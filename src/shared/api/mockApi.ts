import { API_AVERAGE_DELAY, INCOMING_MESSAGE_INTERVAL } from "@/constants";
import type { Chat, Message } from "../types";
import {
  generateChats,
  generateMessages,
  randomId,
  randomMessage,
  rnd,
  rndFrom,
  sleep,
} from "../utils/messages";
import { EventBus } from "../utils/eventBus";

const debugSleep = () =>
  sleep(API_AVERAGE_DELAY + rnd(API_AVERAGE_DELAY) - API_AVERAGE_DELAY / 2);

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
    await debugSleep();
    return Promise.resolve(chats.map((chat) => ({ ...chat })));
  },

  getMessages: async (chatId: string): Promise<Message[]> => {
    await debugSleep();
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
    const message: Message = randomMessage(chat.id);
    chatMessages[chat.id].unshift(message);
    chat.lastMessage = message;
    events.emit("message", message);
  },
};

setInterval(() => {
  mockApi.addIncomingMessage();
}, INCOMING_MESSAGE_INTERVAL / 2 + rnd(INCOMING_MESSAGE_INTERVAL));
