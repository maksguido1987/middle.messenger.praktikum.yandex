import {BlockProps, Children, Attributes, EmitEvents, Events, Lists} from '../global-types';
import {EventBus} from './EventBus';
import Handlebars from 'handlebars';
import {v4 as uuidv4} from 'uuid';

export abstract class Block {
  protected eventBus: () => EventBus;
  protected children: Children = {};
  protected events: Events = {};
  protected attributes: Attributes = {};
  protected state: Record<string, unknown> = {};
  protected lists: Lists = {};

  private _element: HTMLElement | null = null;
  private _placeholder?: string = `child_${uuidv4()}`;
  private _isMounted: boolean = false;
  private _renderTimeout: number | null = null;

  constructor(props: BlockProps = {}) {
    const eventBus = new EventBus();

    this.attributes = this._makePropsProxy(props.attributes || {});
    this.state = this._makePropsProxy(props.state || {});
    this.children = props.children || {};
    this.events = props.events || {};
    this.lists = this._makePropsProxy(props.lists || {}) as Lists;
    this.eventBus = () => eventBus;
    this._registerEvents(eventBus);
    eventBus.emit(EmitEvents.INIT);
  }

  /**
   * Регистрирует обработчики событий жизненного цикла компонента
   * @param {EventBus} eventBus - Шина событий компонента
   * @private
   */
  private _registerEvents(eventBus: EventBus) {
    eventBus.on(EmitEvents.INIT, this.init.bind(this));
    eventBus.on(EmitEvents.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(EmitEvents.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(EmitEvents.FLOW_RENDER, this._render.bind(this));
  }

  /**
   * Добавляет обработчики событий к DOM-элементу компонента
   * @private
   */
  private _addEvents() {
    if (!this.events) {
      return;
    }

    Object.entries(this.events).forEach(([event, callback]) => {
      this._element?.addEventListener(event, callback as EventListener);
    });
  }

  /**
   * Инициализирует компонент
   */
  init() {
    this.eventBus().emit(EmitEvents.FLOW_RENDER);
  }

  /**
   * Внутренний метод, вызываемый после монтирования компонента
   * @private
   */
  private _componentDidMount() {
    this.componentDidMount(this.attributes);
    Object.values(this.children).forEach((child) => {
      if (child instanceof Block) {
        child.dispatchComponentDidMount();
      }
    });
  }

  /**
   * Хук жизненного цикла, вызываемый после монтирования компонента
   * @param {BlockProps} oldProps - Предыдущие свойства компонента
   * @return {boolean}
   */
  componentDidMount(oldProps: BlockProps) {
    console.log('Component mounted with props:', oldProps);
    return true;
  }

  /**
   * Запускает процесс монтирования компонента
   */
  dispatchComponentDidMount() {
    this._isMounted = true;
    this.eventBus().emit(EmitEvents.FLOW_CDM);
  }

  /**
   * Внутренний метод обновления компонента
   * @param {unknown[]} args - Аргументы обновления
   * @private
   */
  private _componentDidUpdate(...args: unknown[]) {
    const [oldProps, newProps] = args as [BlockProps, BlockProps];
    const response = this.componentDidUpdate(oldProps, newProps);
    if (!response) {
      return;
    }
    this._render();
  }

  /**
   * Хук жизненного цикла, вызываемый при обновлении компонента
   * @param {BlockProps} oldProps - Предыдущие свойства
   * @param {BlockProps} newProps - Новые свойства
   * @return {boolean}
   */
  componentDidUpdate(oldProps: BlockProps, newProps: BlockProps) {
    const isPropsChanged = !this._isEqual(oldProps, newProps);

    if (isPropsChanged) {
      console.log('Props changed from', oldProps, 'to', newProps);
      return true;
    }

    return false;
  }

  /**
   * Устанавливает новые свойства компонента
   * @param {Attributes} nextAttributes - Новые свойства
   */
  setProps = (nextAttributes: Attributes) => {
    if (!nextAttributes) {
      return;
    }

    Object.assign(this.attributes, nextAttributes);
  };

  /**
   * Устанавливает новое состояние компонента
   * @param {Record<string, unknown>} nextState - Новое состояние
   */
  setState = (nextState: Record<string, unknown>) => {
    if (!nextState) {
      return;
    }

    Object.assign(this.state, nextState);
    this.eventBus().emit(EmitEvents.FLOW_RENDER);
  };

  /**
   * Возвращает DOM-элемент компонента
   */
  get element() {
    return this._element ?? '';
  }

  /**
   * Выполняет рендеринг компонента
   * @private
   */
  private _render() {
    const block = this.render();

    this._unmount();

    const listId = uuidv4();

    const template = Handlebars.compile(block);
    const propsAndChildren = {
      ...(this.attributes as Record<string, unknown>),
      ...(this.state as Record<string, unknown>),
      ...(this.lists as Record<string, (Block | string)[]>),
      ...this.children,
    };

    Object.entries(this.children).forEach(([key, child]) => {
      if (child instanceof Block) {
        propsAndChildren[key] = `<div data-id="${child._placeholder}"></div>`;
      }
    });

    Object.entries(this.lists).forEach(([key]) => {
      propsAndChildren[key] = `<div data-id="__l_${listId}"></div>`;
    });

    const html = template(propsAndChildren);

    const fragment = this._createDocumentElement('template') as HTMLTemplateElement;
    fragment.innerHTML = html;
    const newElement = fragment.content.firstElementChild;
    if (this._element && newElement) {
      this._element.replaceWith(newElement);
    }
    this._element = newElement as HTMLElement;

    Object.values(this.children).forEach((child) => {
      const placeholder = newElement?.querySelector(`[data-id="${child._placeholder}"]`);

      if (placeholder && child.getContent()) {
        placeholder.replaceWith(child.getContent());
      }
    });

    Object.entries(this.lists).forEach(([, child]) => {
      const listCont = this._createDocumentElement('template') as HTMLTemplateElement;
      child.forEach((item) => {
        if (item instanceof Block) {
          listCont.content.append(item.getContent());
        } else {
          listCont.content.append(`${item}`);
        }
      });
      const stub = fragment.content.querySelector(`[data-id="__l_${listId}"]`);
      if (stub) {
        stub.replaceWith(listCont.content);
      }
    });

    this._addEvents();
    this.addAttributes(this.attributes);
  }

  /**
   * Абстрактный метод рендеринга, должен быть переопределен в наследниках
   * @return {string} HTML-строка компонента
   */
  render(): string {
    return '';
  }

  /**
   * Возвращает DOM-элемент компонента
   * @return {HTMLElement}
   */
  getContent() {
    return this.element;
  }

  /**
   * Создает прокси для свойств компонента
   * @param {Attributes} props - Свойства для проксирования
   * @return {Proxy}
   * @private
   */
  _makePropsProxy(props: Attributes | Record<string, (Block | string)[]>) {
    return new Proxy(props, {
      get: (target, prop: string) => {
        if (prop.startsWith('_')) {
          throw new Error('Нет прав');
        }
        return target[prop];
      },

      set: (target, prop: string, value) => {
        if (prop.startsWith('_')) {
          throw new Error('Нет прав');
        }
        const oldProps = {...target};
        target[prop] = String(value);
        this.eventBus().emit(EmitEvents.FLOW_RENDER, oldProps, target);
        return true;
      },

      deleteProperty: () => {
        throw new Error('Нет прав');
      },
    });
  }

  /**
   * Создает DOM-элемент
   * @param {string} tagName - Имя тега
   * @return {HTMLElement | HTMLTemplateElement}
   * @private
   */
  _createDocumentElement(tagName: string): HTMLElement | HTMLTemplateElement {
    return document.createElement(tagName);
  }

  /**
   * Добавляет атрибуты к DOM-элементу компонента
   * @param {Attributes} attributes - Атрибуты для добавления
   */
  addAttributes(attributes?: Attributes) {
    if (!attributes) {
      return;
    }

    Object.entries(attributes).forEach(([key, value]) => {
      this._element?.setAttribute(key, String(value));
    });
  }

  /**
   * Показывает компонент
   */
  show() {
    if (!this._element) {
      return;
    }
    this._element.style.display = 'block';
  }

  /**
   * Скрывает компонент
   */
  hide() {
    if (!this._element) {
      return;
    }
    this._element.style.display = 'none';
  }

  /**
   * Сравнивает два объекта на равенство
   * @param {unknown} obj1 - Первый объект
   * @param {unknown} obj2 - Второй объект
   * @return {boolean}
   * @private
   */
  private _isEqual(obj1: unknown, obj2: unknown): boolean {
    if (obj1 === obj2) {
      return true;
    }

    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || !obj1 || !obj2) {
      return false;
    }

    const keys1 = Object.keys(obj1 as object);
    const keys2 = Object.keys(obj2 as object);

    if (keys1.length !== keys2.length) {
      return false;
    }

    return keys1.every((key) =>
      this._isEqual((obj1 as Record<string, unknown>)[key], (obj2 as Record<string, unknown>)[key]),
    );
  }

  /**
   * Выполняет отложенное обновление компонента
   * @protected
   */
  protected deferredUpdate() {
    if (this._renderTimeout !== null) {
      window.clearTimeout(this._renderTimeout);
    }

    this._renderTimeout = window.setTimeout(() => {
      this.eventBus().emit(EmitEvents.FLOW_RENDER);
    }, 0);
  }

  /**
   * Принудительно обновляет компонент
   */
  public forceUpdate() {
    this.eventBus().emit(EmitEvents.FLOW_RENDER);
  }

  /**
   * Создает ref для DOM-элемента
   * @template T - Тип DOM-элемента
   * @return {Object} Объект ref
   * @protected
   */
  protected createRef<T extends HTMLElement>(): {current: T | null} {
    return {
      current: null,
    };
  }

  /**
   * Хук жизненного цикла, вызываемый перед удалением компонента
   */
  public componentWillUnmount() {
    // Хук жизненного цикла перед удалением компонента
  }

  /**
   * Размонтирует компонент
   * @private
   */
  private _unmount() {
    if (!this._isMounted) {
      return;
    }

    this.componentWillUnmount();
    this._removeEvents();
    this._element?.remove();
    this._isMounted = false;
  }

  /**
   * Удаляет обработчики событий компонента
   * @private
   */
  private _removeEvents() {
    if (!this.events || !this._element) {
      return;
    }

    Object.entries(this.events).forEach(([event, callback]) => {
      this._element?.removeEventListener(event, callback as EventListener);
    });
  }

  /**
   * Получает данные формы
   * @param {Event} e - Событие отправки формы
   * @return {Record<string, {value: string}>} Объект данных формы
   * @protected
   */
  protected getFormData(e: Event): Record<string, {value: string}> {
    e.preventDefault();

    if (!(e.target instanceof HTMLFormElement)) {
      return {};
    }

    return Array.from(e.target.elements)
      .filter((item): item is HTMLInputElement => {
        return (
          item instanceof HTMLInputElement &&
          !!item.name &&
          item.type !== 'submit' &&
          item.type !== 'button'
        );
      })
      .reduce(
        (acc, element) => {
          acc[element.name] = {value: element.value};
          return acc;
        },
        {} as Record<string, {value: string}>,
      );
  }

  /**
   * Уничтожает компонент
   */
  public destroy() {
    this._unmount();
    this.eventBus = () => new EventBus();
  }
}
