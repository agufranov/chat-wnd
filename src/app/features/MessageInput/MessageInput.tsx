import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type FormEventHandler,
  type KeyboardEventHandler,
} from "react";
import type React from "react";
import style from "./MessageInput.module.css";
import Send from "./assets/send.svg";
import cn from "classnames";

type MessageInputProps = {
  initialValue?: string;
  onInput?: (message: string) => void;
  onSubmit: (message: string) => void;
};

export const MessageInput: React.FC<MessageInputProps> = ({
  initialValue,
  onInput,
  onSubmit,
}) => {
  const [inputState, setInputState] = useState(initialValue ?? "");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.focus();
    const length = inputRef.current.value.length;
    inputRef.current.setSelectionRange(length, length);
  }, []);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!inputState.trim()) return;
    setInputState("");
    adjustHeight();
    onSubmit(inputState.trim());
  };

  const adjustHeight = () => {
    const textarea = inputRef.current;
    if (!textarea) return;

    textarea.style.height = "auto"; // Сброс
    textarea.style.height = `${textarea.scrollHeight + 1}px`;
  };

  const handleInput: FormEventHandler<HTMLTextAreaElement> = (e) => {
    setInputState(e.currentTarget.value);
    adjustHeight();
    onInput?.(e.currentTarget.value);
  };

  const handleKeyDown: KeyboardEventHandler = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
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
        onKeyDown={handleKeyDown}
        ref={inputRef}
      />
      <button
        className={style.sendButton}
        type="submit"
        disabled={!inputState.trim()}
      >
        <Send width={24} height={24} />
      </button>
    </form>
  );
};
