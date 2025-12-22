import { useEffect } from "react";
import { MessageList } from "../../app/features/MessageList/MessageList";
import { useChatStore } from "@/store/chatStore";
import { MessageInput } from "../../app/features/MessageInput/MessageInput";
import style from "./ChatWindow.module.css";

type ChatWindowProps = {
  chatId: string | null;
};

export const ChatWindow: React.FC<ChatWindowProps> = ({ chatId }) => {
  const { messages, loadMessages } = useChatStore();

  useEffect(() => {
    if (chatId !== null) loadMessages(chatId);
  }, [chatId]);

  return (
    <div className={style.container}>
      {chatId ? (
        <>
          <MessageList messages={messages[chatId] ?? []} />
          <MessageInput onSubmit={(e) => console.log(e)} />
        </>
      ) : (
        <span>Выберите чат</span>
      )}
    </div>
  );
};
