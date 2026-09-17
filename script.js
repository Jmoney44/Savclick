/* =========================================================
   SAVCLICK — Homepage Interactions
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initDropdown();
  initConstructionModal();
  initDirectoryReveal();
  document.getElementById("year").textContent = new Date().getFullYear();
});

/* ---------- Mobile menu toggle ---------- */
function initMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close mobile menu when a plain link is clicked
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (e) => {
      if (!link.hasAttribute("data-construction")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  });
}

/* ---------- Departments dropdown (desktop + mobile) ---------- */
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
