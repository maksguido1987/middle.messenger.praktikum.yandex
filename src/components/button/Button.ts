import {Block} from '../../core/Block';
import './style.scss';

// type ButtonProps = {
//   text: string;
//   type?: 'button' | 'submit' | 'reset';
//   class?: string;
//   events?: {
//     click?: (event: MouseEvent) => void;
//   };
// } & Record<string, unknown>;

export class Button extends Block {
  constructor({...props}) {
    super({
      ...props,
      events: {
        click: () => {
          console.log('click');
        },
      },
    });
    console.log('props', props); // {text: 'Click me', type: 'button'}
  }

  render(): string {
    return `
      <button class="button {{class}}" type="{{type}}">
        {{text}}
      </button>
    `;
  }
}
