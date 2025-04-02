import {Block} from '../../core/Block';
import {Button} from '../../components/button/Button';

export class LoginPage extends Block {
  constructor() {
    super({
      children: {
        Button: new Button({
          text: 'Click me',
          type: 'button',
        }),
      },
    });
  }

  render() {
    return `
      <div id="login-page">
        <h1>Login</h1>
        {{{Button}}}
      </div>
    `;
  }
}
