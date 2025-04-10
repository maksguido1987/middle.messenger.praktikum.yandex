import {Block} from '../../core/Block';
import {Router} from '../../core/Router';
import {BlockProps} from '../../global-types';
import './style.scss';

export class Link extends Block {
  constructor(props: BlockProps) {
    const router = new Router();

    super({
      ...props,
      events: {
        click: (e: MouseEvent) => {
          e.preventDefault();

          const href = (e.target as HTMLAnchorElement).getAttribute('href');

          if (href) {
            router.go(href);
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
