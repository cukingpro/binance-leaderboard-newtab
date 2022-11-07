'use strict';

// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

let clickedElement: HTMLElement | null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'open_trader_in_new_tab_active':
    case 'open_trader_in_new_tab':
      const name = getName();
      if (name) {
        sendResponse([name]);
      }
      break;

    case 'open_all_traders_in_new_tab':
      const names = getNames();
      if (names.length) {
        sendResponse(names);
        return true;
      }
      break;

    default:
      break;
  }
});

window.addEventListener('DOMContentLoaded', (event) => {
  document.addEventListener(
    'mousedown',
    (event) => {
      clickedElement = event.target as HTMLElement;
    },
    false
  );
});

function getName(): string | null | undefined {
  const traderCardElement = clickedElement?.closest('.TraderCard');
  const nameElement = traderCardElement?.querySelector('.name');
  const name = nameElement?.textContent;
  return name;
}

function getNames(): string[] {
  const nameElements = document.querySelectorAll('.TraderCard .name');
  const names = Array.from(nameElements)
    .map((element) => {
      return element.textContent;
    })
    .filter((value) => {
      return value !== null;
    }) as string[];
  return names;
}
