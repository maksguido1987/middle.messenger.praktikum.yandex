import {Block} from '../../core/Block';
import {Link} from '../../components/link/Link';
import {ProfileForm} from '../../components/forms/profile-form/ProfileForm';
import {PasswordForm} from '../../components/forms/password-form/PasswordForm';
import {LoadAvatar} from './components/load-avatar/LoadAvatar';
import {AuthController} from '../../controllers/authController';
import {store} from '../../store/store';
import {UserData} from '../../services/auth';
import {EmitEvents} from '../../global-types';

export class ProfilePage extends Block {
  protected _isPasswordChange = false;
  private authController: AuthController;
  private userData: UserData;

  constructor() {
    super({
      state: {
        profileName: 'Псевдоним',
      },
      children: {
        Avatar: new LoadAvatar({
          attributes: {
            name: 'avatar',
            avatar: 'https://placehold.co/400',
          },
        }),
        ProfileForm: new ProfileForm(),
        PasswordForm: new PasswordForm(),
        EditLink: new Link({
          attributes: {
            text: 'Изменить данные',
            href: '/settings',
          },
        }),
        PasswordLink: new Link({
          attributes: {
            text: 'Изменить пароль',
            href: '/settings?is_password_change=true',
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

    // Подписываемся на изменения store
    store.on(EmitEvents.STORE_UPDATE, this.updateUserData.bind(this));

    // Добавляем обработчики изменений URL
    window.addEventListener('popstate', this.handleUrlChange.bind(this));
  }

  private updateUserData() {
    this.userData = store.state.user as UserData;
    if (this.userData) {
      this.setState({profileName: this.userData.display_name || this.userData.login});
    }
  }

  private handleUrlChange() {
    const params = new URLSearchParams(window.location.search);
    this._isPasswordChange = params.get('is_password_change') === 'true';
    this.forceUpdate();
  }

  public render(): string {
    return `
      <div id="app">
        <main class="profile-page">
          <div class="profile-page__container">
            <div class="profile-avatar-container">
              {{{ Avatar }}}
              <div class="profile-name">{{profileName}}</div>
            </div>
            ${this._isPasswordChange ? '{{{ PasswordForm }}}' : '{{{ ProfileForm }}}'}
            <div class="profile-links">
              <div class="profile-links__item">{{{ EditLink }}}</div>
              <div class="profile-links__item">{{{ PasswordLink }}}</div>
              <div class="profile-links__item">{{{ LogoutLink }}}</div>
            </div>
          </div>
        </main>
      </div>
    `;
  }

  public destroy() {
    window.removeEventListener('popstate', this.handleUrlChange.bind(this));
    super.destroy();
  }
}
