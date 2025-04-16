import {Block} from '../../../core/Block';
import {Input} from '../../input/Input';
import {Button} from '../../button/Button';
import {UserController} from '../../../controllers/userController';

interface FormData {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export class PasswordForm extends Block {
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
        OldPasswordInput: new Input({
          attributes: {
            id: 'old_password',
            name: 'old_password',
            type: 'password',
            placeholder: 'Старый пароль',
          },
        }),
        NewPasswordInput: new Input({
          attributes: {
            id: 'new_password',
            name: 'new_password',
            type: 'password',
            placeholder: 'Новый пароль',
          },
        }),
        ConfirmPasswordInput: new Input({
          attributes: {
            id: 'confirm_password',
            name: 'confirm_password',
            type: 'password',
            placeholder: 'Подтвердите пароль',
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
  }

  private fetchFormData(e: SubmitEvent) {
    e.preventDefault();
    const formData = this.getFormData<FormData>(e);

    if (!this.validateForm(e)) {
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      this.showError('Новые пароли не совпадают');
      return;
    }

    document.querySelector('.form-error')?.remove();
    this.userController.updatePassword({
      oldPassword: formData.old_password,
      newPassword: formData.new_password,
    });
  }

  private showError(message: string) {
    if (!(this.element instanceof HTMLElement)) return;

    const form = this.element;
    if (!form) return;

    // Удаляем существующую ошибку, если она есть
    const existingError = form.querySelector('.form-error');
    if (existingError) {
      existingError.remove();
    }

    // Создаем новый элемент ошибки
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error';
    errorElement.textContent = message;

    // Добавляем ошибку перед кнопкой
    const buttonContainer = form.querySelector('.form-actions');
    if (buttonContainer) {
      buttonContainer.insertBefore(errorElement, buttonContainer.firstChild);
    } else {
      form.appendChild(errorElement);
    }
  }

  render() {
    return `
      <form class="profile-form" name="{{name}}">
        <div class="form-group">
          {{{ OldPasswordInput }}}
        </div>
        <div class="form-group">
          {{{ NewPasswordInput }}}
        </div>
        <div class="form-group">
          {{{ ConfirmPasswordInput }}}
        </div>
        <div class="form-actions">
          {{{ SaveButton }}}
        </div>
      </form>
    `;
  }
}
