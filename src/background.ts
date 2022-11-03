'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

chrome.runtime.onInstalled.addListener((details) => {
  chrome.contextMenus.create({
    title: 'Open trader in new tab - Active',
    id: 'open_trader_in_new_tab_active',
    contexts: ['all'],
  });
  chrome.contextMenus.create({
    title: 'Open trader in new tab',
    id: 'open_trader_in_new_tab',
    contexts: ['all'],
  });
  chrome.contextMenus.create({
    title: 'Open all traders in new tab',
    id: 'open_all_traders_in_new_tab',
    contexts: ['all'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (tab?.id) {
    let message = {
      type: info.menuItemId,
    };
    chrome.tabs.sendMessage(tab.id, message, (names: string[]) => {
      handleOpenInNewTab(
        names,
        info.menuItemId === 'open_trader_in_new_tab_active'
      );
    });
  }
});

async function getId(name: string): Promise<string> {
  const response = await fetch(
    'https://www.binance.com/bapi/futures/v1/public/future/leaderboard/searchNickname',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nickname: name,
      }),
    }
  );
  const json = await response.json();
  return json['data'][0]['encryptedUid'];
}

function openInNewTab(id: string, active: boolean) {
  chrome.tabs.create({
    url: `https://www.binance.com/en/futures-activity/leaderboard/user?encryptedUid=${id}`,
    active: active,
  });
}

async function handleOpenInNewTab(names: string[], active: boolean) {
  for (const name of names) {
    const id = await getId(name);
    openInNewTab(id, active);
  }
}
