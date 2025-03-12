let isEnabled = true;

function initExtensionStatus() {
  browser.storage.local.get("enabled").then((result) => {
    if (typeof result.enabled === "undefined") {
      isEnabled = true;
      browser.storage.local.set({ enabled: true });
      console.log("Background: No enabled status found. Setting default to true.");
    } else {
      isEnabled = result.enabled;
      console.log("Background: Enabled status loaded:", isEnabled);
    }
  });
}
initExtensionStatus();

browser.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.enabled) {
    isEnabled = changes.enabled.newValue;
    console.log("Background: Enabled status updated:", isEnabled);
  }
});

function checkAndRedirect(tabId, urlString) {
  try {
    const url = new URL(urlString);
    if (url.hostname.includes("cattube.ir")) {
      return;
    }
    if (!isEnabled) return;
    if (
      (url.hostname === "www.youtube.com" || url.hostname === "youtube.com") &&
      url.pathname.includes("watch")
    ) {
      const newUrl = url.href.replace(/(www\.)?youtube\.com/, "cattube.ir");
      browser.tabs.update(tabId, { url: newUrl });
    }
  } catch (e) {
    console.error("Background: Error while checking URL:", e);
  }
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    checkAndRedirect(tabId, changeInfo.url);
  }
});

browser.browserAction.onClicked.addListener((tab) => {
  checkAndRedirect(tab.id, tab.url);
});
