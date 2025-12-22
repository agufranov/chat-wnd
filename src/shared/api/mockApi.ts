import type { Chat, Message } from "../types";
import {
  EventBus,
  generateChats,
  generateMessages,
  randomId,
  rnd,
  rndFrom,
  sleep,
} from "./utils";

const chats = generateChats();

type MessageCache = { [chatId: string]: Message[] };

const chatMessages: MessageCache = chats.reduce((agg, { id }) => {
  agg[id] = generateMessages(id);
  chats.find((chat) => chat.id === id)!.lastMessage = agg[id][0];
  return agg;
}, {} as MessageCache);

const events = new EventBus<{ message: Message }>();

export const mockApi = {
  events,
  getChats: (): Promise<Chat[]> =>
    Promise.resolve(chats.map((chat) => ({ ...chat }))),

  getChatMessages: (chatId: string): Message[] => {
    console.log(chatId);
    chatMessages[chatId] ??= generateMessages(chatId);

    return [...chatMessages[chatId]];
  },

  sendMessage: async (chatId: string, text: string) => {
    await sleep(rnd(300) + 150); // искусственная задержка

    const message: Message = {
      id: randomId(),
      timestamp: +new Date(),
      text,
      chatId,
      author: null,
      status: "sent",
    };

    chatMessages[chatId] ??= [];

    chatMessages[chatId] ??= generateMessages(chatId);

    chatMessages[chatId].unshift(message);

    return message;
  },

  addIncomingMessage: () => {
    const chat = rndFrom(chats);
    const message: Message = {
      id: Math.random().toString(),
      text: "New message",
      author: "New author",
      chatId: chat.id,
      timestamp: +new Date(),
      status: "sent",
    };
    chatMessages[chat.id].unshift(message);
    chat.lastMessage = message;
    events.emit("message", message);
  },
};

setInterval(() => {
  mockApi.addIncomingMessage();
}, 1000);
