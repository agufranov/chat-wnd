import { MessageInput } from "@/features/MessageInput/MessageInput";
import {
  MessageList,
  type MessageListMethods,
} from "@/features/MessageList/MessageList";
import { Spinner } from "@/shared/ui/Spinner/Spinner";
import { useChatStore } from "@/store/chatStore";
import { useDraftStore } from "@/store/draftStore";
import { useEffect, useRef } from "react";
import style from "./ChatWindow.module.css";

type ChatWindowProps = {
  chatId: string | null;
};

export const ChatWindow: React.FC<ChatWindowProps> = ({ chatId }) => {
  const { messages, loadMessages, sendMessage, loadingMessages } =
    useChatStore();

  const { getDraft, setDraft, clearDraft } = useDraftStore();

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
          <MessageInput
            initialValue={getDraft(chatId)}
            onInput={handleInput}
            onSubmit={handleSubmit}
          />
        </>
      ) : (
        <span>Выберите чат</span>
      )}
    </div>
  );
};
