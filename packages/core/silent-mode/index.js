function createSilentModeService() {
  const history = [];
  let currentHistoryPosition = 0;

  const go = (howFar) => {
    const goResult = currentHistoryPosition + howFar;
    const previousObject = history[goResult];
    if (previousObject) {
      currentHistoryPosition = goResult;
      return previousObject.fullPath || '';
    }
    return history[0].fullPath || '';
  };

  return {
    appendHistory(data) {
      if (Array.isArray(data)) {
        history.push(...data);
        currentHistoryPosition += data.length;
      } else {
        history.push(data);
        currentHistoryPosition++;
      }
    },
    go,
    back() {
      go(-1);
    }
  };
}

export default function setSilentMode() {
  this.silentControl = createSilentModeService();

  this.changeUrl = function (url, doPushState = true, toRouteInfo = undefined) {
    doPushState && this.silentControl.appendHistory(toRouteInfo);
  };

  this.go = function (howFar) {
    this.parseRoute(this.silentControl.go(howFar), false);
  };

  this.parseRoute(`${window.location.pathname}${window.location.search}`);
}
