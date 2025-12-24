export class EventBus<T extends { [eventName: string]: unknown }> {
  private listeners = {} as {
    [K in keyof T]: ((payload: T[K]) => void)[];
  };

  on<K extends keyof T>(event: K, callback: (payload: T[K]) => void) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  off<K extends keyof T>(event: K, callback: (payload: T[K]) => void) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(
      (listener) => listener !== callback
    );
  }

  emit<K extends keyof T>(event: K, payload: T[K]) {
    this.listeners?.[event]?.forEach((listener) => listener(payload));
  }
}
