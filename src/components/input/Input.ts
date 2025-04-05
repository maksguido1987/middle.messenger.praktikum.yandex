import {BlockProps} from '../../global-types';
import {Block} from '../../core/Block';
import './style.scss';

interface InputProps extends Omit<BlockProps, 'attributes'> {
  attributes: {
    id: string;
    name: string;
  } & BlockProps['attributes'];
}

export class Input extends Block {
  constructor(props: InputProps) {
    super(props);
  }

  render() {
    return `
        <input
          class="input {{class}}"
          id="{{id}}"
          name="{{name}}" />
    `;
  }
}
