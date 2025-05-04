import {Block} from '../../../../core/Block';
import './style.scss';
import {Button} from '../../../../components/button/Button';
import {store, StoreEvents} from '../../../../store/store';
import {ChatService} from '../../../../services/chat';

export class UserActions extends Block {
  private onOutsideClick: (e: MouseEvent) => void;
  private chatService: ChatService;

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
        RemoveChat: new Button({
          state: {
            text: 'Удалить чат',
          },
          attributes: {
            class: 'user-actions__button user-actions__button--remove',
          },
          events: {
            click: () => {
              this.deleteChat();
            },
          },
        }),
      },
    });

    this.chatService = new ChatService();

    this.onOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.user-actions-container') && this.state.isOpen) {
        this.setState({isOpen: false});
      }
    };

    store.on(StoreEvents.MODALS_UPDATE, this.onOpenClose.bind(this));
  }

  private deleteChat() {
    const currentChatId = store.state.chats.currentChat?.id;

    if (!currentChatId) {
      return;
    }

    this.chatService
      .deleteChat(currentChatId)
      .then(() => {
        store.setState(
          'chats.filtered',
          store.state.chats.filtered.filter((chat) => chat.id !== currentChatId),
        );
      })
      .then(() => {
        this.onOpenClose();
      });
  }

  onOpenClose() {
    const newState = !this.state.isOpen;
    this.setState({
      isOpen: newState,
    });

    if (newState) {
      document.addEventListener('click', this.onOutsideClick);
    } else {
      document.removeEventListener('click', this.onOutsideClick);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onOutsideClick);
  }

  render() {
    const buttons = `<div class="user-actions__dropdown">
            {{{ AddUser }}}
            {{{ RemoveUser }}}
            {{{ RemoveChat }}}
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
