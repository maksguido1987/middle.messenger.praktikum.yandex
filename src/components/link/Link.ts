import {Block} from '../../core/Block';
import {BlockProps} from '../../global-types';
import './style.scss';

export class Link extends Block {
  constructor(props: BlockProps) {
    super(props);
  }

  render() {
    return `
        <a href="{{href}}" class="link {{class}}">{{text}}</a>
    `;
  }
}
