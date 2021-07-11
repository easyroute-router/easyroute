export const stripBase = (url, base) =>
  Boolean(base) ? url.replace(base, '') : url;
