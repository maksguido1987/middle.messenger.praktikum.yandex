import {Block} from '../../../../core/Block';
import './style.scss';

/**
 * Класс компонента кнопки прикрепления файлов
 */
export class AttachButton extends Block {
  constructor() {
    super();
  }

  render() {
    return `
      <button class="chat-form__attach-button" type="submit">
        <img
          src="../../../images/attach.svg"
          alt="attach"
          class="chat-form__attach-icon"
        />
      </button>
    `;
  }
}
