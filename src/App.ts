import {LoginPage} from './pages/login/LoginPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { SigninPage } from './pages/signin/SigninPage';

/**
 * Основной класс приложения для управления маршрутизацией и рендерингом
 */
export class App {
  private rootElement: HTMLElement;

  /**
   * Создает экземпляр приложения
   * @param {string} rootSelector - CSS селектор корневого элемента
   */
  constructor(rootSelector: string) {
    const root = document.getElementById(rootSelector);

    if (!root) {
      throw new Error(`Элемент с селектором "${rootSelector}" не найден`);
    }

    this.rootElement = root;
  }

  /**
   * Рендерит компоненты в зависимости от текущего маршрута
   */
  private render() {
    const location = window.location.pathname;

    switch (location) {
      case '/profile':
        this.rootElement.replaceWith(new ProfilePage().getContent());
        break;
      case '/login':
        this.rootElement.replaceWith(new LoginPage().getContent());
        break;
      case '/signin':
        this.rootElement.replaceWith(new SigninPage().getContent());
        break;
    }
  }

  /**
   * Инициализирует приложение
   */
  public init() {
    this.render();
  }
}
