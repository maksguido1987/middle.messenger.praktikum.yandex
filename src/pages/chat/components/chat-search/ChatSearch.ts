import {Input} from '../../../../components/input/Input';
import {Block} from '../../../../core/Block';
import './style.scss';

interface ChatSearchProps {
  events?: {
    submit: (e: SubmitEvent) => void;
  };
}

/**
 * Класс компонента поиска в чате
 */
export class ChatSearch extends Block {
  constructor(props: ChatSearchProps) {
    super({
      ...props,
      children: {
        SearchInput: new Input({
          attributes: {
            id: 'search',
            name: 'search',
            placeholder: 'Поиск',
            type: 'text',
            class: 'chat-search__input reset-input',
          },
          events: {
            blur: (e: FocusEvent) => {
              console.log('blur', e);
            },
            input: (e: Event) => {
              console.log('input', e);
            },
          },
        }),
      },
    });
  }

  render(): string {
    return `
      <form class="chat-search">
        {{{ SearchInput }}}
      </form>
    `;
  }
}
