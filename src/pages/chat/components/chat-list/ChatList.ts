import {Block} from '../../../../core/Block';
import {ChatItem} from '../chat-item/ChatItem';
import {mockChats} from './mockData';
import {Button} from '../../../../components/button/Button';
import {CreateChatModal} from '../../../../components/modal/CreateChatModal';
import {store} from '../../../../store/store';

export class ChatList extends Block {
  constructor() {
    super({
      lists: {
        items: mockChats.map((chat) => new ChatItem({state: {...chat}})),
      },
      children: {
        CreateButton: new Button({
          state: {
            text: 'Создать чат',
          },
          events: {
            click: () => {
              store.setState('modals.createChat', true);
            },
          },
        }),
        CreateModal: new CreateChatModal(),
      },
    });
  }

  public render() {
    return `
      <div class="chat-list-container">
        {{{CreateButton}}}
        <ul class="chat-list">
          {{{items}}}
        </ul>
        {{{CreateModal}}}
      </div>
    `;
  }
}
