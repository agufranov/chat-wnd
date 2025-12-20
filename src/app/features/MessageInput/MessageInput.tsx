import { useState, type FormEvent } from "react";
import type React from "react";
import style from "./MessageInput.module.css";

type MessageInputProps = {
  onSubmit: (message: string) => void;
};

export const MessageInput: React.FC<MessageInputProps> = ({ onSubmit }) => {
  const [inputState, setInputState] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setInputState("");
    onSubmit(inputState);
  };

  return (
    <form className={style.root} onSubmit={handleSubmit}>
      <input
        className={style.input}
        value={inputState}
        onInput={(e) =>
          setInputState((e.currentTarget as HTMLInputElement).value)
        }
      />
      <button type="submit">Send</button>
    </form>
  );
};
