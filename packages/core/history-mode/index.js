import { isBrowser } from '../utils/isBrowser';
import { stripBase } from '../utils/stripBase';
import { deleteLastSlash } from '../utils/deleteLastSlash';
const SSR = !isBrowser();

export default function setHistoryMode() {
  this.modeName = 'history';
  this.changeUrl = function (
    url,
    doPushState = true,
    toRouteInfo = undefined,
    replace = false
  ) {
    if (replace) {
      return !SSR && window.history.replaceState({ url }, url, url);
    }
    doPushState &&
      !SSR &&
      window.history.pushState(
        {
          url
        },
        url,
        url
      );
  };
  this.replace = (url) => {
    this.parseRoute(url, true, true);
  };
  this.go = function (howFar) {
    window.history.go(howFar);
  };
  if (SSR) return;
  Promise.resolve().then(() => {
    this.parseRoute(
      stripBase(
        `${deleteLastSlash(window.location.pathname)}/${
          window.location.search
        }`,
        this.base
      ),
      true
    );
  });
  window.addEventListener('popstate', (ev) => {
    ev.state
      ? this.parseRoute(stripBase(ev.state.url, this.base), false)
      : this.parseRoute('/', false);
  });
}
