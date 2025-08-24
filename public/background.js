// public/background.js
self.addEventListener('install', () => console.log('Ext instalada (Firefox)'));

browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.set({ installedAt: Date.now() });
});

browser.runtime.onMessage.addListener((msg) => {
  if (msg?.ping) return Promise.resolve({ pong: true, vendor: 'firefox' });
});
