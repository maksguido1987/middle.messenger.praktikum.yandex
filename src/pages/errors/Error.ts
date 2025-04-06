import {Link} from '../../components/link/Link';
import {Block} from '../../core/Block';

export class ErrorPage extends Block {
  constructor(props: {title: string; code: string; description: string}) {
    super({
      ...props,
      children: {
        Link: new Link({
          attributes: {
            href: '/',
            text: 'Вернуться на главную',
          },
        }),
      },
      attributes: {
        title: props.title,
        code: props.code,
        description: props.description,
      },
    });
  }

  public render(): string {
    return `
      <main class="error-page">
        <div class="error-container">
          <div class="error-code">${this.attributes.code}</div>
          <h1 class="error-title">${this.attributes.title}</h1>
          <p class="error-message">${this.attributes.description}</p>
          {{{Link}}}
        </div>
      </main>
    `;
  }
}
