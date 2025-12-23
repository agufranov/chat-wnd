import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import style from "./MessageList.module.css";
import type { Message } from "../../../shared/types";
import cn from "classnames";
import { generateAvatar } from "../../../shared/api/utils";
import { useUnreadCount } from "./hooks/useUnreadCount";
import { ScrollDownButton } from "./ui/ScrollDownButton/ScrollDownButton";
import { useDebounce } from "../../../shared/hooks/useDebounce";

type MessageListMethods = {
  scrollToBottom: () => void;
};

type MessageListProps = {
  messages: Message[];
};

export const MessageList = forwardRef<MessageListMethods, MessageListProps>(
  ({ messages }, ref) => {
    const virtuosoRef = useRef<VirtuosoHandle>(null);

    const [atBottom, setAtBottom] = useState(true);
    const atBottomDebounced = useDebounce(atBottom, 300);
    const [initiallyScrolled, setInitiallyScrolled] = useState(false);

    const unreadCount = useUnreadCount(atBottom, messages.length);

    const scrollToBottom = useCallback(
      (force = false) => {
        if (virtuosoRef.current && messages.length > 0 && (force || atBottom)) {
          setTimeout(() => {
            virtuosoRef.current?.scrollToIndex({
              index: messages.length,
              align: "end",
              behavior: initiallyScrolled ? "smooth" : "auto",
            });
            setInitiallyScrolled(true);
          }, 0);
        }
      },
      [initiallyScrolled, atBottom, messages]
    );

    useImperativeHandle(ref, () => ({
      scrollToBottom: () => scrollToBottom(true),
    }));

    useEffect(() => console.log("unread", unreadCount), [unreadCount]);

    useEffect(scrollToBottom, [messages.length]);

    return (
      <div className={style.container}>
        <ScrollDownButton
          className={cn(style.scrollDownButton, {
            [style.scrollDownButtonHidden]: atBottomDebounced,
          })}
          unreadCount={unreadCount}
          onClick={() => scrollToBottom(true)}
        />
        <Virtuoso
          atBottomStateChange={setAtBottom}
          ref={virtuosoRef}
          data={messages}
          itemContent={(index, message) => (
            <div className={style.messageWrapper}>
              <div
                className={cn(style.message, {
                  [style.messageMy]: message.isMy,
                })}
              >
                <div className={style.messageHeader}>
                  <div
                    className={style.messageAvatar}
                    style={{
                      background: generateAvatar(message.author ?? "").color,
                    }}
                  >
                    {generateAvatar(message.author ?? "").text}
                  </div>
                  <span className={style.messageAuthor}>
                    {message.author ?? "Вы"}
                  </span>
                  <span className={style.messageTime}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className={style.messageText}>
                  {message.status === "pending" ? "......" : message.text}
                </div>
              </div>
            </div>
          )}
          overscan={200}
          style={{ height: "100%" }}
        />
      </div>
    );
  }
);
