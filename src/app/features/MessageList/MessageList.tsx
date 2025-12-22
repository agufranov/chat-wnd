import { useCallback, useEffect, useMemo, useRef } from "react";
import type { ListRowProps } from "react-virtualized";
import { AutoSizer, List } from "react-virtualized";
import style from "./MessageList.module.css";
import type { Message } from "../../../shared/types";
import cn from "classnames";

interface MessageListProps {
  messages: Message[];
}

const DEFAULT_MSG_HEIGHT = 80;
const MSG_MARGIN = 12;

export const MessageList: React.FC<MessageListProps> = ({
  messages,
}: MessageListProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const listRef = useRef<List>(null);
  const itemHeights = useRef<Map<number, number>>(new Map());

  // const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);
  const reversedMessages = messages;

  const getRowHeight = useCallback(({ index }: { index: number }) => {
    return itemHeights.current.get(index) || DEFAULT_MSG_HEIGHT;
  }, []);

  const setRowHeight = useCallback((index: number, height: number) => {
    if (itemHeights.current.get(index) !== height) {
      itemHeights.current.set(index, height + MSG_MARGIN);
      listRef.current?.recomputeRowHeights(index);
    }
  }, []);

  const rowRenderer = useCallback(
    ({ index, key, style }: ListRowProps) => {
      const message = reversedMessages[index];

      return (
        <div
          key={key}
          className={style.gridcell}
          style={{
            ...style,
          }}
        >
          <MessageRow
            message={message}
            index={index}
            setRowHeight={setRowHeight}
          />
        </div>
      );
    },
    [reversedMessages, setRowHeight]
  );

  // Прокручиваем вниз при добавлении новых сообщений
  useEffect(() => {
    if (listRef.current && reversedMessages.length > 0) {
      setTimeout(() => {
        listRef.current?.scrollToRow(reversedMessages.length - 1);
      }, 0);
    }
  }, [reversedMessages.length]);

  return (
    <div className={style.chatContainer} ref={containerRef}>
      <AutoSizer>
        {({ height, width }: { height: number; width: number }) => (
          <List
            ref={listRef}
            height={height}
            width={width}
            rowCount={reversedMessages.length}
            rowHeight={getRowHeight}
            rowRenderer={rowRenderer}
            overscanRowCount={5}
            scrollToIndex={reversedMessages.length - 1}
          />
        )}
      </AutoSizer>
    </div>
  );
};

interface MessageRowProps {
  message: Message;
  index: number;
  setRowHeight: (index: number, height: number) => void;
}

// Компонент для измерения высоты
function MessageRow({ message, index, setRowHeight }: MessageRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rowRef.current) {
      const height = rowRef.current.getBoundingClientRect().height;
      setRowHeight(index, height);
    }
  }, [index, setRowHeight, message]);

  return (
    <div
      ref={rowRef}
      className={cn(style.message, { [style.messageMy]: !message.author })}
    >
      <div className={style.messageHeader}>
        <span className={style.messageAuthor}>{message.author ?? "Вы"}</span>
        <span className={style.messageTime}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
      <div className={style.messageText}>
        {message.status === "pending" ? "......" : message.text}
      </div>
    </div>
  );
}
