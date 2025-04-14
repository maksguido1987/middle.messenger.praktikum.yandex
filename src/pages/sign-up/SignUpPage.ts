import { SignUpForm } from '../../components/forms/sign-up-form/SignUpForm';
import {Block} from '../../core/Block';

export class SignUpPage extends Block {
  constructor() {
    super({
      children: {
        SignUpForm: new SignUpForm(),
      },
    });
  }

  render() {
    return `
      <div id="app">
        <main class="signin-container">
          <div class="form-container">
            <h1>Регистрация</h1>
            {{{ SignUpForm }}}
          </div>
        </main>
      </div>
    `;
  }
}
