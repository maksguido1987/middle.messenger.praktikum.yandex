import {Block} from '../../../../core/Block';
import {Link} from '../../../../components/link/Link';
import './style.scss';
import {Avatar} from '../../../../components/avatar/Avatar';

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
            href: '/login',
            class: 'chat-header__link',
          },
        }),
        SigninLink: new Link({
          attributes: {
            text: 'Регистрация',
            href: '/signin',
            class: 'chat-header__link',
          },
        }),
        ProfileLink: new Link({
          attributes: {
            text: 'Профиль',
            href: '/profile',
            class: 'chat-header__link',
          },
        }),
        NotFoundLink: new Link({
          attributes: {
            text: '404',
            href: '/404',
            class: 'chat-header__link',
          },
        }),
        ServerErrorLink: new Link({
          attributes: {
            text: '500',
            href: '/500',
            class: 'chat-header__link',
          },
        }),
      },
    });
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
