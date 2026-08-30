/* =========================================================
   Bauwerkzeug — nach jeder Textänderung ausführen:

     node tools/build.js

   1. Schreibt die deutschen Texte fest in die Seiten, damit sie
      auch ohne JavaScript lesbar sind und von Suchmaschinen
      gefunden werden. Quelle bleibt assets/js/i18n.js.
   2. Baut preview.html — die ganze Website in einer Datei.
   ========================================================= */

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
const write = (f, c) => fs.writeFileSync(path.join(root, f), c, "utf8");

/* Deutsche Texte aus der Sprachdatei holen */
const { I18N, LANGS } = new Function(read("assets/js/i18n.js") + "; return { I18N, LANGS };")();
const de = I18N.de;

const PAGES = [
  { file: "index.html",      route: "index.html",      page: "home" },
  { file: "kollektion.html", route: "kollektion.html", page: "shop" },
  { file: "produkt.html",    route: "produkt.html",    page: "shop" },
  { file: "warenkorb.html",  route: "warenkorb.html",  page: "shop" },
  { file: "ueber-uns.html",  route: "ueber-uns.html",  page: "about" },
  { file: "kontakt.html",    route: "kontakt.html",    page: "contact" }
];

const NAV = [
  { href: "index.html", key: "home" },
  { href: "kollektion.html", key: "shop" },
  { href: "ueber-uns.html", key: "about" },
  { href: "kontakt.html", key: "contact" }
];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s) => esc(s).replace(/"/g, "&quot;");

/* ---------- 1. Deutsche Texte in die Seiten schreiben ---------- */

function fillTexts(html) {
  // Leere Elemente mit data-i18n / data-i18n-html bekommen den deutschen Text
  html = html.replace(
    /<(\w+)([^>]*?\sdata-i18n(?:-html)?="([^"]+)"[^>]*)><\/\1>/g,
    (match, tag, attrs, key) => {
      if (de[key] === undefined) return match;
      const isHtml = /\sdata-i18n-html="/.test(attrs);
      return `<${tag}${attrs}>${isHtml ? de[key] : esc(de[key])}</${tag}>`;
    }
  );

  // Vorhandene Texte auffrischen, falls sich die Sprachdatei geändert hat
  html = html.replace(
    /<(\w+)([^>]*?\sdata-i18n(?:-html)?="([^"]+)"[^>]*)>([\s\S]*?)<\/\1>/g,
    (match, tag, attrs, key, inner) => {
      if (de[key] === undefined || /<\w/.test(inner)) return match;
      const isHtml = /\sdata-i18n-html="/.test(attrs);
      return `<${tag}${attrs}>${isHtml ? de[key] : esc(de[key])}</${tag}>`;
    }
  );

  // Attribute: Platzhalter, Beschriftung für Vorlesehilfen, Kurzhinweis, Seitenbeschreibung
  const attrMap = [
    ["data-i18n-placeholder", "placeholder"],
    ["data-i18n-aria", "aria-label"],
    ["data-i18n-title", "title"],
    ["data-i18n-content", "content"]
  ];
  attrMap.forEach(([source, target]) => {
    html = html.replace(new RegExp(`(<[^>]*?\\s${source}="([^"]+)"[^>]*?>)`, "g"), (tagText, _all, key) => {
      if (de[key] === undefined) return tagText;
      const value = escAttr(de[key]);
      const has = new RegExp(`\\s${target}="[^"]*"`);
      return has.test(tagText)
        ? tagText.replace(has, ` ${target}="${value}"`)
        : tagText.replace(/\s*\/?>$/, (tail) => ` ${target}="${value}"${tail.trim() === "/>" ? " />" : ">"}`);
    });
  });

  return html;
}

/* Kopf- und Fußzeile für Besucher ohne JavaScript */
function noscriptChrome(activeKey) {
  return `<noscript>
  <div class="topbar">${esc(de["topbar"])}</div>
  <header class="header"><div class="wrap header__inner">
    <a class="logo" href="index.html">Maison Noir<small>${esc(de["logo.sub"])}</small></a>
    <nav class="nav-static">
      ${NAV.map((n) => `<a href="${n.href}"${n.key === activeKey ? ' class="is-active"' : ""}>${esc(de["nav." + n.key])}</a>`).join("\n      ")}
    </nav>
  </div></header>
</noscript>`;
}

