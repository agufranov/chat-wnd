import { List, AutoSizer } from 'react-virtualized'
import { useMemo, useRef, useCallback, useEffect } from 'react'
import type { ListRowProps } from 'react-virtualized'
import style from './Chat.module.css'

export type Message = {
  id: string
  text: string
  author: string
  timestamp: Date
}

interface ChatProps {
  messages: Message[]
}

const DEFAULT_MSG_HEIGHT = 80

function Chat({ messages }: ChatProps) {
  const listRef = useRef<List>(null)
  const itemHeights = useRef<Map<number, number>>(new Map())

  const reversedMessages = useMemo(() => [...messages].reverse(), [messages])

  const getRowHeight = useCallback(
    ({ index }: { index: number }) => {
      return itemHeights.current.get(index) || DEFAULT_MSG_HEIGHT
    },
    []
  )

  const setRowHeight = useCallback((index: number, height: number) => {
    if (itemHeights.current.get(index) !== height) {
      itemHeights.current.set(index, height)
      listRef.current?.recomputeRowHeights(index)
    }
  }, [])

  const rowRenderer = useCallback(
    ({ index, key, style }: ListRowProps) => {
      const message = reversedMessages[index]

      return (
        <div key={key} className={style.gridcell} style={{
          ...style
        }}>
          <MessageRow
            message={message}
            index={index}
            setRowHeight={setRowHeight}
          />
        </div >
      )
    },
    [reversedMessages, setRowHeight]
  )

  // Прокручиваем вниз при добавлении новых сообщений
  useEffect(() => {
    if (listRef.current && reversedMessages.length > 0) {
      setTimeout(() => {
        listRef.current?.scrollToRow(reversedMessages.length - 1)
      }, 0)
    }
  }, [reversedMessages.length])

  return (
    <div className={style.chatContainer}>
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
          />
        )}
      </AutoSizer>
    </div>
  )
}

interface MessageRowProps {
  message: Message
  index: number
  setRowHeight: (index: number, height: number) => void
}

// Компонент для измерения высоты
function MessageRow({ message, index, setRowHeight }: MessageRowProps) {
  const rowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (rowRef.current) {
      const height = rowRef.current.getBoundingClientRect().height
      setRowHeight(index, height)
    }
  }, [index, setRowHeight, message])

  return (
    <div ref={rowRef} className={style.message}>
      <div className={style.messageHeader}>
        <span className={style.messageAuthor}>{message.author}</span>
        <span className={style.messageTime}>
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
      <div className={style.messageText}>{message.text}</div>
    </div>
  )
}

export default Chat
