import {Block} from '../../../../core/Block';
import {store, StoreEvents} from '../../../../store/store';
import {ChatHeader} from '../chat-header/ChatHeader';
import {ChatInput} from '../chat-input/ChatInput';
import {Message} from '../message/Message';
import './style.scss';

interface ChatProps {
  state?: {
    isVisible?: boolean;
  };
}

export class Chat extends Block {
  constructor(props: ChatProps = {}) {
    super({
      ...props,
      list: {
        Messages: [],
      },
      children: {
        ChatHeader: new ChatHeader({
          state: {
            src: 'https://via.placeholder.com/150',
            name: 'Иванов Иван Иванович',
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
      },
    });

    store.on(StoreEvents.CHATS_UPDATE, this.onGetMessages.bind(this));
  }

  onGetMessages() {
    this.list.Messages = [];
    const messages = store.state.chats.messages;
    messages.forEach((message) => {
      this.addToListItem(
        'Messages',
        new Message({
          state: {
            isCurrentUser: Number(message.user_id) === store.state.user?.id,
            text: message.content,
            time: message.time,
            isRead: message.is_read,
          },
        }),
      );
    });
  }

  render() {
    return `
      <div class="chat-content">
        {{{ ChatHeader }}}
        <section class="chat-messages">
          {{{ Messages }}}
        </section>
        {{{ ChatInput }}}
      </div>
    `;
  }
}
