import { useMemo } from "react";
import type { Chat, Message } from "../types";

export const range = (n: number) => [...Array(n).keys()];

export const rnd = (n: number) => Math.floor(Math.random() * n);

export const rndFrom = <T>(a: Array<T>) => a[rnd(a.length)];

export const randomId = () => Math.random().toString(36).substring(2, 10);

export const sleep = (delay: number) =>
  new Promise((r) => setTimeout(r, delay));

export const generateMessages = (chatId: string, length = 5000): Message[] => {
  const authors = ["Алиса", "Боб", "Чарли", "Диана"];
  const shortTexts = ["Привет!", "Как дела?", "Ок", "👍"];
  const longTexts = [
    "Это очень длинное сообщение, которое занимает много места и демонстрирует, как виртуализация работает с сообщениями разной высоты. Текст может быть очень длинным и переноситься на несколько строк.",
    "Еще одно длинное сообщение для тестирования виртуализации. Когда у нас много сообщений разной длины, виртуализация помогает производительности, рендеря только видимые элементы.",
    "Среднее сообщение с некоторым количеством текста, чтобы показать, что высота может варьироваться.",
  ];

  return range(length).map((i) => {
    const author = authors[i % authors.length];
    const isLong = rnd(2) === 1;
    const text = isLong
      ? longTexts[i % longTexts.length]
      : shortTexts[i % shortTexts.length];

    return {
      id: `msg-${i}`,
      text: `${text} (сообщение #${i + 1})`,
      author,
      timestamp: +new Date(Date.now() - (1000 - i) * 60000),
      chatId,
    };
  });
};

export const generateChats = (length = 8): Chat[] => {
  return range(length).map((i) => ({
    name: `Chat #${i}`,
    id: i.toString(),
  }));
};

export class EventBus<T extends { [eventName: string]: unknown }> {
  private listeners: { [K in keyof T]: ((payload: T[K]) => void)[] } = {}; //as { [K in keyof T]: ((payload: T[K]) => void)[] };

  on<K extends keyof T>(event: K, callback: (payload: T[K]) => void) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  off<K extends keyof T>(event: K, callback: (payload: T[K]) => void) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(
      (listener) => listener !== callback
    );
  }

  emit<K extends keyof T>(event: K, payload: T[K]) {
    this.listeners?.[event]?.forEach((listener) => listener(payload));
  }
}
