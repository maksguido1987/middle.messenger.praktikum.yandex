export function omit<T extends object>(obj: T, fields: (keyof T)[]) {
  const result = {...obj};
  fields.forEach((field) => {
    delete result[field];
  });
  return result;
}
