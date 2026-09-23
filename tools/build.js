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

/* Bilder als Daten-URI einbetten. Die Einzeldatei-Vorschau hat keinen
   Ordner daneben, aus dem sie Fotos nachladen könnte — und im Artifact
   wären Pfade zu anderen Rechnern ohnehin gesperrt. */
function inlineBilder(text) {
  const typen = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
  let ersetzt = 0, bytes = 0;
  const out = text.replace(/assets\/img\/[\w.-]+\.(?:jpe?g|png|webp)/g, (treffer) => {
    const voll = path.join(root, treffer);
    if (!fs.existsSync(voll)) return treffer;
    const roh = fs.readFileSync(voll);
    ersetzt++; bytes += roh.length;
    return "data:" + typen[path.extname(treffer).toLowerCase()] + ";base64," + roh.toString("base64");
  });
  if (ersetzt) console.log("  " + ersetzt + " Bilder eingebettet (" + Math.round(bytes / 1024) + " KB)");
  return out;
}

/* Deutsche Texte aus der Sprachdatei holen */
const { I18N, LANGS, SITE_URL } = new Function(read("assets/js/i18n.js") + "; return { I18N, LANGS, SITE_URL };")();
const de = I18N.de;

/* Der Katalog — fuer Auszeichnung und Seitenverzeichnis. Die Sprachdatei
   muss mitgeladen werden, weil data.js auf ihr aufbaut. */
const { PRODUCTS } = new Function(
  read("assets/js/i18n.js") + "\n" + read("assets/js/data.js") + "; return { PRODUCTS };"
)();

const PAGES = [
  { file: "index.html",      route: "index.html",      page: "home",    titel: "title.home",    text: "desc.home",    art: "website", rang: "1.0" },
  { file: "kollektion.html", route: "kollektion.html", page: "shop",    titel: "title.shop",    text: "desc.shop",    art: "website", rang: "0.9" },
  { file: "produkt.html",    route: "produkt.html",    page: "shop",    titel: "title.product", text: "desc.product", art: "product", rang: null },
  { file: "warenkorb.html",  route: "warenkorb.html",  page: "shop",    titel: "title.cart",    text: "desc.cart",    art: "website", rang: null, keinIndex: true },
  { file: "ueber-uns.html",  route: "ueber-uns.html",  page: "about",   titel: "title.about",   text: "desc.about",   art: "website", rang: "0.6" },
  { file: "kontakt.html",    route: "kontakt.html",    page: "contact", titel: "title.contact", text: "desc.contact", art: "website", rang: "0.6" }
];

const NAV = [
  { href: "index.html", key: "home" },
  { href: "kollektion.html", key: "shop" },
  { href: "ueber-uns.html", key: "about" },
  { href: "kontakt.html", key: "contact" }
];

/* Die Adresse der Website steht in assets/js/i18n.js — an einer Stelle,
   damit Kopfdaten hier und die Auszeichnung im Browser nicht auseinander
   laufen. */
const SITE = SITE_URL;

/* Was in Auszeichnung und Adressbuch steht. Muss mit Fusszeile und
   Kontaktseite uebereinstimmen. */
