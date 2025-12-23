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
  author: string;
  isMy?: boolean;
  status: "pending" | "sent" | "failed";
};
