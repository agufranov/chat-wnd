import { EventBus } from "@/shared/utils/eventBus";

describe("EventBus", () => {
  type TestEvents = {
    "user:login": { id: string; name: string };
    "user:logout": undefined;
    "message:received": string;
  };

  let eventBus: EventBus<TestEvents>;

  beforeEach(() => {
    eventBus = new EventBus<TestEvents>();
  });

  it("должен создавать экземпляр с пустыми слушателями", () => {
    expect(eventBus).toBeInstanceOf(EventBus);
  });

  describe("метод on", () => {
    it("должен регистрировать слушателя события", () => {
      const callback = jest.fn();
      eventBus.on("user:login", callback);
      expect(callback).not.toHaveBeenCalled();
    });

    it("должен регистрировать несколько слушателей для одного события", () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      eventBus.on("message:received", callback1);
      eventBus.on("message:received", callback2);

      eventBus.emit("message:received", "тест");

      expect(callback1).toHaveBeenCalledWith("тест");
      expect(callback2).toHaveBeenCalledWith("тест");
    });
  });

  describe("метод off", () => {
    it("должен удалять зарегистрированного слушателя", () => {
      const callback = jest.fn();

      eventBus.on("user:login", callback);
      eventBus.off("user:login", callback);

      eventBus.emit("user:login", { id: "1", name: "Иван" });

      expect(callback).not.toHaveBeenCalled();
    });

    it("должен удалять только указанный слушатель", () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      eventBus.on("message:received", callback1);
      eventBus.on("message:received", callback2);
      eventBus.off("message:received", callback1);

      eventBus.emit("message:received", "сообщение");

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledWith("сообщение");
    });

    it("не должен падать при удалении несуществующего слушателя", () => {
      const callback = jest.fn();

      expect(() => {
        eventBus.off("user:login", callback);
      }).not.toThrow();
    });
  });

  describe("метод emit", () => {
    it("должен вызывать всех слушателей с переданными данными", () => {
      const callback = jest.fn();
      const payload = { id: "123", name: "Анна" };

      eventBus.on("user:login", callback);
      eventBus.emit("user:login", payload);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(payload);
    });

    it("должен работать с событиями без данных", () => {
      const callback = jest.fn();

      eventBus.on("user:logout", callback);
      eventBus.emit("user:logout", undefined);

      expect(callback).toHaveBeenCalledWith(undefined);
    });

    it("не должен падать при вызове несуществующего события", () => {
      expect(() => {
        eventBus.emit("несуществующее-событие" as any, "данные");
      }).not.toThrow();
    });
  });

  describe("интеграционные сценарии", () => {
    it("должен корректно работать с цепочкой событий", () => {
      const results: string[] = [];

      const loginHandler = jest.fn(() => results.push("вошел"));
      const logoutHandler = jest.fn(() => results.push("вышел"));

      eventBus.on("user:login", loginHandler);
      eventBus.on("user:logout", logoutHandler);

      eventBus.emit("user:login", { id: "1", name: "Петр" });
      eventBus.emit("user:logout", undefined);

      eventBus.off("user:login", loginHandler);
      eventBus.emit("user:login", { id: "2", name: "Мария" });

      expect(loginHandler).toHaveBeenCalledTimes(1);
      expect(logoutHandler).toHaveBeenCalledTimes(1);
      expect(results).toEqual(["вошел", "вышел"]);
    });

    it("должен сохранять порядок вызова слушателей", () => {
      const callOrder: number[] = [];

      const callback1 = jest.fn(() => callOrder.push(1));
      const callback2 = jest.fn(() => callOrder.push(2));
      const callback3 = jest.fn(() => callOrder.push(3));

      eventBus.on("message:received", callback1);
      eventBus.on("message:received", callback2);
      eventBus.on("message:received", callback3);

      eventBus.emit("message:received", "сообщение");

      expect(callOrder).toEqual([1, 2, 3]);
    });
  });
});
