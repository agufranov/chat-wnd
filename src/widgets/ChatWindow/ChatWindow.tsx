import MessageList from "../../app/features/MessageList/MessageList";
import { useMessages } from "./useMessages";

export const ChatWindow: React.FC = () => {
  const messages = useMessages();

  return <MessageList messages={messages} />;
};
