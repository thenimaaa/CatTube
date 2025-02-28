browser.browserAction.onClicked.addListener((tab) => {
  const url = new URL(tab.url);
  if ((url.hostname === "www.youtube.com" || url.hostname === "youtube.com") && url.pathname.includes("watch")) {
    const newUrl = url.href.replace(/(www\.)?youtube\.com/, "cattube.ir");
    browser.tabs.update(tab.id, { url: newUrl });
  }
});
