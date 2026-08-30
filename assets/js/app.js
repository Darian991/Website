/* =========================================================
   MAISON NOIR — Anwendungslogik
   Kopf-/Fußzeile, Warenkorb, Filter, Produktdetail
   ========================================================= */

/* ---------- Hilfsfunktionen ---------- */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const euro = (n) =>
  new Intl.NumberFormat(langLocale(), { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

/* Vergleichbare Schreibweise: Kleinbuchstaben, ohne Akzente */
const normalize = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

/* Durchsucht Name, Kategorie, Material und Beschreibung */
function searchProducts(query) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return PRODUCTS.filter((p) => {
    const x = pt(p);
    const haystack = normalize([
      p.name, t("cat." + p.categoryKey), x.short, x.description,
      x.material, x.origin, (x.colors || []).join(" ")
    ].join(" "));
    return words.every((w) => haystack.includes(w));
  });
}

const findProduct = (id) => PRODUCTS.find((p) => p.id === id);

/* Name einer Farbe in ihre Position umrechnen — in allen Sprachen, damit
   ein vor dem Sprachwechsel gefüllter Warenkorb erhalten bleibt. */
function nameToIndex(product, name) {
  if (!name) return 0;
  const langs = Object.keys(product.t || {});
  for (const l of langs) {
    const i = (product.t[l].colors || []).indexOf(name);
    if (i > -1) return i;
  }
  return 0;
}

/* Übersetzter Farbname einer Warenkorb-Position */
const itemColor = (product, item) => (productColors(product)[item.colorIndex] || {}).name || "";


/* ---------- Adressparameter ----------
   Funktioniert sowohl in der normalen Website (?id=…) als auch in der
   Einzeldatei-Vorschau, die stattdessen die Raute nutzt (#produkt.html?id=…). */
function isPreview() { return document.body.dataset.spa === "true"; }

function queryParams() {
  const hash = location.hash.replace(/^#/, "");
  const q = hash.indexOf("?");
  if (q > -1) return new URLSearchParams(hash.slice(q + 1));
  return new URLSearchParams(location.search);
}

function setParam(key, value) {
  if (isPreview()) {
    const hash = location.hash.replace(/^#/, "") || "index.html";
    const [path, search] = hash.split("?");
    const params = new URLSearchParams(search || "");
    if (value === null) params.delete(key); else params.set(key, value);
    const str = params.toString();
    history.replaceState(null, "", "#" + path + (str ? "?" + str : ""));
  } else {
    const url = new URL(location.href);
    if (value === null) url.searchParams.delete(key); else url.searchParams.set(key, value);
    history.replaceState(null, "", url);
  }
}

/* Wechselt auf eine andere Seite — in der Einzeldatei-Vorschau über die Raute */
function goTo(href) {
  if (!isPreview()) { location.href = href; return; }
  const next = "#" + href;
  if (location.hash === next) window.__renderRoute?.();
  else location.hash = next;
}

/* Zuhörer, die beim Seitenwechsel wieder abgemeldet werden müssen */
const pageListeners = [];
function onCartChange(fn) {
  document.addEventListener("cart:changed", fn);
  pageListeners.push(fn);
}
function clearPageListeners() {
  pageListeners.splice(0).forEach((fn) => document.removeEventListener("cart:changed", fn));
}

/* ---------- Warenkorb (im Browser gespeichert) ---------- */
const CART_KEY = "maison-noir-cart";

const Cart = {
  read() {
    let items = [];
    try {
      const raw = localStorage.getItem(CART_KEY);
      items = raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
    if (!Array.isArray(items)) return [];
    // Fremde oder beschädigte Einträge werden übergangen, statt die Seite lahmzulegen.
    return items.reduce((list, i) => {
      const p = i && typeof i === "object" ? findProduct(i.id) : null;
      if (!p) return list;
      const qty = Math.min(Math.max(Math.round(Number(i.qty) || 1), 1), bestand(p));
      // Ältere Warenkörbe haben den Farbnamen gespeichert — in eine Position umrechnen,
      // damit die Farbe die Sprache mitwechselt.
      let idx = Number.isInteger(i.colorIndex) ? i.colorIndex : nameToIndex(p, i.color);
      if (idx < 0 || idx >= p.swatches.length) idx = 0;
      list.push({ id: p.id, qty, colorIndex: idx });
      return list;
    }, []);
  },
  write(items) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch (e) { /* z. B. privater Modus */ }
    document.dispatchEvent(new CustomEvent("cart:changed", { detail: items }));
  },
  add(id, qty = 1, colorIndex = 0) {
    const p = findProduct(id);
    if (!p) return;
    const max = bestand(p);
    const items = Cart.read();
    const existing = items.find((i) => i.id === id && i.colorIndex === colorIndex);
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id, qty: Math.min(qty, max), colorIndex });
    Cart.write(items);
  },
  setQty(index, qty) {
    const items = Cart.read();
    if (!items[index]) return;
    if (qty <= 0) items.splice(index, 1);
    else items[index].qty = Math.min(qty, bestand(findProduct(items[index].id)));
    Cart.write(items);
  },
  remove(index) {
    const items = Cart.read();
    items.splice(index, 1);
    Cart.write(items);
  },
  clear() { Cart.write([]); },
  count() { return Cart.read().reduce((s, i) => s + i.qty, 0); },
  subtotal() {
    return Cart.read().reduce((s, i) => {
      const p = findProduct(i.id);
      return p ? s + p.price * i.qty : s;
    }, 0);
  }
};

/* ---------- Kopf- und Fußzeile ---------- */
const NAV = [
  { href: "index.html",     label: "Startseite", key: "home" },
  { href: "kollektion.html", label: "Kollektion", key: "shop" },
  { href: "ueber-uns.html",  label: "Manufaktur", key: "about" },
  { href: "kontakt.html",    label: "Kontakt",    key: "contact" }
];

function renderChrome() {
  const page = document.body.dataset.page || "";

  const header = `
  <div class="topbar" data-i18n="topbar"></div>
  <header class="header">
    <div class="wrap header__inner">
      <a class="logo" href="index.html"><span class="logo__mark" aria-hidden="true">SL</span><span class="logo__name">Studio Lusso<small data-i18n="logo.sub"></small></span></a>
      <nav class="nav" id="nav">
        <button class="close-x nav__close" id="nav-close" data-i18n-aria="action.close">×</button>
        ${NAV.map((n) => `<a href="${n.href}" class="${n.key === page ? "is-active" : ""}" data-i18n="nav.${n.key}"></a>`).join("")}
        <div class="langs langs--menu" role="group" aria-label="${t("action.language")}">
          ${LANGS.map((l) => `<button class="lang ${l.code === getLang() ? "is-active" : ""}" data-lang="${l.code}" lang="${l.code}">${l.label}</button>`).join("")}
        </div>
      </nav>
      <div class="header__actions">
        <button class="icon-btn" id="search-open" data-i18n-aria="action.search.open" data-i18n-title="action.search">
          <svg viewBox="0 0 20 20" width="17" height="17" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6">
            <circle cx="8.5" cy="8.5" r="5.5"/><line x1="12.6" y1="12.6" x2="17.5" y2="17.5" stroke-linecap="round"/>
          </svg>
        </button>
        <div class="langs" role="group" aria-label="${t("action.language")}">
          ${LANGS.map((l) => `<button class="lang ${l.code === getLang() ? "is-active" : ""}" data-lang="${l.code}" title="${l.name}" lang="${l.code}">${l.label}</button>`).join("")}
        </div>
        <button class="icon-btn" id="cart-open" data-i18n-aria="action.cart.open" data-i18n-title="action.cart">
          <span class="label" data-i18n="action.cart"></span><span class="cart-count" id="cart-count">0</span>
        </button>
        <button class="icon-btn burger" id="burger" data-i18n-aria="action.menu" aria-expanded="false">☰</button>
      </div>
    </div>
    <div class="nav-backdrop" id="nav-backdrop"></div>
    <div class="searchbar" id="searchbar" hidden>
      <div class="wrap searchbar__inner">
        <svg viewBox="0 0 20 20" width="19" height="19" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6">
          <circle cx="8.5" cy="8.5" r="5.5"/><line x1="12.6" y1="12.6" x2="17.5" y2="17.5" stroke-linecap="round"/>
        </svg>
        <input type="search" id="search-input" data-i18n-placeholder="search.placeholder" autocomplete="off">
        <button class="close-x" id="search-close" data-i18n-aria="action.close">×</button>
      </div>
      <div class="wrap" id="search-results"></div>
    </div>
  </header>`;

  const footer = `
  <footer class="footer">
    <div class="wrap">
      <div class="footer__grid">
        <div>
          <a class="logo" href="index.html"><span class="logo__mark" aria-hidden="true">SL</span><span class="logo__name">Studio Lusso<small data-i18n="logo.sub"></small></span></a>
          <p style="margin-top:1.2rem;max-width:34ch;font-size:.92rem" data-i18n="footer.tagline"></p>
        </div>
        <div>
          <h5 data-i18n="footer.collection"></h5>
          <ul>
            <li><a href="kollektion.html?kategorie=sofas" data-i18n="cat.sofas"></a></li>
            <li><a href="kollektion.html?kategorie=sessel" data-i18n="cat.sessel"></a></li>
            <li><a href="kollektion.html?kategorie=tische" data-i18n="cat.tische"></a></li>
            <li><a href="kollektion.html?kategorie=leuchten" data-i18n="cat.leuchten"></a></li>
            <li><a href="kollektion.html" data-i18n="footer.all"></a></li>
          </ul>
        </div>
        <div>
          <h5 data-i18n="footer.service"></h5>
          <ul>
            <li><a href="kontakt.html" data-i18n="footer.advice"></a></li>
            <li><a href="kontakt.html" data-i18n="footer.delivery"></a></li>
            <li><a href="ueber-uns.html" data-i18n="footer.care"></a></li>
            <li><a href="ueber-uns.html" data-i18n="footer.manufactory"></a></li>
          </ul>
        </div>
        <div>
          <h5 data-i18n="footer.showroom"></h5>
          <ul>
            <li>Stadthausbrücke 8</li>
            <li>20355 Hamburg</li>
            <li><a href="tel:+4940419274600">+49 40 41 92 74 60</a></li>
            <li><a href="mailto:info@studio-lusso.de">info@studio-lusso.de</a></li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <span>© ${new Date().getFullYear()} ${t("footer.rights")}</span>
        <span data-i18n="footer.legal"></span>
      </div>
    </div>
  </footer>`;

  const drawer = `
  <div class="drawer-backdrop" id="drawer-backdrop"></div>
  <aside class="drawer" id="drawer" aria-hidden="true" aria-label="${t("cart.title")}">
    <div class="drawer__head">
      <h3 data-i18n="cart.title"></h3>
      <button class="close-x" id="drawer-close" data-i18n-aria="action.close">×</button>
    </div>
    <div class="drawer__body" id="drawer-body"></div>
    <div class="drawer__foot">
      <div class="summary__row"><span data-i18n="cart.subtotal"></span><strong id="drawer-total">0 €</strong></div>
      <a class="btn btn--block" href="warenkorb.html" data-i18n="cart.checkout"></a>
      <button class="btn btn--ghost btn--block" id="drawer-continue" data-i18n="cart.continue"></button>
    </div>
  </aside>
  <div class="toast" id="toast"></div>`;

  const hostTop = $("#site-header");
  const hostBottom = $("#site-footer");
  if (hostTop) hostTop.innerHTML = header;
  if (hostBottom) hostBottom.innerHTML = footer + drawer;

  applyI18n(document);
  bindChrome();
}

function bindChrome() {
  const burger = $("#burger");
  const nav = $("#nav");
  const navBackdrop = $("#nav-backdrop");

  const setNav = (open) => {
    // Beim Schließen darf der Tastaturfokus nicht im unerreichbaren Menü
    // zurückbleiben — er wandert zurück auf den Menüknopf.
    if (!open && nav.contains(document.activeElement)) burger?.focus();
    nav.classList.toggle("is-open", open);
    navBackdrop?.classList.toggle("is-open", open);
    burger?.setAttribute("aria-expanded", String(open));
    // Solange das Menü als Auszug daneben liegt, darf es weder mit der
    // Tabulatortaste noch von Vorlesehilfen erreichbar sein.
    syncNavReachability();
  };

  /* Das Menü ist nur dann unerreichbar, wenn es als Auszug vorliegt und zu ist.
     Ab 1240 px steht es als normale Navigation in der Kopfzeile. */
  function syncNavReachability() {
    const isPanel = window.matchMedia("(max-width: 1240px)").matches;
    const hidden = isPanel && !nav.classList.contains("is-open");
    nav.inert = hidden;
    nav.setAttribute("aria-hidden", String(hidden));
  }

  if (burger && nav) {
    burger.addEventListener("click", () => setNav(!nav.classList.contains("is-open")));
    $("#nav-close")?.addEventListener("click", () => setNav(false));
    navBackdrop?.addEventListener("click", () => setNav(false));
    // Ein Verweis im Menü schließt es ebenfalls
    $$("#nav a").forEach((a) => a.addEventListener("click", () => setNav(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setNav(false); });
    document.addEventListener("route:changed", () => setNav(false));
    window.addEventListener("resize", syncNavReachability);
    syncNavReachability();
  }

  const backdrop = $("#drawer-backdrop");
  const drawer = $("#drawer");
  const openDrawer = () => {
    drawer.classList.add("is-open");
    backdrop.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    drawer.inert = false;
    renderDrawer();
    $("#drawer-close")?.focus();
  };
  const closeDrawer = () => {
    if (!drawer.classList.contains("is-open")) return;
    drawer.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    drawer.inert = true;
    $("#cart-open")?.focus();
  };

  drawer.inert = true;
  $("#cart-open")?.addEventListener("click", openDrawer);
  $("#drawer-close")?.addEventListener("click", closeDrawer);
  $("#drawer-continue")?.addEventListener("click", closeDrawer);
  backdrop?.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });
  document.addEventListener("route:changed", closeDrawer);

  /* Sprache wechseln */
  $$(".lang").forEach((btn) => {
    btn.addEventListener("click", () => { if (btn.dataset.lang !== getLang()) setLang(btn.dataset.lang); });
  });

  bindSearch();

  updateCartCount();
  document.addEventListener("cart:changed", () => { updateCartCount(); renderDrawer(); });
}

