import { isBrowser } from '../lib/utils';

const stripBase = (url, base) => (Boolean(base) ? url.replace(base, '') : url);
const deleteLastSlash = (url) => url.replace(/\/$/, '');
const SSR = !isBrowser();

export default function setHistoryMode() {
  this.changeUrl = function (url, doPushState = true) {
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
  this.go = function (howFar) {
    window.history.go(howFar);
  };
  this.parseRoute(
    stripBase(
      `${deleteLastSlash(window.location.pathname)}/${window.location.search}`,
      this.base
    ),
    true
  );
  window.addEventListener('popstate', (ev) => {
    ev.state
      ? this.parseRoute(stripBase(ev.state.url, this.base), false)
      : this.parseRoute('/', false);
  });
}
