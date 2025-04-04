import {BlockProps, Children, CustomProps, EmitEvents, Events} from '../global-types';
import {EventBus} from './EventBus';
import Handlebars from 'handlebars';
import {v4 as uuidv4} from 'uuid';

export abstract class Block {
  protected eventBus: () => EventBus;
  protected children: Children = {};
  protected events: Events = {};
  protected customProps: CustomProps = {};
  protected _element: HTMLElement | null = null;
  protected _placeholder?: string = `child_${uuidv4()}`;

  constructor(props: BlockProps = {}) {
    const eventBus = new EventBus();

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
    this.componentDidMount(this.customProps);
    Object.values(this.children).forEach((child) => {
      if (child instanceof Block) {
        child.dispatchComponentDidMount();
      }
    });
  }

  componentDidMount(oldProps: BlockProps) {
    return true;
  }

  dispatchComponentDidMount() {
    this.eventBus().emit(EmitEvents.FLOW_CDM);
  }

  private _componentDidUpdate(...args: unknown[]) {
    const [oldProps, newProps] = args as [BlockProps, BlockProps];
    const response = this.componentDidUpdate(oldProps, newProps);
    if (!response) {
      return;
    }
    this._render();
  }

  componentDidUpdate(oldProps: BlockProps, newProps: BlockProps) {
    return true;
  }

  setProps = (nextAttributes: CustomProps) => {
    if (!nextAttributes) {
      return;
    }

    Object.assign(this.customProps, nextAttributes);
  };

  get element() {
    return this._element ?? '';
  }

  private _render() {
    const block = this.render();

    const template = Handlebars.compile(block);
    const propsAndChildren = {...this.customProps, ...this.children};

    Object.entries(this.children).forEach(([key, child]) => {
      propsAndChildren[key] = `<div data-id="${child._placeholder}"></div>`;
    });

    const html = template(propsAndChildren);

    const fragment = this._createDocumentElement('template') as HTMLTemplateElement;
    fragment.innerHTML = html;
    const newElement = fragment.content.firstElementChild;
    if (this._element && newElement) {
      this._element.replaceWith(newElement);
    }
    this._element = newElement as HTMLElement;

    // Заменяем плейсхолдеры на реальные компоненты
    Object.values(this.children).forEach((child) => {
      const placeholder = newElement?.querySelector(`[data-id="${child._placeholder}"]`);

      if (placeholder && child.getContent()) {
        placeholder.replaceWith(child.getContent());
      }
    });

    this._addEvents();
    this.addAttributes(this.customProps);
  }

  render(): string {
    return '';
  }

  getContent() {
    return this.element;
  }

  _makePropsProxy(props: CustomProps) {
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

  addAttributes(attributes?: CustomProps) {
    if (!attributes) {
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
