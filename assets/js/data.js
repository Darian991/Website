/* =========================================================
   MAISON NOIR — Produktdaten & Bildwelt
   Alle Abbildungen sind als SVG eingebettet, damit die
   Seite ohne externe Bilddateien überall funktioniert.
   ========================================================= */

/* --- Farbstimmungen für die Produktbilder --- */
const TONES = {
  sand:  { bg1: "#efe7da", bg2: "#ddd0bc", floor: "#cbbba1", obj: "#3f3a30", accent: "#a9863f" },
  clay:  { bg1: "#eee0d6", bg2: "#dcc4b4", floor: "#c9ab98", obj: "#42332b", accent: "#96603c" },
  sage:  { bg1: "#e6e9df", bg2: "#ccd4c3", floor: "#b6c0aa", obj: "#333a31", accent: "#7d8a6a" },
  stone: { bg1: "#e9e8e4", bg2: "#d3d2cc", floor: "#bfbdb5", obj: "#35342f", accent: "#8b8778" },
  ink:   { bg1: "#3a3833", bg2: "#22211c", floor: "#161510", obj: "#e6dfd2", accent: "#c8a463" },
  rose:  { bg1: "#f0e3e0", bg2: "#dec7c2", floor: "#cbaea8", obj: "#3d3230", accent: "#a4726a" }
};

/* --- Bausteine --- */
function scene(t, inner, seed) {
  const id = "g" + seed;
  return `<svg viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img">
  <defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stop-color="${t.bg1}"/><stop offset="1" stop-color="${t.bg2}"/>
    </linearGradient>
    <radialGradient id="${id}v" cx="0.5" cy="0.42" r="0.75">
      <stop offset="0.55" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.14"/>
    </radialGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#${id})"/>
  <circle cx="560" cy="300" r="190" fill="${t.accent}" opacity="0.13"/>
  <rect x="0" y="720" width="800" height="280" fill="${t.floor}" opacity="0.55"/>
  <line x1="0" y1="720" x2="800" y2="720" stroke="${t.obj}" stroke-opacity="0.14" stroke-width="2"/>
  ${inner}
  <rect width="800" height="1000" fill="url(#${id}v)"/>
</svg>`;
}

const shadow = (t, x, w) =>
  `<ellipse cx="${x}" cy="726" rx="${w}" ry="16" fill="${t.obj}" opacity="0.16"/>`;