function updateCartCount() {
  const el = $("#cart-count");
  if (el) el.textContent = Cart.count();
}

function renderDrawer() {
  const body = $("#drawer-body");
  if (!body) return;
  const items = Cart.read();

  if (!items.length) {
    body.innerHTML = `<p class="muted" style="padding:2.5rem 0;text-align:center">${t("cart.empty")}</p>`;
  } else {
    body.innerHTML = items.map((item, index) => {
      const p = findProduct(item.id);
      return `
      <div class="cart-item" style="grid-template-columns:72px 1fr">
        <div class="cart-item__media">${artFor(p, item.colorIndex)}</div>
        <div>
          <div class="cart-item__title">${p.name}</div>
          <div class="cart-item__meta">${itemColor(p, item)} · ${item.qty} × ${euro(p.price)}</div>
          <button class="cart-item__remove" data-remove="${index}">${t("cart.remove")}</button>
        </div>
      </div>`;
    }).join("");
    $$("[data-remove]", body).forEach((btn) =>
      btn.addEventListener("click", () => Cart.remove(Number(btn.dataset.remove)))
    );
  }
  const total = $("#drawer-total");
  if (total) total.textContent = euro(Cart.subtotal());
}


/* ---------- Suche ---------- */
function bindSearch() {
  const bar = $("#searchbar");
  const input = $("#search-input");
  const results = $("#search-results");
  if (!bar || !input) return;

  const openSearch = () => {
    bar.hidden = false;
    requestAnimationFrame(() => bar.classList.add("is-open"));
    input.focus();
    renderSearch(input.value);
  };
  const closeSearch = () => {
    if (!bar.classList.contains("is-open")) return;
    bar.classList.remove("is-open");
    setTimeout(() => { if (!bar.classList.contains("is-open")) bar.hidden = true; }, 300);
    $("#search-open")?.focus();
  };

  // Der Zustand hängt an der Klasse, nicht am verzögerten hidden-Attribut —
  // sonst schließt ein Klick während des Zuklappens erneut, statt zu öffnen.
  $("#search-open")?.addEventListener("click", () =>
    (bar.classList.contains("is-open") ? closeSearch() : openSearch()));
  $("#search-close")?.addEventListener("click", closeSearch);
  input.addEventListener("input", () => renderSearch(input.value));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSearch();
    if (e.key === "Enter" && input.value.trim()) {
      goTo("kollektion.html?suche=" + encodeURIComponent(input.value.trim()));
    }
  });
  document.addEventListener("route:changed", closeSearch);

  function renderSearch(query) {
    const q = query.trim();
    if (!q) {
      results.innerHTML = `<p class="search__hint" data-i18n="search.hint"></p>`;
      applyI18n(results);
      return;
    }
    const hits = searchProducts(q);
    if (!hits.length) {
      results.innerHTML = `
        <p class="search__hint"><strong>${t("search.none")} „${escapeHtml(q)}“</strong><br>${t("search.noneHint")}</p>
        <a class="link-underline" href="kollektion.html">${t("footer.all")}</a>`;
      return;
    }
    results.innerHTML = `
      <p class="search__count">${hits.length} ${t("search.results")}</p>
      <div class="search__list">
        ${hits.slice(0, 6).map((p) => `
          <a class="search__item" href="produkt.html?id=${p.id}">
            <span class="search__thumb">${artFor(p)}</span>
            <span class="search__text">
              <span class="search__cat">${t("cat." + p.categoryKey)}</span>
              <span class="search__name">${p.name}</span>
              <span class="search__desc">${escapeHtml(pt(p).short)}</span>
            </span>
            <span class="search__price">${euro(p.price)}</span>
          </a>`).join("")}
      </div>
      ${hits.length > 6 ? `<a class="link-underline" href="kollektion.html?suche=${encodeURIComponent(q)}">${t("search.all")}</a>` : ""}`;
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ---------- Hinweis-Einblendung ---------- */
let toastTimer;
function toast(msg) {
  const el = $("#toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("is-open");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-open"), 2600);
}

