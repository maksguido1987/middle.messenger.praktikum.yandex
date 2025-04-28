import {Block} from '../../../../core/Block';
import './style.scss';

interface EmptyChatProps {
  state?: {
    isVisible?: boolean;
  };
}

export class EmptyChat extends Block {
  constructor(props: EmptyChatProps = {}) {
    super({
      ...props,
      state: {
        isVisible: props.state?.isVisible ?? true,
        ...props.state,
      },
    });
  }

  render() {
    if (!this.state.isVisible) {
      return '';
    }

    return `
      <div class="empty-chat">
        <p class="empty-chat__message">Выберите чат чтобы отправить сообщение</p>
      </div>
    `;
  }
}
