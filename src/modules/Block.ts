import {EmitEvents} from '../global-types';
import {EventBus} from './EventBus';
import Handlebars from 'handlebars';

type Attributes = Partial<HTMLElement>;
type Children = Record<string, Block | Block[]>;

type Props = {
  attributes?: Attributes;
  children?: Children;
} & Record<string, unknown>;

type Meta = {
  tagName: string;
  props: Props;
};

const DEFAULT_TAG_NAME = 'div';

export abstract class Block {
  props: Props;
  eventBus: EventBus;

  protected children: Children = {};

  private _element: HTMLElement | null = null;
  private _meta: Meta = {tagName: DEFAULT_TAG_NAME, props: {}};

  constructor(tagName: string = DEFAULT_TAG_NAME, props: Props = {}, children: Children = {}) {
    const eventBus = new EventBus();

    this._meta = {
      tagName,
      props,
    };

    this.children = children;
    this.props = this._makePropsProxy(props);
    this.eventBus = eventBus;
    this._registerEvents(eventBus);
    eventBus.emit(EmitEvents.INIT);
  }

  private _registerEvents(eventBus: EventBus) {
    eventBus.on(EmitEvents.INIT, this.init.bind(this));
    eventBus.on(EmitEvents.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(EmitEvents.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(EmitEvents.FLOW_RENDER, this._render.bind(this));
  }

  private _createResources() {
    const {tagName} = this._meta;
    this._element = this._createDocumentElement(tagName);
    this.addAttributes(this._meta.props.attributes);
  }

  init() {
    this._createResources();
    this.eventBus.emit(EmitEvents.FLOW_RENDER);
  }

  private _componentDidMount() {
    this.componentDidMount(this.props);
    Object.values(this.children).forEach((child) => {
      if (child instanceof Block) {
        child.dispatchComponentDidMount();
      }
    });
  }

  componentDidMount(oldProps: Props) {
    return true;
  }

  dispatchComponentDidMount() {
    this.eventBus.emit(EmitEvents.FLOW_CDM);
  }

  private _componentDidUpdate(...args: unknown[]) {
    const [oldProps, newProps] = args as [Props, Props];
    const response = this.componentDidUpdate(oldProps, newProps);
    if (!response) {
      return;
    }
    this._render();
  }

  componentDidUpdate(oldProps: Props, newProps: Props) {
    return true;
  }

  setProps = (nextProps: Props) => {
    if (!nextProps) {
      return;
    }

    Object.assign(this.props, nextProps);
  };

  get element() {
    return this._element;
  }

  private _render() {
    const block = this.render();

    if (this._element && block) {
      // Компилируем шаблон через Handlebars
      const template = Handlebars.compile(block);

      // Рендерим с данными из props
      const html = template(this.props);

      // Создаем временный контейнер
      const temp = document.createElement('template');
      temp.innerHTML = html;

      // Очищаем текущий элемент
      while (this._element.firstChild) {
        this._element.removeChild(this._element.firstChild);
      }

      // Вставляем новый контент
      this._element.appendChild(temp.content);
    }
  }

  // Метод render должен возвращать строку с Handlebars шаблоном
  render(): string {
    return '';
  }

  getContent() {
    return this.element;
  }

  _makePropsProxy(props: Props) {
    return new Proxy(props, {
      get: (target, prop: string) => {
        if (prop.startsWith('_')) {
          throw new Error('Нет прав');
        }
        const value = target[prop];
        if (typeof value === 'function') {
          return value.bind(target);
        }
        return value;
      },

      set: (target, prop: string, value) => {
        if (prop.startsWith('_')) {
          throw new Error('Нет прав');
        }
        const oldProps = {...target};
        target[prop] = value;
        this.eventBus.emit(EmitEvents.FLOW_RENDER, oldProps, target);
        return true;
      },

      deleteProperty: () => {
        throw new Error('Нет прав');
      },
    });
  }

  _createDocumentElement(tagName: string): HTMLElement {
    // Можно сделать метод, который через фрагменты в цикле создаёт сразу несколько блоков
    return document.createElement(tagName);
  }

  addAttributes(attributes?: Attributes) {
    if (!this._element || !attributes) {
      return;
    }

    Object.entries(attributes).forEach(([key, value]) => {
      this._element?.setAttribute(key, String(value));
    });
  }

  show() {
    if (!this._element) {
      return;
    }
    this._element.style.display = 'block';
  }

  hide() {
    if (!this._element) {
      return;
    }
    this._element.style.display = 'none';
  }
}
