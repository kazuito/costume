import { urlCheck } from "../utils";

function injectCSS(tabId: number, item: any, removeOnly: boolean) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: (item: any, removeOnly: boolean) => {
      const className = `costume-style-${item.id}`;

      // Remove CSS
      document.querySelectorAll(`.${className}`).forEach((elem) => {
        elem.remove();
      });
      if (removeOnly) return;

      // Inject CSS
      if (item.css.replace(/\s|\r|\n/g, "") === "") return;
      document
        .querySelector("head")
        ?.insertAdjacentHTML(
          "beforeend",
          `<style type="text/css" class="${className}">${item.css}</style>`
        );
    },
    args: [item, removeOnly],
  });
}

function injectJS(tabId: number, item: any, removeOnly: boolean) {
  chrome.scripting.executeScript({
    world: "MAIN",
    target: { tabId: tabId },
    func: (item: any, removeOnly: boolean) => {
      const className = `costume-script-${item.id}`;

      // Remove JS
      document.querySelectorAll(className).forEach((elem) => {
        elem.remove();
      });
      if (removeOnly) return;

      // Inject JS
      if (item.js.replace(/\s|\r|\n/g, "") === "") return;
      const scriptTag = document.createElement("script");
      scriptTag.innerHTML = item.js;
      scriptTag.setAttribute("class", className);
      scriptTag.setAttribute("type", "text/javascript");
      document.querySelector("body")?.appendChild(scriptTag);
    },
    args: [item, removeOnly],
  });
}

// On storage changed
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (!changes.items) return;
  chrome.storage.local.get(["state"], (data) => {
    if (data.state.lastTab === "js") return;
    chrome.tabs.query({ active: true }, (tabs) => {
      for (let tab of tabs) {
        let activeItemCount = 0;
        if (!tab.id || !tab.url) {
          console.log("out");
          continue;
        }
        for (let item of changes.items.newValue) {
          if (!item.removed && urlCheck(tab.url, item.url)) {
            activeItemCount++;
            // Inject CSS
            if (data.state.lastPage === item.id) {
              injectCSS(tab.id, item, false);
            }
          } else {
            // Remove CSS
            injectCSS(tab.id, item, true);
          }
        }
        setBadge(tab.id, activeItemCount);
      }
    });
  });
});

// On tab activated
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    chrome.storage.local.get(["items"], (data) => {
      let activeItemCount = 0;
      for (let item of data.items) {
        if (!item.removed && tab.url && urlCheck(tab.url, item.url) && tab.id) {
          // Inject CSS
          injectCSS(tab.id, item, false);
          activeItemCount++;
        } else if (tab.id) {
          // Remove CSS
          injectCSS(tab.id, item, true);
        }
      }
      setBadge(activeInfo.tabId, activeItemCount);
    });
  });
});

// On tab opened/reloaded
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  chrome.storage.local.get(["items"], (data) => {
    let activeItemCount = 0;
    for (let item of data.items) {
      if (!item.removed && tab.url && urlCheck(tab.url, item.url)) {
        activeItemCount++;
        if (changeInfo.status === "loading" && tab.status === "loading") {
          // Inject JS
          injectJS(tabId, item, false);
        }
        if (changeInfo.status === "loading" && tab.status === "loading") {
          if (item.css.replace(/\s|\r|\n/g, "") === "") return;
          // Initial CSS injection with chrome.scripting
          // This method is faster but inserted styles cannot be modified with Chrome DevTools,
          // so we re-inject them as Internal CSS with the codes below.
          chrome.scripting.insertCSS({
            target: { tabId: tabId },
            css: item.css,
          });
        } else if (
          changeInfo.status === "complete" &&
          tab.status === "complete"
        ) {
          // Re-inject CSS as Internal CSS
          injectCSS(tabId, item, false);
          chrome.scripting.removeCSS({
            target: { tabId: tabId },
            css: item.css,
          });
        }
      }
    }
    setBadge(tabId, activeItemCount);
  });
});

function setBadge(tabId: number, text: number | string) {
  if (String(text) === "0") {
    chrome.action.setBadgeText({
      tabId: tabId,
      text: "",
    });
  } else {
    chrome.action.setBadgeText({
      tabId: tabId,
      text: String(text),
    });
    chrome.action.setBadgeBackgroundColor({
      tabId: tabId,
      color: "#000",
    });
  }
}
