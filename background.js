chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  const url = changeInfo.url || tab.url
  if (
          url.match(/localhost/) ||
          url.match(/ratings.tankionline.com/) ||
          url.match(/ratings.3dtank.com/)
          ) {
    chrome.pageAction.show(tabId);
  }
});

chrome.pageAction.onClicked.addListener(function (tab) {
  chrome.tabs.executeScript(null, {code: "$('#js-overlay_wrapper').trigger('init');"});
});