/* =========================================================
   Baut aus den echten Seitendateien eine einzelne HTML-Datei.
   So bleibt die Website die einzige Quelle — die Vorschau ist
   nur eine andere Verpackung derselben Dateien.

   Aufruf:  node tools/build-preview.js
   Ergebnis: preview.html
   ========================================================= */

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");

const PAGES = [
  { file: "index.html",      route: "index.html",      page: "home" },
  { file: "kollektion.html", route: "kollektion.html", page: "shop" },
  { file: "produkt.html",    route: "produkt.html",    page: "shop" },
  { file: "warenkorb.html",  route: "warenkorb.html",  page: "shop" },
  { file: "ueber-uns.html",  route: "ueber-uns.html",  page: "about" },
  { file: "kontakt.html",    route: "kontakt.html",    page: "contact" }
];

/* Inhalt zwischen <main> und </main> herausholen */
function mainOf(html) {
  const m = html.match(/<main>([\s\S]*?)<\/main>/);
  if (!m) throw new Error("Kein <main> gefunden");
  return m[1].trim();
}

/* Das letzte <script> ohne src (das seitenspezifische) herausholen */
function scriptOf(html) {
  const all = [...html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)];
  return all.length ? all[all.length - 1][1].trim() : "";
}

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

window.addEventListener("hashchange", renderRoute);
document.addEventListener("DOMContentLoaded", renderRoute);
if (document.readyState !== "loading") boot();
</script>
`;

fs.writeFileSync(path.join(root, "preview.html"), out, "utf8");
console.log("preview.html geschrieben (" + Math.round(out.length / 1024) + " KB)");
