import { MessageInput } from "@/app/features/MessageInput/MessageInput";
import {
  MessageList,
  type MessageListMethods,
} from "@/app/features/MessageList/MessageList";
import { useChatStore } from "../../store/chatStore";
import { useEffect, useRef } from "react";
import style from "./ChatWindow.module.css";
import { Spinner } from "../../shared/ui/Spinner/Spinner";

type ChatWindowProps = {
  chatId: string | null;
};

export const ChatWindow: React.FC<ChatWindowProps> = ({ chatId }) => {
  const { messages, loadMessages, sendMessage, loadingMessages } =
    useChatStore();
  const messageListRef = useRef<MessageListMethods>(null);

  useEffect(() => console.log("Loading", loadingMessages), [loadingMessages]);

  useEffect(() => {
    if (chatId !== null) loadMessages(chatId);
  }, [chatId]);

  const handleSubmit = (text: string) => {
    if (!chatId) return;
    sendMessage(chatId, text);
    messageListRef.current?.scrollToBottom();
  };

  return (
    <div className={style.container}>
      {loadingMessages ? (
        <Spinner size={128} thin />
      ) : chatId ? (
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
