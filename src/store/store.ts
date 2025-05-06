import {EventBus} from '../core/EventBus';
import {ChatInfo} from '../services/chat';
import {UserData} from '../services/auth';
import {set} from '../utils/set';
import {debounce} from '../utils/debounce';
import {Messages} from '../controllers/webSocketController';

interface ModalsState {
  createChat: boolean;
  addUser: boolean;
  deleteUser: boolean;
}

interface StoreState {
  modals: ModalsState;
  user: UserData | null;
  chats: {
    original: ChatInfo[];
    filtered: ChatInfo[];
    currentChat: ChatInfo | null;
    messages: Messages;
  };
  searchChat: string;
}

export const enum StoreEvents {
  STORE_UPDATE = 'store:update',
  USER_UPDATE = 'store:user:update',
  CHATS_UPDATE = 'store:chats:update',
  MODALS_UPDATE = 'store:modals:update',
  SEARCH_CHAT_UPDATE = 'store:searchChat:update',
}

class Store extends EventBus {
  private static instance: Store;
  private _state: StoreState = {
    modals: {
      createChat: false,
      addUser: false,
      deleteUser: false,
    },
    user: null,
    chats: {
      original: [],
      filtered: [],
      currentChat: null,
      messages: [],
    },
    searchChat: '',
  };

  private debouncedSearchEmit: () => void;

  private constructor() {
    super();
    this.debouncedSearchEmit = debounce(() => {
      this.emit(StoreEvents.SEARCH_CHAT_UPDATE);
    }, 300);
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
      case 'searchChat':
        this.debouncedSearchEmit();
        break;
    }
  }

  public clearStore(): void {
    this._state = {
      modals: {
        createChat: false,
        addUser: false,
        deleteUser: false,
      },
      user: null,
      chats: {
        original: [],
        filtered: [],
        currentChat: null,
        messages: [],
      },
      searchChat: '',
    };
    this.emit(StoreEvents.STORE_UPDATE);
  }
}

export const store = Store.getInstance();
