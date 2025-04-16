import {Block} from '../../../core/Block';
import {Input} from '../../input/Input';
import {Button} from '../../button/Button';
import {AuthController} from '../../../controllers/authController';
import {UserData} from '../../../services/auth';
import '../style.scss';
import {UserController} from '../../../controllers/userController';
import {UserProfileData} from '../../../services/user';

export class ProfileForm extends Block {
  private authController: AuthController;
  private userController: UserController;

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

    this.authController = new AuthController();
    this.userController = new UserController();
    this.getUserData();
  }

  private async getUserData() {
    try {
      const userData = await this.authController.getUser();
      this.fillFormWithUserData(userData);
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
    }
  }

  private fillFormWithUserData(userData: UserData) {
    const form = this.element as HTMLFormElement;
    if (!form) return;

    const inputs = form.querySelectorAll('input');
    inputs.forEach((input) => {
      const fieldName = input.name;
      const value = userData[fieldName as keyof UserData];
      if (value) {
        input.value = String(value);
      }
    });
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
