import { useEffect, useRef, useState } from "react";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import style from "./MessageList.module.css";
import type { Message } from "../../../shared/types";
import cn from "classnames";
import { generateAvatar } from "../../../shared/api/utils";

type MessageListProps = {
  messages: Message[];
};

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const [atBottom, setAtBottom] = useState(true);
  const [initiallyScrolled, setInitiallyScrolled] = useState(false);

  useEffect(() => {
    if (virtuosoRef.current && messages.length > 0 && atBottom) {
      setTimeout(() => {
        virtuosoRef.current?.scrollToIndex({
          index: messages.length - 1,
          align: "end",
          behavior: initiallyScrolled ? "smooth" : "auto",
        });
        setInitiallyScrolled(true);
      }, 0);
    }
  }, [messages.length]);

  return (
    <div className={style.chatContainer}>
      <Virtuoso
        atBottomStateChange={setAtBottom}
        ref={virtuosoRef}
        data={messages}
        itemContent={(index, message) => (
          <div className={style.gridcell}>
            <div
              className={cn(style.message, { [style.messageMy]: message.isMy })}
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
};
