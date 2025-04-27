import {Block} from '../../../../core/Block';
import {Link} from '../../../../components/link/Link';
import {Avatar} from '../../../../components/avatar/Avatar';
import {AuthController} from '../../../../controllers/authController';
import './style.scss';
import {store} from '../../../../store/store';
import {StoreEvents} from '../../../../store/store';
import {UserData} from '../../../../services/auth';

interface ChatHeaderProps {
  state: {
    src: string;
    name: string;
  };
}

export class ChatHeader extends Block {
  private authController: AuthController;

  constructor(props: ChatHeaderProps) {
    super({
      ...props,
      children: {
        Avatar: new Avatar({
          state: {
            src: props.state.src,
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

    store.on(StoreEvents.USER_UPDATE, this.updateUserData.bind(this));
  }

  private updateUserData() {
    const userData = store.state.user as UserData;

    this.children.Avatar.setState({
      src: userData.avatar,
    });
  }

  render() {
    return `
      <header class="chat-header">
        <div class="chat-header__profile">
          {{{ Avatar }}}
          <div class="chat-header__name">${this.state.name}</div>
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
