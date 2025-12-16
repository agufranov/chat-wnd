export type Chat = {
  id: string;
  name: string;
  lastMessage?: Message;
};

export type Message = {
  id: string;
  timestamp: number;
  text: string;
  author: string | null; // для простоты, null - у моих сообщений
};
