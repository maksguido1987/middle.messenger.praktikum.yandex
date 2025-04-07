import {Block} from '../../../core/Block';
import {Input} from '../../input/Input';
import {Button} from '../../button/Button';
import '../style.scss';

export class ProfileForm extends Block {
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
            placeholder: 'test@test.com',
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
            placeholder: 'Максим',
          },
        }),
        LastNameInput: new Input({
          attributes: {
            id: 'second_name',
            name: 'second_name',
            placeholder: 'Иванов',
          },
        }),
        DisplayNameInput: new Input({
          attributes: {
            id: 'display_name',
            name: 'display_name',
            placeholder: 'Максим Иванов',
          },
        }),
        PhoneInput: new Input({
          attributes: {
            id: 'phone',
            name: 'phone',
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

  private fetchFormData(e: SubmitEvent) {
    e.preventDefault();

    if (!this.validateForm(e)) {
      return;
    }

    const formData = this.getFormData(e);
    console.log(formData);
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
