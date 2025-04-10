import {Router} from './core/Router';
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
  private router: Router;

  constructor(rootSelector: string) {
    const root = document.getElementById(rootSelector);

    if (!root) {
      throw new Error(`Элемент с селектором "${rootSelector}" не найден`);
    }

    this.rootElement = root;
    this.router = new Router(this.rootElement);

    // Инициализация роутера
    window.addEventListener('popstate', () => {
      this.render();
    });

    // Первоначальный рендер
    // this.router.use('/', Chat).start();
    // this.render();
  }

  /**
   * Рендерит компоненты в зависимости от текущего маршрута
   */
  private render() {
    this.router
      .use('/', Chat)
      .use('/login', LoginPage)
      .use('/signin', SigninPage)
      .use('/profile', ProfilePage)
      .use('/404', ErrorPage)
      .start();
  }

  /**
   * Инициализирует приложение
   */
  public init() {
    this.render();
  }
}