/* --- Möbel-Silhouetten --- */
const ART = {
  sofa: (t) => scene(t, `
    ${shadow(t, 400, 250)}
    <rect x="150" y="470" width="500" height="150" rx="28" fill="${t.obj}"/>
    <rect x="150" y="400" width="500" height="110" rx="26" fill="${t.obj}" opacity="0.86"/>
    <rect x="182" y="452" width="200" height="72" rx="18" fill="${t.accent}" opacity="0.5"/>
    <rect x="418" y="452" width="200" height="72" rx="18" fill="${t.accent}" opacity="0.5"/>
    <rect x="128" y="430" width="52" height="190" rx="24" fill="${t.obj}"/>
    <rect x="620" y="430" width="52" height="190" rx="24" fill="${t.obj}"/>
    <rect x="196" y="618" width="16" height="98" rx="6" fill="${t.accent}"/>
    <rect x="588" y="618" width="16" height="98" rx="6" fill="${t.accent}"/>`, 1),

  sessel: (t) => scene(t, `
    ${shadow(t, 400, 165)}
    <path d="M262 430c0-62 46-104 138-104s138 42 138 104v86H262z" fill="${t.obj}" opacity="0.88"/>
    <rect x="252" y="500" width="296" height="128" rx="30" fill="${t.obj}"/>
    <rect x="286" y="524" width="228" height="70" rx="20" fill="${t.accent}" opacity="0.45"/>
    <rect x="296" y="626" width="15" height="92" rx="6" fill="${t.accent}"/>
    <rect x="489" y="626" width="15" height="92" rx="6" fill="${t.accent}"/>`, 2),

  tisch: (t) => scene(t, `
    ${shadow(t, 400, 240)}
    <rect x="150" y="452" width="500" height="30" rx="12" fill="${t.obj}"/>
    <rect x="176" y="482" width="448" height="12" fill="${t.obj}" opacity="0.55"/>
    <rect x="214" y="494" width="20" height="224" fill="${t.obj}"/>
    <rect x="566" y="494" width="20" height="224" fill="${t.obj}"/>
    <rect x="214" y="588" width="372" height="14" fill="${t.accent}" opacity="0.75"/>`, 3),

  stuhl: (t) => scene(t, `
    ${shadow(t, 400, 120)}
    <path d="M320 268h160c14 0 22 12 18 26l-44 176H346l-44-176c-4-14 4-26 18-26z" fill="${t.obj}" opacity="0.9"/>
    <rect x="300" y="470" width="200" height="26" rx="10" fill="${t.obj}"/>
    <rect x="314" y="496" width="14" height="222" fill="${t.accent}"/>
    <rect x="472" y="496" width="14" height="222" fill="${t.accent}"/>
    <rect x="314" y="614" width="172" height="11" fill="${t.obj}" opacity="0.6"/>`, 4),

  lampe: (t) => scene(t, `
    ${shadow(t, 400, 110)}
    <path d="M296 236h208l58 168H238z" fill="${t.accent}" opacity="0.72"/>
    <path d="M296 236h208l58 168H238z" fill="none" stroke="${t.obj}" stroke-opacity="0.35" stroke-width="4"/>
    <rect x="392" y="404" width="16" height="290" fill="${t.obj}"/>
    <ellipse cx="400" cy="700" rx="96" ry="20" fill="${t.obj}"/>`, 5),

  regal: (t) => scene(t, `
    ${shadow(t, 400, 210)}
    <rect x="206" y="206" width="18" height="512" fill="${t.obj}"/>
    <rect x="576" y="206" width="18" height="512" fill="${t.obj}"/>
    <rect x="206" y="206" width="388" height="16" fill="${t.obj}"/>
    <rect x="206" y="368" width="388" height="14" fill="${t.obj}" opacity="0.85"/>
    <rect x="206" y="530" width="388" height="14" fill="${t.obj}" opacity="0.85"/>
    <rect x="206" y="702" width="388" height="16" fill="${t.obj}"/>
    <rect x="240" y="292" width="86" height="76" fill="${t.accent}" opacity="0.6"/>
    <circle cx="500" cy="330" r="36" fill="${t.accent}" opacity="0.45"/>
    <rect x="404" y="470" width="60" height="60" fill="${t.accent}" opacity="0.5"/>`, 6),

  bett: (t) => scene(t, `
    ${shadow(t, 400, 268)}
    <rect x="212" y="272" width="376" height="196" rx="18" fill="${t.obj}" opacity="0.88"/>
    <rect x="140" y="468" width="520" height="130" rx="16" fill="${t.obj}"/>
    <rect x="172" y="440" width="150" height="56" rx="18" fill="${t.accent}" opacity="0.55"/>
    <rect x="340" y="440" width="150" height="56" rx="18" fill="${t.accent}" opacity="0.55"/>
    <rect x="140" y="598" width="520" height="26" rx="8" fill="${t.accent}" opacity="0.6"/>
    <rect x="164" y="624" width="16" height="94" fill="${t.obj}"/>
    <rect x="620" y="624" width="16" height="94" fill="${t.obj}"/>`, 7),

  sideboard: (t) => scene(t, `
    ${shadow(t, 400, 230)}
    <rect x="164" y="404" width="472" height="232" rx="10" fill="${t.obj}"/>
    <line x1="400" y1="404" x2="400" y2="636" stroke="${t.bg1}" stroke-opacity="0.35" stroke-width="3"/>
    <rect x="336" y="506" width="128" height="9" rx="4" fill="${t.accent}"/>
    <rect x="164" y="392" width="472" height="16" rx="6" fill="${t.obj}" opacity="0.75"/>
    <rect x="196" y="636" width="16" height="82" fill="${t.accent}"/>
    <rect x="588" y="636" width="16" height="82" fill="${t.accent}"/>`, 8),

  teppich: (t) => scene(t, `
    <ellipse cx="400" cy="560" rx="270" ry="150" fill="${t.obj}" opacity="0.85"/>
    <ellipse cx="400" cy="560" rx="212" ry="115" fill="none" stroke="${t.accent}" stroke-width="10" opacity="0.75"/>
    <ellipse cx="400" cy="560" rx="140" ry="72" fill="none" stroke="${t.bg1}" stroke-width="8" opacity="0.5"/>
    <ellipse cx="400" cy="560" rx="66" ry="32" fill="${t.accent}" opacity="0.7"/>`, 9),

  spiegel: (t) => scene(t, `
    ${shadow(t, 400, 130)}
    <rect x="272" y="180" width="256" height="470" rx="128" fill="${t.accent}" opacity="0.8"/>
    <rect x="294" y="202" width="212" height="426" rx="106" fill="${t.bg1}" opacity="0.85"/>
    <path d="M330 560c0-108 34-206 92-282" stroke="#fff" stroke-opacity="0.5" stroke-width="14" fill="none" stroke-linecap="round"/>
    <rect x="356" y="650" width="88" height="68" rx="8" fill="${t.obj}"/>`, 10)
};


