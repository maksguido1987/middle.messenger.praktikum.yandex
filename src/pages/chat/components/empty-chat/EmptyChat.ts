import {Block} from '../../../../core/Block';
import './style.scss';

export class EmptyChat extends Block {
  constructor() {
    super();
  }

  render() {
    return `
      <div class="empty-chat">
        <p class="empty-chat__message">Выберите чат чтобы отправить сообщение</p>
      </div>
    `;
  }
}
