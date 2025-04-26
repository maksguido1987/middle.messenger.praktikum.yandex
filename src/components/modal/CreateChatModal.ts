import {Block} from '../../core/Block';
import {Button} from '../button/Button';
import {store, StoreEvents} from '../../store/store';
import './style.scss';
import {CreateChatForm} from '../forms/create-chat-form/CreateChatForm';

export class CreateChatModal extends Block {
  constructor() {
    super({
      children: {
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
        CreateChatForm: new CreateChatForm(),
      },
    });

    store.on(StoreEvents.MODALS_UPDATE, this.updateModalClass.bind(this));
  }

  private updateModalClass() {
    const element = this.getContent();
    const currentClass = element instanceof HTMLElement ? element.getAttribute('class') : null;

    if (store.state.modals.createChat) {
      this.addAttributes({
        class: `${currentClass} active`,
      });
    } else {
      this.addAttributes({
        class: `${currentClass?.replace('active', '')}`,
      });
    }
  }

  public render() {
    return `
      <div class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <h3>Создать чат</h3>
            {{{CloseButton}}}
          </div>
          {{{CreateChatForm}}}
        </div>
      </div>
    `;
  }
}
