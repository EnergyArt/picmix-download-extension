alert("Расширение определило сайт");

async function loadHtmlSnippet() {
  try {
    const res = await fetch(chrome.runtime.getURL("resources/button.html"));
    return await res.text();
  }
  catch(error) {
    alert(`Оуууу... Ошибочка вышла!) ${error}`);
    return null;
  }
}

document.addEventListener("mouseover", async (event) => {
  const target = event.target.closest(".mk-stamp-preview");
  
  if (target && !target.dataset.extended) {
    // target.dataset.extended = "true";
    const button = await loadHtmlSnippet();

    const box = document.createElement("div");
    box.innerHTML = button;
    target.appendChild(box);

    target.addEventListener("mouseleave", () => {
      box.remove();
    }, { once: true });
  }
});