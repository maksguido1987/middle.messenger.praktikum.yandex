import {Block} from '../../../../core/Block';
import {BlockProps} from '../../../../global-types';
import {formatMessageDate} from '../../../../utils/date';
import './style.scss';

interface MessageProps extends BlockProps {
  state?: {
    isCurrentUser: boolean;
    text: string;
    time: string;
    isRead?: boolean;
  };
}

export class Message extends Block<MessageProps> {
  constructor(props: MessageProps) {
    super(props);
  }

  render() {
    const {isCurrentUser, text, time, isRead} = this.state;
    const messageClass = isCurrentUser ? 'message message--outgoing' : 'message message--incoming';
    const readStatus = isCurrentUser
      ? isRead
        ? '<img src="/images/recent.svg" />'
        : '<div class="message__status"></div>'
      : '';
    const formattedTime = formatMessageDate(time);

    return `
      <div class="${messageClass}">
        <div class="message__content">${text}</div>
        <div class="message__footer">
          ${readStatus}
          <div class="message__time">${formattedTime}</div>
        </div>
      </div>
    `;
  }
}
