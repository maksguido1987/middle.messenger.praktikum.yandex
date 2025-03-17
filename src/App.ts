import Handlebars from 'handlebars';
import {Button, Input, FormTitle, Link, Avatar} from './components';
import {
  Login,
  Signin,
  Chat,
  Profile,
  EditPassword,
  Error404,
  Error500,
} from './pages';
import {
  AttachButton,
  ChatHeader,
  ChatInput,
  ChatItem,
  ChatList,
  ChatSearch,
} from './pages/chat/components';
import {ChatListComponent} from './pages/chat/components/chat-list/ChatList';
import {LoadAvatar, ProfileInput} from './pages/profile/components';

Handlebars.registerPartial('Button', Button);
Handlebars.registerPartial('Input', Input);
Handlebars.registerPartial('FormTitle', FormTitle);
Handlebars.registerPartial('Link', Link);
Handlebars.registerPartial('Avatar', Avatar);
Handlebars.registerPartial('ChatSearch', ChatSearch);
Handlebars.registerPartial('ChatList', ChatList);
Handlebars.registerPartial('ChatItem', ChatItem);
Handlebars.registerPartial('ChatHeader', ChatHeader);
Handlebars.registerPartial('ChatInput', ChatInput);
Handlebars.registerPartial('AttachButton', AttachButton);
Handlebars.registerPartial('ProfileInput', ProfileInput);
Handlebars.registerPartial('LoadAvatar', LoadAvatar);
Handlebars.registerPartial('EditPassword', EditPassword);

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

    this.rootElement = root as HTMLElement;
  }

  /**
   * Рендерит компоненты в зависимости от текущего маршрута
   */
  private render() {
    const location = window.location.pathname;

    switch (location) {
      case '/':
        this.rootElement.innerHTML = Handlebars.compile(Chat)({});
        break;
      case '/signin':
        this.rootElement.innerHTML = Handlebars.compile(Signin)({});
        break;
      case '/login':
        this.rootElement.innerHTML = Handlebars.compile(Login)({});
        break;
      case '/profile':
        this.rootElement.innerHTML = Handlebars.compile(Profile)({
          displayName: 'Иванов Иван',
          email: 'ivanov@yandex.ru',
          login: 'ivanov',
          firstName: 'Иван',
          lastName: 'Иванов',
          phone: '+7 (909) 967 30 30',
          isEditing: false,
          isPasswordChange: false,
        });
        break;
      case '/404':
        this.rootElement.innerHTML = Handlebars.compile(Error404)({});
        break;
      case '/500':
        this.rootElement.innerHTML = Handlebars.compile(Error500)({});
        break;
      default:
        this.rootElement.innerHTML = Handlebars.compile(Chat)({});
    }

    this.addEventListeners();

    // Инициализация компонентов после рендеринга
    if (location === '/' || location === '/chat') {
      this.initChatComponents();
    }
  }

  /**
   * Инициализирует компоненты чата
   */
  private initChatComponents() {
    const chatListContainer = this.rootElement.querySelector('.chat-list');
    if (chatListContainer) {
      new ChatListComponent(chatListContainer as HTMLElement);
    }
  }

  /**
   * Добавляет обработчики событий для форм и ссылок
   */
  private addEventListeners() {
    const form = this.rootElement.querySelector(
      '.form-container',
    ) as HTMLElement;

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
      });
    }

    const links = this.rootElement.querySelectorAll('.link');

    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        const href = (link as HTMLAnchorElement).getAttribute('href');

        if (href) {
          // Изменяем URL без перезагрузки страницы
          window.history.pushState({}, '', href);

          // Вызываем рендер для обновления содержимого
          this.render();
        }
      });
    });
  }

  /**
   * Инициализирует приложение
   */
  public init() {
    this.render();

    // Добавляем обработчик для кнопки "назад" в браузере
    window.addEventListener('popstate', () => {
      this.render();
    });
  }
}
