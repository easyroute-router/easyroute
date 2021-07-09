import { deleteLastSlash } from './deleteLastSlash';
import { deleteFirstSlash } from './deleteFirstSlash';
import { deleteQueryTrailingSlash } from './deleteQueryTrailingSlash';

export function constructUrl(url: string, base: string, omitTrailing = false) {
  omitTrailing &&
    url.split('?')[0].length > 1 &&
    (url = deleteQueryTrailingSlash(deleteLastSlash(url)));
  if (!base || url.includes(base)) return url;
  return `/${deleteLastSlash(base)}/${deleteFirstSlash(url)}`;
}
