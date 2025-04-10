import {Block} from './Block';
import {BlockProps} from '../global-types';

function isEqual(lhs: string, rhs: string) {
  return lhs === rhs;
}

function render<T extends BlockProps>(rootElement: HTMLElement, block: Block<T>) {
  if (!rootElement) {
    return null;
  }

  const content = block.getContent();
  if (!content) {
    return null;
  }

  rootElement.appendChild(content);
  return null;
}

export class Route<T extends BlockProps = BlockProps> {
  private _pathname: string;
  private _blockClass: new (props: T) => Block<T>;
  private _block: Block<T> | null;
  private _props: {rootQuery: HTMLElement};
  private _componentProps: T;

  constructor(
    pathname: string,
    view: new (props: T) => Block<T>,
    props: {rootQuery: HTMLElement},
    componentProps: T,
  ) {
    this._pathname = pathname;
    this._blockClass = view;
    this._block = null;
    this._props = props;
    this._componentProps = componentProps;
  }

  navigate(pathname: string) {
    if (this.match(pathname)) {
      this.render();
    }
  }

  leave() {
    if (this._block) {
      this._block.hide();
    }
  }

  match(pathname: string) {
    return isEqual(pathname, this._pathname);
  }

  render() {
    if (!this._block) {
      this._block = new this._blockClass(this._componentProps);
      render(this._props.rootQuery, this._block);
      return;
    }
    this._block.show();
  }
}
