import React from 'react';

/**
 * Duck typing the browser, pilfered and modified from
 * https://stackoverflow.com/a/9851769
 */
export const DetectBrowser = () => {
  const possibleBrowsers = [];

  // Opera 8.0+
  const isOpera =
    (!!window.opr && !!window.opr.addons) ||
    !!window.opera ||
    navigator.userAgent.indexOf(' OPR/') >= 0;
  if (isOpera) possibleBrowsers.push('Opera 8.0+');

  // Firefox 1.0+
  const isFirefox = typeof InstallTrigger !== 'undefined';
  if (isFirefox) possibleBrowsers.push('Firefox 1.0+');

  // Safari 3.0+ "[object HTMLElementConstructor]"
  const isSafari =
    /constructor/i.test(window.HTMLElement) ||
    (function (p) {
      return p.toString() === '[object SafariRemoteNotification]';
    }(!window.safari || (typeof window.safari !== 'undefined' && window.safari.pushNotification)));
  if (isSafari) possibleBrowsers.push('Safari 3.0+');

  // Internet Explorer 6-11
  const isIE = /* @cc_on!@ */ false || !!document.documentMode;
  if (isIE) possibleBrowsers.push('Internet Explorer 6-11');

  // Edge 20+
  const isEdge = !isIE && !!window.StyleMedia;
  if (isEdge) possibleBrowsers.push('Edge 20+');

  // Chrome 1+
  const isChrome = !!window.chrome && !!window.chrome.webstore;
  if (isChrome) possibleBrowsers.push('Chrome 1+');

  // Blink engine detection
  const isBlink = (isChrome || isOpera) && !!window.CSS;
  if (isBlink) possibleBrowsers.push('Blink Engine');

  let displayPossibleBrowsers = possibleBrowsers.join(', ');
  if (!displayPossibleBrowsers) {
    displayPossibleBrowsers = 'Unknown (failed browser ducktyping)';
  }
  return <span>{displayPossibleBrowsers}</span>;
};

export default DetectBrowser;
