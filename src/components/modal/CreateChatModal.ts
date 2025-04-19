import {Block} from '../../core/Block';
import {Input} from '../input/Input';
import {Button} from '../button/Button';
import {store} from '../../store/store';
import './style.scss';

export class CreateChatModal extends Block {
  constructor() {
    super({
      children: {
        Input: new Input({
          attributes: {
            name: 'chat_title',
            id: 'chat_title',
            placeholder: 'Название чата',
          },
        }),
        CloseButton: new Button({
          state: {
            text: '×',
          },
          attributes: {
            class: 'modal-close',
          },
          events: {
            click: () => store.setState('modals.createChat', false),
          },
        }),
        SubmitButton: new Button({
          state: {
            text: 'Создать',
          },
          attributes: {
            type: 'submit',
            disabled: true,
          },
        }),
      },
    });
  }

  public render() {
    return `
      <div class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <h3>Создать чат</h3>
            {{{CloseButton}}}
          </div>
          <form class="modal-form">
            {{{Input}}}
            {{{SubmitButton}}}
          </form>
        </div>
      </div>
    `;
  }
}
