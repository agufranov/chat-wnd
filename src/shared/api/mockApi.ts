import type { Chat, Message } from "../types";
import {
  EventBus,
  generateChats,
  generateFullName,
  generateMessages,
  randomId,
  rnd,
  rndFrom,
  sleep,
} from "./utils";

const AVG_DELAY = 1000;

const debugSleep = () => sleep(AVG_DELAY + rnd(AVG_DELAY) - AVG_DELAY / 2);

const chats = generateChats();

type MessageCache = { [chatId: string]: Message[] };

const chatMessages: MessageCache = chats.reduce((agg, { id }) => {
  agg[id] = generateMessages(id);
  chats.find((chat) => chat.id === id)!.lastMessage = agg[id].slice(-1)[0];
  return agg;
}, {} as MessageCache);

const events = new EventBus<{ message: Message }>();

export const mockApi = {
  events,
  getChats: async (): Promise<Chat[]> => {
    // await debugSleep();
    return Promise.resolve(chats.map((chat) => ({ ...chat })));
  },

  getChatMessages: async (chatId: string): Promise<Message[]> => {
    await debugSleep();
    console.log(chatId);
    chatMessages[chatId] ??= generateMessages(chatId);

    return [...chatMessages[chatId]];
  },

  sendMessage: async (chatId: string, text: string) => {
    await debugSleep(); // искусственная задержка

    const message: Message = {
      id: randomId(),
      timestamp: +new Date(),
      text,
      chatId,
      author: "Вы",
      isMy: true,
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
      author: generateFullName(),
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
}, 300);
