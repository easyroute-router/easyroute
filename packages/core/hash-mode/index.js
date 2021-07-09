const stripBase = (url, base) => (Boolean(base) ? url.replace(base, '') : url);

export default function setHashMode() {
  this.modeName = 'hash';
  this.changeUrl = function (url) {
    this.currentUrl = url;
    window.location.hash = url;
  };
  this.go = function (howFar) {
    window.history.go(howFar);
  };
  this.parseRoute(stripBase(window.location.hash, this.base) || '/');
  window.addEventListener('hashchange', () => {
    if (this.ignoreEvents) {
      this.ignoreEvents = false;
      return;
    }
    this.parseRoute(stripBase(window.location.hash, this.base));
  });
}
