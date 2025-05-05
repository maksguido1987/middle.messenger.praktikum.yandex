import {Block} from '../../../../core/Block';
import {AttachButton} from './AttachButton';
import './style.scss';
import {webSocketController} from '../../../../controllers/webSocketController';
interface ChatInputProps {
  value: string;
  events?: {
    submit: (e: SubmitEvent) => void;
  };
}

/**
 * Класс компонента ввода сообщения в чате
 */
export class ChatInput extends Block {
  constructor(props: ChatInputProps) {
    super({
      ...props,
      events: {
        submit: (e: SubmitEvent) => {
          e.preventDefault();
          this.fetchFormData(e);
        },
      },
      children: {
        AttachButton: new AttachButton(),
      },
    });
  }

  private sanitizeMessage(message: string): string {
    // Удаляем html-теги и потенциально опасные конструкции
    return message
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private fetchFormData(e: SubmitEvent) {
    e.preventDefault();
    const formData = this.getFormData<{message: string}>(e);
    const rawMessage = formData['message'] || '';
    const sanitizedMessage = this.sanitizeMessage(rawMessage);
    if (!sanitizedMessage) return;
    webSocketController.send({type: 'message', content: sanitizedMessage});
    this.setState({value: ''});
  }

  render() {
    return `
      <form class="chat-form">
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
