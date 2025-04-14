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

    // Инициализация роутера
    window.addEventListener('popstate', () => {
      this.render();
    });

    // Первоначальный рендер
    this.render();
  }

  /**
   * Рендерит компоненты в зависимости от текущего маршрута
   */
  private render() {
    const location = window.location.pathname;
    let newContent: HTMLElement | null = null;

    switch (location) {
      case '/':
        newContent = new Chat().getContent() as HTMLElement;
        break;
      case '/profile':
        newContent = new ProfilePage().getContent() as HTMLElement;
        break;
      case '/login':
        newContent = new LoginPage().getContent() as HTMLElement;
        break;
      case '/signin':
        newContent = new SigninPage().getContent() as HTMLElement;
        break;
      case '/404':
        newContent = new ErrorPage({
          title: 'Страница не найдена',
          code: '404',
          description: 'Запрашиваемая страница не существует или была перемещена',
        }).getContent() as HTMLElement;
        break;
      case '/500':
        newContent = new ErrorPage({
          title: 'Ошибка сервера',
          code: '500',
          description: 'Сервер временно не отвечает. Мы уже работаем над устранением проблемы',
        }).getContent() as HTMLElement;
        break;
      default:
        newContent = new ErrorPage({
          title: 'Страница не найдена',
          code: '404',
          description: 'Запрашиваемая страница не существует или была перемещена',
        }).getContent() as HTMLElement;
    }

    if (newContent) {
      // Очищаем содержимое корневого элемента
      this.rootElement.innerHTML = '';
      // Добавляем новый контент
      this.rootElement.appendChild(newContent);
    }
  }

  /**
   * Инициализирует приложение
   */
  public init() {
    this.render();
  }
}
