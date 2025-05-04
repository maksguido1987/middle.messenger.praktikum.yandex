import {Block} from '../../../core/Block';
import {Input} from '../../input/Input';
import {Button} from '../../button/Button';
import {ChatController} from '../../../controllers/chatController';
import './style.scss';
import {store} from '../../../store/store';

export class DeleteUserForm extends Block {
  private chatController: ChatController;

  constructor() {
    super({
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
    return `
      <form class="modal-form" id="delete-user-form">
        {{{Input}}}
        {{{SubmitButton}}}
      </form>
    `;
  }
}
