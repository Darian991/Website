/* =========================================================
   MAISON NOIR — Anwendungslogik
   Kopf-/Fußzeile, Warenkorb, Filter, Produktdetail
   ========================================================= */

/* ---------- Hilfsfunktionen ---------- */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const euro = (n) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const findProduct = (id) => PRODUCTS.find((p) => p.id === id);


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
    try {
      const raw = localStorage.getItem(CART_KEY);
      const items = raw ? JSON.parse(raw) : [];
      return Array.isArray(items) ? items.filter((i) => findProduct(i.id)) : [];
    } catch (e) {
      return [];
    }
  },
  write(items) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch (e) { /* z. B. privater Modus */ }
    document.dispatchEvent(new CustomEvent("cart:changed", { detail: items }));
  },
  add(id, qty = 1, color = null) {
    const items = Cart.read();
    const key = (i) => i.id === id && i.color === color;
    const existing = items.find(key);
    if (existing) existing.qty += qty;
    else items.push({ id, qty, color });
    Cart.write(items);
  },
  setQty(index, qty) {
    const items = Cart.read();
    if (!items[index]) return;
    if (qty <= 0) items.splice(index, 1);
    else items[index].qty = Math.min(qty, 99);
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
  <div class="topbar">Versandkostenfrei innerhalb Europas · Persönliche Beratung unter +49 89 1234 5678</div>
  <header class="header">
    <div class="wrap header__inner">
      <a class="logo" href="index.html">Maison Noir<small>Möbelmanufaktur</small></a>
      <nav class="nav" id="nav">
        ${NAV.map((n) => `<a href="${n.href}" class="${n.key === page ? "is-active" : ""}">${n.label}</a>`).join("")}
      </nav>
      <div class="header__actions">
        <button class="icon-btn burger" id="burger" aria-label="Menü öffnen" aria-expanded="false">☰</button>
        <a class="icon-btn" href="kontakt.html" aria-label="Beratung"><span class="label">Beratung</span></a>
        <button class="icon-btn" id="cart-open" aria-label="Warenkorb öffnen">
          <span class="label">Warenkorb</span><span class="cart-count" id="cart-count">0</span>
        </button>
      </div>
    </div>
  </header>`;

  const footer = `
  <footer class="footer">
    <div class="wrap">
      <div class="footer__grid">
        <div>
          <a class="logo" href="index.html">Maison Noir<small>Möbelmanufaktur</small></a>
          <p style="margin-top:1.2rem;max-width:34ch;font-size:.92rem">
            Möbel, die in Handarbeit entstehen und über Generationen bleiben.
            Gefertigt in Europa, seit 1974.
          </p>
        </div>
        <div>
          <h5>Kollektion</h5>
          <ul>
            <li><a href="kollektion.html?kategorie=Sofas">Sofas</a></li>
            <li><a href="kollektion.html?kategorie=Sessel">Sessel</a></li>
            <li><a href="kollektion.html?kategorie=Tische">Tische</a></li>
            <li><a href="kollektion.html?kategorie=Leuchten">Leuchten</a></li>
            <li><a href="kollektion.html">Alles ansehen</a></li>
          </ul>
        </div>
        <div>
          <h5>Service</h5>
          <ul>
            <li><a href="kontakt.html">Persönliche Beratung</a></li>
            <li><a href="kontakt.html">Lieferung &amp; Montage</a></li>
            <li><a href="ueber-uns.html">Pflegehinweise</a></li>
            <li><a href="ueber-uns.html">Manufaktur</a></li>
          </ul>
        </div>
        <div>
          <h5>Showroom</h5>
          <ul>
            <li>Maximilianstraße 12</li>
            <li>80539 München</li>
            <li><a href="tel:+498912345678">+49 89 1234 5678</a></li>
            <li><a href="mailto:salon@maison-noir.de">salon@maison-noir.de</a></li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <span>© ${new Date().getFullYear()} Maison Noir Möbelmanufaktur</span>
        <span>Impressum · Datenschutz · AGB · Widerrufsrecht</span>
      </div>
    </div>
  </footer>`;

  const drawer = `
  <div class="drawer-backdrop" id="drawer-backdrop"></div>
  <aside class="drawer" id="drawer" aria-hidden="true" aria-label="Warenkorb">
    <div class="drawer__head">
      <h3>Warenkorb</h3>
      <button class="close-x" id="drawer-close" aria-label="Schließen">×</button>
    </div>
    <div class="drawer__body" id="drawer-body"></div>
    <div class="drawer__foot">
      <div class="summary__row"><span>Zwischensumme</span><strong id="drawer-total">0 €</strong></div>
      <a class="btn btn--block" href="warenkorb.html">Zur Kasse</a>
      <button class="btn btn--ghost btn--block" id="drawer-continue">Weiter stöbern</button>
    </div>
  </aside>
  <div class="toast" id="toast"></div>`;

  const hostTop = $("#site-header");
  const hostBottom = $("#site-footer");
  if (hostTop) hostTop.innerHTML = header;
  if (hostBottom) hostBottom.innerHTML = footer + drawer;

  bindChrome();
}

function bindChrome() {
  const burger = $("#burger");
  const nav = $("#nav");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
      burger.textContent = open ? "×" : "☰";
    });
  }

  const backdrop = $("#drawer-backdrop");
  const drawer = $("#drawer");
  const openDrawer = () => {
    drawer.classList.add("is-open");
    backdrop.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    renderDrawer();
    $("#drawer-close")?.focus();
  };
  const closeDrawer = () => {
    if (!drawer.classList.contains("is-open")) return;
    drawer.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    $("#cart-open")?.focus();
  };

  $("#cart-open")?.addEventListener("click", openDrawer);
  $("#drawer-close")?.addEventListener("click", closeDrawer);
  $("#drawer-continue")?.addEventListener("click", closeDrawer);
  backdrop?.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });
  document.addEventListener("route:changed", closeDrawer);

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
    body.innerHTML = `<p class="muted" style="padding:2.5rem 0;text-align:center">Ihr Warenkorb ist noch leer.</p>`;
  } else {
    body.innerHTML = items.map((item, index) => {
      const p = findProduct(item.id);
      return `
      <div class="cart-item" style="grid-template-columns:72px 1fr">
        <div class="cart-item__media">${artFor(p)}</div>
        <div>
          <div class="cart-item__title">${p.name}</div>
          <div class="cart-item__meta">${item.color || p.colors[0].name} · ${item.qty} × ${euro(p.price)}</div>
          <button class="cart-item__remove" data-remove="${index}">Entfernen</button>
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
  return `
  <article class="card reveal">
    <a class="card__media" href="produkt.html?id=${p.id}" aria-label="${p.name} ansehen">
      ${artFor(p)}
      ${p.badge ? `<span class="card__tag">${p.badge}</span>` : ""}
      <div class="card__quick">
        <button class="btn btn--block" data-add="${p.id}">In den Warenkorb</button>
      </div>
    </a>
    <div class="card__body">
      <span class="card__cat">${p.category}</span>
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
      Cart.add(p.id, 1, p.colors[0].name);
      toast(`${p.name} wurde in den Warenkorb gelegt`);
    });
  });
}

/* ---------- Einblenden beim Scrollen ---------- */
function initReveal() {
  const items = $$(".reveal");
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
        box.textContent = name
          ? `Vielen Dank, ${name}. Wir melden uns innerhalb eines Werktages bei Ihnen.`
          : "Vielen Dank — wir haben Ihre Anfrage erhalten.";
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
