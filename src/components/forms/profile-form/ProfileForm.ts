import {Block} from '../../../core/Block';
import {Input} from '../../input/Input';
import {Button} from '../../button/Button';
import '../style.scss';

export class ProfileForm extends Block {
  constructor() {
    super({
      children: {
        EmailInput: new Input({
          attributes: {
            id: 'email',
            name: 'email',
            value: 'test@test.com',
            placeholder: 'test@test.com',
          },
        }),
        LoginInput: new Input({
          attributes: {
            id: 'login',
            name: 'login',
            value: 'test',
            placeholder: 'test',
          },
        }),
        FirstNameInput: new Input({
          attributes: {
            id: 'first_name',
            name: 'first_name',
            value: 'Максим',
            placeholder: 'Максим',
          },
        }),
        LastNameInput: new Input({
          attributes: {
            id: 'last_name',
            name: 'last_name',
            value: 'Иванов',
            placeholder: 'Иванов',
          },
        }),
        DisplayNameInput: new Input({
          attributes: {
            id: 'display_name',
            name: 'display_name',
            value: 'Максим Иванов',
            placeholder: 'Максим Иванов',
          },
        }),
        PhoneInput: new Input({
          attributes: {
            id: 'phone',
            name: 'phone',
            value: '+7 (909) 967 30 30',
            placeholder: '+7 (909) 967 30 30',
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
      <form class="profile-form" id="profile-form">
        <div class="profile-form__field">
          {{{ EmailInput }}}
        </div>
        <div class="profile-form__field">
          {{{ LoginInput }}}
        </div>
        <div class="profile-form__field">
          {{{ FirstNameInput }}}
        </div>
        <div class="profile-form__field">
          {{{ LastNameInput }}}
        </div>
        <div class="profile-form__field">
          {{{ DisplayNameInput }}}
        </div>
        <div class="profile-form__field">
          {{{ PhoneInput }}}
        </div>
        <div class="profile-actions">
          {{{ SaveButton }}}
        </div>
      </form>
    `;
  }
}
