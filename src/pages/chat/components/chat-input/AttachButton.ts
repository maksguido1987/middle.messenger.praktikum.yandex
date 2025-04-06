import {Block} from '../../../../core/Block';
import './style.scss';

interface AttachButtonProps {
  events?: {
    click: () => void;
  };
}

/**
 * Класс компонента кнопки прикрепления файлов
 */
export class AttachButton extends Block {
  constructor(props: AttachButtonProps) {
    super({
      ...props,
    });
  }

  render(): string {
    return `
      <button class="chat-form__attach-button">
        <img
          src="../../../images/attach.svg"
          alt="attach"
          class="chat-form__attach-icon"
        />
      </button>
    `;
  }
}
