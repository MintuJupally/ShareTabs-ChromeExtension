let tabs = [];
let timer = 1;
let previousName = "";
const loader = document.querySelector(".lds-ellipsis");

const copyAndSave = (url, temp, name, color) => {
  const el = document.createElement("textarea");
  el.value = url;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);

  chrome.storage.sync.get(["history"], (result) => {
    let hist;
    if (result.history === undefined) hist = [];
    else hist = [...result.history];

    let curr = { time: Date.now(), tabs: temp, name, url };
    hist.push(curr);

    chrome.storage.sync.set({ history: hist }, () => {
      bglog(hist);
    });
  });

  loader.style.display = "none";
  toggleButtons(false);
  toggleInput(false);
  showMessage("Copied to Clipboard", color);
};

document.getElementById("all-tabs").addEventListener("click", () => {
  toggleButtons(true);
  toggleInput(true);

  let temp = { tabs: [] };
  chrome.windows.getAll({ populate: true }, async (windows) => {
    windows.forEach((window) => {
      window.tabs.forEach((tab) => {
        if (tab.url.startsWith("http://") || tab.url.startsWith("https://"))
          temp.tabs.push(tab.url);
      });
    });

    if (temp.tabs.length === 0) return;

    temp.name = previousName;

    let status = document.getElementById("status");
    status.style.display = "none";

    if (timer !== 1) {
      clearTimeout(timer);
    }

    loader.style.display = "flex";
    // const url = "http://localhost:3000";
    const url = "https://sharetabs.herokuapp.com";
    await fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      referrerPolicy: "no-referrer",
      body: JSON.stringify(temp),
    })
      .then(async (res) => {
        const data = await res.json();
        return data.data;
      })
      .then((data) => {
        copyAndSave(
          url + "/" + previousName + "/" + data,
          temp.tabs,
          previousName,
          "rgb(163, 103, 188)"
        );
      });
  });
});

document
  .getElementById("current-window")
  .addEventListener("click", async () => {
    toggleButtons(true);
    toggleInput(true);

    let temp = { tabs: [] };
    chrome.windows.getCurrent({ populate: true }, async (window) => {
      window.tabs.forEach((tab) => {
        if (tab.url.startsWith("http://") || tab.url.startsWith("https://"))
          temp.tabs.push(tab.url);
      });

      if (temp.tabs.length === 0) return;
      temp.name = previousName;

      let status = document.getElementById("status");
      status.style.display = "none";

      if (timer !== 1) {
        clearTimeout(timer);
      }

      loader.style.display = "flex";
      // const url = "http://localhost:3000";
      const url = "https://sharetabs.herokuapp.com";
      await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        referrerPolicy: "no-referrer",
        body: JSON.stringify(temp),
      })
        .then(async (res) => {
          const data = await res.json();
          return data.data;
        })
        .then((data) => {
          copyAndSave(
            url + "/" + previousName + "/" + data,
            temp.tabs,
            previousName,
            "rgb(64, 152, 247)"
          );
        });
    });
  });

document.getElementById("history").addEventListener("click", () => {
  chrome.tabs.create({ url: "history.html" });
});

document.getElementById("name").addEventListener("input", (event) => {
  const el = document.getElementById("name");
  if (/^[a-zA-Z0-9.\-_]*$/.test(el.value) && el.value.length <= 20) {
    previousName = el.value;

    document.getElementById("count").innerText = el.value.length + "/20";

    if (el.value.length < 3) {
      toggleButtons(true);
    } else {
      toggleButtons(false);
    }
  } else el.value = previousName;
});

var bglog = function (obj) {
  if (chrome && chrome.runtime) {
    chrome.runtime.sendMessage({ type: "bglog", obj: obj });
  }
};

const showMessage = (msg, color) => {
  let status = document.getElementById("status");

  status.innerText = status.innerText !== msg ? msg : status.innerText;
  status.style.color = color;
  status.style.display = "block";

  timer = setTimeout(() => {
    status.style.display = "none";
  }, 3000);
};

const toggleButtons = (el) => {
  document.getElementById("current-window").disabled = el;
  document.getElementById("all-tabs").disabled = el;
};

const toggleInput = (el) => {
  document.getElementById("name").disabled = el;
};

toggleButtons(true);
