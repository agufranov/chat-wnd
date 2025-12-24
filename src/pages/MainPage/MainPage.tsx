import type { Chat } from "@/shared/types";
import { ChatList } from "@/widgets/ChatList/ChatList";
import { ChatWindow } from "@/widgets/ChatWindow/ChatWindow";
import { useState } from "react";
import style from "./MainPage.module.css";

export const MainPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
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
