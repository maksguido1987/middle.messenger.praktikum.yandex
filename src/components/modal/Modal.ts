import {Block} from '../../core/Block';
import {Button} from '../button/Button';
import {store, StoreEvents} from '../../store/store';
import './style.scss';
import {CreateChatForm} from '../forms/create-chat-form/CreateChatForm';
import {BlockProps} from '../../global-types';

export class Modal extends Block {
  constructor(props: BlockProps) {
    super({
      ...props,
      state: {
        title: props?.state?.title || '',
        modalKeyStore: props?.state?.modalKeyStore || '',
      },
      children: {
        CloseButton: new Button({
          state: {
            text: '×',
          },
          attributes: {
            class: 'modal-close',
          },
          events: {
            click: () => store.setState(`modals.${this.state.modalKeyStore}`, false),
          },
        }),
        Form: props?.children?.Form || new CreateChatForm(),
      },
    });

    store.on(StoreEvents.MODALS_UPDATE, this.updateModalClass.bind(this));
  }

  private updateModalClass() {
    const element = this.getContent();
    const currentClass = element instanceof HTMLElement ? element.getAttribute('class') : null;

    if (store.state.modals[this.state.modalKeyStore as keyof typeof store.state.modals]) {
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
            <h3>${this.state.title}</h3>
            {{{CloseButton}}}
          </div>
          {{{Form}}}
        </div>
      </div>
    `;
  }
}
