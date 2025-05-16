import {Router} from './Router';
import {Block} from '../block/Block';

class MockBlock extends Block {
  getContent = jest.fn(() => document.createElement('div'));
  componentWillUnmount = jest.fn();
}

describe('Router', () => {
  let root: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    root = document.getElementById('app')!;
  });

  test('use добавляет роут', () => {
    const router = new Router(root);
    router.use('/test', MockBlock, {});
    expect(router['routes'].length).toBe(1);
  });

  test('getRoute возвращает нужный роут', () => {
    const router = new Router(root);
    router.use('/foo', MockBlock, {});
    expect(router.getRoute('/foo')).toBeDefined();
    expect(router.getRoute('/bar')).toBeUndefined();
  });

  test('go вызывает _onRoute и меняет url', () => {
    const router = new Router(root);
    router.use('/go', MockBlock, {});
    const spy = jest.spyOn(router, '_onRoute');
    router.go('/go');
    expect(spy).toHaveBeenCalledWith('/go');
    spy.mockRestore();
  });

  test('setNotFound задаёт notFoundRoute', () => {
    const router = new Router(root);
    router.setNotFound(MockBlock, {});
    expect(router['notFoundRoute']).toBeDefined();
  });
});
