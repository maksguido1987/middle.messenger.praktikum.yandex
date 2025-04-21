import {BlockProps, Children, Attributes, EmitEvents, Events, Lists} from '../global-types';
import {EventBus} from './EventBus';
import * as Handlebars from 'handlebars';
import {v4 as uuidv4} from 'uuid';
import {defaultValidationConfig} from './validation';
import isEqual from '../utils/isEqual';

export abstract class Block<T extends BlockProps = BlockProps> {
  private eventBus: () => EventBus;
  protected children: Children = {};
  protected events: Events = {};
  protected attributes: NonNullable<T['attributes']> = {} as NonNullable<T['attributes']>;
  protected state: NonNullable<T['state']> = {} as NonNullable<T['state']>;
  protected lists: Lists = {};

  private _element: HTMLElement | null = null;
  private _placeholder?: string = `child_${uuidv4()}`;

  constructor(props: T = {} as T) {
    const eventBus = new EventBus();

    this.attributes = this._makePropsProxy(props.attributes || {}) as NonNullable<T['attributes']>;
    this.state = this._makePropsProxy(props.state || {}) as NonNullable<T['state']>;
    this.children = props.children || {};
    this.events = props.events || {};
    this.lists = this._makePropsProxy(props.lists || {}) as Lists;
    this.eventBus = () => eventBus;
    this._registerEvents(eventBus);
    eventBus.emit(EmitEvents.INIT);
  }

  private _registerEvents(eventBus: EventBus) {
    eventBus.on(EmitEvents.INIT, this.init.bind(this));
    eventBus.on(EmitEvents.FLOW_RENDER, this._render.bind(this));
    // eventBus.on(EmitEvents.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(EmitEvents.FLOW_CDU, this._componentDidUpdate.bind(this));
  }

  private addEvents() {
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

  // private _componentDidMount() {
  //   this.componentDidMount(this.attributes as T);
  //   Object.values(this.children).forEach((child) => {
  //     if (child instanceof Block) {
  //       child.dispatchComponentDidMount();
  //     }
  //   });
  // }

  // componentDidMount(oldProps: T): boolean {
  //   return true;
  // }

  dispatchComponentDidMount() {
    this.eventBus().emit(EmitEvents.FLOW_CDM);
  }

  private _componentDidUpdate(...args: unknown[]) {
    const [oldProps, newProps] = args as [Record<string, unknown>, Record<string, unknown>];
    const response = this.componentDidUpdate(oldProps, newProps);
    if (!response) {
      return;
    }
    this._render();
  }

  componentDidUpdate(
    oldProps: Record<string, unknown>,
    newProps: Record<string, unknown>,
  ): boolean {
    return !isEqual(oldProps, newProps);
  }

  setProps = (nextAttributes: NonNullable<T['attributes']>): void => {
    if (!nextAttributes) {
      return;
    }
    Object.assign(this.attributes, nextAttributes);
  };

  setChildrenProps = (childrenProps: Record<string, Record<string, unknown>>): void => {
    if (!childrenProps) {
      return;
    }

    Object.entries(childrenProps).forEach(([childName, props]) => {
      const child = this.children[childName];
      if (child instanceof Block) {
        child.setProps(props);
      }
    });
  };

  setState = (nextState: Record<string, unknown>) => {
    if (!nextState) {
      return;
    }

    const proxyNewState = this._makePropsProxy(nextState);

    Object.assign(this.state, proxyNewState);
  };

  get element() {
    return this._element ?? '';
  }

  private _render() {
    const block = this.render();

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

    this.addEvents();
    this.addAttributes(this.attributes);
    this.setState(this.state);
  }

  render(): string {
    return '';
  }

  getContent() {
    return this.element;
  }

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
        target[prop] = value;
        this.eventBus().emit(EmitEvents.FLOW_CDU, oldProps, target);
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
    if (!attributes) {
      return;
    }
    Object.entries(attributes).forEach(([key, value]) => {
      this._element?.setAttribute(key, String(value));
    });
  }

  removeAttributes(attributes?: Attributes) {
    if (!attributes) {
      return;
    }
    Object.entries(attributes).forEach(([key]) => {
      this._element?.removeAttribute(key);
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

  // public forceUpdate() {
  //   this.eventBus().emit(EmitEvents.FLOW_RENDER);
  // }

  public componentWillUnmount() {
    // Хук жизненного цикла перед удалением компонента
  }

  protected getFormData<T>(e: Event): T {
    e.preventDefault();

    if (!(e.target instanceof HTMLFormElement)) {
      return {} as T;
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
      .reduce((acc, element) => {
        acc[element.name as keyof T] = element.value as T[keyof T];
        return acc;
      }, {} as T);
  }

  protected validateForm(e: Event): boolean {
    if (!(e.target instanceof HTMLFormElement)) {
      return false;
    }

    let isValid = true;
    const elements = Array.from(e.target.elements);

    for (const element of elements) {
      if (
        !(element instanceof HTMLInputElement) ||
        !element.name ||
        element.type === 'submit' ||
        element.type === 'button'
      ) {
        continue;
      }

      const fieldConfig = defaultValidationConfig[element.name];
      if (!fieldConfig) {
        continue;
      }

      const value = element.value;
      let fieldIsValid = true;
      let errorMessage = '';

      for (const rule of fieldConfig.rules) {
        let ruleValid = true;

        switch (rule.type) {
          case 'required':
            ruleValid = value.trim() !== '';
            break;
          case 'minLength':
            ruleValid = value.length >= (rule.value as number);
            break;
          case 'maxLength':
            ruleValid = value.length <= (rule.value as number);
            break;
          case 'pattern':
            ruleValid = (rule.value as RegExp).test(value);
            break;
          case 'email':
            ruleValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            break;
          case 'phone':
            ruleValid = /^\+?[0-9]{10,15}$/.test(value.replace(/[^0-9]/g, ''));
            break;
        }

        if (!ruleValid) {
          fieldIsValid = false;
          errorMessage = rule.message;
          break;
        }
      }

      this.updateFieldUI(element, fieldIsValid, errorMessage);
      if (!fieldIsValid) {
        isValid = false;
      }
    }

    return isValid;
  }

  protected updateFieldUI(input: HTMLInputElement, isValid: boolean, errorMessage: string): void {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;

    const errorElement =
      formGroup.querySelector('.validate-error') || document.createElement('small');
    errorElement.className = 'validate-error';
    if (!formGroup.contains(errorElement)) {
      formGroup.appendChild(errorElement);
    }

    input.classList.toggle('error', !isValid);
    errorElement.textContent = isValid ? '' : errorMessage;
  }
}