const HAUS = {
  name: "Premium Meubles",
  strasse: "Stadthausbrücke 8",
  plz: "20355",
  ort: "Hamburg",
  land: "DE",
  telefon: "+49 40 41 92 74 60",
  email: "norbert.wichele@gemail.com",
  geo: { lat: 53.5511, lon: 9.9865 }
};

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

  // Vorhandene Texte auffrischen, falls sich die Sprachdatei geändert hat.
  // Auch Texte mit Formatierung (data-i18n-html, etwa mit <br>) — die
  // Sprachdatei ist die Quelle, der Inhalt im HTML nur ihr Abbild.
  html = html.replace(
    /<(\w+)([^>]*?\sdata-i18n(?:-html)?="([^"]+)"[^>]*)>([\s\S]*?)<\/\1>/g,
    (match, tag, attrs, key) => {
      if (de[key] === undefined) return match;
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

/* ---------- Kopfdaten: Auffindbarkeit und geteilte Links ----------
   Eine Website wird nicht dadurch gefunden, dass sie schoen ist, sondern
   dadurch, dass Maschinen sie lesen koennen. Drei Dinge gehoeren dazu:

   1. Eine Vorschau fuer geteilte Links (Open Graph). Ohne sie erscheint
      ein Link bei WhatsApp, Instagram oder Facebook als nackte Adresse —
      mit ihr als Karte mit Bild, Titel und Zeile darunter.
   2. Auszeichnung der Inhalte (JSON-LD). Damit weiss eine Suchmaschine,
      dass hier ein gebrauchtes Sofa fuer 2.900 Euro steht und kein
      Blogeintrag — und kann Preis, Zustand und Verfuegbarkeit direkt im
      Ergebnis zeigen.
   3. Eine feste Adresse je Seite (canonical), damit dieselbe Seite nicht
      mehrfach gezaehlt wird.

   Der Block zwischen den Marken wird bei jedem Bau neu geschrieben —
   von Hand geaenderte Zeilen darin gehen verloren. ---------- */

const ANFANG = "<!-- kopfdaten:anfang (wird von tools/build.js geschrieben) -->";
const ENDE = "<!-- kopfdaten:ende -->";

function ld(obj) {
  return '<script type="application/ld+json">' +
    JSON.stringify(obj, null, 2).replace(/</g, "\\u003c") + "</" + "script>";
}

/* Das Haus selbst — Anschrift, Ruf, Zweig. Steht auf jeder Seite, damit
   Suchmaschinen den Betrieb einem Ort zuordnen koennen. */
function ldHaus() {
  return {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    "@id": SITE + "/#haus",
    name: HAUS.name,
    description: de["desc.home"],
    url: SITE + "/",
    image: SITE + "/assets/img/og-premium-meubles.jpg",
    logo: SITE + "/assets/icon-512.png",
    telephone: HAUS.telefon,
    email: HAUS.email,
    priceRange: "€€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: HAUS.strasse,
      postalCode: HAUS.plz,
      addressLocality: HAUS.ort,
      addressCountry: HAUS.land
    },
    geo: { "@type": "GeoCoordinates", latitude: HAUS.geo.lat, longitude: HAUS.geo.lon },
    areaServed: "DE",
    currenciesAccepted: "EUR"
  };
}

function ldWebsite() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE + "/#website",
    url: SITE + "/",
    name: HAUS.name,
    inLanguage: LANGS.map((l) => l.code),
    publisher: { "@id": SITE + "/#haus" },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: SITE + "/kollektion.html?suche={search_term_string}" },
      "query-input": "required name=search_term_string"
    }
  };
}

/* Ein einzelnes Stueck als Angebot. Gebraucht heisst hier ausdruecklich
   UsedCondition — genau das unterscheidet uns im Suchergebnis. */
function ldProdukt(x) {
  const t = x.t.de;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": SITE + "/produkt.html?id=" + x.id + "#produkt",
    name: x.name,
    description: t.short,
    sku: x.id,
    category: de["cat." + x.categoryKey],
    material: t.material,
    color: (t.colors && t.colors[0]) || undefined,
    image: (x.photos || []).map((f) => SITE + "/" + f),
    productionDate: x.year,
    brand: { "@type": "Brand", name: HAUS.name },
    offers: {
      "@type": "Offer",
      url: SITE + "/produkt.html?id=" + x.id,
      price: x.price,
      priceCurrency: "EUR",
      itemCondition: "https://schema.org/UsedCondition",
      availability: "https://schema.org/InStock",
      inventoryLevel: { "@type": "QuantitativeValue", value: x.used ? (x.stueck || 1) : 99 },
      seller: { "@id": SITE + "/#haus" }
    }
  };
}

