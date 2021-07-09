/**
 * All credits goes to Vue Router
 * https://github.com/vuejs/vue-router/blob/dev/src/util/query.js
 */
import { ParsedQueryObject } from '../../types';

function decode(str: string) {
  try {
    return decodeURIComponent(str);
  } catch (err) {
    console.warn(`[Easyroute] Could not decode query string: ${str}`);
  }
  return str;
}

function parseQuery(query: string) {
  const res: ParsedQueryObject = {};
  if (typeof query !== 'string') return res;

  query = query.trim().replace(/^(\?|#|&)/, '');

  if (!query) {
    return res;
  }

  query.split('&').forEach((param) => {
    const parts: string[] = param.replace(/\+/g, ' ').split('=');
    const key: string = decode(parts.shift() as string);
    const val = parts.length > 0 ? decode(parts.join('=')) : null;

    if (res[key] === undefined) {
      res[key] = val;
    } else if (Array.isArray(res[key])) {
      val !== null && (res[key] as string[]).push(val);
    } else {
      if (val !== null) {
        res[key] = [res[key] as string, val];
      }
    }
  });

  return res;
}

export { parseQuery };
