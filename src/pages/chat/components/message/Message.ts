import {Block} from '../../../../core/Block';

export class Message extends Block {
  constructor(props: any) {
    super(props);
  }

  render() {
    return `
      <div class="message message--incoming">
        <div class="message__content">Привет, как дела?</div>
        <div class="message__time">10:30</div>
      </div>
    `;
  }
}
