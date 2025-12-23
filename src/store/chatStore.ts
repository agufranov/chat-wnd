import { create } from "zustand";
import type { Chat, Message } from "../shared/types";
import { mockApi } from "../shared/api/mockApi";
import { immer } from "zustand/middleware/immer";
import { randomId } from "../shared/api/utils";
import type { WritableDraft } from "immer";

type ChatStore = {
  chats: Chat[];
  messages: { [chatId: string]: Message[] };
  setLastMessage: (
    state: WritableDraft<ChatStore>,
    chatId: string,
    message: Message
  ) => void;
  loadChats: () => Promise<void>;
  loadMessages: (chatId: string) => Promise<void>;
  subscribe: () => void;
};

export const useChatStore = create<ChatStore>()(
  immer((set, get) => {
    return {
      chats: [],

      messages: {},

      setLastMessage: (
        state: WritableDraft<ChatStore>,
        chatId: string,
        message: Message
      ) => {
        const chatIndex = state.chats.findIndex(({ id }) => id === chatId);
        if (chatIndex !== -1) {
          state.chats[chatIndex].lastMessage = message;
        }
      },

      loadChats: async () => {
        set({ chats: await mockApi.getChats() });
      },

      loadMessages: async (chatId: string) => {
        const messages = await mockApi.getChatMessages(chatId);
        set((state) => {
          state.messages[chatId] = messages;
          state.setLastMessage(state, chatId, messages[messages.length - 1]);
        });
      },

      sendMessage: async (chatId: string, text: string) => {
        const tmpId = randomId();

        set((state) => {
          const tmpMessage: Message = {
            id: tmpId,
            chatId,
            text,
            author: "Вы",
            isMy: true,
            timestamp: +new Date(),
            status: "pending" as const,
          };
          state.messages[chatId].push(tmpMessage);
          state.setLastMessage(state, chatId, tmpMessage);
        });

        const sentMessage = await mockApi.sendMessage(chatId, text);
        set((state) => {
          state.messages[chatId] = [
            ...state.messages[chatId].filter(({ id }) => id !== tmpId),
            sentMessage,
          ];
          state.setLastMessage(state, chatId, sentMessage);
        });
      },

      subscribe: () => {
        const fn = (message: Message) => {
          const chat = get().chats.find(({ id }) => id === message.chatId);
          if (!chat) return;
          set((state) => {
            state.messages[chat.id]?.push(message);
            state.setLastMessage(state, chat.id, message);
          });
        };

        mockApi.events.on("message", fn);
        return () => mockApi.events.off("message", fn);
      },
    };
  })
);
