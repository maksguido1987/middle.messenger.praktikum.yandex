import {Block} from '../../core/Block';
import {BlockProps, EmitEvents} from '../../global-types';
import './style.scss';

export class Link extends Block {
  constructor(props: BlockProps) {
    super({
      ...props,
      events: {
        click: (e: MouseEvent) => {
          e.preventDefault();

          const href = (e.target as HTMLAnchorElement).getAttribute('href');

          if (href) {
            window.history.pushState({}, '', href);
            window.dispatchEvent(new PopStateEvent('popstate'));
            this.eventBus().emit(EmitEvents.FLOW_RENDER);
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
