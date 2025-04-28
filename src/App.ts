import {Router} from './core/Router';
import {ChatPage} from './pages/chat/ChatPage';
import {ErrorPage, ErrorPageProps} from './pages/errors/Error';
import {LoginPage} from './pages/login/LoginPage';
import {ProfilePage} from './pages/profile/ProfilePage';
import {BlockProps} from './global-types';
import {SignUpPage} from './pages/sign-up/SignUpPage';

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
  }

  private render() {

    this.router
      .use('/', LoginPage, {} as BlockProps)
      .use('/messenger', ChatPage, {} as BlockProps)
      .use('/sign-up', SignUpPage, {} as BlockProps)
      .use('/settings', ProfilePage, {} as BlockProps)
      .use<ErrorPageProps>('/error', ErrorPage, {
        attributes: {
          title: 'Страница не найдена',
          code: '404',
          description: 'Извините, запрашиваемая страница не существует',
        },
      })
      .use<ErrorPageProps>('/nothing', ErrorPage, {
        attributes: {
          title: 'Ошибка сервера',
          code: '500',
          description: 'Извините, произошла внутренняя ошибка сервера',
        },
      })
      .start();
  }

  public init() {
    this.render();
  }
}
