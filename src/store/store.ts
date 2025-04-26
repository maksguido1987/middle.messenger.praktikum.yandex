import {EventBus} from '../core/EventBus';
import {ChatInfo} from '../services/chat';
import {UserData} from '../services/auth';
import {set} from '../utils/set';

interface ModalsState {
  createChat: boolean;
}

interface StoreState {
  modals: ModalsState;
  user: UserData | null;
  chats: ChatInfo[];
}

export const enum StoreEvents {
  STORE_UPDATE = 'store:update',
  USER_UPDATE = 'store:user:update',
  CHATS_UPDATE = 'store:chats:update',
  MODALS_UPDATE = 'store:modals:update',
}

class Store extends EventBus {
  private static instance: Store;
  private _state: StoreState = {
    modals: {
      createChat: false,
    },
    user: null,
    chats: [],
  };

  private constructor() {
    super();
  }

  public static getInstance(): Store {
    if (!Store.instance) {
      Store.instance = new Store();
    }
    return Store.instance;
  }

  public get state(): StoreState {
    return this._state;
  }

  public setState(path: string, value: unknown): void {
    set(this._state, path, value);

    // Получаем корневой путь до первой точки
    const rootPath = path.split('.')[0] as keyof StoreState;

    // Эмитим специфичное событие в зависимости от корневого пути
    switch (rootPath) {
      case 'user':
        this.emit(StoreEvents.USER_UPDATE);
        break;
      case 'chats':
        this.emit(StoreEvents.CHATS_UPDATE);
        break;
      case 'modals':
        this.emit(StoreEvents.MODALS_UPDATE);
        break;
    }
  }
}

export const store = Store.getInstance();