/* ---------- Produktkarte ---------- */
function productCard(p) {
  const x = pt(p);
  return `
  <article class="card reveal">
    <a class="card__media" href="produkt.html?id=${p.id}" aria-label="${p.name}">
      ${artFor(p)}
      <span class="card__tag ${p.used ? "card__tag--used" : ""}">${p.used ? t("shop.used") : (x.badge || t("shop.new"))}</span>
      <div class="card__quick">
        <button class="btn btn--block" data-add="${p.id}">${t("shop.add")}</button>
      </div>
    </a>
    <div class="card__body">
      <span class="card__cat">${t("cat." + p.categoryKey)}</span>
      <a class="card__title" href="produkt.html?id=${p.id}">${p.name}</a>
      <span class="card__price">${euro(p.price)}</span>
    </div>
  </article>`;
}

/* Verhindert, dass ein Element seine Klick-Funktion doppelt erhält */
function once(el, mark) {
  if (el.dataset[mark] === "1") return false;
  el.dataset[mark] = "1";
  return true;
}

function bindAddButtons(root = document) {
  $$("[data-add]", root).forEach((btn) => {
    if (!once(btn, "boundAdd")) return;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const p = findProduct(btn.dataset.add);
      Cart.add(p.id, 1, 0);
      toast(t("cart.added", { name: p.name }));
    });
  });
}