/* --- Bühnenbild für die Startseite (Breitformat) --- */
function heroScene() {
  return `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Wohnraum mit Sofa, Stehleuchte und Beistelltisch">
  <defs>
    <linearGradient id="hw" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0" stop-color="#3c382f"/><stop offset="1" stop-color="#1b1a15"/>
    </linearGradient>
    <radialGradient id="hglow" cx="0.72" cy="0.34" r="0.42">
      <stop offset="0" stop-color="#e8c68a" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#e8c68a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="hfloor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#4a4238"/><stop offset="1" stop-color="#221f19"/>
    </linearGradient>
    <linearGradient id="hlamp" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f3dcae"/><stop offset="1" stop-color="#d9b672"/>
    </linearGradient>
  </defs>

  <rect width="1600" height="900" fill="url(#hw)"/>

  <!-- Bogenfenster -->
  <path d="M1010 700V330c0-104 84-188 188-188s188 84 188 188v370z" fill="#c9a76a" opacity="0.16"/>
  <path d="M1010 700V330c0-104 84-188 188-188s188 84 188 188v370z" fill="none" stroke="#d8b67c" stroke-opacity="0.3" stroke-width="3"/>
  <line x1="1198" y1="142" x2="1198" y2="700" stroke="#d8b67c" stroke-opacity="0.22" stroke-width="3"/>
  <line x1="1010" y1="392" x2="1386" y2="392" stroke="#d8b67c" stroke-opacity="0.22" stroke-width="3"/>
  <rect width="1600" height="900" fill="url(#hglow)"/>

  <!-- Boden -->
  <rect x="0" y="700" width="1600" height="200" fill="url(#hfloor)"/>
  <line x1="0" y1="700" x2="1600" y2="700" stroke="#c9a76a" stroke-opacity="0.18" stroke-width="2"/>
  <ellipse cx="1000" cy="790" rx="470" ry="86" fill="#8a7454" opacity="0.16"/>

  <!-- Sofa -->
  <ellipse cx="1000" cy="706" rx="260" ry="18" fill="#000" opacity="0.35"/>
  <rect x="762" y="470" width="476" height="102" rx="24" fill="#2b2822"/>
  <rect x="778" y="522" width="444" height="120" rx="22" fill="#3a352c"/>
  <rect x="806" y="546" width="182" height="66" rx="16" fill="#8d7038" opacity="0.55"/>
  <rect x="1012" y="546" width="182" height="66" rx="16" fill="#8d7038" opacity="0.55"/>
  <rect x="744" y="496" width="46" height="146" rx="20" fill="#2b2822"/>
  <rect x="1210" y="496" width="46" height="146" rx="20" fill="#2b2822"/>
  <rect x="800" y="640" width="14" height="62" rx="5" fill="#b08d4a"/>
  <rect x="1186" y="640" width="14" height="62" rx="5" fill="#b08d4a"/>

  <!-- Stehleuchte -->
  <ellipse cx="1420" cy="704" rx="70" ry="14" fill="#000" opacity="0.3"/>
  <path d="M1362 300h116l30 92h-176z" fill="url(#hlamp)" opacity="0.9"/>
  <rect x="1414" y="392" width="10" height="298" fill="#b08d4a"/>
  <ellipse cx="1419" cy="694" rx="58" ry="12" fill="#2b2822"/>

  <!-- Beistelltisch -->
  <ellipse cx="640" cy="702" rx="86" ry="14" fill="#000" opacity="0.28"/>
  <ellipse cx="640" cy="596" rx="88" ry="16" fill="#4d4638"/>
  <rect x="634" y="600" width="12" height="94" fill="#b08d4a"/>
  <ellipse cx="640" cy="694" rx="46" ry="9" fill="#4d4638"/>

  <rect width="1600" height="900" fill="#16150f" opacity="0.08"/>
</svg>`;
}

