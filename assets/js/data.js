/* =========================================================
   MAISON NOIR — Produktdaten & Bildwelt
   Alle Abbildungen sind als SVG eingebettet, damit die
   Seite ohne externe Bilddateien überall funktioniert.
   ========================================================= */

/* --- Farbstimmungen für die Produktbilder ---
   Jede Stimmung beschreibt einen kleinen Raum: Wand, Lichtkegel, Boden
   und das Möbel selbst. Daraus baut scene() unten die Abbildung. --- */
const TONES = {
  sand:  { bg1:"#f3ecdf", bg2:"#e2d6c1", bg3:"#cabb9f", floor:"#c3b195", floorDeep:"#9e8c72", light:"#fff7e8", obj:"#3f3a30", accent:"#a9863f" },
  clay:  { bg1:"#f4e7dc", bg2:"#e3cabb", bg3:"#c9ac99", floor:"#c2a28f", floorDeep:"#9e7f69", light:"#fff2e7", obj:"#42332b", accent:"#96603c" },
  sage:  { bg1:"#ecefe4", bg2:"#d4dcca", bg3:"#b6c2a8", floor:"#afbba2", floorDeep:"#8b977e", light:"#f8fbf0", obj:"#333a31", accent:"#7d8a6a" },
  stone: { bg1:"#efeeea", bg2:"#dad9d3", bg3:"#bebdb5", floor:"#b8b6ae", floorDeep:"#95938b", light:"#fdfcf9", obj:"#35342f", accent:"#8b8778" },
  ink:   { bg1:"#46423a", bg2:"#2b2823", bg3:"#17160f", floor:"#201e17", floorDeep:"#0e0d09", light:"#e2c795", obj:"#e8e1d4", accent:"#c8a463" },
  rose:  { bg1:"#f6e9e5", bg2:"#e4ccc6", bg3:"#ccaea7", floor:"#c5a8a1", floorDeep:"#9f857f", light:"#fff1ec", obj:"#3d3230", accent:"#a4726a" }
};

/* Jede Abbildung braucht eigene Verlaufs-Kennungen, sonst greifen mehrere
   Bilder auf denselben Verlauf zu und zeigen dieselbe Farbe. */
let artSeq = 0;

/* --- Der Raum, in dem jedes Möbel steht --- */
function scene(t, build) {
  const id = "a" + (++artSeq);
  return `<svg viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img">
  <defs>
    <linearGradient id="${id}w" x1="0.1" y1="0" x2="0.8" y2="1">
      <stop offset="0" stop-color="${t.bg1}"/>
      <stop offset="0.52" stop-color="${t.bg2}"/>
      <stop offset="1" stop-color="${t.bg3}"/>
    </linearGradient>
    <radialGradient id="${id}p" cx="0.54" cy="0.34" r="0.52">
      <stop offset="0" stop-color="${t.light}" stop-opacity="0.9"/>
      <stop offset="0.5" stop-color="${t.light}" stop-opacity="0.32"/>
      <stop offset="1" stop-color="${t.light}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${t.floor}"/>
      <stop offset="1" stop-color="${t.floorDeep}"/>
    </linearGradient>
    <radialGradient id="${id}r" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${t.light}" stop-opacity="0.5"/>
      <stop offset="0.55" stop-color="${t.light}" stop-opacity="0.18"/>
      <stop offset="1" stop-color="${t.light}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="${id}s" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#000" stop-opacity="0.42"/>
      <stop offset="0.45" stop-color="#000" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="${id}v" cx="0.5" cy="0.4" r="0.78">
      <stop offset="0.42" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.26"/>
    </radialGradient>
  </defs>

  <rect width="800" height="1000" fill="url(#${id}w)"/>
  <rect width="800" height="1000" fill="url(#${id}p)"/>

  <rect x="0" y="720" width="800" height="280" fill="url(#${id}f)"/>
  <ellipse cx="400" cy="800" rx="420" ry="160" fill="url(#${id}r)"/>
  <line x1="0" y1="720" x2="800" y2="720" stroke="${t.light}" stroke-opacity="0.35" stroke-width="1.5"/>

  ${build(t, id)}

  <rect width="800" height="1000" fill="url(#${id}v)"/>
</svg>`;
}

