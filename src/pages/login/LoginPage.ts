import {LoginForm} from '../../components/forms/login-form/LoginForm';
import {Block} from '../../core/Block';
export class LoginPage extends Block {
  constructor() {
    super({
      children: {
        LoginForm: new LoginForm(),
      },
    });
  }

  render() {
    return `
      <div id="app">
        <main class="login-container">
          <div class="form-container">
            <h1>Вход</h1>
            {{{ LoginForm }}}
          </div>
        </main>
      </div>
    `;
  }
}
