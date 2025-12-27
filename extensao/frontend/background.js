chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id || !tab.url) return;

  if (!tab.url.includes('web.whatsapp.com')) return;

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['contentScript.js']
  });
});