/* Weicher Schlagschatten unter dem Möbel */
const shadow = (id, x, w) =>
  `<ellipse cx="${x}" cy="730" rx="${w * 1.2}" ry="30" fill="url(#${id}s)"/>`;

/* --- Möbel-Silhouetten --- */
const ART = {
  sofa: (t) => scene(t, (t, id) => `
    ${shadow(id, 400, 250)}
    <rect x="150" y="400" width="500" height="112" rx="26" fill="${t.obj}" opacity="0.84"/>
    <rect x="150" y="470" width="500" height="150" rx="28" fill="${t.obj}"/>
    <rect x="182" y="452" width="200" height="74" rx="18" fill="${t.accent}" opacity="0.5"/>
    <rect x="418" y="452" width="200" height="74" rx="18" fill="${t.accent}" opacity="0.5"/>
    <line x1="400" y1="470" x2="400" y2="618" stroke="${t.light}" stroke-opacity="0.16" stroke-width="2"/>
    <rect x="128" y="430" width="52" height="190" rx="24" fill="${t.obj}"/>
    <rect x="620" y="430" width="52" height="190" rx="24" fill="${t.obj}"/>
    <rect x="128" y="430" width="16" height="190" rx="8" fill="${t.light}" opacity="0.10"/>
    <rect x="196" y="618" width="16" height="100" rx="6" fill="${t.accent}"/>
    <rect x="588" y="618" width="16" height="100" rx="6" fill="${t.accent}"/>`),

  sessel: (t) => scene(t, (t, id) => `
    ${shadow(id, 400, 165)}
    <path d="M262 430c0-62 46-104 138-104s138 42 138 104v86H262z" fill="${t.obj}" opacity="0.86"/>
    <path d="M262 430c0-62 46-104 138-104v190h-138z" fill="${t.light}" opacity="0.07"/>
    <rect x="252" y="500" width="296" height="130" rx="30" fill="${t.obj}"/>
    <rect x="286" y="524" width="228" height="72" rx="20" fill="${t.accent}" opacity="0.45"/>
    <rect x="296" y="628" width="15" height="92" rx="6" fill="${t.accent}"/>
    <rect x="489" y="628" width="15" height="92" rx="6" fill="${t.accent}"/>`),

  tisch: (t) => scene(t, (t, id) => `
    ${shadow(id, 400, 240)}
    <rect x="150" y="452" width="500" height="30" rx="12" fill="${t.obj}"/>
    <rect x="150" y="452" width="500" height="9" rx="4" fill="${t.light}" opacity="0.18"/>
    <rect x="176" y="482" width="448" height="12" fill="${t.obj}" opacity="0.5"/>
    <rect x="214" y="494" width="20" height="226" fill="${t.obj}"/>
    <rect x="566" y="494" width="20" height="226" fill="${t.obj}"/>
    <rect x="214" y="588" width="372" height="14" fill="${t.accent}" opacity="0.72"/>`),

  stuhl: (t) => scene(t, (t, id) => `
    ${shadow(id, 400, 120)}
    <path d="M320 268h160c14 0 22 12 18 26l-44 176H346l-44-176c-4-14 4-26 18-26z" fill="${t.obj}" opacity="0.9"/>
    <path d="M320 268h56l-24 202h-6l-44-176c-4-14 4-26 18-26z" fill="${t.light}" opacity="0.08"/>
    <rect x="300" y="470" width="200" height="26" rx="10" fill="${t.obj}"/>
    <rect x="314" y="496" width="14" height="224" fill="${t.accent}"/>
    <rect x="472" y="496" width="14" height="224" fill="${t.accent}"/>
    <rect x="314" y="614" width="172" height="11" fill="${t.obj}" opacity="0.55"/>`),

  lampe: (t) => scene(t, (t, id) => `
    ${shadow(id, 400, 110)}
    <ellipse cx="400" cy="420" rx="250" ry="180" fill="${t.light}" opacity="0.28"/>
    <path d="M296 236h208l58 168H238z" fill="${t.accent}" opacity="0.72"/>
    <path d="M296 236h104v168H238z" fill="${t.light}" opacity="0.2"/>
    <path d="M296 236h208l58 168H238z" fill="none" stroke="${t.obj}" stroke-opacity="0.3" stroke-width="4"/>
    <rect x="392" y="404" width="16" height="292" fill="${t.obj}"/>
    <ellipse cx="400" cy="700" rx="96" ry="20" fill="${t.obj}"/>`),

  regal: (t) => scene(t, (t, id) => `
    ${shadow(id, 400, 210)}
    <rect x="206" y="206" width="388" height="512" fill="${t.obj}" opacity="0.10"/>
    <rect x="206" y="206" width="18" height="512" fill="${t.obj}"/>
    <rect x="576" y="206" width="18" height="512" fill="${t.obj}"/>
    <rect x="206" y="206" width="388" height="16" fill="${t.obj}"/>
    <rect x="206" y="368" width="388" height="14" fill="${t.obj}" opacity="0.85"/>
    <rect x="206" y="530" width="388" height="14" fill="${t.obj}" opacity="0.85"/>
    <rect x="206" y="702" width="388" height="16" fill="${t.obj}"/>
    <rect x="240" y="292" width="86" height="76" fill="${t.accent}" opacity="0.6"/>
    <circle cx="500" cy="330" r="36" fill="${t.accent}" opacity="0.42"/>
    <rect x="404" y="470" width="60" height="60" fill="${t.accent}" opacity="0.48"/>
    <rect x="252" y="466" width="54" height="64" fill="${t.obj}" opacity="0.5"/>`),

  bett: (t) => scene(t, (t, id) => `
    ${shadow(id, 400, 268)}
    <rect x="212" y="272" width="376" height="198" rx="18" fill="${t.obj}" opacity="0.86"/>
    <line x1="400" y1="278" x2="400" y2="464" stroke="${t.light}" stroke-opacity="0.14" stroke-width="2"/>
    <rect x="140" y="468" width="520" height="132" rx="16" fill="${t.obj}"/>
    <rect x="172" y="440" width="150" height="58" rx="18" fill="${t.accent}" opacity="0.55"/>
    <rect x="340" y="440" width="150" height="58" rx="18" fill="${t.accent}" opacity="0.55"/>
    <rect x="140" y="600" width="520" height="26" rx="8" fill="${t.accent}" opacity="0.58"/>
    <rect x="164" y="626" width="16" height="94" fill="${t.obj}"/>
    <rect x="620" y="626" width="16" height="94" fill="${t.obj}"/>`),

  sideboard: (t) => scene(t, (t, id) => `
    ${shadow(id, 400, 230)}
    <rect x="164" y="404" width="472" height="234" rx="10" fill="${t.obj}"/>
    <rect x="164" y="404" width="472" height="10" rx="5" fill="${t.light}" opacity="0.14"/>
    <line x1="400" y1="414" x2="400" y2="638" stroke="${t.bg1}" stroke-opacity="0.3" stroke-width="3"/>
    <rect x="336" y="506" width="128" height="9" rx="4" fill="${t.accent}"/>
    <rect x="196" y="638" width="16" height="82" fill="${t.accent}"/>
    <rect x="588" y="638" width="16" height="82" fill="${t.accent}"/>`),

  teppich: (t) => scene(t, (t, id) => `
    <ellipse cx="400" cy="566" rx="272" ry="152" fill="#000" opacity="0.12"/>
    <ellipse cx="400" cy="560" rx="270" ry="150" fill="${t.obj}" opacity="0.85"/>
    <ellipse cx="400" cy="560" rx="212" ry="115" fill="none" stroke="${t.accent}" stroke-width="10" opacity="0.75"/>
    <ellipse cx="400" cy="560" rx="140" ry="72" fill="none" stroke="${t.bg1}" stroke-width="8" opacity="0.45"/>
    <ellipse cx="400" cy="560" rx="66" ry="32" fill="${t.accent}" opacity="0.7"/>`),

  spiegel: (t) => scene(t, (t, id) => `
    ${shadow(id, 400, 130)}
    <rect x="272" y="180" width="256" height="472" rx="128" fill="${t.accent}" opacity="0.82"/>
    <rect x="294" y="202" width="212" height="428" rx="106" fill="${t.bg1}" opacity="0.88"/>
    <path d="M330 560c0-108 34-206 92-282" stroke="#fff" stroke-opacity="0.45" stroke-width="14" fill="none" stroke-linecap="round"/>
    <rect x="356" y="652" width="88" height="68" rx="8" fill="${t.obj}"/>`)
};

