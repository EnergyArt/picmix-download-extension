stamps = null;

async function loadHtmlSnippet() {
  const res = await fetch(chrome.runtime.getURL("resources/button.html"));
  return await res.text();
}

const observer = new PerformanceObserver((list) => {
  targetUrl =  '/maker/get-stamps'
  for (const entry of list.getEntries()) {
    if (
      (entry.initiatorType === 'fetch' || entry.initiatorType === 'xmlhttprequest') &&
      entry.name.includes(targetUrl)
    ) {
      fetchData(entry.name);
    }
  }
});
observer.observe({ entryTypes: ['resource'] });

async function fetchData(url) {
  try {
    const response = await fetch(url, {
      method: 'GET', 
      headers: {}, 
    });
    const data = await response.json();
    stamps = data.stamps
  } 
  catch (error) {
    console.error('Ошибка при получении данных:', error);
  }
}

document.addEventListener("mouseover", async (event) => {
  const target = event.target.closest(".mk-stamp-preview");
  
  if (target && !target.dataset.extended) {
    const all = [...document.querySelectorAll(".mk-stamp-preview")];
    const stampIndex = all.indexOf(target);

    target.dataset.extended = "true";
    const button = await loadHtmlSnippet();

    target.insertAdjacentHTML("beforeend", button);
    const box = target.lastElementChild;

    const btn = box.querySelector("#mk-download-button");
    if (btn) {
      btn.addEventListener("click", () => {
        
        const gifData = {
          width: parseInt(stamps[stampIndex].width, 0),
          height: parseInt(stamps[stampIndex].height, 0),
          frames: stamps[stampIndex].srcNormal || '',
          frametimes: stamps[stampIndex].frameTimes || [],
          isAnimated: stamps[stampIndex].isAnimated,
        };
        getGif(gifData);
      });
    }

    target.addEventListener("mouseleave", () => {
      box.remove();
      delete target.dataset.extended;
    });
  }
});