/* ---------- Einblenden beim Scrollen ---------- */
function initReveal() {
  // Bereits beobachtete Elemente überspringen; sonst legt jeder
  // Tastendruck in der Suche einen weiteren Beobachter an.
  const items = $$(".reveal").filter((el) => once(el, "boundReveal"));
  if (!items.length) return;
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("is-visible"), Math.min(i * 70, 350));
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -60px" });
  items.forEach((el) => io.observe(el));
}

/* ---------- Ziehharmonika (Produktdetail) ---------- */
function initAccordions(root = document) {
  $$(".acc__btn", root).forEach((btn) => {
    if (!once(btn, "boundAcc")) return;
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      btn.nextElementSibling.classList.toggle("is-open", !open);
    });
  });
}

/* ---------- Formulare (Demo ohne Server) ---------- */
function initForms() {
  $$("form[data-demo]").forEach((form) => {
    if (!once(form, "boundForm")) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const box = form.querySelector("[data-msg]");
      const name = form.querySelector("[name=name]")?.value?.trim();
      if (box) {
        box.hidden = false;
        box.textContent = name ? t("contact.thanksNamed", { name: name }) : t("contact.thanks");
      }
      form.reset();
    });
  });
}

/* ---------- Start ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderChrome();
  if (typeof initPage === "function") initPage();
  bindAddButtons();
  initAccordions();
  initForms();
  initReveal();
});
