import {Router} from './core/Router';
import {Chat} from './pages/chat/Chat';
import {ErrorPage, ErrorPageProps} from './pages/errors/Error';
import {LoginPage} from './pages/login/LoginPage';
import {ProfilePage} from './pages/profile/ProfilePage';
import {SigninPage} from './pages/signin/SigninPage';
import {BlockProps} from './global-types';

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
  }

  /**
   * Рендерит компоненты в зависимости от текущего маршрута
   */
  private render() {
    this.router
      .use('/', Chat, {} as BlockProps)
      .use('/login', LoginPage, {} as BlockProps)
      .use('/signin', SigninPage, {} as BlockProps)
      .use('/profile', ProfilePage, {} as BlockProps)
      .use<ErrorPageProps>('/404', ErrorPage, {
        attributes: {
          title: 'Страница не найдена',
          code: '404',
          description: 'Извините, запрашиваемая страница не существует',
        },
      })
      .use<ErrorPageProps>('/500', ErrorPage, {
        attributes: {
          title: 'Ошибка сервера',
          code: '500',
          description: 'Извините, произошла внутренняя ошибка сервера',
        },
      })
      .start();
  }

  /**
   * Инициализирует приложение
   */
  public init() {
    this.render();
  }
}
