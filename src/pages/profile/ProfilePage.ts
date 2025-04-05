import {Block} from '../../core/Block';
import {Link} from '../../components/link/Link';
import {ProfileForm} from '../../components/forms/profile-form/ProfileForm';
import {PasswordForm} from '../../components/forms/password-form/PasswordForm';
import {LoadAvatar} from './components/load-avatar/LoadAvatar';
import {EmitEvents} from '../../global-types';

export class ProfilePage extends Block {
  protected _isEditing = false;
  protected _isPasswordChange = false;

  constructor() {
    super({
      state: {
        profileName: 'Максим Петров',
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
            href: '/profile?is_editing=true',
          },
          events: {
            click: (e: Event) => {
              e.preventDefault();
              this._isEditing = true;
              this._isPasswordChange = false;
              this.eventBus().emit(EmitEvents.FLOW_RENDER);
            },
          },
        }),
        PasswordLink: new Link({
          attributes: {
            text: 'Изменить пароль',
            href: '/profile?is_password_change=true',
          },
          events: {
            click: (e: Event) => {
              e.preventDefault();
              this._isPasswordChange = true;
              this.eventBus().emit(EmitEvents.FLOW_RENDER);
            },
          },
        }),
        LogoutLink: new Link({
          attributes: {
            text: 'Выйти',
            href: '/logout',
          },
        }),
      },
    });
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
}
