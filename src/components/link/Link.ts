import {Block} from '../../core/Block';
import {BlockProps} from '../../global-types';
import './style.scss';

export class Link extends Block {
  constructor(props: BlockProps) {
    super({
      ...props,
      events: {
        click: (e: Event) => {
          e.preventDefault();

          const href = (e.target as HTMLAnchorElement).getAttribute('href');

          if (href) {
            window.history.pushState({}, '', href);
            window.dispatchEvent(new PopStateEvent('popstate'));
          }
        },
      },
    });
  }

  render() {
    return `
        <a href="{{href}}" class="link {{class}}">{{text}}</a>
    `;
  }
}
