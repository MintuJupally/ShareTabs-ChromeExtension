// let color = "#000000";

chrome.runtime.onInstalled.addListener(() => {
  // chrome.storage.sync.set({ color });
  // console.log("Default background color set to %cgreen", `color: ${color}`);
  console.log("Installed");
});

var onMessageListener = function (message, sender, sendResponse) {
  switch (message.type) {
    case "bglog":
      console.log(message.obj);
      break;
  }
  return true;
};

chrome.runtime.onMessage.addListener(onMessageListener);
