import { MessageInput } from "@/app/features/MessageInput/MessageInput";
import { MessageList } from "@/app/features/MessageList/MessageList";
import { useChatStore } from "../../store/chatStore";
import { useEffect } from "react";
import style from "./ChatWindow.module.css";

type ChatWindowProps = {
  chatId: string | null;
};

export const ChatWindow: React.FC<ChatWindowProps> = ({ chatId }) => {
  const { messages, loadMessages, sendMessage } = useChatStore();

  useEffect(() => {
    if (chatId !== null) loadMessages(chatId);
  }, [chatId]);

  return (
    <div className={style.container}>
      {chatId ? (
        <>
          <MessageList messages={messages[chatId] ?? []} />
          <MessageInput
            onSubmit={(text: string) => sendMessage(chatId, text)}
          />
        </>
      ) : (
        <span>Выберите чат</span>
      )}
    </div>
  );
};
