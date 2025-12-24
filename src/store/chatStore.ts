import { mockApi } from "@/shared/api/mockApi";
import type { Chat, Message } from "@/shared/types";
import { randomId } from "@/shared/utils/messages";
import type { WritableDraft } from "immer";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type ChatStore = {
  chats: Chat[];
  messages: { [chatId: string]: Message[] };
  pendingMessages: { [messageId: string]: boolean };
  loadingChats: boolean;
  loadingMessages: boolean;
  setLastMessage: (
    state: WritableDraft<ChatStore>,
    chatId: string,
    message: Message
  ) => void;
  loadChats: () => Promise<void>;
  loadMessages: (chatId: string) => Promise<void>;
  sendMessage: (chatId: string, text: string) => void;
  subscribe: () => void;
};

export const useChatStore = create<ChatStore>()(
  immer((set, get) => {
    return {
      chats: [],

      messages: {},

      pendingMessages: {},

      loadingChats: false,

      loadingMessages: false,

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
        set({ loadingChats: true });
        set({ chats: await mockApi.getChats(), loadingChats: false });
      },

      loadMessages: async (chatId: string) => {
        set({ loadingMessages: true });
        const messages = await mockApi.getMessages(chatId);
        set((state) => {
          state.messages[chatId] = messages;
          state.setLastMessage(state, chatId, messages[messages.length - 1]);
          state.loadingMessages = false;
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
          state.pendingMessages[tmpId] = true;
          state.setLastMessage(state, chatId, tmpMessage);
        });

        const sentMessage = await mockApi.sendMessage(chatId, text);
        set((state) => {
          state.messages[chatId] = [
            ...state.messages[chatId].filter(({ id }) => id !== tmpId),
            sentMessage,
          ];
          state.setLastMessage(state, chatId, sentMessage);
          state.pendingMessages[tmpId] = false;
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
