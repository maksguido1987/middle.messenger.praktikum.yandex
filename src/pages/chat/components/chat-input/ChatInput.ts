import {Block} from '../../../../core/Block';
import { AttachButton } from './AttachButton';
import './style.scss';

interface ChatInputProps {
  value: string;
  events?: {
    submit: (e: Event) => void;
  };
}

/**
 * Класс компонента ввода сообщения в чате
 */
export class ChatInput extends Block {
  constructor(props: ChatInputProps) {
    super({
      ...props,
      children: {
        AttachButton: new AttachButton({}),
      },
    });
  }

  render(): string {
    return `
      <form class="chat-form">
        {{{ AttachButton }}}
        <input
          placeholder="Сообщение"
          class="chat-form__field"
          name="message"
          value="${this.attributes.value || ''}"
        />
        <button class="chat-form__send-button">
          <span class="chat-form__send-icon"></span>
        </button>
      </form>
    `;
  }
}
