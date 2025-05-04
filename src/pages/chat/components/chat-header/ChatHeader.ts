import {Block} from '../../../../core/Block';
import {Avatar} from '../../../../components/avatar/Avatar';
import {store} from '../../../../store/store';
import {StoreEvents} from '../../../../store/store';
import './style.scss';
import {UserActions} from '../user-actions/UserActions';
import {Modal} from '../../../../components/modal/Modal';
import {AddUserForm} from '../../../../components/forms/add-user-form/AddUserForm';
import {DeleteUserForm} from '../../../../components/forms/delete-user-form/DeleteUserForm';

interface ChatHeaderProps {
  state: {
    src: string;
    name: string;
  };
}

export class ChatHeader extends Block {

  constructor(props: ChatHeaderProps) {
    super({
      ...props,
      children: {
        Avatar: new Avatar({
          state: {
            src: props.state.src,
          },
        }),
        UserActions: new UserActions(),
        AddUserModal: new Modal({
          state: {
            title: 'Добавить пользователя',
            modalKeyStore: 'addUser',
          },
          children: {
            Form: new AddUserForm(),
          },
        }),
        DeleteUserModal: new Modal({
          state: {
            title: 'Удалить пользователя',
            modalKeyStore: 'deleteUser',
          },
          children: {
            Form: new DeleteUserForm(),
          },
        }),
      },
    });

    store.on(StoreEvents.USER_UPDATE, this.updateAvatar.bind(this));
    store.on(StoreEvents.CHATS_UPDATE, this.updateTitle.bind(this));
  }

  private updateAvatar() {
    const currentUser = store.state.chats.currentChat;

    this.children.Avatar.setState({
      src: currentUser?.avatar,
    });
  }

  private updateTitle() {
    const currentUser = store.state.chats.currentChat;

    this.setState({
      name: currentUser?.title,
    });
  }

  render() {
    return `
      <header class="chat-header">
        <div class="chat-header__profile">
          {{{ Avatar }}}
          <div class="chat-header__name">${this.state.name}</div>
        </div>
        <div class="chat-header__actions">
          {{{ UserActions }}}
        </div>
        {{{ AddUserModal }}}
        {{{ DeleteUserModal }}}
      </header>
    `;
  }
}
