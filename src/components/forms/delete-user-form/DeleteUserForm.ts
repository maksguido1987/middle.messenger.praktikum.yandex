import {Block} from '../../../core/Block';
import {Input} from '../../input/Input';
import {Button} from '../../button/Button';
import {ChatController} from '../../../controllers/chatController';
import {CreateChatData} from '../../../services/chat';
import './style.scss';

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
            name: 'user_login',
            id: 'user_login',
            placeholder: 'Введите логин пользователя',
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
    const formData = this.getFormData<CreateChatData>(e);
    if (!this.validateForm(e)) {
      return;
    }
    this.chatController.createChat(formData);
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
