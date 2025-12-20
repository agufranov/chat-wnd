import React, { useEffect, type ReactElement, type ReactNode } from "react";
import { useChatStore } from "../../store/chatStore";
import type { Chat } from "../../shared/types";

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

  return (
    <div>
      {chats.map((chat) => (
        <div
          key={chat.id}
          style={{
            fontWeight: selectedChat?.id === chat.id ? "bold" : "normal",
          }}
          onClick={() => onChatSelected(chat)}
        >
          {chat.name}
        </div>
      ))}
    </div>
  );
};
