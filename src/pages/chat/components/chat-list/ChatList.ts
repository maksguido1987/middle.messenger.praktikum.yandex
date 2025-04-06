import {Block} from '../../../../core/Block';
import {ChatItem} from '../chat-item/ChatItem';
import {mockChats} from './mockData';

export class ChatList extends Block {
  constructor() {
    super({
      lists: {
        items: mockChats.map((chat) => new ChatItem({state: {...chat}})),
      },
    });
  }

  public render(): string {
    return `
      <ul class="chat-list">
        {{{items}}}
      </ul>
    `;
  }
}
