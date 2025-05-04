import {BlockProps} from '../global-types';
import {Block} from './Block';
import {Route} from './Route';

export class Router {
  private static __instance: Router;
  private routes: Route<BlockProps>[] = [];
  private history: History = window.history;
  private _currentRoute: Route<BlockProps> | null = null;
  private _rootQuery: HTMLElement | null = null;
  private notFoundRoute: Route<BlockProps> | null = null;

  constructor(rootQuery?: HTMLElement) {
    if (Router.__instance) {
      return Router.__instance;
    }

    if (rootQuery) {
      this._rootQuery = rootQuery;
    }

    Router.__instance = this;
  }

  use<T extends BlockProps>(
    pathname: string,
    block: new (props: T) => Block<T>,
    componentProps: T,
  ) {
    if (!this._rootQuery) {
      throw new Error('Root query is not set');
    }
    const route = new Route<T>(pathname, block, {rootQuery: this._rootQuery}, componentProps);
    this.routes.push(route as unknown as Route<BlockProps>);
    return this;
  }

  start() {
    window.onpopstate = (event: PopStateEvent) => {
      this._onRoute((event.currentTarget as Window).location.pathname);
    };

    this._onRoute(window.location.pathname);
  }

  _onRoute(pathname: string) {
    // Очищаем pathname от query-параметров
    const cleanPathname = pathname.split('?')[0];
    const route = this.getRoute(cleanPathname);
    if (!route) {
      if (this.notFoundRoute) {
        if (this._currentRoute) {
          this._currentRoute.leave();
        }
        this._currentRoute = this.notFoundRoute;
        this.notFoundRoute.render();
      }
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
    window.dispatchEvent(new PopStateEvent('popstate'));
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

  setNotFound<T extends BlockProps>(block: new (props: T) => Block<T>, componentProps: T) {
    if (!this._rootQuery) {
      throw new Error('Root query is not set');
    }
    this.notFoundRoute = new Route<T>(
      '*',
      block,
      {rootQuery: this._rootQuery},
      componentProps,
    ) as unknown as Route<BlockProps>;
    return this;
  }
}