/* Liefert das SVG-Markup für ein Produkt (variant 0–2 = leichte Farbvarianten) */
function artFor(product, variant = 0) {
  const order = [product.tone, "stone", "ink"];
  const tone = TONES[order[variant % order.length]] || TONES.sand;
  return (ART[product.shape] || ART.sofa)(tone);
}

/* --- Katalog --- */
const PRODUCTS = [
  {
    id: "sofa-milano",
    name: "Milano",
    category: "Sofas",
    shape: "sofa",
    tone: "sand",
    price: 8490,
    badge: "Neuheit",
    short: "Dreisitzer aus italienischem Anilinleder auf einem Rahmen aus massiver Eiche.",
    description: "Das Sofa Milano verbindet großzügige Proportionen mit einer bemerkenswert leichten Silhouette. Der Korpus wird in Handarbeit über einen Rahmen aus lufttrockneter Eiche gespannt, die Sitzkissen bestehen aus einem Kern aus Kaltschaum mit einer Auflage aus Gänsedaunen. Das pflanzlich gegerbte Anilinleder entwickelt über die Jahre eine eigene Patina.",
    material: "Anilinleder, Eiche massiv, Gänsedaunen",
    dimensions: "B 240 × T 98 × H 72 cm",
    weight: "68 kg",
    origin: "Manufaktur Brianza, Italien",
    lead: "10–12 Wochen",
    colors: [
      { name: "Cognac", hex: "#9a6a3f" },
      { name: "Sandbeige", hex: "#d9c9ae" },
      { name: "Anthrazit", hex: "#3a3a38" }
    ]
  },
  {
    id: "sofa-riviera",
    name: "Riviera",
    category: "Sofas",
    shape: "sofa",
    tone: "sage",
    price: 6950,
    short: "Modularer Zweisitzer mit Bezug aus belgischem Leinen.",
    description: "Riviera ist als modulares System konzipiert und lässt sich jederzeit erweitern. Der Bezug aus gewaschenem belgischem Leinen ist vollständig abnehmbar und waschbar. Die konisch gedrechselten Füße aus Messing geben dem Volumen optische Leichtigkeit.",
    material: "Belgisches Leinen, Buche, Messing",
    dimensions: "B 196 × T 94 × H 74 cm",
    weight: "52 kg",
    origin: "Atelier Flandern, Belgien",
    lead: "8–10 Wochen",
    colors: [
      { name: "Salbei", hex: "#9aa78d" },
      { name: "Elfenbein", hex: "#e8e0d2" },
      { name: "Taubenblau", hex: "#7d8a99" }
    ]
  },
  {
    id: "sessel-orsini",
    name: "Orsini",
    category: "Sessel",
    shape: "sessel",
    tone: "clay",
    price: 3280,
    badge: "Bestseller",
    short: "Loungesessel mit geschwungener Rückenlehne und Bouclé-Bezug.",
    description: "Ein Sessel, der zum Verweilen einlädt. Die umlaufende Rückenlehne wird aus einem Stück formverleimt und anschließend von Hand gepolstert. Der Bouclé-Bezug aus Schurwolle ist besonders strapazierfähig und angenehm warm.",
    material: "Bouclé aus Schurwolle, Formsperrholz, Messing",
    dimensions: "B 88 × T 84 × H 76 cm",
    weight: "24 kg",
    origin: "Werkstatt Kopenhagen, Dänemark",
    lead: "6–8 Wochen",
    colors: [
      { name: "Terrakotta", hex: "#b2705a" },
      { name: "Creme", hex: "#e6dcc9" },
      { name: "Nachtblau", hex: "#38445c" }
    ]
  },
  {
    id: "sessel-luca",
    name: "Luca",
    category: "Sessel",
    shape: "sessel",
    tone: "ink",
    price: 4150,
    short: "Ohrensessel in Samt mit hoher Rückenlehne.",
    description: "Luca zitiert die klassische Ohrensessel-Form und übersetzt sie in eine reduzierte Gegenwartssprache. Der Baumwollsamt ist lichtecht und schmutzabweisend ausgerüstet, die Federung besteht aus handgebundenen Stahlfedern.",
    material: "Baumwollsamt, Nussbaum, Stahlfedern",
    dimensions: "B 92 × T 90 × H 108 cm",
    weight: "31 kg",
    origin: "Manufaktur Rhein, Deutschland",
    lead: "8–10 Wochen",
    colors: [
      { name: "Tannengrün", hex: "#2f4438" },
      { name: "Bordeaux", hex: "#5d2b30" },
      { name: "Graphit", hex: "#33322e" }
    ]
  },
  {
    id: "tisch-atelier",
    name: "Atelier",
    category: "Tische",
    shape: "tisch",
    tone: "stone",
    price: 5890,
    short: "Esstisch aus Nussbaum massiv für acht Personen.",
    description: "Die Tischplatte wird aus durchgehenden Bohlen eines einzigen Nussbaumstamms gefertigt — jede Platte ist damit ein Unikat. Die Oberfläche ist mit Hartwachsöl behandelt und kann jederzeit partiell aufgearbeitet werden.",
    material: "Nussbaum massiv, Hartwachsöl",
    dimensions: "B 260 × T 100 × H 75 cm",
    weight: "94 kg",
    origin: "Schreinerei Schwarzwald, Deutschland",
    lead: "12–14 Wochen",
    colors: [
      { name: "Nussbaum natur", hex: "#6b4a30" },
      { name: "Eiche geräuchert", hex: "#4a3b2c" },
      { name: "Esche weiß", hex: "#d5c8b2" }
    ]
  },
  {
    id: "tisch-onda",
    name: "Onda",
    category: "Tische",
    shape: "tisch",
    tone: "rose",
    price: 2740,
    short: "Couchtisch mit Platte aus Travertin und Sockel aus Messing.",
    description: "Onda setzt einen ruhigen Gegenpol im Wohnraum. Die 4 cm starke Platte aus römischem Travertin ruht auf einem gebürsteten Messingsockel. Der Stein ist gegen Flecken imprägniert, behält aber seine offene, lebendige Struktur.",
    material: "Travertin, gebürstetes Messing",
    dimensions: "Ø 110 × H 34 cm",
    weight: "58 kg",
    origin: "Steinmetz Tivoli, Italien",
    lead: "10–12 Wochen",
    colors: [
      { name: "Travertin hell", hex: "#d8c6ad" },
      { name: "Marmor Nero", hex: "#3b3a38" },
      { name: "Marmor Verde", hex: "#5b6b58" }
    ]
  },
  {
    id: "stuhl-vela",
    name: "Vela",
    category: "Stühle",
    shape: "stuhl",
    tone: "sand",
    price: 690,
    short: "Esszimmerstuhl mit gepolsterter Sitzfläche und Eichengestell.",
    description: "Vela ist auf das Wesentliche reduziert: ein schlankes Gestell aus massiver Eiche, eine ergonomisch geformte Rückenlehne und eine großzügig gepolsterte Sitzfläche. Stapelbar bis vier Stück.",
    material: "Eiche massiv, Wollfilz",
    dimensions: "B 48 × T 54 × H 82 cm",
    weight: "6 kg",
    origin: "Werkstatt Jütland, Dänemark",
    lead: "4–6 Wochen",
    colors: [
      { name: "Naturweiß", hex: "#e3dccb" },
      { name: "Karamell", hex: "#b98d5c" },
      { name: "Schiefer", hex: "#4d5157" }
    ]
  },
  {
    id: "stuhl-marchese",
    name: "Marchese",
    category: "Stühle",
    shape: "stuhl",
    tone: "ink",
    price: 980,
    short: "Armlehnstuhl mit Lederbezug und Rahmen aus Nussbaum.",
    description: "Der Armlehnstuhl Marchese wurde für lange Abende am Tisch entworfen. Die Armlehnen sind aus dem Rahmen herausgearbeitet, der Sattelledersitz wird von Hand über einen Gurtboden gespannt.",
    material: "Sattelleder, Nussbaum massiv",
    dimensions: "B 58 × T 56 × H 84 cm",
    weight: "8 kg",
    origin: "Manufaktur Brianza, Italien",
    lead: "8–10 Wochen",
    colors: [
      { name: "Tabak", hex: "#7d5636" },
      { name: "Schwarz", hex: "#2b2a27" },
      { name: "Ocker", hex: "#a97f42" }
    ]
  },
  {
    id: "lampe-soleil",
    name: "Soleil",
    category: "Leuchten",
    shape: "lampe",
    tone: "sand",
    price: 1290,
    badge: "Limitiert",
    short: "Stehleuchte mit handgefaltetem Schirm aus Pergamentpapier.",
    description: "Der Schirm der Soleil wird von Hand aus Pergamentpapier gefaltet und über ein Gestell aus Messingdraht gespannt. Das Licht fällt weich und warm — ideal als Grundbeleuchtung neben dem Sofa. Dimmbar über einen Fußschalter.",
    material: "Pergamentpapier, Messing, Marmorfuß",
    dimensions: "Ø 46 × H 168 cm",
    weight: "9 kg",
    origin: "Atelier Lyon, Frankreich",
    lead: "6–8 Wochen",
    colors: [
      { name: "Naturpergament", hex: "#e5d3ab" },
      { name: "Alabaster", hex: "#ece7dc" },
      { name: "Kupfer", hex: "#a6663f" }
    ]
  },
  {
    id: "regal-biblio",
    name: "Biblio",
    category: "Aufbewahrung",
    shape: "regal",
    tone: "stone",
    price: 3960,
    short: "Bibliotheksregal aus geräucherter Eiche, vier Ebenen.",
    description: "Biblio ist ein Regal für Sammlungen. Die Böden sind in der Höhe verstellbar und tragen bis zu 60 kg pro Ebene. Die Verbindungen sind gezinkt und kommen ohne sichtbare Beschläge aus.",
    material: "Eiche geräuchert, Messingdübel",
    dimensions: "B 180 × T 38 × H 210 cm",
    weight: "86 kg",
    origin: "Schreinerei Schwarzwald, Deutschland",
    lead: "10–12 Wochen",
    colors: [
      { name: "Eiche geräuchert", hex: "#4a3b2c" },
      { name: "Eiche natur", hex: "#c1a37a" },
      { name: "Schwarz gebeizt", hex: "#2e2c28" }
    ]
  },
  {
    id: "sideboard-linea",
    name: "Linea",
    category: "Aufbewahrung",
    shape: "sideboard",
    tone: "clay",
    price: 4480,
    short: "Sideboard mit Schiebetüren und Innenausbau aus Ahorn.",
    description: "Hinter den grifflosen Schiebetüren von Linea verbirgt sich ein sorgfältig gearbeiteter Innenausbau aus hellem Ahorn mit verstellbaren Böden und zwei Schubladen mit Filzeinlage.",
    material: "Nussbaum, Ahorn, Messing",
    dimensions: "B 200 × T 45 × H 72 cm",
    weight: "74 kg",
    origin: "Manufaktur Rhein, Deutschland",
    lead: "10–12 Wochen",
    colors: [
      { name: "Nussbaum", hex: "#6b4a30" },
      { name: "Eiche natur", hex: "#c1a37a" },
      { name: "Olivgrün", hex: "#5a5f45" }
    ]
  },
  {
    id: "bett-sereno",
    name: "Sereno",
    category: "Betten",
    shape: "bett",
    tone: "sage",
    price: 5240,
    short: "Polsterbett mit hohem Kopfteil in Leinen.",
    description: "Das großzügige Kopfteil von Sereno ist in einzelne Segmente unterteilt und mit Rosshaar unterfüttert. Der Bettrahmen ist aus massiver Buche gezapft und trägt einen Lattenrost mit 42 Federleisten.",
    material: "Leinen, Buche massiv, Rosshaar",
    dimensions: "B 200 × L 220 × H 118 cm (Liegefläche 180 × 200)",
    weight: "88 kg",
    origin: "Manufaktur Rhein, Deutschland",
    lead: "12–14 Wochen",
    colors: [
      { name: "Salbei", hex: "#9aa78d" },
      { name: "Leinen natur", hex: "#ded3bd" },
      { name: "Rauchblau", hex: "#6e7d8a" }
    ]
  },
  {
    id: "teppich-nomade",
    name: "Nomade",
    category: "Accessoires",
    shape: "teppich",
    tone: "clay",
    price: 2180,
    short: "Handgeknüpfter Teppich aus Hochlandwolle.",
    description: "Nomade wird von Hand aus reiner Hochlandwolle geknüpft — rund 900 Arbeitsstunden stecken in einem Stück. Die leicht changierende Farbgebung entsteht durch die Färbung mit Pflanzenfarben.",
    material: "Hochlandwolle, pflanzengefärbt",
    dimensions: "300 × 200 cm",
    weight: "22 kg",
    origin: "Knüpferei Anatolien, Türkei",
    lead: "8–10 Wochen",
    colors: [
      { name: "Rost", hex: "#a5643f" },
      { name: "Sand", hex: "#d4c2a4" },
      { name: "Kohle", hex: "#484540" }
    ]
  },
  {
    id: "spiegel-luna",
    name: "Luna",
    category: "Accessoires",
    shape: "spiegel",
    tone: "rose",
    price: 1480,
    short: "Standspiegel mit Rahmen aus poliertem Messing.",
    description: "Luna ist ein Ganzkörperspiegel mit einem Rahmen aus poliertem Messing, der mit den Jahren sanft nachdunkelt. Das Kristallglas ist 6 mm stark und facettiert geschliffen.",
    material: "Poliertes Messing, Kristallglas",
    dimensions: "B 80 × H 190 cm",
    weight: "34 kg",
    origin: "Atelier Lyon, Frankreich",
    lead: "6–8 Wochen",
    colors: [
      { name: "Messing poliert", hex: "#b08d4a" },
      { name: "Bronze", hex: "#7d6144" },
      { name: "Schwarz matt", hex: "#2e2c28" }
    ]
  }
];

const CATEGORIES = ["Alle", "Sofas", "Sessel", "Tische", "Stühle", "Leuchten", "Aufbewahrung", "Betten", "Accessoires"];
