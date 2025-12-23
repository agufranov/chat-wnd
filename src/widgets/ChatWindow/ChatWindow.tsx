import { MessageInput } from "@/app/features/MessageInput/MessageInput";
import { MessageList } from "@/app/features/MessageList/MessageList";
import { useChatStore } from "../../store/chatStore";
import { useEffect, useRef } from "react";
import style from "./ChatWindow.module.css";

type ChatWindowProps = {
  chatId: string | null;
};

export const ChatWindow: React.FC<ChatWindowProps> = ({ chatId }) => {
  const { messages, loadMessages, sendMessage } = useChatStore();
  const messageListRef = useRef<typeof MessageList>(null);

  useEffect(() => {
    if (chatId !== null) loadMessages(chatId);
  }, [chatId]);

  const handleSubmit = (text: string) => {
    if (!chatId) return;
    sendMessage(chatId, text);
    messageListRef.current.scrollToBottom();
  };

  return (
    <div className={style.container}>
      {chatId ? (
        <>
          <MessageList messages={messages[chatId] ?? []} ref={messageListRef} />
          <MessageInput onSubmit={handleSubmit} />
        </>
      ) : (
        <span>Выберите чат</span>
      )}
    </div>
  );
};
