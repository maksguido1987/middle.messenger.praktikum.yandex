import {Block} from '../../core/Block';
import {SigninForm} from '../../components/forms/signin-form/SigninForm';
export class SigninPage extends Block {
  constructor() {
    super({
      children: {
        SigninForm: new SigninForm(),
      },
    });
  }

  render() {
    return `
      <div id="app">
        <main class="signin-container">
          <div class="form-container">
            <h1>Регистрация</h1>
            {{{ SigninForm }}}
          </div>
        </main>
      </div>
    `;
  }
}
