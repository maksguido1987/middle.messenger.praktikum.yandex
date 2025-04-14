function isEqual(a: object, b: object): boolean {
  // Проверка на null и undefined
  if (a === null || b === null || a === undefined || b === undefined) {
    return a === b;
  }

  // Проверка на примитивы
  if (typeof a !== 'object' || typeof b !== 'object') {
    return a === b;
  }

  // Получаем ключи объектов
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  // Проверка количества ключей
  if (keysA.length !== keysB.length) {
    return false;
  }

  // Рекурсивное сравнение значений
  for (const key of keysA) {
    if (!keysB.includes(key)) {
      return false;
    }

    const valueA = (a as Record<string, unknown>)[key];
    const valueB = (b as Record<string, unknown>)[key];

    // Рекурсивное сравнение для вложенных объектов
    if (typeof valueA === 'object' && typeof valueB === 'object') {
      if (!isEqual(valueA as object, valueB as object)) {
        return false;
      }
    } else if (valueA !== valueB) {
      return false;
    }
  }

  return true;
}

export default isEqual;

const a = {a: 1};
const b = {a: 1};
console.log(isEqual(a, b)); // true
