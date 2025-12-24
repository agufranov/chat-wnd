import { useEffect } from "react";
import { useChatStore } from "../store/chatStore";
import { MainPage } from "@/pages/MainPage/MainPage";

function App() {
  const { subscribe } = useChatStore();

  useEffect(() => {
    return subscribe();
  }, []);

  return <MainPage />;
}

export default App;