function ldListe() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: de["shop.title"] || "Kollektion",
    numberOfItems: PRODUCTS.length,
    itemListElement: PRODUCTS.map((x, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: SITE + "/produkt.html?id=" + x.id,
      name: x.name
    }))
  };
}

function ldWeg(stufen) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: stufen.map((st, i) => ({
      "@type": "ListItem", position: i + 1, name: st[0], item: SITE + "/" + st[1]
    }))
  };
}

function kopfDaten(p) {
  const titel = de[p.titel];
  const text = de[p.text];
  const adresse = SITE + "/" + (p.route === "index.html" ? "" : p.route);
  const bild = SITE + "/assets/img/og-premium-meubles.jpg";

  const zeilen = [
    ANFANG,
    `<link rel="canonical" href="${escAttr(adresse)}">`,
    p.keinIndex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">',
    "",
    "<!-- Vorschau beim Teilen (WhatsApp, Facebook, LinkedIn, Signal …) -->",
    `<meta property="og:type" content="${p.art}">`,
    `<meta property="og:site_name" content="${escAttr(HAUS.name)}">`,
    `<meta property="og:locale" content="de_DE">`,
    LANGS.filter((l) => l.code !== "de").map((l) => `<meta property="og:locale:alternate" content="${l.locale.replace("-", "_")}">`).join("\n"),
    `<meta property="og:title" content="${escAttr(titel)}">`,
    `<meta property="og:description" content="${escAttr(text)}">`,
    `<meta property="og:url" content="${escAttr(adresse)}">`,
    `<meta property="og:image" content="${escAttr(bild)}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:image:alt" content="${escAttr(HAUS.name + " — " + de["home.used.title"])}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escAttr(titel)}">`,
    `<meta name="twitter:description" content="${escAttr(text)}">`,
    `<meta name="twitter:image" content="${escAttr(bild)}">`,
    "",
    "<!-- Signet und Farbe der Adresszeile. Relative Pfade, damit die",
    "     Seite auch in einem Unterordner liegen darf (etwa GitHub Pages). -->",
    `<link rel="icon" href="favicon.ico" sizes="48x48">`,
    `<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">`,
    `<link rel="apple-touch-icon" href="assets/icon-180.png">`,
    `<link rel="manifest" href="site.webmanifest">`,
    `<meta name="theme-color" content="#3a3229">`,
    "",
    "<!-- Auszeichnung für Suchmaschinen -->",
    ld(ldHaus())
  ];

  if (p.route === "index.html") zeilen.push(ld(ldWebsite()));
  if (p.route === "kollektion.html") {
    zeilen.push(ld(ldListe()));
    zeilen.push(ld(ldWeg([[de["nav.home"], "index.html"], [de["nav.shop"], "kollektion.html"]])));
  }
  if (p.route === "ueber-uns.html") zeilen.push(ld(ldWeg([[de["nav.home"], "index.html"], [de["nav.about"], "ueber-uns.html"]])));
  if (p.route === "kontakt.html") zeilen.push(ld(ldWeg([[de["nav.home"], "index.html"], [de["nav.contact"], "kontakt.html"]])));
  /* Auf der Produktseite haengt alles am Stueck in der Adresszeile —
     diese Auszeichnung setzt assets/js/app.js beim Anzeigen nach. */

  zeilen.push(ENDE);
  return zeilen.filter((z) => z !== null && z !== undefined).join("\n");
}

/* Kopf- und Fußzeile für Besucher ohne JavaScript */
function noscriptChrome(activeKey) {
  return `<noscript>
  <style>.reveal { opacity: 1 !important; transform: none !important; }</style>
  <div class="topbar">${esc(de["topbar"])}</div>
  <header class="header"><div class="wrap header__inner">
    <a class="logo" href="index.html"><span class="logo__mark">PM</span><span class="logo__name">Premium Meubles<small>${esc(de["logo.sub"])}</small></span></a>
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
    <p>Stadthausbrücke 8 · 20355 Hamburg · <a href="tel:+4940419274600">+49 40 41 92 74 60</a> ·
       <a href="mailto:norbert.wichele@gemail.com">norbert.wichele@gemail.com</a></p>
    <p class="muted">Warenkorb, Suche und Sprachwahl brauchen JavaScript.</p>
  </div></footer>
</noscript>`;
}

