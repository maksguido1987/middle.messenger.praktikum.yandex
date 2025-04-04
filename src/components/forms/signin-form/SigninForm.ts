import {Block} from '../../../core/Block';
import {Button} from '../../button/Button';
import {Input} from '../../input/Input';
import {Link} from '../../link/Link';
import '../style.scss';

export class SigninForm extends Block {
  constructor() {
    super({
      events: {
        submit: (e: Event) => this._fetchFormData(e),
      },
      children: {
        InputEmail: new Input({
          customProps: {
            type: 'email',
            placeholder: 'Почта',
            name: 'email',
            id: 'email',
          },
        }),
        InputLogin: new Input({
          customProps: {
            type: 'text',
            placeholder: 'Логин',
            name: 'login',
            id: 'login',
          },
        }),
        InputName: new Input({
          customProps: {
            type: 'text',
            placeholder: 'Имя',
            name: 'first_name',
            id: 'first_name',
          },
        }),
        InputSecondName: new Input({
          customProps: {
            type: 'text',
            placeholder: 'Фамилия',
            name: 'second_name',
            id: 'second_name',
          },
        }),
        InputPhone: new Input({
          customProps: {
            type: 'tel',
            placeholder: 'Телефон',
            name: 'phone',
            id: 'phone',
          },
        }),
        InputPassword: new Input({
          customProps: {
            type: 'password',
            placeholder: 'Пароль',
            name: 'password',
            id: 'password',
          },
        }),
        InputPasswordConfirm: new Input({
          customProps: {
            type: 'password',
            placeholder: 'Пароль (еще раз)',
            name: 'password_confirm',
            id: 'password_confirm',
          },
        }),
        Button: new Button({
          customProps: {
            type: 'submit',
            text: 'Войти',
          },
        }),
        Link: new Link({
          customProps: {
            href: '/login',
            text: 'Уже есть аккаунт? Войти',
          },
        }),
      },
    });
  }

  private _fetchFormData(e: Event) {
    e.preventDefault();

    if (e.target instanceof HTMLFormElement) {
      return (Array.from(e.target.elements) as HTMLInputElement[])
        .filter((item) => !!item.name)
        .forEach((element) => {
          const {name, value} = element;
          console.log({name, value});
        });
    }
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
