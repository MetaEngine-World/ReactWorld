(() => {
  const film = document.getElementById("wall-video");
  const toggle = document.getElementById("film-toggle");
  const mast = document.getElementById("top");
  const small = matchMedia("(max-width:680px)");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let pauseByChoice = reduced.matches || Boolean(navigator.connection?.saveData);
  let inView = true;

  function paint() {
    const paused = film.paused;
    toggle.firstElementChild.textContent = paused ? "▷" : "Ⅱ";
    toggle.setAttribute("aria-label", paused ? "Play background video" : "Pause background video");
    toggle.setAttribute("aria-pressed", String(paused));
  }
  function sync() {
    if (pauseByChoice || document.hidden || !inView) film.pause();
    else {
      const path = small.matches ? "film/tall.mp4" : "film/wide.mp4";
      if (film.getAttribute("src") !== path) {
        film.classList.remove("visible");
        film.src = path;
      }
      film.play().catch(paint);
    }
    paint();
  }
  film.addEventListener("playing", () => {film.classList.add("visible");paint();});
  film.addEventListener("pause", paint);
  film.addEventListener("error", () => {film.classList.remove("visible");paint();});
  toggle.addEventListener("click", () => {pauseByChoice = !film.paused;sync();});
  small.addEventListener("change", sync);
  reduced.addEventListener("change", () => {pauseByChoice = reduced.matches;sync();});
  document.addEventListener("visibilitychange", sync);
  new IntersectionObserver(entries => {inView=entries[0].isIntersecting;sync();}).observe(mast);
  new IntersectionObserver(entries => {document.body.classList.toggle("past-mast", !entries[0].isIntersecting);}, {rootMargin:"-62px 0px 0px"}).observe(mast);
  toggle.hidden=false;
  sync();
})();

(() => {
  const button = document.getElementById("nav-toggle");
  const navigation = document.getElementById("main-navigation");
  function setOpen(open) {
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  }
  button.addEventListener("click", () => setOpen(button.getAttribute("aria-expanded") !== "true"));
  navigation.addEventListener("click", () => setOpen(false));
  document.addEventListener("click", event => {
    if (!event.target.closest(".site-nav")) setOpen(false);
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      button.focus();
    }
  });
})();
