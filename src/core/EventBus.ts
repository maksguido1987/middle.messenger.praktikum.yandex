export type EventHandler = (...args: unknown[]) => void;

/**
 * Класс для управления событиями
 */
export class EventBus {
  private events: Map<string, EventHandler[]>;

  constructor() {
    this.events = new Map();
  }

  on(event: string, handler: EventHandler): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)?.push(handler);
  }

  off(event: string, handler: EventHandler): void {
    if (!this.events.has(event)) {
      throw new Error(`Нет события: ${event}`);
    }

    const handlers = this.events.get(event);
    const index = handlers?.indexOf(handler);

    if (index && index !== -1) {
      handlers?.splice(index, 1);
    }

    if (handlers?.length === 0) {
      this.events.delete(event);
    }
  }

  emit<T extends string>(event: T, ...args: unknown[]): void {
    if (!this.events.has(event)) {
      throw new Error(`Нет события: ${event}`);
    }

    const handlers = this.events.get(event);
    if (handlers) {
      handlers.forEach((handler) => {
        handler(...args);
      });
    }
  }

  clear(): void {
    this.events.clear();
  }
}
