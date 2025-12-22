import { create } from "zustand";
import type { Chat, Message } from "../shared/types";
import { mockApi } from "@/shared/api/mockApi";
import { immer } from "zustand/middleware/immer";

type ChatStore = {
  chats: Chat[];
  messages: { [chatId: string]: Message[] };
  loadChats: () => Promise<void>;
  loadMessages: (chatId: string) => Promise<void>;
  subscribe: () => void;
};

export const useChatStore = create<ChatStore>()(
  immer((set, get) => {
    return {
      chats: [],

      messages: {},

      loadChats: async () => {
        set({ chats: await mockApi.getChats() });
      },

      loadMessages: async (chatId: string) => {
        const messages = await mockApi.getChatMessages(chatId);
        const chat = get().chats.find(({ id }) => id === chatId);
        set((state) => {
          state.messages[chatId] = messages;
          if (chat) {
            const chatToUpdate = state.chats.find(({ id }) => id === chat.id);
            if (!chatToUpdate) return;
            chatToUpdate.lastMessage = messages[0];
          }
        });
      },

      subscribe: () => {
        const fn = (message: Message) => {
          const chat = get().chats.find(({ id }) => id === message.chatId);
          if (!chat) return;
          set((state) => {
            state.messages[chat.id]?.push(message);
            const chatToUpdate = state.chats.find(({ id }) => id === chat.id);
            if (!chatToUpdate) return;
            chatToUpdate.lastMessage = message;
          });
        };

        mockApi.events.on("message", fn);
        return () => mockApi.events.off("message", fn);
      },
    };
  })
);
