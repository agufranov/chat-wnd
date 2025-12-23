import React, { useEffect, useMemo } from "react";
import { useChatStore } from "../../store/chatStore";
import type { Chat } from "../../shared/types";
import style from "./ChatList.module.css";
import cn from "classnames";
import { formatTimeAgo } from "../../shared/api/date";
import { generateAvatar, range } from "../../shared/api/utils";
import { ChatItemSkeleton } from "./ui/ChatItemSkeleton/ChatItemSkeleton";

type ChatListProps = {
  selectedChat: Chat | null;
  onChatSelected: (chat: Chat) => void;
};

export const ChatList: React.FC<ChatListProps> = ({
  selectedChat,
  onChatSelected,
}) => {
  const { chats, loadChats, loadingChats } = useChatStore();

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
    <ul className={style.root}>
      {loadingChats
        ? range(8).map((_) => <ChatItemSkeleton />)
        : sortedChats.map((chat) => {
            const avatar = generateAvatar(chat.lastMessage?.author ?? "");
            return (
              <li
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
                        <span className={style.lastMessageAuthor}>
                          {chat.lastMessage.author?.split(" ")[0]}
                        </span>
                        : {chat.lastMessage.text}
                      </span>
                      <span className={style.lastMessageTimestamp}>
                        {formatTimeAgo(new Date(chat.lastMessage.timestamp))}
                      </span>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
    </ul>
  );
};
