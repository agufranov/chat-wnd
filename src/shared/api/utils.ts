import { useMemo } from "react";
import type { Chat, Message } from "../types";

export const range = (n: number) => [...Array(n).keys()];

export const rnd = (n: number) => Math.floor(Math.random() * n);

export const rndFrom = <T>(a: Array<T>) => a[rnd(a.length)];

export const randomId = () => Math.random().toString(36).substring(2, 10);

export const sleep = (delay: number) =>
  new Promise((r) => setTimeout(r, delay));

export const generateFullName = () => {
  const names = "Анна Мария Анастасия Татьяна Евгения Марьям Алина".split(" ");
  const lastNames = "Кузнецова Смирнова Кругликова Крайнова Любимова".split(
    " "
  );

  return `${rndFrom(names)} ${rndFrom(lastNames)}`;
};

export const generateMessages = (chatId: string, length = 5000): Message[] => {
  const shortTexts = ["Привет!", "Как дела?", "Ок", "👍"];
  const longTexts = [
    "Это очень длинное сообщение, которое занимает много места и демонстрирует, как виртуализация работает с сообщениями разной высоты. Текст может быть очень длинным и переноситься на несколько строк.",
    "Еще одно длинное сообщение для тестирования виртуализации. Когда у нас много сообщений разной длины, виртуализация помогает производительности, рендеря только видимые элементы.",
    "Среднее сообщение с некоторым количеством текста, чтобы показать, что высота может варьироваться.",
  ];

  return range(length).map((i) => {
    const author = generateFullName();
    const isLong = rnd(2) === 1;
    const text = isLong
      ? longTexts[i % longTexts.length]
      : shortTexts[i % shortTexts.length];

    return {
      id: `msg-${i}`,
      text: `${text}`,
      author,
      timestamp: +new Date(
        Date.now() - rnd(5) * 86_400_000 - (1000 - i) * 60000
      ),
      chatId,
      status: "sent",
    };
  });
};

export const generateChats = (length = 8): Chat[] => {
  return range(length).map((i) => ({
    name: `Chat #${i}`,
    id: i.toString(),
  }));
};

export const generateAvatar = (name: string) => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E2",
    "#F8B739",
    "#52BE80",
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // TODO: по модулю!
  const index = Math.abs(hash) % colors.length;

  const [firstName, lastName] = name.split(" ");

  const displayName = `${firstName[0].toLocaleUpperCase()}${
    lastName?.[0].toLocaleUpperCase() ?? ""
  }`;

  return { color: colors[index], text: displayName };
};

export class EventBus<T extends { [eventName: string]: unknown }> {
  private listeners = {} as {
    [K in keyof T]: ((payload: T[K]) => void)[];
  };

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
