import {Block} from '../../../../core/Block';
import {ChatItem} from '../chat-item/ChatItem';
import {mockChats} from './mockData';
import {Button} from '../../../../components/button/Button';
import {CreateChatModal} from '../../../../components/modal/CreateChatModal';
import {store} from '../../../../store/store';
import {EmitEvents} from '../../../../global-types';

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
            click: () => store.setState('modals.createChat', true),
          },
        }),
        CreateModal: new CreateChatModal(),
      },
    });

    store.on(EmitEvents.STORE_UPDATE, () => {
      this.forceUpdate();
    });
  }

  public render() {
    return `
      <div class="chat-list-container">
        {{{CreateButton}}}
          <ul class="chat-list">
            {{{items}}}
          </ul>
          ${store.state.modals.createChat ? '{{{CreateModal}}}' : ''}
      </div>
    `;
  }
}
