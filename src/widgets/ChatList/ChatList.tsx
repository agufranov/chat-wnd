import React, {
  useEffect,
  useMemo,
  type ReactElement,
  type ReactNode,
} from "react";
import { useChatStore } from "../../store/chatStore";
import type { Chat } from "../../shared/types";
import style from "./ChatList.module.css";

type ChatListProps = {
  selectedChat: Chat | null;
  onChatSelected: (chat: Chat) => void;
};

export const ChatList: React.FC<ChatListProps> = ({
  selectedChat,
  onChatSelected,
}) => {
  const { chats, loadChats } = useChatStore();

  useEffect(() => {
    loadChats();
  }, []);

  const sortedChats = useMemo(() => {
    return [...chats].sort(
      (a, b) =>
        (a.lastMessage?.timestamp || 0) - (b.lastMessage?.timestamp || 0)
    );
  }, [chats]);

  return (
    <div>
      {sortedChats.map((chat) => (
        <div
          key={chat.id}
          style={{
            fontWeight: selectedChat?.id === chat.id ? "bold" : "normal",
          }}
          onClick={() => onChatSelected(chat)}
        >
          <div>{chat.name}</div>
          {chat.lastMessage && (
            <div className={style.lastMessage}>
              <strong>{chat.lastMessage.author}</strong>:{" "}
              {chat.lastMessage.text}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
