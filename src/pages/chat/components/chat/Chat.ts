import {Block} from '../../../../core/Block';
import {ChatHeader} from '../chat-header/ChatHeader';
import {ChatInput} from '../chat-input/ChatInput';
import './style.scss';

interface ChatProps {
  state?: {
    isVisible?: boolean;
  };
}

export class Chat extends Block {
  constructor(props: ChatProps = {}) {
    super({
      ...props,
      state: {
        isVisible: props.state?.isVisible ?? true,
        ...props.state,
      },
      children: {
        ChatHeader: new ChatHeader({
          state: {
            src: 'https://via.placeholder.com/150',
            name: 'Иванов Иван Иванович',
          },
        }),
        ChatInput: new ChatInput({
          value: '',
          events: {
            submit: (e: SubmitEvent) => {
              e.preventDefault();
              // Здесь будет логика отправки сообщения
            },
          },
        }),
      },
    });
  }

  render() {
    if (!this.state.isVisible) {
      return '';
    }

    return `
      <div class="chat-content">
        {{{ ChatHeader }}}
        <section class="chat-messages">

        </section>
        {{{ ChatInput }}}
      </div>
    `;
  }
}
