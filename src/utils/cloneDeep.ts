function cloneDeep<T extends object = object>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => cloneDeep(item as unknown as object)) as unknown as T;
  }

  const result = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (value && typeof value === 'object') {
        result[key] = cloneDeep(value as unknown as object) as unknown as T[Extract<
          keyof T,
          string
        >];
      } else {
        result[key] = value;
      }
    }
  }

  return result;
}

export default cloneDeep;
