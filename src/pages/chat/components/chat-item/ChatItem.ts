import {webSocketController} from '../../../../controllers/webSocketController';
import {Block} from '../../../../core/Block';
import {BlockProps} from '../../../../global-types';
import {ChatInfo, ChatService} from '../../../../services/chat';
import {store} from '../../../../store/store';
import './style.scss';

interface ChatItemProps extends Omit<BlockProps, 'state'> {
  state: ChatInfo & {
    isSelected?: boolean;
  };
}

export class ChatItem extends Block {
  private chatService: ChatService;
  private chatId: number;

  constructor(props: ChatItemProps) {
    super({
      ...props,
      state: {
        ...props.state,
      },
      events: {
        click: () => {
          this.onSetCurrentChat();
        },
      },
    });
    this.chatService = new ChatService();
    this.chatId = props.state.id;
  }

  private deleteChat() {
    this.chatService.deleteChat(this.chatId).then(() => {
      store.setState(
        'chats.filtered',
        store.state.chats.filtered.filter((chat) => chat.id !== this.chatId),
      );
    });
  }

  private onSetCurrentChat() {
    const currentChat = store.state.chats.original.find((chat) => chat.id === this.chatId);
    store.setState('chats.currentChat', currentChat || null);

    this.chatService.getChatToken(this.chatId).then((token) => {
      webSocketController.connect({
        userId: String(store.state.user?.id),
        chatId: String(this.chatId),
        token: token.token,
      });
    });
  }

  render() {
    return `
      <li class="chat-item {{class}}">
        <div class="chat-item__avatar">
          <div class="avatar avatar--medium">{{avatar}}</div>
        </div>
        <div class="chat-item__info">
          <div class="chat-item__name">{{title}}</div>
          <div class="chat-item__last-message">{{last_message.content}}</div>
        </div>
        <div class="chat-item__meta">
          <div class="chat-item__time">{{time}}</div>
          <div class="chat-item__unread">{{unread_count}}</div>
        </div>
      </li>
    `;
  }
}
