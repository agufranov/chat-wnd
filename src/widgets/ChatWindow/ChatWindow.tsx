import { MessageInput } from "@/app/features/MessageInput/MessageInput";
import {
  MessageList,
  type MessageListMethods,
} from "@/app/features/MessageList/MessageList";
import { useChatStore } from "../../store/chatStore";
import { useEffect, useRef } from "react";
import style from "./ChatWindow.module.css";
import { Spinner } from "../../shared/ui/Spinner/Spinner";
import { useDraftStore } from "@/store/draftStore";

type ChatWindowProps = {
  chatId: string | null;
};

export const ChatWindow: React.FC<ChatWindowProps> = ({ chatId }) => {
  const { messages, loadMessages, sendMessage, loadingMessages } =
    useChatStore();

  const { setDraft, clearDraft } = useDraftStore();

  const messageListRef = useRef<MessageListMethods>(null);

  useEffect(() => {
    if (chatId !== null) loadMessages(chatId);
  }, [chatId]);

  const handleInput = (text: string) => {
    if (!chatId) return;
    setDraft(chatId, text);
  };

  const handleSubmit = (text: string) => {
    if (!chatId) return;
    sendMessage(chatId, text);
    messageListRef.current?.scrollToBottom();
    clearDraft(chatId);
  };

  return (
    <div className={style.container}>
      {loadingMessages ? (
        <Spinner size={128} thin />
      ) : chatId ? (
        <>
          <MessageList messages={messages[chatId] ?? []} ref={messageListRef} />
          <MessageInput onInput={handleInput} onSubmit={handleSubmit} />
        </>
      ) : (
        <span>Выберите чат</span>
      )}
    </div>
  );
};