/* --- Bühnenbild für die Startseite ---
   Ein abendlicher Raum: Bogenfenster mit Dämmerungslicht, Vorhang,
   Parkettboden mit Lichtspiegelung, Sofa, Stehleuchte, Beistelltisch. --- */
function heroScene() {
  const planks = [];
  for (let i = 0; i < 9; i++) {
    const y = 664 + Math.pow(i / 8, 1.7) * 236;
    planks.push(`<line x1="0" y1="${y.toFixed(0)}" x2="1600" y2="${y.toFixed(0)}" stroke="#a98d5f" stroke-opacity="${(0.05 + i * 0.012).toFixed(3)}" stroke-width="1.5"/>`);
  }
  const panels = [];
  for (let i = 0; i < 3; i++) {
    const x = 96 + i * 190;
    panels.push(`<rect x="${x}" y="150" width="150" height="430" rx="4" fill="none" stroke="#e7d3aa" stroke-opacity="0.035" stroke-width="2"/>`);
  }

  return `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Abendlicher Wohnraum mit Sofa, Stehleuchte und Bogenfenster">
  <defs>
    <linearGradient id="hWall" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stop-color="#3b362d"/>
      <stop offset="0.5" stop-color="#241f19"/>
      <stop offset="1" stop-color="#131209"/>
    </linearGradient>
    <linearGradient id="hSky" x1="0" y1="0" x2="0.2" y2="1">
      <stop offset="0" stop-color="#6d5636"/>
      <stop offset="0.45" stop-color="#b98f57"/>
      <stop offset="1" stop-color="#f0d3a0"/>
    </linearGradient>
    <radialGradient id="hGlow" cx="0.74" cy="0.34" r="0.5">
      <stop offset="0" stop-color="#f2d194" stop-opacity="0.5"/>
      <stop offset="0.4" stop-color="#c99a55" stop-opacity="0.2"/>
      <stop offset="1" stop-color="#c99a55" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="hCurtain" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#efdcb8" stop-opacity="0.22"/>
      <stop offset="0.55" stop-color="#efdcb8" stop-opacity="0.05"/>
      <stop offset="1" stop-color="#efdcb8" stop-opacity="0.16"/>
    </linearGradient>
    <linearGradient id="hFloor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#5a4e3d"/>
      <stop offset="0.3" stop-color="#3a3227"/>
      <stop offset="1" stop-color="#191712"/>
    </linearGradient>
    <linearGradient id="hPool" x1="0" y1="664" x2="0" y2="900" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#f2d194" stop-opacity="0.26"/>
      <stop offset="1" stop-color="#f2d194" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="hPool2" gradientUnits="userSpaceOnUse" cx="1200" cy="720" r="460">
      <stop offset="0" stop-color="#f2d194" stop-opacity="0.2"/>
      <stop offset="0.5" stop-color="#f2d194" stop-opacity="0.07"/>
      <stop offset="1" stop-color="#f2d194" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="hSoft" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#000" stop-opacity="0.72"/>
      <stop offset="0.5" stop-color="#000" stop-opacity="0.26"/>
      <stop offset="1" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="hLamp" gradientUnits="userSpaceOnUse" cx="1420" cy="368" r="380">
      <stop offset="0" stop-color="#ffe6b4" stop-opacity="0.34"/>
      <stop offset="0.3" stop-color="#ffe6b4" stop-opacity="0.13"/>
      <stop offset="0.65" stop-color="#ffe6b4" stop-opacity="0.03"/>
      <stop offset="1" stop-color="#ffe6b4" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="hShade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f9e6bc"/>
      <stop offset="1" stop-color="#d6ac6b"/>
    </linearGradient>
    <radialGradient id="hVig" cx="0.6" cy="0.44" r="0.72">
      <stop offset="0.38" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.62"/>
    </radialGradient>
  </defs>

  <rect width="1600" height="900" fill="url(#hWall)"/>
  ${panels.join("")}
  <line x1="0" y1="118" x2="1600" y2="118" stroke="#e7d3aa" stroke-opacity="0.07" stroke-width="3"/>

  <path d="M1002 664V330c0-108 88-196 196-196s196 88 196 196v334z" fill="url(#hSky)" opacity="0.92"/>
  <line x1="1198" y1="140" x2="1198" y2="664" stroke="#241f19" stroke-opacity="0.4" stroke-width="6"/>
  <line x1="1002" y1="392" x2="1394" y2="392" stroke="#241f19" stroke-opacity="0.4" stroke-width="6"/>
  <path d="M1002 664V330c0-108 88-196 196-196s196 88 196 196v334z" fill="none" stroke="#e7d3aa" stroke-opacity="0.22" stroke-width="5"/>

  <g fill="url(#hCurtain)">
    <path d="M946 120h34c-6 130-10 320-6 544h-32c-4-224 0-414 4-544z"/>
    <path d="M980 120h30c-4 132-6 322-2 544h-34c-4-222 0-412 6-544z"/>
    <path d="M1010 120h26c-2 134-2 324 2 544h-30c-4-222-2-412 2-544z"/>
    <path d="M1364 120h30c4 132 8 322 12 544h-32c-6-222-10-412-10-544z"/>
    <path d="M1394 120h32c6 132 12 322 20 544h-30c-8-222-16-412-22-544z"/>
    <path d="M1426 120h28c8 132 18 322 30 544h-30c-10-222-20-412-28-544z"/>
  </g>

  <rect width="1600" height="900" fill="url(#hGlow)"/>

  <rect x="0" y="664" width="1600" height="236" fill="url(#hFloor)"/>
  ${planks.join("")}
  <path d="M1002 664h392l186 236H840z" fill="url(#hPool)" opacity="0.5"/>
  <rect x="0" y="664" width="1600" height="236" fill="url(#hPool2)"/>
  <line x1="0" y1="664" x2="1600" y2="664" stroke="#e7d3aa" stroke-opacity="0.16" stroke-width="2"/>

  <ellipse cx="1060" cy="790" rx="500" ry="96" fill="#8a7454" opacity="0.13"/>
  <ellipse cx="1060" cy="790" rx="500" ry="96" fill="none" stroke="#c8a463" stroke-opacity="0.07" stroke-width="2"/>

  <rect width="1600" height="900" fill="url(#hLamp)"/>

  <ellipse cx="1010" cy="700" rx="300" ry="34" fill="url(#hSoft)"/>
  <rect x="768" y="464" width="484" height="106" rx="26" fill="#2a2721"/>
  <rect x="768" y="464" width="484" height="12" rx="6" fill="#e7d3aa" opacity="0.09"/>
  <rect x="784" y="520" width="452" height="124" rx="24" fill="#39342b"/>
  <rect x="812" y="546" width="186" height="68" rx="16" fill="#8d7038" opacity="0.5"/>
  <rect x="1022" y="546" width="186" height="68" rx="16" fill="#8d7038" opacity="0.5"/>
  <rect x="748" y="492" width="48" height="152" rx="22" fill="#2a2721"/>
  <rect x="1216" y="492" width="48" height="152" rx="22" fill="#2a2721"/>
  <rect x="1216" y="492" width="14" height="152" rx="7" fill="#e7d3aa" opacity="0.10"/>
  <rect x="806" y="642" width="14" height="62" rx="5" fill="#b08d4a"/>
  <rect x="1192" y="642" width="14" height="62" rx="5" fill="#b08d4a"/>

  <ellipse cx="1420" cy="702" rx="92" ry="20" fill="url(#hSoft)"/>
  <path d="M1360 296h120l32 96h-184z" fill="url(#hShade)"/>
  <path d="M1360 296h44l-20 96h-92z" fill="#fff" opacity="0.16"/>
  <rect x="1415" y="392" width="10" height="300" fill="#b08d4a"/>
  <ellipse cx="1420" cy="692" rx="56" ry="12" fill="#2a2721"/>

  <rect width="1600" height="900" fill="url(#hVig)"/>
</svg>`;
}

/* Liefert das SVG-Markup für ein Produkt (variant 0–2 = Farbvarianten) */
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
