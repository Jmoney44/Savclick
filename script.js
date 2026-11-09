/* =========================================================
   SAVCLICK — Homepage Interactions
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initDropdown();
  initConstructionModal();
  initDirectoryReveal();
  initContactForm();
  initPortfolioFilter();
  initReservationForm();
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

/* ---------- Contact form: validation + send ----------
   Sends through FormSubmit (formsubmit.co) to CONTACT_EMAIL. The first message
   triggers a one-time activation email to that address; confirm it once. */
function initContactForm() {
  const form = document.getElementById("contactForm");
  const successPanel = document.getElementById("formSuccess");
  const resetBtn = document.getElementById("formReset");
  if (!form) return;
  const CONTACT_EMAIL = "support@savclick.com";
  const sendError = document.getElementById("formSendError");
  const submitBtn = form.querySelector('button[type="submit"]');
  const submitLabel = submitBtn ? submitBtn.textContent : "";

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const setFieldState = (fieldEl, valid) => {
    const wrapper = fieldEl.closest(".field");
    if (!wrapper) return;
    wrapper.classList.toggle("has-error", !valid);
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let allValid = true;

    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const department = document.getElementById("department");
    const message = document.getElementById("message");

    const nameValid = fullName.value.trim().length > 1;
    setFieldState(fullName, nameValid);
    if (!nameValid) allValid = false;

    const emailValid = isValidEmail(email.value.trim());
    setFieldState(email, emailValid);
    if (!emailValid) allValid = false;

    const deptValid = department.value !== "";
    setFieldState(department, deptValid);
    if (!deptValid) allValid = false;

    const messageValid = message.value.trim().length > 4;
    setFieldState(message, messageValid);
    if (!messageValid) allValid = false;

    if (!allValid) {
      const firstError = form.querySelector(".has-error input, .has-error select, .has-error textarea");
      if (firstError) firstError.focus();
      return;
    }

    // Spam trap: real visitors never fill the hidden field
    const honey = form.querySelector('input[name="_honey"]');
    if (honey && honey.value) return;

    const phone = document.getElementById("phone");
    const payload = {
      Name: fullName.value.trim(),
      email: email.value.trim(),
      Phone: phone ? phone.value.trim() || "-" : "-",
      Department: department.options[department.selectedIndex].text,
      Message: message.value.trim(),
      _subject: "New message from the SAVCLICK website (" + department.value + ")",
      _template: "table",
      _captcha: "false",
    };

    if (sendError) sendError.hidden = true;
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending…"; }

    fetch("https://formsubmit.co/ajax/" + CONTACT_EMAIL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok || String(data.success) !== "true") throw new Error(data.message || "Send failed");
        form.hidden = true;
        if (successPanel) successPanel.hidden = false;
      })
      .catch(() => {
        if (sendError) sendError.hidden = false;
      })
      .finally(() => {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitLabel; }
      });
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      form.reset();
      form.querySelectorAll(".field.has-error").forEach((f) => f.classList.remove("has-error"));
      form.hidden = false;
      if (successPanel) successPanel.hidden = true;
    });
  }
}
/* ---------- Portfolio filter (SAVCLICK Digitex) ---------- */
function initPortfolioFilter() {
  const tabs = document.querySelectorAll(".pf-tab");
  if (!tabs.length) return;
  const items = document.querySelectorAll(".pf-item");
  const empty = document.getElementById("pfEmpty");

  const apply = (filter) => {
    tabs.forEach((tab) => {
      const on = tab.dataset.filter === filter;
      tab.classList.toggle("is-active", on);
      tab.setAttribute("aria-pressed", String(on));
    });
    let shown = 0;
    items.forEach((item) => {
      const match = filter === "all" || item.dataset.service === filter;
      item.hidden = !match;
      if (match) shown++;
    });
    if (empty) empty.hidden = shown > 0;
  };

  tabs.forEach((tab) => tab.addEventListener("click", () => apply(tab.dataset.filter)));

  // "See our work" links in the service cards jump down and pre-select a filter
  document.querySelectorAll("[data-pf-jump]").forEach((link) => {
    link.addEventListener("click", () => apply(link.dataset.pfJump));
  });
}

/* ---------- Training reservation form (SAVCLICK Academy) ----------
   No backend: on submit it opens the visitor's email app with a prefilled
   message. Change RESERVE_EMAIL to route requests elsewhere. */
function initReservationForm() {
  const form = document.getElementById("reserveForm");
  if (!form) return;
  const RESERVE_EMAIL = "support@savclick.com";
  const success = document.getElementById("reserveSuccess");
  const resetBtn = document.getElementById("reserveReset");
  const course = document.getElementById("rCourse");

  // "Reserve" links elsewhere on the page preselect their course
  document.querySelectorAll("[data-course]").forEach((link) => {
    link.addEventListener("click", () => {
      const match = [...course.options].find((o) => o.value === link.dataset.course);
      if (match) course.value = match.value;
    });
  });

  const field = (id) => document.getElementById(id);
  const mark = (el, ok) => el.closest(".field").classList.toggle("has-error", !ok);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = field("rName"), phone = field("rPhone"), email = field("rEmail");
    const format = field("rFormat"), start = field("rStart"), message = field("rMessage");

    const checks = [
      [name, name.value.trim().length > 1],
      [phone, phone.value.replace(/\D/g, "").length >= 7],
      [email, email.value.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())],
      [course, course.value !== ""],
      [format, format.value !== ""],
    ];
    checks.forEach(([el, ok]) => mark(el, ok));
    const firstBad = checks.find(([, ok]) => !ok);
    if (firstBad) { firstBad[0].focus(); return; }

    const body = [
      "Hello SAVCLICK Academy, I'd like to reserve a training.",
      "",
      "Name: " + name.value.trim(),
      "Phone / WhatsApp: " + phone.value.trim(),
      "Email: " + (email.value.trim() || "-"),
      "Course: " + course.value,
      "Format: " + format.value,
      "Preferred start date: " + (start.value || "Flexible"),
      "",
      message.value.trim(),
    ].join("\n");

    window.location.href = "mailto:" + RESERVE_EMAIL +
      "?subject=" + encodeURIComponent("Training reservation: " + course.value) +
      "&body=" + encodeURIComponent(body);

    form.hidden = true;
    if (success) success.hidden = false;
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      form.reset();
      form.querySelectorAll(".field.has-error").forEach((f) => f.classList.remove("has-error"));
      form.hidden = false;
      success.hidden = true;
    });
  }
}
