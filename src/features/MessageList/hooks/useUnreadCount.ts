import { useEffect, useMemo, useRef } from "react";

export const useUnreadCount = (atBottom: boolean, messagesLength: number) => {
  const currentMessagesLength = useRef(messagesLength);

  useEffect(() => {
    currentMessagesLength.current = messagesLength;
  }, [messagesLength]);

  const readMessagesLength = useMemo(
    () => (atBottom ? -1 : currentMessagesLength.current),
    [atBottom]
  );

  const unreadCount = useMemo(
    () => (readMessagesLength === -1 ? 0 : messagesLength - readMessagesLength),
    [readMessagesLength, messagesLength]
  );

  return unreadCount;
};
