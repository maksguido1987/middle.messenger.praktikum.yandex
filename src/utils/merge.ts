type Indexed<T = unknown> = {
  [key in string]: T;
};

export const merge = (lhs: Indexed, rhs: Indexed): Indexed => {
  const isObject = (v: unknown): v is Record<string, unknown> =>
    typeof v === 'object' && !Array.isArray(v) && v !== null;

  for (const key in rhs) {
    if (Object.prototype.hasOwnProperty.call(rhs, key)) {
      if (isObject(lhs[key]) && isObject(rhs[key])) {
        lhs[key] = merge(lhs[key] as Indexed, rhs[key] as Indexed);
      } else {
        lhs[key] = rhs[key];
      }
    }
  }
  return lhs;
};
