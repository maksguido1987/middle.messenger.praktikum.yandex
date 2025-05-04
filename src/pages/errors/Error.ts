import {Link} from '../../components/link/Link';
import {Block} from '../../core/Block';
import {BlockProps} from '../../global-types';

export interface ErrorPageProps extends BlockProps {
  attributes: {
    title: string;
    code: string;
    description: string;
  };
}

export class ErrorPage extends Block<ErrorPageProps> {
  constructor(props: ErrorPageProps) {
    super({
      ...props,
      children: {
        Link: new Link({
          attributes: {
            href: '/messenger',
            text: 'Вернуться на главную',
          },
        }),
      },
      attributes: {
        title: props.attributes.title,
        code: props.attributes.code,
        description: props.attributes.description,
      },
    });
  }

  public render() {
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
