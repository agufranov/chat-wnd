import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import style from "./MessageList.module.css";
import type { Message } from "../../../shared/types";
import cn from "classnames";
import { generateAvatar } from "../../../shared/utils/messages";
import { useUnreadCount } from "./hooks/useUnreadCount";
import { ScrollDownButton } from "./ui/ScrollDownButton/ScrollDownButton";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { Spinner } from "../../../shared/ui/Spinner/Spinner";
import { useChatStore } from "../../../store/chatStore";

export type MessageListMethods = {
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
    const { pendingMessages } = useChatStore();

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

    useEffect(scrollToBottom, [messages.length]);

    return (
      <div className={style.container}>
        <ScrollDownButton
          className={cn(style.scrollDownButton, {
            [style.scrollDownButtonHidden]: atBottomDebounced && !unreadCount,
          })}
          unreadCount={unreadCount}
          onClick={() => scrollToBottom(true)}
        />
        <Virtuoso
          atBottomStateChange={setAtBottom}
          ref={virtuosoRef}
          data={messages}
          itemContent={(_, message) => (
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
                    {pendingMessages[message.id] && (
                      <div className={style.spinner}>
                        <Spinner size={24} />
                      </div>
                    )}
                  </div>
                  <span className={style.messageAuthor}>
                    {message.author ?? "Вы"}
                  </span>
                  <span className={style.messageTime}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className={style.messageText}>{message.text}</div>
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
