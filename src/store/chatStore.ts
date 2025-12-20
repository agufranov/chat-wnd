import { create } from "zustand";
import type { Chat, Message } from "../shared/types";
import { mockApi } from "@/shared/api/mockApi";

type ChatStore = {
  chats: Chat[];
  messages: { [chatId: string]: Message[] };
  loadChats: () => Promise<void>;
  loadMessages: (chatId: string) => Promise<void>;
};

export const useChatStore = create<ChatStore>((set, get) => {
  return {
    chats: [],
    messages: {},
    loadChats: async () => {
      set({ chats: await mockApi.getChats() });
    },
    loadMessages: async (chatId: string) => {
      set({
        messages: {
          ...get().messages,
          [chatId]: await mockApi.getChatMessages(chatId),
        },
      });
    },
  };
});
