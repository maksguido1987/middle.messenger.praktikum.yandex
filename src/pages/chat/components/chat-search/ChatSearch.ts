import {Input} from '../../../../components/input/Input';
import {Block} from '../../../../core/Block';
import {BlockProps} from '../../../../global-types';
import {store, StoreEvents} from '../../../../store/store';
import './style.scss';

export class ChatSearch extends Block {

  constructor(props: BlockProps) {
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
              this.searchChat((e.target as HTMLInputElement).value);
            },
          },
        }),
      },
    });

    store.on(StoreEvents.SEARCH_CHAT_UPDATE, () => {
      const value = store.state.searchChat;

      if (!value) {
        // Если поиск пустой, возвращаем все чаты
        store.setState('chats.filtered', store.state.chats.original);
        return;
      }

      // Фильтруем из оригинального списка
      const filteredChats = store.state.chats.original.filter((chat) =>
        chat.title.toLowerCase().includes(value.toLowerCase()),
      );

      store.setState('chats.filtered', filteredChats);
    });
  }

  private searchChat(value: string) {
    store.setState('searchChat', value);
  }

  render() {
    return `
      <form class="chat-search">
        {{{ SearchInput }}}
      </form>
    `;
  }
}
