import {Block} from '../../../../core/Block';
import {BlockProps} from '../../../../global-types';
import './style.scss';

/**
 * Класс компонента элемента списка чатов
 */
export class ChatItem extends Block {
  constructor(props: BlockProps) {
    super({
      ...props,
    });
  }

  render() {
    const unread = (this.state.unread as number) || 0;

    return `
      <li class="chat-item">
        <div class="chat-item__avatar">
          <div class="avatar avatar--medium"></div>
        </div>
        <div class="chat-item__info">
          <div class="chat-item__name">{{name}}</div>
          <div class="chat-item__last-message">{{lastMessage}}</div>
        </div>
        <div class="chat-item__meta">
          <div class="chat-item__time">{{time}}</div>
          ${unread > 0 ? `<div class="chat-item__unread">${unread}</div>` : ''}
        </div>
      </li>
    `;
  }
}
