type Indexed<T = unknown> = {
  [key in string]: T;
};

export const set = (object: Indexed | unknown, path: string, value: unknown): Indexed | unknown => {
  if (typeof path !== 'string') {
    throw new Error('path must be string');
  }
  if (typeof object !== 'object' || object === null) {
    return object;
  }

  const keys = path.split('.');
  const stack: {obj: Indexed; key: string}[] = [];
  let currentObj = object as Indexed;

  // Создаем стек объектов и ключей
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in currentObj) || typeof currentObj[key] !== 'object' || currentObj[key] === null) {
      currentObj[key] = {};
    }
    stack.push({obj: currentObj, key});
    currentObj = currentObj[key] as Indexed;
  }

  // Устанавливаем значение в последний ключ
  const lastKey = keys[keys.length - 1];
  currentObj[lastKey] = value;

  return object;
};
