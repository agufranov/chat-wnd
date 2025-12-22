export type Chat = {
  id: string;
  name: string;
  lastMessage?: Message;
};

export type Message = {
  id: string;
  chatId: Chat["id"];
  timestamp: number;
  text: string;
  author: string | null; // для простоты, у моих сообщений sender будет равен null
  status: "pending" | "sent" | "failed";
};
