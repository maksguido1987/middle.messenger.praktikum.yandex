type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
};

type UserStoreEvents = 'userChanged' | 'loadingChanged';

class UserStore {
  private static instance: UserStore;
  private user: User | null = null;
  private isLoading: boolean = false;
  private listeners: Map<UserStoreEvents, (() => void)[]> = new Map();

  private constructor() {
    // Загружаем данные пользователя при инициализации
    this.loadUserFromStorage();
  }

  public static getInstance(): UserStore {
    if (!UserStore.instance) {
      UserStore.instance = new UserStore();
    }
    return UserStore.instance;
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.user = JSON.parse(userData);
      } catch (e) {
        console.error('Ошибка при загрузке данных пользователя:', e);
        localStorage.removeItem('user');
      }
    }
  }

  private saveUserToStorage(): void {
    if (this.user) {
      localStorage.setItem('user', JSON.stringify(this.user));
    } else {
      localStorage.removeItem('user');
    }
  }

  private emit(event: UserStoreEvents): void {
    const handlers = this.listeners.get(event) || [];
    handlers.forEach((handler) => handler());
  }

  public subscribe(event: UserStoreEvents, handler: () => void): void {
    const handlers = this.listeners.get(event) || [];
    this.listeners.set(event, [...handlers, handler]);
  }

  public unsubscribe(event: UserStoreEvents, handler: () => void): void {
    const handlers = this.listeners.get(event) || [];
    this.listeners.set(
      event,
      handlers.filter((h) => h !== handler),
    );
  }

  public async login(email: string, password: string): Promise<void> {
    try {
      this.isLoading = true;
      this.emit('loadingChanged');

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
      });

      if (!response.ok) {
        throw new Error('Ошибка авторизации');
      }

      const userData = await response.json();
      this.user = userData;
      this.saveUserToStorage();
      this.emit('userChanged');
    } finally {
      this.isLoading = false;
      this.emit('loadingChanged');
    }
  }

  public async logout(): Promise<void> {
    try {
      this.isLoading = true;
      this.emit('loadingChanged');

      await fetch('/api/logout', {
        method: 'POST',
      });

      this.user = null;
      this.saveUserToStorage();
      this.emit('userChanged');
    } finally {
      this.isLoading = false;
      this.emit('loadingChanged');
    }
  }

  public getUser(): User | null {
    return this.user;
  }

  public isAuthenticated(): boolean {
    return !!this.user;
  }

  public getLoadingState(): boolean {
    return this.isLoading;
  }
}

export const userStore = UserStore.getInstance();
