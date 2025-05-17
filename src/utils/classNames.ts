type ClassName = string | number | undefined | null | {[key: string]: boolean} | ClassName[];

export function classNames(...args: ClassName[]): string {
  const result: string[] = [];

  const process = (item: ClassName): void => {
    if (!item && item !== 0) return;
    if (typeof item === 'string' || typeof item === 'number') {
      if (item) result.push(String(item));
      return;
    }
    if (Array.isArray(item)) {
      item.forEach(process);
      return;
    }
    if (typeof item === 'object') {
      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key) && item[key]) {
          result.push(key);
        }
      }
    }
  };

  args.forEach(process);
  return result.join(' ');
}
