import {EventBus} from '../core/EventBus';
import {EmitEvents} from '../global-types';
import {Chat} from '../pages/chat/Chat';
import {UserData} from '../services/auth';
import {set} from '../utils/set';

interface ModalsState {
  createChat: boolean;
}

interface StoreState {
  modals: ModalsState;
  user: UserData | null;
  chats: Chat[];
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

  public setState<T extends string>(path: T, value: unknown): void {
    set(this._state, path, value);
    this.emit(EmitEvents.STORE_UPDATE);
  }
}

export const store = Store.getInstance();
