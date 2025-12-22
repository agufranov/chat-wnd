import { useEffect, useRef, useState, type FormEvent } from "react";
import type React from "react";
import style from "./MessageInput.module.css";
import Send from "./assets/send.svg?react";

type MessageInputProps = {
  onSubmit: (message: string) => void;
};

export const MessageInput: React.FC<MessageInputProps> = ({ onSubmit }) => {
  const [inputState, setInputState] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setInputState("");
    onSubmit(inputState.trim());
  };

  return (
    <form className={style.root} onSubmit={handleSubmit}>
      <input
        className={style.input}
        value={inputState}
        placeholder="Введите сообщение..."
        onInput={(e) =>
          setInputState((e.currentTarget as HTMLInputElement).value)
        }
        ref={inputRef}
      />
      <button type="submit" disabled={!inputState}>
        <Send width={24} height={24} />
        Отправить
      </button>
    </form>
  );
};
