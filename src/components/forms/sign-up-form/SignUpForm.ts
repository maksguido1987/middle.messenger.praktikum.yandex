import {AuthController} from '../../../controllers/authController';
import {Block} from '../../../core/Block';
import {SignUpData} from '../../../services/auth';
import {Button} from '../../button/Button';
import {Input} from '../../input/Input';
import {Link} from '../../link/Link';
import '../style.scss';

export class SignUpForm extends Block {
  private authController: AuthController;
  constructor() {
    super({
      events: {
        submit: (e: SubmitEvent) => this.fetchFormData(e),
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
            placeholder: 'Логин',
            name: 'login',
            id: 'login',
          },
        }),
        InputName: new Input({
          attributes: {
            placeholder: 'Имя',
            name: 'first_name',
            id: 'first_name',
          },
        }),
        InputSecondName: new Input({
          attributes: {
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
        Button: new Button({
          attributes: {
            type: 'submit',
            text: 'Войти',
          },
        }),
        Link: new Link({
          attributes: {
            href: '/',
            text: 'Уже есть аккаунт? Войти',
          },
        }),
      },
    });

    this.authController = new AuthController();
  }

  private fetchFormData(e: SubmitEvent) {
    const formData = this.getFormData<SignUpData>(e);

    if (!this.validateForm(e)) {
      return;
    }
    this.authController.signUp(formData);
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
        <div class="form-actions">
          {{{ Button }}}
          {{{ Link }}}
        </div>
      </form>
    `;
  }
}
