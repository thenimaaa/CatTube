function initToggle() {
  browser.storage.local.get("enabled").then((result) => {
    if (typeof result.enabled === "undefined") {
      browser.storage.local.set({ enabled: true });
      document.getElementById("toggle").checked = true;
    } else {
      document.getElementById("toggle").checked = result.enabled;
    }
  });
}

document.getElementById("toggle").addEventListener("change", function() {
  const newState = this.checked;
  browser.storage.local.set({ enabled: newState });
});

initToggle();
