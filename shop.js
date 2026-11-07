/* =========================================================
   SAVCLICK Shop — search, category filter, pagination, product popup
   Products come from products.js (SHOP_PRODUCTS).
   ========================================================= */

(() => {
  // WhatsApp number that receives purchase messages (international format, digits only)
  const WHATSAPP_NUMBER = "2348139552920";
  const PER_PAGE = 20;

  const products = (typeof SHOP_PRODUCTS !== "undefined" ? SHOP_PRODUCTS : []).map((p, i) => ({ ...p, id: i }));

  const els = {
    search: document.getElementById("shopSearch"),
    clear: document.getElementById("shopClear"),
    chips: document.getElementById("shopChips"),
    grid: document.getElementById("shopGrid"),
    count: document.getElementById("shopCount"),
    empty: document.getElementById("shopEmpty"),
    pager: document.getElementById("shopPager"),
    top: document.getElementById("shopTop"),
    overlay: document.getElementById("productOverlay"),
    pTitle: document.getElementById("productTitle"),
    pCat: document.getElementById("productCategory"),
    pPrice: document.getElementById("productPrice"),
    pDesc: document.getElementById("productDesc"),
    pSpecs: document.getElementById("productSpecs"),
    pMedia: document.getElementById("productMedia"),
    pBuy: document.getElementById("productBuy"),
    pClose: document.getElementById("productClose"),
  };
  if (!els.grid) return;

  const state = { query: "", category: "All", page: 1 };

  // Allow links like shop.html?category=Smart%20Home or shop.html?q=charger
  const params = new URLSearchParams(window.location.search);
  const startCat = params.get("category");
  if (startCat && products.some((p) => p.category === startCat)) state.category = startCat;
  if (params.get("q")) state.query = params.get("q").trim();

  /* ---------- Helpers ---------- */
  const escapeHtml = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const ICONS = {
    "MacBook Devices": '<path d="M5 6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5V15H5z"/><path d="M2.5 15h19l-1 2.5a1 1 0 0 1-.93.63H4.43a1 1 0 0 1-.93-.63z"/>',
    "MacBook Parts": '<rect x="6" y="6" width="12" height="12" rx="1.5"/><rect x="9.5" y="9.5" width="5" height="5" rx=".5"/><path d="M9 3v3M12 3v3M15 3v3M9 18v3M12 18v3M15 18v3M3 9h3M3 12h3M3 15h3M18 9h3M18 12h3M18 15h3"/>',
    "Smart Home": '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M9.5 15.5a3.5 3.5 0 0 1 5 0M11 17.5a1.4 1.4 0 0 1 2 0"/>',
    "Smart Office": '<path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16"/><path d="M15 10h4a1 1 0 0 1 1 1v10M3 21h18"/><path d="M8 8h3M8 12h3M8 16h3"/>',
    "Private Cinema": '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="m10 7.5 4.5 2.5-4.5 2.5z"/><path d="M7 20h10M12 16v4"/>',
    "Short-Let Automation": '<circle cx="8" cy="15" r="4"/><path d="m11 12 8-8M16 7l2 2M14 9l2 2"/>',
    "Hotel Automation": '<path d="M3 18V7M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="1.6"/>',
    "Networking & Power": '<path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.2" r=".9"/>',
  };
  const iconFor = (cat) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${
      ICONS[cat] || ICONS["Smart Home"]
    }</svg>`;

  const mediaHtml = (p) =>
    p.image
      ? `<img src="${escapeHtml(p.image)}" alt="" loading="lazy">`
      : `<span class="shop-ph" data-cat="${escapeHtml(p.category)}">${iconFor(p.category)}</span>`;

  const priceText = (p) => p.price || "Price on request";

  const waLink = (p) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      `Hello SAVCLICK, I'd like to buy: ${p.name}${p.price ? ` (${p.price})` : ""}. Is it available?`
    )}`;

  /* ---------- Filtering ---------- */
  const filtered = () => {
    const words = state.query.toLowerCase().split(/\s+/).filter(Boolean);
    return products.filter((p) => {
      if (state.category !== "All" && p.category !== state.category) return false;
      if (!words.length) return true;
      const hay = `${p.name} ${p.category} ${p.description} ${p.specs || ""}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  };

  /* ---------- Category chips ---------- */
  const categories = ["All", ...new Set(products.map((p) => p.category))];
  els.chips.innerHTML = categories
    .map((c) => `<button type="button" class="shop-chip" data-cat="${escapeHtml(c)}" aria-pressed="false">${escapeHtml(c)}</button>`)
    .join("");
  els.chips.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    state.category = btn.dataset.cat;
    state.page = 1;
    render();
  });

  /* ---------- Render ---------- */
  function render(scroll = false) {
    const list = filtered();
    const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    state.page = Math.min(Math.max(1, state.page), pages);
    const start = (state.page - 1) * PER_PAGE;
    const pageItems = list.slice(start, start + PER_PAGE);

    els.chips.querySelectorAll("[data-cat]").forEach((b) => {
      const on = b.dataset.cat === state.category;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", String(on));
    });

    els.grid.innerHTML = pageItems
      .map(
        (p) => `
        <li>
          <button type="button" class="shop-card" data-id="${p.id}" aria-haspopup="dialog">
            <span class="shop-card-media">${mediaHtml(p)}</span>
            <span class="shop-card-body">
              <span class="shop-card-cat">${escapeHtml(p.category)}</span>
              <span class="shop-card-name">${escapeHtml(p.name)}</span>
              <span class="shop-card-price">${escapeHtml(priceText(p))}</span>
            </span>
          </button>
        </li>`
      )
      .join("");

    els.empty.hidden = list.length > 0;
    els.count.textContent = list.length
      ? `Showing ${start + 1}–${start + pageItems.length} of ${list.length} product${list.length === 1 ? "" : "s"}`
      : "";
    els.clear.hidden = state.query === "";

    renderPager(pages);
    if (scroll) els.top.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderPager(pages) {
    if (pages <= 1) {
      els.pager.hidden = true;
      els.pager.innerHTML = "";
      return;
    }
    els.pager.hidden = false;
    const btn = (label, page, opts = {}) =>
      `<button type="button" class="pager-btn${opts.current ? " is-current" : ""}${opts.wide ? " pager-wide" : ""}" data-page="${page}"${
        opts.disabled ? " disabled" : ""
      }${opts.current ? ' aria-current="page"' : ""}${opts.aria ? ` aria-label="${opts.aria}"` : ""}>${label}</button>`;

    let html = btn("← Previous", state.page - 1, { disabled: state.page === 1, wide: true });
    html += '<span class="pager-nums">';
    for (let i = 1; i <= pages; i++) {
      // Show first, last, current and neighbours; collapse the rest
      if (i === 1 || i === pages || Math.abs(i - state.page) <= 1) {
        html += btn(String(i), i, { current: i === state.page, aria: `Page ${i}` });
      } else if (Math.abs(i - state.page) === 2) {
        html += '<span class="pager-gap" aria-hidden="true">…</span>';
      }
    }
    html += "</span>";
    html += btn("Next →", state.page + 1, { disabled: state.page === pages, wide: true });
    els.pager.innerHTML = html;
  }

  els.pager.addEventListener("click", (e) => {
    const b = e.target.closest("[data-page]");
    if (!b || b.disabled) return;
    state.page = Number(b.dataset.page);
    render(true);
  });

  /* ---------- Search ---------- */
  let t;
  els.search.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(() => {
      state.query = els.search.value.trim();
      state.page = 1;
      render();
    }, 150);
  });
  document.getElementById("shopSearchForm").addEventListener("submit", (e) => e.preventDefault());
  els.clear.addEventListener("click", () => {
    els.search.value = "";
    state.query = "";
    state.page = 1;
    render();
    els.search.focus();
  });
  document.getElementById("shopReset").addEventListener("click", () => {
    els.search.value = "";
    state.query = "";
    state.category = "All";
    state.page = 1;
    render();
  });

  /* ---------- Product popup ---------- */
  let lastFocus = null;
  function openProduct(p) {
    lastFocus = document.activeElement;
    els.pTitle.textContent = p.name;
    els.pCat.textContent = p.category;
    els.pPrice.textContent = priceText(p);
    els.pDesc.textContent = p.description;
    const specs = (p.specs || "").split(";").map((x) => x.trim().replace(/\.$/, "")).filter(Boolean).map((x) => x.charAt(0).toUpperCase() + x.slice(1));
    els.pSpecs.innerHTML = specs.map((x) => `<li>${escapeHtml(x)}</li>`).join("");
    els.pSpecs.hidden = specs.length === 0;
    els.pMedia.innerHTML = mediaHtml(p);
    els.pBuy.href = waLink(p);
    els.overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    els.pClose.focus();
  }
  function closeProduct() {
    if (!els.overlay.classList.contains("is-open")) return;
    els.overlay.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  els.grid.addEventListener("click", (e) => {
    const card = e.target.closest(".shop-card");
    if (card) openProduct(products[Number(card.dataset.id)]);
  });
  els.pClose.addEventListener("click", closeProduct);
  els.overlay.addEventListener("click", (e) => {
    if (e.target === els.overlay) closeProduct();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeProduct();
  });

  els.search.value = state.query;
  render();
})();
