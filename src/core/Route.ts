import {Block} from './Block';
import {BlockProps} from '../global-types';

function isEqual(lhs: string, rhs: string) {
  return lhs === rhs;
}

function render(query: string, block: Block) {
  const root = document.querySelector(query);
  if (root) {
    const content = block.getContent();
    if (content instanceof HTMLElement) {
      root.innerHTML = content.outerHTML;
    } else {
      root.innerHTML = content;
    }
    return root;
  }
  return null;
}

export class Route {
  private _pathname: string;
  private _blockClass: new (props: BlockProps) => Block;
  private _block: Block | null;
  private _props: {rootQuery: string};

  constructor(
    pathname: string,
    view: new (props: BlockProps) => Block,
    props: {rootQuery: string},
  ) {
    this._pathname = pathname;
    this._blockClass = view;
    this._block = null;
    this._props = props;
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
      this._block = new this._blockClass({});
      render(this._props.rootQuery, this._block);
      return;
    }
    this._block.show();
  }
}
