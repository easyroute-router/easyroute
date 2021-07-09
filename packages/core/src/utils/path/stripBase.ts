export const stripBase = (url: string, base: string) =>
  Boolean(base) ? url.replace(base, '') : url;
