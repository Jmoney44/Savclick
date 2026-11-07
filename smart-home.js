/* =========================================================
   SAVCLICK Smart Home page — video carousel
   Each video plays for SLIDE_MS, then the next one starts.
   ========================================================= */

(() => {
  const SLIDE_MS = 6000; // how long each video shows before moving on

  const stage = document.getElementById("vcStage");
  if (!stage) return;

  const slides = [...stage.querySelectorAll(".vc-slide")];
  const segs = [...stage.querySelectorAll(".vc-seg")];
  const videos = slides.map((s) => s.querySelector("video"));
  const toggle = document.getElementById("vcToggle");
  const idxEl = document.getElementById("vcIndex");
  const titleEl = document.getElementById("vcSlideTitle");
  const descEl = document.getElementById("vcSlideDesc");

  let current = 0;
  let playing = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let inView = false;
  let elapsed = 0;   // ms shown of the current slide
  let lastTick = 0;
  let raf = 0;

  const pad = (n) => String(n).padStart(2, "0");

  function playVideo(v) {
    if (v.preload !== "auto") v.preload = "auto";
    const p = v.play();
    if (p && p.catch) p.catch(() => {}); // autoplay can be refused; the poster still shows
  }

  function show(i) {
    const prev = current;
    current = (i + slides.length) % slides.length;
    elapsed = 0;

    slides.forEach((s, k) => s.classList.toggle("is-active", k === current));
    segs.forEach((g, k) => {
      g.classList.toggle("is-active", k === current);
      g.classList.toggle("is-done", k < current);
      g.style.setProperty("--p", k < current ? 1 : 0);
    });

    if (prev !== current) {
      videos[prev].pause();
      videos[prev].currentTime = 0;
    }
    const s = slides[current];
    idxEl.textContent = pad(current + 1);
    titleEl.textContent = s.dataset.title;
    descEl.textContent = s.dataset.desc;

    if (inView && playing) playVideo(videos[current]);
    // Warm up the next video so it starts instantly
    const next = videos[(current + 1) % videos.length];
    if (next.preload === "none") next.preload = "metadata";
  }

  function tick(now) {
    if (playing && inView && !document.hidden) {
      elapsed += now - lastTick;
      segs[current].style.setProperty("--p", Math.min(elapsed / SLIDE_MS, 1));
      if (elapsed >= SLIDE_MS) show(current + 1);
    }
    lastTick = now;
    raf = requestAnimationFrame(tick);
  }

  function setPlaying(on) {
    playing = on;
    stage.closest(".vc-section").classList.toggle("is-paused", !on);
    toggle.setAttribute("aria-label", on ? "Pause slideshow" : "Play slideshow");
    if (on && inView) playVideo(videos[current]);
    else videos[current].pause();
  }

  document.getElementById("vcPrev").addEventListener("click", () => show(current - 1));
  document.getElementById("vcNext").addEventListener("click", () => show(current + 1));
  toggle.addEventListener("click", () => setPlaying(!playing));
  segs.forEach((g) => g.addEventListener("click", () => show(Number(g.dataset.go))));

  // Swipe on touch screens
  let x0 = null;
  stage.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) show(current + (dx < 0 ? 1 : -1));
    x0 = null;
  });

  // Only play (and download) while the carousel is on screen
  const onView = (visible) => {
    inView = visible;
    if (visible && playing) playVideo(videos[current]);
    else videos[current].pause();
  };
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => onView(entries[0].isIntersecting), { threshold: 0.25 }).observe(stage);
  } else {
    onView(true);
  }

  setPlaying(playing);
  show(0);
  lastTick = performance.now();
  raf = requestAnimationFrame(tick);
})();
