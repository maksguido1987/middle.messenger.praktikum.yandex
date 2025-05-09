import {Block} from '../../../core/Block';
import {Button} from '../../button/Button';
import {Input} from '../../input/Input';
import {Link} from '../../link/Link';
import '../style.scss';
import {AuthController} from '../../../controllers/authController';
import {SignInData} from '../../../services/auth';
import {Router} from '../../../core/Router';
import {store, StoreEvents} from '../../../store/store';
export class LoginForm extends Block {
  private authController: AuthController;
  private router: Router;

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
            href: '/sign-up',
            text: 'Ещё не зарегистрированы?',
          },
        }),
      },
    });
    this.authController = new AuthController();
    this.router = new Router();

    this.authController.getUser();

    store.on(StoreEvents.USER_UPDATE, this.checkUser.bind(this));
  }

  private checkUser() {
    const user = store.state.user;
    if (user) {
      this.router.go('/messenger');
    }
  }

  private fetchFormData(e: SubmitEvent) {
    e.preventDefault();
    const formData = this.getFormData<SignInData>(e);

    if (!this.validateForm(e)) {
      return;
    }
    this.authController.signIn(formData);
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
