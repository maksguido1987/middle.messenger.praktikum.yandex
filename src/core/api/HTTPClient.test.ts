import {HTTPClient} from './HTTPClient';

describe('HTTPClient.transformDataToQueryString', () => {
  test('возвращает пустую строку для undefined', () => {
    expect(HTTPClient.transformDataToQueryString(undefined)).toBe('');
  });

  test('возвращает пустую строку для null', () => {
    expect(HTTPClient.transformDataToQueryString(null)).toBe('');
  });

  test('возвращает пустую строку для пустого объекта', () => {
    expect(HTTPClient.transformDataToQueryString({})).toBe('');
  });

  test('корректно сериализует простой объект', () => {
    expect(HTTPClient.transformDataToQueryString({a: 1, b: 'test'})).toBe('a=1&b=test');
  });

  test('корректно кодирует спецсимволы', () => {
    expect(HTTPClient.transformDataToQueryString({'a b': 'c&d', 'e/f': 'g=h'})).toBe(
      'a%20b=c%26d&e%2Ff=g%3Dh',
    );
  });

  test('корректно сериализует числа и булевы значения', () => {
    expect(HTTPClient.transformDataToQueryString({num: 42, bool: false})).toBe('num=42&bool=false');
  });

  test('корректно сериализует строку с пустым значением', () => {
    expect(HTTPClient.transformDataToQueryString({empty: ''})).toBe('empty=');
  });

  test('корректно сериализует если значение null', () => {
    expect(HTTPClient.transformDataToQueryString({a: null})).toBe('a=null');
  });

  test('корректно сериализует если значение undefined', () => {
    expect(HTTPClient.transformDataToQueryString({a: undefined})).toBe('a=undefined');
  });
});
