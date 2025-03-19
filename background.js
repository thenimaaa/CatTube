"use strict";

function initExtensionStatus() {
  return browser.storage.local.get("enabled")
    .then((result) => {
      if (typeof result.enabled === "undefined") {
        return browser.storage.local.set({ enabled: true })
          .then(() => true);
      } else {
        return result.enabled;
      }
    })
    .catch(() => true);
}

function checkAndRedirect(tabId, urlString) {
  try {
    const url = new URL(urlString);

    if (url.hostname.includes("cattube.ir")) {
      return;
    }

    if (url.hostname.includes("youtube.com") && url.pathname.includes("watch")) {
      const newUrl = url.href.replace(/^(https?:\/\/)(m\.)?(www\.)?youtube\.com/, "$1cattube.ir");
      browser.tabs.update(tabId, { url: newUrl })
        .catch(() => {});
    }
  } catch (e) {
  }
}

initExtensionStatus().then(() => {
  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
      browser.storage.local.get("enabled").then((data) => {
        if (data.enabled) {
          checkAndRedirect(tabId, changeInfo.url);
        }
      }).catch(() => {});
    }
  });

  browser.browserAction.onClicked.addListener((tab) => {
    browser.storage.local.get("enabled").then((data) => {
      if (data.enabled) {
        checkAndRedirect(tab.id, tab.url);
      }
    }).catch(() => {});
  });
});

browser.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.enabled) {
  }
});
