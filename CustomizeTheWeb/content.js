chrome.storage.sync.get("customCSS", (data) => {
  if (data.customCSS) {
    applyCustomCSS(data.customCSS);
  }
});

function applyCustomCSS(customCSS) {
  const style = document.createElement("style");
  style.textContent = customCSS;
  document.head.append(style);
}


function storeOriginalCSS() {
  const allStyleElements = document.getElementsByTagName("style");
  const originalStyles = Array.from(allStyleElements).map((styleEl) => ({
    el: styleEl,
    content: styleEl.innerHTML,
  }));

  const allLinkElements = document.getElementsByTagName("link");
  const originalLinks = Array.from(allLinkElements).map((linkEl) => ({
    el: linkEl,
    href: linkEl.href,
  }));

  return { originalStyles, originalLinks };
}

function applyCustomCSS(customCSS) {
  const customStyleElement = document.createElement("style");
  customStyleElement.id = "chrome-extension-custom-style";
  customStyleElement.textContent = customCSS;
  document.head.append(customStyleElement);

  // Store the original CSS rules before applying custom CSS
  const originalCSS = storeOriginalCSS();
  window.localStorage.setItem("originalCSS", JSON.stringify(originalCSS));
}
