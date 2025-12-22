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
import { formatDistanceToNow, formatDistanceToNowStrict } from "date-fns";
import { formatTimeAgo } from "../../shared/api/date";
import { generateAvatar } from "../../shared/api/utils";

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
      {sortedChats.map((chat) => {
        const avatar = generateAvatar(chat.lastMessage?.author ?? "");
        return (
          <div
            key={chat.id}
            className={cn(style.item, {
              [style.itemSelected]: selectedChat?.id === chat.id,
            })}
            onClick={() => onChatSelected(chat)}
          >
            <div
              className={style.avatar}
              style={{
                backgroundColor: avatar.color,
              }}
            >
              {avatar.text}
            </div>
            <div className={style.messagePreview}>
              <div>{chat.name}</div>
              {chat.lastMessage && (
                <div className={style.lastMessage}>
                  <span className={style.lastMessageText}>
                    <strong>{chat.lastMessage.author}</strong>:{" "}
                    {chat.lastMessage.text}
                  </span>
                  <span className={style.lastMessageTimestamp}>
                    {formatTimeAgo(new Date(chat.lastMessage.timestamp))}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
