import {Block} from '../../../../core/Block';
import './style.scss';
import {Button} from '../../../../components/button/Button';
import {store, StoreEvents} from '../../../../store/store';

export class UserActions extends Block {
  constructor() {
    super({
      state: {
        isOpen: false,
      },
      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;
          if (target.closest('.user-actions')) {
            this.onOpenClose();
          }
        },
      },
      children: {
        AddUser: new Button({
          state: {
            text: 'Добавить пользователя',
          },
          attributes: {
            class: 'user-actions__button user-actions__button--add',
          },
          events: {
            click: () => {
              this.onOpenClose();
              store.setState('modals.addUser', true);
            },
          },
        }),
        RemoveUser: new Button({
          state: {
            text: 'Удалить пользователя',
          },
          attributes: {
            class: 'user-actions__button user-actions__button--remove',
          },
          events: {
            click: () => {
              this.onOpenClose();
              store.setState('modals.deleteUser', true);
            },
          },
        }),
      },
    });

    store.on(StoreEvents.MODALS_UPDATE, this.onOpenClose.bind(this));
  }

  onOpenClose() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    const buttons = `<div class="user-actions__dropdown">
            {{{ AddUser }}}
            {{{ RemoveUser }}}
          </div>`;

    return `
      <div class="user-actions-container">
        <button class="user-actions ${this.state.isOpen ? 'user-actions--active' : ''}">
          <div class="dots-menu">
            <span class="dots-menu__dot"></span>
            <span class="dots-menu__dot"></span>
            <span class="dots-menu__dot"></span>
          </div>
        </button>
        ${this.state.isOpen ? buttons : ''}
      </div>
    `;
  }
}
