import {Block} from '../../../../core/Block';
import {ChatItem} from '../chat-item/ChatItem';
import {Button} from '../../../../components/button/Button';
import {CreateChatModal} from '../../../../components/modal/CreateChatModal';
import {store} from '../../../../store/store';
import {ChatController} from '../../../../controllers/chatController';
import {EmitEvents} from '../../../../global-types';
export class ChatList extends Block {
  private chatController: ChatController;

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
        CreateModal: new CreateChatModal(),
      },
    });

    this.chatController = new ChatController();
    store.on(EmitEvents.FLOW_RENDER, this.onGetChats.bind(this));
    // this.onGetChats();
  }

  onGetChats() {
    this.chatController.getChats().then((chats) => {
      chats.forEach((chat) => {
        this.addToList('Chats', new ChatItem({state: {...chat}}));
      });
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
