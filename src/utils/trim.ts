export const trim = (str: string, chars?: string) => {
  if (!chars) {
    return str.trim();
  }
  return str.replace(new RegExp(`^[${chars}]+|[${chars}]+$`, 'g'), '');
};
