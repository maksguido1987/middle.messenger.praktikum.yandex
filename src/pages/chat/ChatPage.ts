import {AuthController} from '../../controllers/authController';
import {Block} from '../../core/Block';
import {store, StoreEvents} from '../../store/store';
import {Chat} from './components/chat/Chat';
import {ChatList} from './components/chat-list/ChatList';
import {ChatSearch} from './components/chat-search/ChatSearch';
import {EmptyChat} from './components/empty-chat/EmptyChat';

export class ChatPage extends Block {
  constructor() {
    super({
      children: {
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

    new AuthController().getUser();

    // Подписываемся на изменения store
    store.on(StoreEvents.USER_UPDATE, this.updateChatData.bind(this));
    store.on(StoreEvents.CHATS_UPDATE, this.updateChatData.bind(this));
  }

  private updateChatData() {
    const chatData = store.state.chats.currentChat;

    if (chatData) {
      this.setChildrenProps({
        Chat: {
          state: {
            isVisible: true,
          },
        },
        EmptyChat: {
          state: {
            isVisible: false,
          },
        },
      });
    } else {
      this.setChildrenProps({
        Chat: {
          state: {
            isVisible: false,
          },
        },
        EmptyChat: {
          state: {
            isVisible: true,
          },
        },
      });
    }
  }

  render() {
    return `
      <main class="chat-page">
        <div class="chat-sidebar">
          {{{ ChatSearch }}}
          {{{ ChatList }}}
        </div>
        {{#if state.Chat.isVisible}}
          {{{ Chat }}}
        {{else}}
          {{{ EmptyChat }}}
        {{/if}}
      </main>
    `;
  }
}
