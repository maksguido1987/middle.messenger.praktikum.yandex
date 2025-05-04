import {Block} from '../../../core/Block';
import {Input} from '../../input/Input';
import {Button} from '../../button/Button';
import {ChatController} from '../../../controllers/chatController';
import {CreateChatData} from '../../../services/chat';
import './style.scss';

export class CreateChatForm extends Block {
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
            name: 'title',
            id: 'chat_title',
            placeholder: 'Название чата',
          },
        }),
        SubmitButton: new Button({
          state: {
            text: 'Создать',
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
      <form class="modal-form" id="create-chat-form">
        {{{Input}}}
        {{{SubmitButton}}}
      </form>
    `;
  }
}
