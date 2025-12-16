import { ChatList } from "../widgets/ChatList/ChatList";
import { ChatWindow } from "../widgets/ChatWindow/ChatWindow";
import style from "./App.module.css";

function App() {
  return (
    <main className={style.main}>
      <aside className={style.sidebar}>
        <ChatList />
      </aside>
      <section className={style.content}>
        <ChatWindow />
      </section>
    </main>
  );
}

export default App;
