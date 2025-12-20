import type { Chat, Message } from "../types";
import { generateChats, generateMessages, randomId, rnd, sleep } from "./utils";

const chats = generateChats();

const chatMessages: { [chatId: string]: Message[] } = {};

export const mockApi = {
  getChats: (): Promise<Chat[]> => Promise.resolve(chats),
  getChatMessages: (chatId: string): Message[] => {
    console.log(chatId);
    chatMessages[chatId] ??= generateMessages(chatId);

    return chatMessages[chatId];
  },
  sendMessage: async (chatId: string, message: Message) => {
    chatMessages[chatId] ??= [];
    const createdMessage = {
      ...message,
      id: randomId(),
      author: null,
    };
    chatMessages[chatId].push(createdMessage);
    await sleep(rnd(300) + 150);
    return createdMessage;
  },
};
