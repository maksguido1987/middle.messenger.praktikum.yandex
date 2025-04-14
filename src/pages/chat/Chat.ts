import {Block} from '../../core/Block';
import {ChatHeader} from './components/chat-header/ChatHeader';
import {ChatInput} from './components/chat-input/ChatInput';
import {ChatList} from './components/chat-list/ChatList';
import {mockChats} from './components/chat-list/mockData';
import {ChatSearch} from './components/chat-search/ChatSearch';

export class Chat extends Block {
  constructor() {
    super({
      attributes: {
        chats: mockChats,
        currentChat: mockChats[0],
      },
      children: {
        chatList: new ChatList(),
        chatHeader: new ChatHeader({
          attributes: {
            avatar: 'https://via.placeholder.com/150',
            name: 'Иван Иванов',
          },
        }),
        chatInput: new ChatInput({
          value: '',
          events: {
            submit: (e: SubmitEvent) => {
              e.preventDefault();
              // Здесь будет логика отправки сообщения
            },
          },
        }),
        chatSearch: new ChatSearch({
          events: {
            submit: (e: SubmitEvent) => {
              e.preventDefault();
              // Здесь будет логика поиска
            },
          },
        }),
      },
    });
  }

  render(): string {
    return `
    <div id="app">
      <main class="chat-page">
        <div class="chat-sidebar">
          {{{ chatSearch }}}
          {{{ chatList }}}
        </div>
        <div class="chat-content">
        {{{ chatHeader }}}
        <section class="chat-messages">
          <!-- Здесь будут отображаться сообщения -->
          <div class="message message--incoming">
            <div class="message__content">Привет, как дела?</div>
            <div class="message__time">10:30</div>
          </div>
          <div class="message message--outgoing">
            <div class="message__content">Привет! Всё хорошо, спасибо!</div>
            <div class="message__time">10:32</div>
          </div>
        </section>
        {{{ chatInput }}}
        </div>

      </main>
    </div>
    `;
  }
}
