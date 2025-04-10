import {BlockProps} from '../global-types';
import {Block} from './Block';
import {Route} from './Route';

export class Router {
  private static __instance: Router;
  private routes: Route[] = [];
  private history: History = window.history;
  private _currentRoute: Route | null = null;
  private _rootQuery: HTMLElement | null = null;

  constructor(rootQuery: HTMLElement) {
    if (Router.__instance) {
      return Router.__instance;
    }

    this._rootQuery = rootQuery;
    Router.__instance = this;
  }

  use(pathname: string, block: new (props: BlockProps) => Block<BlockProps>) {
    // console.log('use', pathname, block);
    if (!this._rootQuery) {
      throw new Error('Root query is not set');
    }
    const route = new Route(pathname, block, {rootQuery: this._rootQuery});
    // console.log('route', route);
    this.routes.push(route);
    return this;
  }

  start() {
    window.onpopstate = (event: PopStateEvent) => {
      this._onRoute((event.currentTarget as Window).location.pathname);
    };

    // Вызываем _onRoute для текущего пути при инициализации
    this._onRoute(window.location.pathname);
  }

  _onRoute(pathname: string) {
    const route = this.getRoute(pathname);
    if (!route) {
      return;
    }

    if (this._currentRoute) {
      this._currentRoute.leave();
    }

    this._currentRoute = route;
    route.render();
  }

  go(pathname: string) {
    this.history.pushState({}, '', pathname);
    this._onRoute(pathname);
  }

  back() {
    this.history.back();
  }

  forward() {
    this.history.forward();
  }

  getRoute(pathname: string) {
    return this.routes.find((route) => route.match(pathname));
  }
}
