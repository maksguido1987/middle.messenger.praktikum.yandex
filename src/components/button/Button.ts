import {Block} from '../../core/Block';
import {BlockProps} from '../../global-types';
import './style.scss';

export class Button extends Block {
  constructor(props: BlockProps) {
    super(props);
  }

  render(): string {
    return `
      <button class="button {{class}}" type="{{type}}">
        {{text}}
      </button>
    `;
  }
}
