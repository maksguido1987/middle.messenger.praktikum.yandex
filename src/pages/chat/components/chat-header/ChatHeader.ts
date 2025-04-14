import {Block} from '../../../../core/Block';
import {Link} from '../../../../components/link/Link';
import {Avatar} from '../../../../components/avatar/Avatar';
import {AuthController} from '../../../../controllers/authController';
import './style.scss';

interface ChatHeaderProps {
  attributes: {
    avatar: string;
    name: string;
  };
}

/**
 * Класс компонента заголовка чата
 */
export class ChatHeader extends Block {
  private authController: AuthController;

  constructor(props: ChatHeaderProps) {
    super({
      ...props,
      children: {
        Avatar: new Avatar({
          attributes: {
            avatar: props.attributes.avatar,
          },
        }),
        LoginLink: new Link({
          attributes: {
            text: 'Логин',
            href: '/',
            class: 'chat-header__link',
          },
        }),
        SigninLink: new Link({
          attributes: {
            text: 'Регистрация',
            href: '/sign-up',
            class: 'chat-header__link',
          },
        }),
        ProfileLink: new Link({
          attributes: {
            text: 'Профиль',
            href: '/settings',
            class: 'chat-header__link',
          },
        }),
        LogoutLink: new Link({
          attributes: {
            text: 'Выйти',
            href: '/',
            class: 'chat-header__link',
          },
          onClick: () => {
            this.authController.logout();
          },
        }),
        NotFoundLink: new Link({
          attributes: {
            text: '404',
            href: '/error',
            class: 'chat-header__link',
          },
        }),
        ServerErrorLink: new Link({
          attributes: {
            text: '500',
            href: '/nothing',
            class: 'chat-header__link',
          },
        }),
      },
    });

    this.authController = new AuthController();
  }

  render(): string {
    return `
      <header class="chat-header">
        <div class="chat-header__profile">
          {{{ Avatar }}}
          <div class="chat-header__name">${this.attributes.name}</div>
        </div>
        <div>
          {{{ LoginLink }}}
          {{{ SigninLink }}}
          {{{ ProfileLink }}}
          {{{ LogoutLink }}}
          {{{ NotFoundLink }}}
          {{{ ServerErrorLink }}}
        </div>
        <div class="chat-header__actions">
          <button class="chat-header__menu-button">
            <div class="dots-menu">
              <span class="dots-menu__dot"></span>
              <span class="dots-menu__dot"></span>
              <span class="dots-menu__dot"></span>
            </div>
          </button>
        </div>
      </header>
    `;
  }
}
