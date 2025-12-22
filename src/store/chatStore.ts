import { create } from "zustand";
import type { Chat, Message } from "../shared/types";
import { mockApi } from "../shared/api/mockApi";
import { immer } from "zustand/middleware/immer";
import { randomId } from "../shared/api/utils";

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
            chatToUpdate.lastMessage = messages[messages.length - 1];
          }
        });
      },

      sendMessage: async (chatId: string, text: string) => {
        console.log("sending", chatId, text);
        const tmpId = randomId();
        set((state) => {
          state.messages[chatId].push({
            id: tmpId,
            chatId,
            text,
            author: null,
            timestamp: +new Date(),
            status: "pending",
          });
        });
        const sentMessage = await mockApi.sendMessage(chatId, text);
        set((state) => {
          state.messages[chatId] = [
            ...state.messages[chatId].filter(({ id }) => id !== tmpId),
            sentMessage,
          ];
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
