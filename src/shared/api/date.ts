import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { ru } from "date-fns/locale";

// Простая функция форматирования
export const formatMessageTime = (timestamp: string | Date): string => {
  const date = new Date(timestamp);
  const now = new Date();

  // Если сообщение было меньше минуты назад
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "только что";
  }

  // Если сообщение сегодня - показываем время
  if (isToday(date)) {
    return format(date, "HH:mm");
  }

  // Если сообщение вчера
  if (isYesterday(date)) {
    return `вчера, ${format(date, "HH:mm")}`;
  }

  // Если сообщение в течение последних 7 дней
  if (diffInSeconds < 7 * 24 * 60 * 60) {
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: ru,
    }).replace("примерно ", "");
  }

  // Старые сообщения - полная дата
  return format(date, "dd.MM.yyyy, HH:mm");
};

// Или еще проще, одной функцией:
export const formatTimeAgo = (timestamp: string | Date): string => {
  const date = new Date(timestamp);
  const now = new Date();

  // Разница в секундах
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "только что";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} мин. назад`;
  if (diffInSeconds < 86400) return format(date, "HH:mm");

  if (diffInSeconds < 172800) return `вчера, ${format(date, "HH:mm")}`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} дн. назад`;

  return format(date, "dd.MM.yyyy");
};
