import {Router} from './core/Router';
import {ChatPage} from './pages/chat/ChatPage';
import {ErrorPage} from './pages/errors/Error';
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
      .setNotFound(ErrorPage, {
        attributes: {
          title: '404 - Страница не найдена',
          code: '404',
          description: 'Извините, запрашиваемая страница не существует',
        },
      })
      .start();
  }

  public init() {
    this.render();
  }
}
