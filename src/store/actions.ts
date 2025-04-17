import {store} from './store';

export const actions = {
  // Пример действия для обновления состояния
  updateState: (key: string, value: unknown): void => {
    store.setState(key, value);
  },

  // Пример действия для получения состояния
  getState: (key: string): unknown => {
    return store.state[key];
  },

  subscribe: (listener: () => void): (() => void) => {
    return store.subscribe(listener);
  },
};
