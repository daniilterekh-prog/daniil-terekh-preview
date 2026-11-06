(function () {
  "use strict";
  const root = document.getElementById("case-film");
  if (!root) return;
  const video = document.getElementById("case-film-video");
  const start = document.getElementById("case-film-start");
  const status = document.getElementById("case-film-status");
  const original = document.getElementById("case-film-original");
  const source = "https://barn-estate.ru/upload/barnes.mp4";
  let version = 0,
    requested = false;

  function reset() {
    version++;
    requested = false;
    video.pause();
    if (video.hasAttribute("src")) {
      video.removeAttribute("src");
      video.load();
    }
    video.hidden = true;
    start.hidden = false;
    original.hidden = true;
    status.textContent = "";
    root.removeAttribute("aria-busy");
  }
  function failed() {
    if (!requested) return;
    requested = false;
    video.pause();
    video.hidden = true;
    start.hidden = false;
    status.textContent =
      "The film couldn’t load. Try again or open the original video.";
    original.hidden = false;
    root.removeAttribute("aria-busy");
    start.focus({ preventScroll: true });
  }
  start.addEventListener("click", async () => {
    const current = ++version;
    requested = true;
    start.hidden = true;
    video.hidden = false;
    original.hidden = true;
    status.textContent = "Loading film…";
    root.setAttribute("aria-busy", "true");
    video.setAttribute("poster", "assets/barnes-brand-film-poster.webp");
    video.setAttribute("src", source);
    video.focus({ preventScroll: true });
    try {
      await video.play();
    } catch {
      if (current === version) failed();
    }
  });
  video.addEventListener("playing", () => {
    if (!requested) return;
    status.textContent = "";
    root.removeAttribute("aria-busy");
  });
  video.addEventListener("error", failed);
  window.DTCaseFilm = {
    show(company) {
      reset();
      root.hidden = company !== "barnes";
    },
  };
})();
