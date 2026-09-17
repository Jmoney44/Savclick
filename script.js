/* =========================================================
   SAVCLICK — Homepage Interactions
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initDropdown();
  initConstructionModal();
  initDirectoryReveal();
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* ---------- Mobile slide-in menu ---------- */
function initMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const closeBtn = document.getElementById("navClose");
  const nav = document.getElementById("mainNav");
  const scrim = document.getElementById("navScrim");
  if (!toggle || !nav || !scrim) return;

  const openNav = () => {
    nav.classList.add("is-open");
    scrim.classList.add("is-visible");
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  const closeNav = () => {
    nav.classList.remove("is-open");
    scrim.classList.remove("is-visible");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  toggle.addEventListener("click", openNav);
  if (closeBtn) closeBtn.addEventListener("click", closeNav);
  scrim.addEventListener("click", closeNav);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  // Close the mobile panel when a plain (non-dropdown, non-construction) link is clicked
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (!link.hasAttribute("data-construction") && !link.classList.contains("dropdown-toggle")) {
        closeNav();
      }
    });
  });
}

/* ---------- Departments dropdown (desktop popover + mobile accordion) ---------- */
function initDropdown() {
  const wrapper = document.querySelector(".has-dropdown");
  const toggleBtn = document.getElementById("deptToggle");
  if (!wrapper || !toggleBtn) return;

  const setOpen = (open) => {
    wrapper.setAttribute("data-open", String(open));
    toggleBtn.setAttribute("aria-expanded", String(open));
  };

  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = wrapper.getAttribute("data-open") === "true";
    setOpen(!isOpen);
  });

  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}

/* ---------- "Under construction" modal for Travels / Properties ---------- */
function initConstructionModal() {
  const overlay = document.getElementById("modalOverlay");
  const deptLabel = document.getElementById("modalDept");
  const closeBtn = document.getElementById("modalClose");
  const okBtn = document.getElementById("modalOk");
  if (!overlay) return;

  const openModal = (deptName) => {
    deptLabel.textContent = deptName;
    overlay.classList.add("is-open");
  };
  const closeModal = () => overlay.classList.remove("is-open");

  document.querySelectorAll("[data-construction]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(link.getAttribute("data-construction"));
    });
  });

  closeBtn.addEventListener("click", closeModal);
  okBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

/* ---------- One-time reveal for the directory board ---------- */
function initDirectoryReveal() {
  const board = document.getElementById("board");
  if (!board) return;

  if (!("IntersectionObserver" in window)) {
    board.classList.add("is-visible");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          board.classList.add("is-visible");
          observer.disconnect();
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(board);
}
