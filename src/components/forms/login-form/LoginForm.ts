import {Block} from '../../../core/Block';
import {Button} from '../../button/Button';
import {Input} from '../../input/Input';
import {Link} from '../../link/Link';
import '../style.scss';

export class LoginForm extends Block {
  constructor() {
    super({
      events: {
        submit: (e: Event) => this._fetchFormData(e),
      },
      children: {
        InputLogin: new Input({
          customProps: {
            type: 'text',
            placeholder: 'Логин',
            name: 'login',
            id: 'login',
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
        Button: new Button({
          customProps: {
            type: 'submit',
            text: 'Войти',
          },
        }),
        Link: new Link({
          customProps: {
            href: '/signin',
            text: 'Ещё не зарегистрированы?',
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
          {{{ InputLogin }}}
        </div>
        <div class="form-group">
          {{{ InputPassword }}}
        </div>
        <div class="form-actions">
          {{{ Button }}}
          {{{ Link }}}
        </div>
      </form>
    `;
  }
}
