import type { Chat } from "@/shared/types";
import { ChatList } from "@/widgets/ChatList/ChatList";
import { ChatWindow } from "@/widgets/ChatWindow/ChatWindow";
import { useEffect, useState } from "react";
import style from "./MainPage.module.css";

export const MainPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedChat(null);
    };

    document.addEventListener("keydown", keyHandler);

    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <main className={style.main}>
      <aside className={style.sidebar}>
        <ChatList
          selectedChat={selectedChat}
          onChatSelected={setSelectedChat}
        />
      </aside>
      <section className={style.content}>
        <ChatWindow key={selectedChat?.id} chatId={selectedChat?.id ?? null} />
      </section>
    </main>
  );
};
