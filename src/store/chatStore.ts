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
      const messages = await mockApi.getChatMessages(chatId);
      const chat = get().chats.find(({ id }) => id === chatId);
      set({
        messages: {
          ...get().messages,
          [chatId]: messages,
        },
      });
      if (chat) {
        set({
          chats: [
            ...get().chats.filter(({ id }) => id !== chatId),
            { ...chat, lastMessage: messages[0] },
          ],
        });
      }
    },
    subscribe: () => {
      const fn = (message: Message) => {
        const chat = get().chats.find(({ id }) => id === message.chatId);
        if (!chat) return;
        set({
          messages: {
            ...get().messages,
            [chat.id]: [...(get().messages[chat.id] ?? []), message],
          },
        });
        set({
          chats: [
            ...get().chats.filter(({ id }) => id !== chat.id),
            { ...chat, lastMessage: message },
          ],
        });
      };

      mockApi.events.on("message", fn);
      return () => mockApi.events.off("message", fn);
    },
  };
});
