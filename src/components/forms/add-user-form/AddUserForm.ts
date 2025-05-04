import {Block} from '../../../core/Block';
import {Input} from '../../input/Input';
import {Button} from '../../button/Button';
import {ChatController} from '../../../controllers/chatController';
import './style.scss';
import {store} from '../../../store/store';

export class AddUserForm extends Block {
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
            text: 'Добавить',
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
    const chatId = store.state.chats.currentChat?.id;
    console.log(formData);
    if (!this.validateForm(e)) {
      return;
    }
    this.chatController
      .addUsers({users: [Number(formData.user_id)], chatId: Number(chatId)})
      .then(() => {
        store.setState('modals.addUser', false);
      });
  }

  render() {
    return `
      <form class="modal-form" id="add-user-form">
        {{{Input}}}
        {{{SubmitButton}}}
      </form>
    `;
  }
}
