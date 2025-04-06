import {Chat} from './pages/chat/Chat';
import {ErrorPage} from './pages/errors/Error';
import {LoginPage} from './pages/login/LoginPage';
import {ProfilePage} from './pages/profile/ProfilePage';
import {SigninPage} from './pages/signin/SigninPage';

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
      case '/':
        this.rootElement.replaceWith(new Chat().getContent());
        break;
      case '/profile':
        this.rootElement.replaceWith(new ProfilePage().getContent());
        break;
      case '/login':
        this.rootElement.replaceWith(new LoginPage().getContent());
        break;
      case '/signin':
        this.rootElement.replaceWith(new SigninPage().getContent());
        break;
      case '/404':
        this.rootElement.replaceWith(
          new ErrorPage({
            title: 'Страница не найдена',
            code: '404',
            description: 'Запрашиваемая страница не существует или была перемещена',
          }).getContent(),
        );
        break;
      case '/500':
        this.rootElement.replaceWith(
          new ErrorPage({
            title: 'Ошибка сервера',
            code: '500',
            description: 'Сервер временно не отвечает. Мы уже работаем над устранением проблемы',
          }).getContent(),
        );
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
