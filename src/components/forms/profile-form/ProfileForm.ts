import {Block} from '../../../core/Block';
import {Input} from '../../input/Input';
import {Button} from '../../button/Button';
import {UserData} from '../../../services/auth';
import '../style.scss';
import {UserController} from '../../../controllers/userController';
import {UserProfileData} from '../../../services/user';
import {store} from '../../../store/store';
import {EmitEvents} from '../../../global-types';

export class ProfileForm extends Block {
  private userController: UserController;
  private userData: UserData | null = null;

  constructor() {
    super({
      events: {
        submit: (e: SubmitEvent) => {
          e.preventDefault();
          this.fetchFormData(e);
        },
      },
      children: {
        EmailInput: new Input({
          attributes: {
            id: 'email',
            name: 'email',
            placeholder: 'Почта',
          },
        }),
        LoginInput: new Input({
          attributes: {
            id: 'login',
            name: 'login',
            placeholder: 'Логин',
          },
        }),
        FirstNameInput: new Input({
          attributes: {
            id: 'first_name',
            name: 'first_name',
            placeholder: 'Имя',
          },
        }),
        LastNameInput: new Input({
          attributes: {
            id: 'second_name',
            name: 'second_name',
            placeholder: 'Фамилия',
          },
        }),
        DisplayNameInput: new Input({
          attributes: {
            id: 'display_name',
            name: 'display_name',
            placeholder: 'Псевдоним',
          },
        }),
        PhoneInput: new Input({
          attributes: {
            id: 'phone',
            name: 'phone',
            placeholder: 'Телефон',
          },
        }),
        SaveButton: new Button({
          attributes: {
            text: 'Сохранить изменения',
            type: 'submit',
          },
        }),
      },
    });

    this.userController = new UserController();

    store.on(EmitEvents.STORE_UPDATE, this.getUserData.bind(this));
  }

  private async getUserData() {
    this.userData = store.state.user as UserData;
    if (this.userData) {
      const {email, login, first_name, second_name, display_name, phone} = this.userData;

      this.setChildrenProps({
        EmailInput: {value: email},
        LoginInput: {value: login},
        FirstNameInput: {value: first_name},
        LastNameInput: {value: second_name},
        DisplayNameInput: {value: display_name},
        PhoneInput: {value: phone},
      });
    }
  }

  private fetchFormData(e: SubmitEvent) {
    e.preventDefault();

    if (!this.validateForm(e)) {
      return;
    }

    const formData = this.getFormData<UserProfileData>(e);
    this.userController.updateProfile(formData).then(() => this.getUserData());
  }

  render() {
    return `
      <form class="profile-form" id="profile-form">
        <div class="form-group">
          {{{ EmailInput }}}
        </div>
        <div class="form-group">
          {{{ LoginInput }}}
        </div>
        <div class="form-group">
          {{{ FirstNameInput }}}
        </div>
        <div class="form-group">
          {{{ LastNameInput }}}
        </div>
        <div class="form-group">
          {{{ DisplayNameInput }}}
        </div>
        <div class="form-group">
          {{{ PhoneInput }}}
        </div>
        <div class="form-actions">
          {{{ SaveButton }}}
        </div>
      </form>
    `;
  }
}
