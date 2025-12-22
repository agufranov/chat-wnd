import { useEffect, useState } from "react";
import { ChatList } from "../widgets/ChatList/ChatList";
import { ChatWindow } from "../widgets/ChatWindow/ChatWindow";
import style from "./App.module.css";
import type { Chat } from "../shared/types";
import { useChatStore } from "../store/chatStore";

function App() {
  const { loadMessages, subscribe } = useChatStore();

  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  useEffect(() => subscribe(console.log), []);

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
}

export default App;
