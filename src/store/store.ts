

type StoreState = Record<string, unknown>;
type Listener = () => void;

class Store {
  private static instance: Store;
  private _state: StoreState = {};
  private listeners: Set<Listener> = new Set();

  private constructor() {}

  public static getInstance(): Store {
    if (!Store.instance) {
      Store.instance = new Store();
    }
    return Store.instance;
  }

  public get state(): StoreState {
    return this._state;
  }

  public setState(key: string, value: unknown): void {
    this._state[key] = value;
    this.notifyListeners();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }
}

export const store = Store.getInstance();

export const useStore = () => {
};
