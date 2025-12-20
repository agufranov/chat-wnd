import { useEffect } from "react";
import { MessageList } from "../../app/features/MessageList/MessageList";
import { useChatStore } from "@/store/chatStore";

type ChatWindowProps = {
  chatId: string | null;
};

export const ChatWindow: React.FC<ChatWindowProps> = ({ chatId }) => {
  const { messages, loadMessages } = useChatStore();

  useEffect(() => {
    if (chatId !== null) loadMessages(chatId);
  }, [chatId]);

  if (chatId === null) return null;

  return <MessageList messages={messages[chatId] ?? []} />;
};
