import {Block} from '../../core/Block';
import {Link} from '../../components/link/Link';
import {ProfileForm} from '../../components/forms/profile-form/ProfileForm';
import {PasswordForm} from '../../components/forms/password-form/PasswordForm';
import {LoadAvatar} from './components/load-avatar/LoadAvatar';
import {AuthController} from '../../controllers/authController';
import {store, StoreEvents} from '../../store/store';
import {UserData} from '../../services/auth';

export class ProfilePage extends Block {
  protected _isPasswordChange = false;
  private authController: AuthController;
  private userData: UserData;

  constructor() {
    super({
      state: {
        profileName: 'Псевдоним',
        isPasswordChange: false,
      },
      children: {
        Avatar: new LoadAvatar({
          state: {
            avatar: 'https://placehold.co/400',
          },
        }),
        ProfileForm: new ProfileForm(),
        PasswordForm: new PasswordForm(),
        PasswordLink: new Link({
          attributes: {
            text: 'Изменить пароль',
            href: '/settings?edit=password',
          },
          onClick: () => {
            this.setState({isPasswordChange: true});
          },
        }),
        BackLink: new Link({
          attributes: {
            text: 'Назад',
            href: '/settings',
          },
          onClick: () => {
            this.setState({isPasswordChange: false});
          },
        }),
        LogoutLink: new Link({
          attributes: {
            text: 'Выйти',
            href: '/',
          },
          onClick: () => {
            this.authController.logout();
          },
        }),
      },
    });

    this.authController = new AuthController();
    this.authController.getUser();
    this.userData = store.state.user as UserData;

    store.on(StoreEvents.USER_UPDATE, this.updateUserData.bind(this));
  }

  private updateUserData() {
    this.userData = store.state.user as UserData;
    if (this.userData) {
      this.setState({profileName: this.userData.display_name || this.userData.login});
      this.children.Avatar.setProps({
        avatar: this.userData.avatar,
      });
    }
  }

  public render(): string {
    return `
      <main class="profile-page">
        <div class="profile-page__container">
          <div class="profile-avatar-container">
            {{{ Avatar }}}
            <div class="profile-name">{{profileName}}</div>
          </div>
          ${this.state.isPasswordChange ? '{{{ PasswordForm }}}' : '{{{ ProfileForm }}}'}
          <div class="profile-links">
            ${this.state.isPasswordChange ? '{{{ BackLink }}}' : ''}
            ${!this.state.isPasswordChange ? '{{{ PasswordLink }}}' : ''}
            <div class="profile-links__item">{{{ LogoutLink }}}</div>
          </div>
        </div>
      </main>
    `;
  }
}
