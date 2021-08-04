chrome.storage.sync.get(["history"], (result) => {
  const data = result.history;

  if (data === undefined) return;

  if (data.length > 0) {
    document.getElementById("clr-history").style.display = "flex";
    document.getElementById("no-content").style.display = "none";
  }

  let content = document.getElementById("content");

  data
    .sort((a, b) => {
      return b.time - a.time;
    })
    .forEach((el) => {
      let div = document.createElement("div");
      div.classList.add("col-sm-12", "col-md-5", "custom-card");

      let p1 = document.createElement("p");
      p1.classList.add("url");
      p1.setAttribute("url", el.url);
      // p1.innerHTML =
      //   "<b>" +
      //   el.name +
      //   "</b>" +
      //   " - " +
      //   el.url.split("/")[el.url.split("/").length - 1];
      p1.innerText = el.name;
      div.appendChild(p1);

      let ul = document.createElement("ul");
      ul.classList.add("tabs");
      el.tabs.forEach((link) => {
        let li = document.createElement("li");
        let a = document.createElement("a");
        var lnk = document.createTextNode(link);
        a.appendChild(lnk);
        a.title = link;
        a.href = link;
        a.setAttribute("target", "_blank");
        li.appendChild(a);
        ul.appendChild(li);
      });
      div.appendChild(ul);

      let p2 = document.createElement("p");
      let it = document.createElement("i");
      p2.classList.add("time");
      it.setAttribute("time", el.time);
      it.innerText = analyseTime(el.time);
      p2.appendChild(it);
      div.appendChild(p2);

      content.appendChild(div);
    });
});

document.addEventListener("click", (event) => {
  let elem = event.target;
  if (elem.id === "clr-history") {
    let res = confirm("Confirm Clear History");
    if (res) {
      chrome.storage.sync.set({ history: [] });
      window.location.reload();
    }
    return;
  }
  if (!elem.classList.contains("url")) return;
  const url = elem.getAttribute("url");
  const el = document.createElement("textarea");
  el.value = url;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  alert("URL Copied to Clipboard");
});

document.addEventListener("mouseover", (event) => {
  let elem = event.target;
  if (!elem.getAttribute("time")) return;
  const date = new Date(parseInt(elem.getAttribute("time")));
  elem.innerText = date.toLocaleDateString();
});

document.addEventListener("mouseout", (event) => {
  let elem = event.target;
  if (!elem.getAttribute("time")) return;
  const date = new Date(parseInt(elem.getAttribute("time")));
  elem.innerText = analyseTime(date);
});

const analyseTime = (time) => {
  let length = (new Date().getTime() - new Date(time).getTime()) / 1000;

  if (length < 60) return `just now`;
  if (length < 120) return `a min ago`;
  length = length / 60;

  if (length < 60) return `${parseInt(length)} mins ago`;
  length = length / 60;

  if (length < 2) return `an hour ago`;
  if (length < 24) return `${parseInt(length)} hours ago`;
  length = length / 24;

  if (length < 2) return `a day ago`;
  if (length < 31) return `${parseInt(length)} days ago`;
  length = length / 30.5;

  if (length < 2) return `a month ago`;
  if (length < 12) return `${parseInt(length)} months ago`;
  length = length / 12;

  if (length < 2) return `an year ago`;

  return `${parseInt(length)} years ago`;
};

var bglog = function (obj) {
  if (chrome && chrome.runtime) {
    chrome.runtime.sendMessage({ type: "bglog", obj: obj });
  }
};
