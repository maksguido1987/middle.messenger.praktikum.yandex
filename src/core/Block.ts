import {EmitEvents} from '../global-types';
import {EventBus} from './EventBus';
import Handlebars from 'handlebars';

type Attributes = {
  [K in keyof HTMLElement]?: HTMLElement[K] extends string ? string : never;
};
type Events = Partial<{
  [K in keyof HTMLElementEventMap]: (event: HTMLElementEventMap[K]) => void;
}>;
type Children = Record<string, Block | Block[]>;
type CustomProps = Record<string, string | undefined>;

type Props = {
  HTMLAttributes?: Attributes;
  children?: Children;
  events?: Events;
  customProps?: CustomProps;
};

export abstract class Block {
  protected HTMLAttributes: Attributes;
  protected eventBus: () => EventBus;
  protected children: Children = {};
  protected events: Events = {};
  protected customProps: CustomProps = {};
  protected _element: HTMLElement | null = null;

  constructor(props: Props = {}) {
    const eventBus = new EventBus();

    this.HTMLAttributes = this._makePropsProxy(props.HTMLAttributes || {});
    this.customProps = this._makePropsProxy(props.customProps || {});
    this.children = props.children || {};
    this.events = props.events || {};
    this.eventBus = () => eventBus;
    this._registerEvents(eventBus);
    eventBus.emit(EmitEvents.INIT);
  }

  private _registerEvents(eventBus: EventBus) {
    eventBus.on(EmitEvents.INIT, this.init.bind(this));
    eventBus.on(EmitEvents.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(EmitEvents.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(EmitEvents.FLOW_RENDER, this._render.bind(this));
  }

  private _addEvents() {
    if (!this.events) {
      return;
    }

    Object.entries(this.events).forEach(([event, callback]) => {
      this._element?.addEventListener(event, callback as EventListener);
    });
  }

  init() {
    this.eventBus().emit(EmitEvents.FLOW_RENDER);
  }

  private _componentDidMount() {
    this.componentDidMount(this.HTMLAttributes);
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
    this.eventBus().emit(EmitEvents.FLOW_CDM);
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

  setProps = (nextAttributes: Attributes) => {
    if (!nextAttributes) {
      return;
    }

    Object.assign(this.HTMLAttributes, nextAttributes);
  };

  get element() {
    return this._element ?? '';
  }

  private _render() {
    const block = this.render();

    // Компилируем шаблон через Handlebars
    const template = Handlebars.compile(block);
    // Рендерим с данными из props
    const html = template(this.HTMLAttributes);

    const fragment = this._createDocumentElement('template');
    fragment.innerHTML = html;
    const newElement = fragment.content.firstElementChild;

    this._element = newElement;

    this._addEvents();
    this.addAttributes(this.HTMLAttributes);
  }

  render(): string {
    return '';
  }

  getContent() {
    return this.element;
  }

  _makePropsProxy(props: Attributes & CustomProps) {
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

  _createDocumentElement(tagName: string): HTMLElement | HTMLTemplateElement {
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
