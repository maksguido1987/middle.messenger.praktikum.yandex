import {Block} from '../../../core/Block';
import {Button} from '../../button/Button';
import {Input} from '../../input/Input';
import {Link} from '../../link/Link';
import '../style.scss';

export class LoginForm extends Block {
  constructor() {
    super({
      events: {
        submit: (e: SubmitEvent) => this.fetchFormData(e),
      },
      children: {
        InputLogin: new Input({
          attributes: {
            placeholder: 'Логин',
            name: 'login',
            id: 'login',
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
        Button: new Button({
          attributes: {
            type: 'submit',
            text: 'Войти',
          },
        }),
        Link: new Link({
          attributes: {
            href: '/signin',
            text: 'Ещё не зарегистрированы?',
          },
        }),
      },
    });
  }

  private fetchFormData(e: SubmitEvent) {
    e.preventDefault();
    const formData = this.getFormData(e);

    if (!this.validateForm(e)) {
      return;
    }
    console.log(formData);
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
