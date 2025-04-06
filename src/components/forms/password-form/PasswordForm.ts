import {Block} from '../../../core/Block';
import {Input} from '../../input/Input';
import {Button} from '../../button/Button';

export class PasswordForm extends Block {
  constructor() {
    super({
      events: {
        submit: (e: Event) => {
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
  }

  private fetchFormData(e: Event) {
    e.preventDefault();
    const formData = this.getFormData(e);
    console.log(formData);
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
