import {AuthController} from '../../controllers/authController';
import {Block} from '../../core/Block';
import {store, StoreEvents} from '../../store/store';
import {Chat} from './components/chat/Chat';
import {ChatList} from './components/chat-list/ChatList';
import {ChatSearch} from './components/chat-search/ChatSearch';
import {EmptyChat} from './components/empty-chat/EmptyChat';
import {Link} from '../../components/link/Link';

export class ChatPage extends Block {
  private authController: AuthController;

  constructor() {
    super({
      state: {
        visibleChat: false,
      },
      children: {
        LoginLink: new Link({
          attributes: {
            text: 'Логин',
            href: '/',
            class: 'navbar__link',
          },
        }),
        SigninLink: new Link({
          attributes: {
            text: 'Регистрация',
            href: '/sign-up',
            class: 'navbar__link',
          },
        }),
        ProfileLink: new Link({
          attributes: {
            text: 'Профиль',
            href: '/settings',
            class: 'navbar__link',
          },
        }),
        LogoutLink: new Link({
          attributes: {
            text: 'Выйти',
            href: '/',
            class: 'navbar__link',
          },
          onClick: () => {
            this.authController.logout();
          },
        }),
        NotFoundLink: new Link({
          attributes: {
            text: '404',
            href: '/error',
            class: 'navbar__link',
          },
        }),
        ServerErrorLink: new Link({
          attributes: {
            text: '500',
            href: '/nothing',
            class: 'navbar__link',
          },
        }),
        ChatList: new ChatList(),
        Chat: new Chat({}),
        EmptyChat: new EmptyChat(),
        ChatSearch: new ChatSearch({
          events: {
            submit: (e: SubmitEvent) => {
              e.preventDefault();
              // Здесь будет логика поиска
            },
          },
        }),
      },
    });

    this.authController = new AuthController();
    this.authController.getUser();

    // Подписываемся на изменения store
    store.on(StoreEvents.USER_UPDATE, this.updateChatData.bind(this));
    store.on(StoreEvents.CHATS_UPDATE, this.updateChatData.bind(this));
  }

  private updateChatData() {
    const chatData = store.state.chats.currentChat;

    if (chatData) {
      this.setState({
        visibleChat: true,
      });
    }
  }

  render() {
    return `
      <main class="chat-page">
        <div class="navbar">
          {{{ LoginLink }}}
          {{{ SigninLink }}}
          {{{ ProfileLink }}}
          {{{ LogoutLink }}}
          {{{ NotFoundLink }}}
          {{{ ServerErrorLink }}}
        </div>
        <div class="chat-page__content">
          <div class="chat-sidebar">
            {{{ ChatSearch }}}
            {{{ ChatList }}}
          </div>
          ${this.state.visibleChat ? '{{{ Chat }}}' : '{{{ EmptyChat }}}'}
        </div>
      </main>
    `;
  }
}
