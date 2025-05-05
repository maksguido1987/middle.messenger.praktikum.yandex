import {Block} from '../../../core/Block';
import {Input} from '../../input/Input';
import {Button} from '../../button/Button';
import {ChatController} from '../../../controllers/chatController';
import './style.scss';
import {store, StoreEvents} from '../../../store/store';

export class DeleteUserForm extends Block {
  private chatController: ChatController;

  constructor() {
    super({
      state: {
        users: [],
      },
      events: {
        submit: (e: SubmitEvent) => {
          this.fetchFormData(e);
        },
      },
      children: {
        Input: new Input({
          attributes: {
            name: 'user_id',
            id: 'user_id',
            placeholder: 'Введите id пользователя',
          },
        }),
        SubmitButton: new Button({
          state: {
            text: 'Удалить',
          },
          attributes: {
            type: 'submit',
          },
        }),
      },
    });
    this.chatController = new ChatController();

    store.on(StoreEvents.CHATS_UPDATE, this.componentDidMount.bind(this));
  }

  async componentDidMount() {
    const chatId = store.state.chats.currentChat?.id;
    if (!chatId) return;
    const users = await this.chatController.getChatUsers(chatId);
    this.setState({users});
  }

  private fetchFormData(e: SubmitEvent) {
    e.preventDefault();
    const formData = this.getFormData<{user_id: string}>(e);
    if (!this.validateForm(e)) {
      return;
    }
    this.chatController
      .deleteUsers({
        users: [Number(formData.user_id)],
        chatId: Number(store.state.chats.currentChat?.id),
      })
      .then(() => {
        store.setState('modals.deleteUser', false);
      });
  }

  render() {
    const users = this.state.users as {id: number; first_name: string; second_name: string}[];
    return `
      <form class="modal-form" id="delete-user-form">
        <div class="chat-users-list">
          ${
  users && users.length
    ? users.map((u) => `<div>${u.first_name} ${u.second_name} (${u.id})</div>`).join('')
    : '<div>Нет пользователей</div>'
}
        </div>
        {{{Input}}}
        {{{SubmitButton}}}
      </form>
    `;
  }
}
