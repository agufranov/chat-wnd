import { useEffect, useRef, useState, type FormEvent } from "react";
import type React from "react";
import style from "./MessageInput.module.css";
import Send from "./assets/send.svg?react";
import cn from "classnames";

type MessageInputProps = {
  onSubmit: (message: string) => void;
};

export const MessageInput: React.FC<MessageInputProps> = ({ onSubmit }) => {
  const [inputState, setInputState] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setInputState("");
    onSubmit(inputState.trim());
  };

  const adjustHeight = () => {
    const textarea = inputRef.current;
    if (!textarea) return;

    textarea.style.height = "auto"; // Сброс
    textarea.style.height = `${textarea.scrollHeight + 1}px`;
  };

  const handleInput = (e: FormEvent<HTMLTextAreaElement>) => {
    setInputState((e.currentTarget as HTMLTextAreaElement).value);
    adjustHeight();
  };

  return (
    <form
      className={cn([style.root, style.messageInputContainer])}
      onSubmit={handleSubmit}
    >
      <textarea
        rows={1}
        className={style.messageInput}
        value={inputState}
        placeholder="Введите сообщение..."
        onInput={handleInput}
        ref={inputRef}
      />
      <button className={style.sendButton} type="submit" disabled={!inputState}>
        <Send width={24} height={24} />
      </button>
    </form>
  );
};