function noscriptFooter() {
  return `<noscript>
  <footer class="footer"><div class="wrap">
    <p>${esc(de["footer.tagline"])}</p>
    <p>Maximilianstraße 12 · 80539 München · <a href="tel:+498912345678">+49 89 1234 5678</a> ·
       <a href="mailto:salon@maison-noir.de">salon@maison-noir.de</a></p>
    <p class="muted">Warenkorb, Suche und Sprachwahl brauchen JavaScript.</p>
  </div></footer>
</noscript>`;
}

function syncPage(p) {
  let html = read(p.file);
  html = fillTexts(html);

  const head = `<div id="site-header">\n${noscriptChrome(p.page)}\n</div>`;
  const foot = `<div id="site-footer">\n${noscriptFooter()}\n</div>`;
  html = html.replace(/<div id="site-header">[\s\S]*?<\/div>\s*(?=<main|<!--)/, head + "\n\n");
  html = html.replace(/<div id="site-footer">[\s\S]*?<\/div>\s*(?=<script)/, foot + "\n\n");

  write(p.file, html);
}

/* ---------- 2. Einzeldatei-Vorschau bauen ---------- */

function mainOf(html) {
  const m = html.match(/<main>([\s\S]*?)<\/main>/);
  if (!m) throw new Error("Kein <main> gefunden");
  return m[1].trim();
}

function scriptOf(html) {
  const all = [...html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)];
  return all.length ? all[all.length - 1][1].trim() : "";
}

function buildPreview() {
  const routes = PAGES.map((p) => {
    const html = read(p.file);
    return `  ${JSON.stringify(p.route)}: {
    page: ${JSON.stringify(p.page)},
    html: ${JSON.stringify(mainOf(html))},
    init: function () {
${scriptOf(html)}
      initPage();
    }
  }`;
  }).join(",\n");

  const out = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Maison Noir Möbelmanufaktur</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
<style>
${read("assets/css/style.css")}
</style>

<div id="site-header"></div>
<main id="app"></main>
<div id="site-footer"></div>

<script>
${read("assets/js/i18n.js")}
</script>
<script>
${read("assets/js/data.js")}
</script>
<script>
${read("assets/js/hero.js")}
</script>
<script>
document.body.dataset.spa = "true";
${read("assets/js/app.js")}
</script>
<script>
/* ---------- Einfache Wegführung für die Einzeldatei ---------- */
const ROUTES = {
${routes}
};

function currentRoute() {
  const hash = location.hash.replace(/^#/, "");
  const file = (hash.split("?")[0] || "index.html").trim();
  return ROUTES[file] ? file : "index.html";
}

function renderRoute() {
  const key = currentRoute();
  const route = ROUTES[key];

  clearPageListeners();
  document.dispatchEvent(new Event("route:changed"));
  document.body.dataset.page = route.page;
  document.querySelectorAll("#nav a").forEach(function (a) {
    a.classList.toggle("is-active", a.getAttribute("href") === key);
  });

  const app = document.getElementById("app");
  app.innerHTML = route.html;
  applyI18n(app);
  route.init();
  applyI18n(app);
  bindAddButtons(app);
  initAccordions(app);
  initForms();
  initReveal();
  window.scrollTo({ top: 0, behavior: "instant" });
}

/* Interne Verweise auf die Raute umlenken */
document.addEventListener("click", function (e) {
  const a = e.target.closest("a[href]");
  if (!a) return;
  const href = a.getAttribute("href");
  if (!href || !/^[\\w-]+\\.html(\\?|$)/.test(href)) return;
  e.preventDefault();
  const next = "#" + href;
  if (location.hash === next) renderRoute();
  else location.hash = next;
});

function boot() {
  if (!document.getElementById("nav")) renderChrome();
  renderRoute();
}

window.__renderRoute = renderRoute;
window.addEventListener("hashchange", renderRoute);
document.addEventListener("DOMContentLoaded", renderRoute);
if (document.readyState !== "loading") boot();
</script>
`;

  write("preview.html", out);
  return out.length;
}

PAGES.forEach(syncPage);
console.log("Deutsche Texte in " + PAGES.length + " Seiten geschrieben");
const size = buildPreview();
console.log("preview.html geschrieben (" + Math.round(size / 1024) + " KB)");
console.log("Sprachen: " + LANGS.map((l) => l.code).join(", "));
