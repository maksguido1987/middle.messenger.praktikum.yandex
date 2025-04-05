import {Block} from '../../../core/Block';
import {Button} from '../../button/Button';
import {Input} from '../../input/Input';
import {Link} from '../../link/Link';
import '../style.scss';

export class SigninForm extends Block {
  constructor() {
    super({
      events: {
        submit: (e: Event) => this.fetchFormData(e),
      },
      children: {
        InputEmail: new Input({
          attributes: {
            type: 'email',
            placeholder: 'Почта',
            name: 'email',
            id: 'email',
          },
        }),
        InputLogin: new Input({
          attributes: {
            type: 'text',
            placeholder: 'Логин',
            name: 'login',
            id: 'login',
          },
        }),
        InputName: new Input({
          attributes: {
            type: 'text',
            placeholder: 'Имя',
            name: 'first_name',
            id: 'first_name',
          },
        }),
        InputSecondName: new Input({
          attributes: {
            type: 'text',
            placeholder: 'Фамилия',
            name: 'second_name',
            id: 'second_name',
          },
        }),
        InputPhone: new Input({
          attributes: {
            type: 'tel',
            placeholder: 'Телефон',
            name: 'phone',
            id: 'phone',
          },
        }),
        InputPassword: new Input({
          attributes: {
            type: 'password',
            placeholder: 'Пароль',
            name: 'password',
            id: 'password',
          },
        }),
        InputPasswordConfirm: new Input({
          attributes: {
            type: 'password',
            placeholder: 'Пароль (еще раз)',
            name: 'password_confirm',
            id: 'password_confirm',
          },
        }),
        Button: new Button({
          attributes: {
            type: 'submit',
            text: 'Войти',
          },
        }),
        Link: new Link({
          attributes: {
            href: '/login',
            text: 'Уже есть аккаунт? Войти',
          },
        }),
      },
    });
  }

  private fetchFormData(e: Event) {
    const formData = this.getFormData(e);
    console.log(formData);
    return formData;
  }

  render() {
    return `
      <form class="form {{class}}" name="{{name}}">
        <div class="form-group">
          {{{ InputEmail }}}
        </div>
        <div class="form-group">
          {{{ InputLogin }}}
        </div>
        <div class="form-group">
          {{{ InputName }}}
        </div>
        <div class="form-group">
          {{{ InputSecondName }}}
        </div>
        <div class="form-group">
          {{{ InputPhone }}}
        </div>
        <div class="form-group">
          {{{ InputPassword }}}
        </div>
        <div class="form-group">
          {{{ InputPasswordConfirm }}}
        </div>
        <div class="form-actions">
          {{{ Button }}}
          {{{ Link }}}
        </div>
      </form>
    `;
  }
}
