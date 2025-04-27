import {Block} from '../../../../core/Block';
import {ChatItem} from '../chat-item/ChatItem';
import {Button} from '../../../../components/button/Button';
import {store, StoreEvents} from '../../../../store/store';
import {ChatController} from '../../../../controllers/chatController';
import {Modal} from '../../../../components/modal/Modal';
import {CreateChatForm} from '../../../../components/forms/create-chat-form/CreateChatForm';
export class ChatList extends Block {
  constructor() {
    super({
      list: {
        Chats: [],
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
        CreateModal: new Modal({
          state: {
            title: 'Создать чат',
            modalKeyStore: 'createChat',
          },
          children: {
            CreateChatForm: new CreateChatForm(),
          },
        }),
      },
    });
    store.on(StoreEvents.CHATS_UPDATE, this.onGetChats.bind(this));
    new ChatController().getChats();
  }

  onGetChats() {
    this.list.Chats = [];
    store.state.chats.filtered.forEach((chat) => {
      this.addToListItem(
        'Chats',
        new ChatItem({
          state: chat,
        }),
      );
    });
  }

  public render() {
    return `
      <div class="chat-list-container">
        {{{CreateButton}}}
        <ul class="chat-list">
          {{{Chats}}}
        </ul>
        {{{CreateModal}}}
      </div>
    `;
  }
}
