import React, {
  useEffect,
  useMemo,
  type ReactElement,
  type ReactNode,
} from "react";
import { useChatStore } from "../../store/chatStore";
import type { Chat } from "../../shared/types";
import style from "./ChatList.module.css";
import cn from "classnames";

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
    <div className={style.root}>
      {sortedChats.map((chat) => (
        <div
          key={chat.id}
          className={cn(style.item, {
            [style.itemSelected]: selectedChat?.id === chat.id,
          })}
          onClick={() => onChatSelected(chat)}
        >
          <div>{chat.name}</div>
          {chat.lastMessage && (
            <div className={style.lastMessage}>
              <span className={style.lastMessageText}>
                <strong>{chat.lastMessage.author}</strong>:{" "}
                {chat.lastMessage.text}
              </span>
              <span>{chat.lastMessage.timestamp}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
