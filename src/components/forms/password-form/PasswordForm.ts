import {Block} from '../../../core/Block';
import {Input} from '../../input/Input';
import {Button} from '../../button/Button';

export class PasswordForm extends Block {
  constructor() {
    super({
      children: {
        OldPasswordInput: new Input({
          attributes: {
            id: 'oldPassword',
            name: 'oldPassword',
            type: 'password',
            placeholder: 'Старый пароль',
          },
        }),
        NewPasswordInput: new Input({
          attributes: {
            id: 'newPassword',
            name: 'newPassword',
            type: 'password',
            placeholder: 'Новый пароль',
          },
        }),
        ConfirmPasswordInput: new Input({
          attributes: {
            id: 'confirmPassword',
            name: 'confirmPassword',
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
