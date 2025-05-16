import {Block} from './Block';

describe('Block', () => {
  class TestBlock extends Block {
    render() {
      return '<div class="test-block">{{text}}</div>';
    }
  }

  test('рендерит текст в шаблоне', () => {
    const block = new TestBlock({attributes: {text: 'hello'}});
    document.body.append(block.getContent() as Node);
    expect(document.body.innerHTML).toContain('hello');
  });

  test('рендерит элемент с классом test-block', () => {
    const block = new TestBlock({attributes: {text: 'hello'}});
    document.body.append(block.getContent() as Node);
    expect(document.querySelector('.test-block')).not.toBeNull();
  });

  test('setState обновляет state и вызывает перерендер (DOM)', () => {
    class StateBlock extends Block {
      render() {
        return `<div>${this['state'].text}</div>`;
      }
    }
    const block = new StateBlock({state: {text: 'one'}});
    document.body.append(block.getContent() as Node);
    block.setState({text: 'two'});
    expect(document.body.innerHTML).toContain('two');
  });

  test('setAttributes обновляет attributes', () => {
    class AttrBlock extends Block {
      render() {
        return `<div>${this['attributes'].text}</div>`;
      }
    }
    const block = new AttrBlock({attributes: {text: 'foo'}});
    block.setAttributes({text: 'bar'});
    expect(block['attributes'].text).toBe('bar');
  });

  test('addToListItem добавляет элемент в список', () => {
    const block = new TestBlock();
    block.addToListItem('items', 'item1');
    expect(block['list'].items).toContain('item1');
  });

  test('setChildrenProps обновляет props дочерних блоков', () => {
    class Child extends Block {
      render() {
        return '<span>{{value}}</span>';
      }
    }
    const child = new Child({attributes: {value: 'old'}});
    const block = new TestBlock({children: {child}});
    block.setChildrenProps({child: {value: 'new'}});
    expect(child['attributes'].value).toBe('new');
  });

  test('subscribe подписывает на событие', () => {
    const block = new TestBlock();
    const cb = jest.fn();
    block.subscribe('custom', cb);
    // @ts-expect-error тестируем приватный eventBus для покрытия
    block.eventBus().emit('custom', 123);
    expect(cb).toHaveBeenCalledWith(123);
  });
});
