// src/components/MessageInput/MessageInput.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MessageInput } from "./MessageInput";
import { useState } from "react";

describe("MessageInput", () => {
  const mockonSubmit = jest.fn();

  beforeEach(() => {
    mockonSubmit.mockClear();
  });

  it("рендерит input и кнопку отправки", () => {
    render(<MessageInput onSubmit={mockonSubmit} />);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /отправить/i })
    ).toBeInTheDocument();
  });

  it("рендерит placeholder", () => {
    render(<MessageInput onSubmit={mockonSubmit} />);

    expect(
      screen.getByPlaceholderText("Введите сообщение...")
    ).toBeInTheDocument();
  });

  it("кнопка имеет правильный текст", () => {
    render(<MessageInput onSubmit={mockonSubmit} />);

    expect(
      screen.getByRole("button", { name: /отправить/i })
    ).toBeInTheDocument();
  });

  it("кнопка отправки заблокирована при пустом input", () => {
    render(<MessageInput onSubmit={mockonSubmit} />);

    const sendButton = screen.getByRole("button", { name: /отправить/i });
    expect(sendButton).toBeDisabled();
  });

  it("кнопка отправки активна при наличии текста", async () => {
    const user = userEvent.setup();
    render(<MessageInput onSubmit={mockonSubmit} />);

    const input = screen.getByRole("textbox");
    const sendButton = screen.getByRole("button", { name: /отправить/i });

    await user.type(input, "Привет мир!");

    expect(sendButton).toBeEnabled();
  });

  it("вызывает onSubmit при клике на кнопку", async () => {
    const user = userEvent.setup();
    render(<MessageInput onSubmit={mockonSubmit} />);

    const input = screen.getByRole("textbox");
    const sendButton = screen.getByRole("button", { name: /отправить/i });

    await user.type(input, "test test");
    await user.click(sendButton);

    expect(mockonSubmit).toHaveBeenCalledTimes(1);
    expect(mockonSubmit).toHaveBeenCalledWith("test test");
  });

  it("вызывает onSubmit при нажатии Enter", async () => {
    const user = userEvent.setup();
    render(<MessageInput onSubmit={mockonSubmit} />);

    const input = screen.getByRole("textbox");

    await user.type(input, "test test{enter}");

    expect(mockonSubmit).toHaveBeenCalledTimes(1);
    expect(mockonSubmit).toHaveBeenCalledWith("test test");
  });

  it("очищает input после отправки", async () => {
    const user = userEvent.setup();
    render(<MessageInput onSubmit={mockonSubmit} />);

    const input = screen.getByRole("textbox") as HTMLInputElement;
    const sendButton = screen.getByRole("button", { name: /отправить/i });

    await user.type(input, "test test");
    await user.click(sendButton);

    expect(input.value).toBe("");
    expect(sendButton).toBeDisabled();
  });

  it("не вызывает onSubmit при пустом input и нажатии Enter", async () => {
    const user = userEvent.setup();
    render(<MessageInput onSubmit={mockonSubmit} />);

    const input = screen.getByRole("textbox");

    await user.type(input, "{enter}");

    expect(mockonSubmit).not.toHaveBeenCalled();
  });

  it("не вызывает onSubmit при клике на неактивную кнопку", async () => {
    const user = userEvent.setup();
    render(<MessageInput onSubmit={mockonSubmit} />);

    const sendButton = screen.getByRole("button", { name: /отправить/i });

    // disabled кнопка
    await user.click(sendButton);

    expect(mockonSubmit).not.toHaveBeenCalled();
  });

  it("обрезает пробелы в тексте сообщения", async () => {
    const user = userEvent.setup();
    render(<MessageInput onSubmit={mockonSubmit} />);

    const input = screen.getByRole("textbox");
    const sendButton = screen.getByRole("button", { name: /отправить/i });

    await user.type(input, "  сообщение с пробелами  ");
    await user.click(sendButton);

    expect(mockonSubmit).toHaveBeenCalledWith("сообщение с пробелами");
  });
});

// Интеграционный тест с состоянием
describe("MessageInput интеграция с состоянием", () => {
  it("добавляет сообщение в список при отправке", async () => {
    const user = userEvent.setup();

    const mockAddMessage = jest.fn();

    const TestWrapper = () => {
      const [messages, setMessages] = useState<string[]>([]);

      const handleSend = (message: string) => {
        mockAddMessage(message);
        setMessages((prev) => [...prev, message]);
      };

      return (
        <div>
          <MessageInput onSubmit={handleSend} />
          <div data-testid="messages">
            {messages.map((msg, i) => (
              <div key={i}>{msg}</div>
            ))}
          </div>
        </div>
      );
    };

    render(<TestWrapper />);

    const input = screen.getByRole("textbox");
    const sendButton = screen.getByRole("button", { name: /отправить/i });

    await user.type(input, "test test test");
    await user.click(sendButton);

    expect(mockAddMessage).toHaveBeenCalledWith("test test test");

    expect(screen.getByTestId("messages")).toHaveTextContent("test test test");
  });
});
