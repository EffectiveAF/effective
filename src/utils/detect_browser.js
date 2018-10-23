function isChromium() {
  const pdfViewer = 'Chromium PDF Viewer';
  for (let i = 0; i < navigator.plugins.length; i++) {
    if (navigator.plugins[i].name === pdfViewer) {
      return true;
    }
    return false;
  }
}

if (!window.browser) {
  const ua = navigator.userAgent;
  const browsers = ['Safari', 'MSIE', 'Firefox'];
  for (var i = 0; i < browsers.length; i++) {
    if (ua.indexOf(browsers[i]) > -1) {
      window.browser = browsers[i];
      break;
    }
  }
  let Chrome = ua.indexOf('Chrome') > -1;
  if (window.browser === 'Safari' && Chrome) {
    window.browser = 'Chrome';
    if (isChromium()) {
      window.browserIsChromium = true;
    }
  }
}
