import {Block} from '../../../../core/Block';
import {Link} from '../../../../components/link/Link';
import {Avatar} from '../../../../components/avatar/Avatar';
import {AuthController} from '../../../../controllers/authController';
import {store} from '../../../../store/store';
import {StoreEvents} from '../../../../store/store';
import {UserData} from '../../../../services/auth';
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
  private authController: AuthController;

  constructor(props: ChatHeaderProps) {
    super({
      ...props,
      children: {
        Avatar: new Avatar({
          state: {
            src: props.state.src,
          },
        }),
        LoginLink: new Link({
          attributes: {
            text: 'Логин',
            href: '/',
            class: 'chat-header__link',
          },
        }),
        SigninLink: new Link({
          attributes: {
            text: 'Регистрация',
            href: '/sign-up',
            class: 'chat-header__link',
          },
        }),
        ProfileLink: new Link({
          attributes: {
            text: 'Профиль',
            href: '/settings',
            class: 'chat-header__link',
          },
        }),
        LogoutLink: new Link({
          attributes: {
            text: 'Выйти',
            href: '/',
            class: 'chat-header__link',
          },
          onClick: () => {
            this.authController.logout();
          },
        }),
        NotFoundLink: new Link({
          attributes: {
            text: '404',
            href: '/error',
            class: 'chat-header__link',
          },
        }),
        ServerErrorLink: new Link({
          attributes: {
            text: '500',
            href: '/nothing',
            class: 'chat-header__link',
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

    this.authController = new AuthController();

    store.on(StoreEvents.USER_UPDATE, this.updateUserData.bind(this));
  }

  private updateUserData() {
    const userData = store.state.user as UserData;

    this.children.Avatar.setState({
      src: userData.avatar,
    });
  }

  render() {
    return `
      <header class="chat-header">
        <div class="chat-header__profile">
          {{{ Avatar }}}
          <div class="chat-header__name">${this.state.name}</div>
        </div>
        <div>
          {{{ LoginLink }}}
          {{{ SigninLink }}}
          {{{ ProfileLink }}}
          {{{ LogoutLink }}}
          {{{ NotFoundLink }}}
          {{{ ServerErrorLink }}}
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
