import {AuthController} from '../../controllers/authController';
import {Block} from '../../core/Block';
import {EmitEvents} from '../../global-types';
import {UserData} from '../../services/auth';
import {store} from '../../store/store';
import {ChatHeader} from './components/chat-header/ChatHeader';
import {ChatInput} from './components/chat-input/ChatInput';
import {ChatList} from './components/chat-list/ChatList';
import {ChatSearch} from './components/chat-search/ChatSearch';

export class Chat extends Block {
  constructor() {
    super({
      children: {
        ChatList: new ChatList(),
        ChatHeader: new ChatHeader({
          attributes: {
            avatar: 'https://via.placeholder.com/150',
            name: 'И И',
          },
        }),
        ChatInput: new ChatInput({
          value: '',
          events: {
            submit: (e: SubmitEvent) => {
              e.preventDefault();
              // Здесь будет логика отправки сообщения
            },
          },
        }),
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

    new AuthController().getUser();

    // Подписываемся на изменения store
    store.on(EmitEvents.STORE_UPDATE, this.updateUserData.bind(this));
  }

  private updateUserData() {
    const userData = store.state.user as UserData;
    if (userData) {
      this.setChildrenProps({
        ChatHeader: {
          name: userData.display_name || userData.login,
          avatar: userData.avatar || 'https://via.placeholder.com/150',
        },
      });
    }
  }

  render(): string {
    return `
      <main class="chat-page">
        <div class="chat-sidebar">
          {{{ ChatSearch }}}
          {{{ ChatList }}}
        </div>
        <div class="chat-content">
        {{{ ChatHeader }}}
        <section class="chat-messages">
          <div class="message message--incoming">
            <div class="message__content">Привет, как дела?</div>
            <div class="message__time">10:30</div>
          </div>
          <div class="message message--outgoing">
            <div class="message__content">Привет! Всё хорошо, спасибо!</div>
            <div class="message__time">10:32</div>
          </div>
        </section>
        {{{ ChatInput }}}
        </div>
      </main>
    `;
  }
}
