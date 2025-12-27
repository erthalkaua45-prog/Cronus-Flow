(() => {
  if (window.__CRONUS_FLOW_LOADED__) {
    const existing = document.getElementById('cronus-flow-sidebar');
    if (existing) {
      existing.remove();
    }
    return;
  }

  window.__CRONUS_FLOW_LOADED__ = true;

  const IS_LOCAL = true;

  const SIDEBAR_ID = 'cronus-flow-sidebar';
  const API_URL = IS_LOCAL
    ? 'http://localhost:3000/v1/analyze'
    : 'https://api.cronusflow.com/v1/analyze';

  const API_KEY = 'cf_demo_key';

  function toggleSidebar() {
    const iframe = document.createElement('iframe');
    iframe.id = SIDEBAR_ID;
    iframe.src = chrome.runtime.getURL('sidebar.html');
    iframe.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      width: 25%;
      height: 100vh;
      z-index: 9999;
      border: none;
      background: #fff;
    `;

    document.body.appendChild(iframe);
  }

  toggleSidebar();
})();
