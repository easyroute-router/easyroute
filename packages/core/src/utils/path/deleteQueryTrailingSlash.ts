export const deleteQueryTrailingSlash = (url: string) =>
  url.replace(/(\/\?)/, '?');
