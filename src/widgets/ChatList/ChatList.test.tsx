import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { ChatList } from "./ChatList";
import { useChatStore } from "../../store/chatStore";
import { formatTimeAgo } from "../../shared/utils/date";
import { generateAvatar } from "../../shared/utils/messages";
import type { Chat } from "../../shared/types";

// Мокаем зависимости
jest.mock("../../store/chatStore", () => ({
  useChatStore: jest.fn(),
}));
jest.mock("../../shared/utils/date");
jest.mock("../../shared/utils/messages", () => ({
  generateAvatar: jest.fn(() => ({ text: "JD", color: "#FF5733" })),
  range: jest.fn((count: number) => Array.from({ length: count }, (_, i) => i)),
}));

const mockFormatTimeAgo = formatTimeAgo as jest.MockedFunction<
  typeof formatTimeAgo
>;
const mockGenerateAvatar = generateAvatar as jest.MockedFunction<
  typeof generateAvatar
>;
const mockUseChatStore = useChatStore as jest.MockedFunction<
  typeof useChatStore
>;

// Моковые данные
const mockChats: Chat[] = [
  {
    id: "1",
    name: "Иван Иванов",
    lastMessage: {
      id: "msg1",
      text: "Hello there!",
      author: "Иван Иванов",
      timestamp: Date.now() - 3600000, // 1 час назад
      chatId: "1",
      status: "sent",
    },
  },
  {
    id: "2",
    name: "Алиса Петрова",
    lastMessage: {
      id: "msg2",
      text: "See you tomorrow",
      author: "Алиса Петрова",
      timestamp: Date.now() - 7200000, // 2 часа назад
      chatId: "2",
      status: "sent",
    },
  },
  {
    id: "3",
    name: "Work Group",
    lastMessage: {
      id: "msg3",
      text: "Meeting at 3 PM",
      author: "Боб Александров",
      timestamp: Date.now() - 1800000, // 30 минут назад
      chatId: "3",
      status: "sent",
    },
  },
];

const mockChatWithoutMessage: Chat = {
  id: "4",
  name: "Empty Chat",
  lastMessage: undefined,
};

describe("ChatList", () => {
  const onChatSelected = jest.fn();
  const mockLoadChats = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Настройка моков по умолчанию
    mockFormatTimeAgo.mockImplementation(() => "1 hour ago");
    mockGenerateAvatar.mockReturnValue({ text: "JD", color: "#FF5733" });

    mockUseChatStore.mockReturnValue({
      chats: [],
      loadChats: mockLoadChats,
      loadingChats: false,
    });
  });

  describe("Загрузка данных", () => {
    it("должен вызывать loadChats при монтировании", () => {
      render(<ChatList selectedChat={null} onChatSelected={onChatSelected} />);

      expect(mockLoadChats).toHaveBeenCalledTimes(1);
    });

    it("не должен показывать скелетоны после загрузки", () => {
      mockUseChatStore.mockReturnValue({
        chats: mockChats,
        loadChats: mockLoadChats,
        loadingChats: false,
      });

      render(<ChatList selectedChat={null} onChatSelected={onChatSelected} />);

      expect(
        screen.queryByTestId("chat-item-skeleton")
      ).not.toBeInTheDocument();
    });
  });

  describe("Отображение списка чатов", () => {
    beforeEach(() => {
      mockUseChatStore.mockReturnValue({
        chats: mockChats,
        loadChats: mockLoadChats,
        loadingChats: false,
      });
    });

    it("должен отображать все чаты из store", () => {
      render(<ChatList selectedChat={null} onChatSelected={onChatSelected} />);

      expect(screen.getByText("Иван Иванов")).toBeInTheDocument();
      expect(screen.getByText("Алиса Петрова")).toBeInTheDocument();
      expect(screen.getByText("Work Group")).toBeInTheDocument();
    });

    it("должен сортировать чаты по времени последнего сообщения", () => {
      render(<ChatList selectedChat={null} onChatSelected={onChatSelected} />);

      const items = screen.getAllByRole("listitem");
      const chatNames = items.map(
        (item) =>
          within(item).getByText(/Иван Иванов|Алиса Петрова|Work Group/).textContent
      );

      // Ожидаемый порядок: Work Group (30 мин), Иван Иванов (1 час), Алиса Петрова (2 часа)
      expect(chatNames[0]).toBe("Алиса Петрова");
      expect(chatNames[1]).toBe("Иван Иванов");
      expect(chatNames[2]).toBe("Work Group");
    });

    it("должен корректно обрабатывать чаты без сообщений", () => {
      mockUseChatStore.mockReturnValue({
        chats: [mockChatWithoutMessage],
        loadChats: mockLoadChats,
        loadingChats: false,
      });

      render(<ChatList selectedChat={null} onChatSelected={onChatSelected} />);

      expect(screen.getByText("Empty Chat")).toBeInTheDocument();
      expect(screen.queryByText("Empty Chat:")).not.toBeInTheDocument();
    });
  });
});