function syncPage(p) {
  let html = read(p.file);
  html = fillTexts(html);
  html = setzeKopfDaten(html, p);

  const head = `<div id="site-header">\n${noscriptChrome(p.page)}\n</div>`;
  const foot = `<div id="site-footer">\n${noscriptFooter()}\n</div>`;
  html = html.replace(/<div id="site-header">[\s\S]*?<\/div>\s*(?=<main|<!--)/, head + "\n\n");
  html = html.replace(/<div id="site-footer">[\s\S]*?<\/div>\s*(?=<script)/, foot + "\n\n");

  write(p.file, html);
}

/* Den verwalteten Kopfblock einsetzen oder auffrischen. Er steht hinter
   dem Stilblatt, damit die Seite unveraendert bleibt, wenn das Werkzeug
   einmal nicht laeuft. */
function setzeKopfDaten(html, p) {
  const block = kopfDaten(p);
  const vorhanden = new RegExp(ANFANG.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[\\s\\S]*?" + ENDE);
  if (vorhanden.test(html)) return html.replace(vorhanden, block);
  return html.replace(
    /(<link rel="stylesheet" href="assets\/css\/style\.css">)/,
    "$1\n" + block
  );
}

/* ---------- Seitenverzeichnis, Suchhinweise, Anwendungsdaten ---------- */

function schreibeVerzeichnis() {
  const heute = new Date().toISOString().slice(0, 10);
  const eintraege = PAGES.filter((p) => p.rang).map((p) => ({
    ort: SITE + "/" + (p.route === "index.html" ? "" : p.route), rang: p.rang
  }));
  PRODUCTS.forEach((x) => eintraege.push({ ort: SITE + "/produkt.html?id=" + x.id, rang: "0.8" }));

  write("sitemap.xml",
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    eintraege.map((e) =>
      "  <url>\n" +
      "    <loc>" + esc(e.ort) + "</loc>\n" +
      "    <lastmod>" + heute + "</lastmod>\n" +
      "    <priority>" + e.rang + "</priority>\n" +
      "  </url>"
    ).join("\n") + "\n</urlset>\n");

  write("robots.txt",
    "# Premium Meubles\n" +
    "User-agent: *\n" +
    "Allow: /\n" +
    "Disallow: /warenkorb.html\n" +
    "\n" +
    "Sitemap: " + SITE + "/sitemap.xml\n");

  write("site.webmanifest", JSON.stringify({
    name: HAUS.name + " — " + de["logo.sub"],
    short_name: HAUS.name,
    description: de["desc.home"],
    start_url: "/",
    display: "standalone",
    background_color: "#faf7f2",
    theme_color: "#3a3229",
    lang: "de",
    icons: [
      { src: "/assets/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/assets/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/assets/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
    ]
  }, null, 2) + "\n");

  return eintraege.length;
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

  let out = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Premium Meubles Interior Design</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Arimo:wght@400;500;700&family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500&display=swap" rel="stylesheet">
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
${read("assets/js/berater.js")}
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
  document.querySelectorAll("#nav a, #subnav a").forEach(function (a) {
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

  out = inlineBilder(out);
  write("preview.html", out);
  return out.length;
}

PAGES.forEach(syncPage);
console.log("Deutsche Texte in " + PAGES.length + " Seiten geschrieben");
console.log("Seitenverzeichnis: " + schreibeVerzeichnis() + " Adressen, robots.txt und site.webmanifest geschrieben");
const size = buildPreview();
console.log("preview.html geschrieben (" + Math.round(size / 1024) + " KB)");
console.log("Sprachen: " + LANGS.map((l) => l.code).join(", "));
