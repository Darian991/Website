/* =========================================================
   MAISON NOIR — Produktdaten & Bildwelt
   Alle Abbildungen sind als SVG eingebettet, damit die
   Seite ohne externe Bilddateien überall funktioniert.
   ========================================================= */

/* --- Zwei Aufnahmestimmungen ---
   Die Broschüre zeigt Möbel wie im Studio fotografiert: heller,
   neutraler Grund, weiches Licht, ein ruhiger Schatten. Dunkle Möbel
   stehen hell, helle Möbel dunkel — sonst verschwinden sie. --- */
const TONES = {
  studio: { bg1:"#ffffff", bg2:"#f4f2ef", bg3:"#e4e0d9", floor:"#eae6e0", floorDeep:"#d3cec6",
            light:"#ffffff", obj:"#3a3229", accent:"#a09589" },
  tief:   { bg1:"#6b6259", bg2:"#4a423a", bg3:"#302a24", floor:"#3a332c", floorDeep:"#221d18",
            light:"#d6cec3", obj:"#f0ece5", accent:"#a09589" }
};

let artSeq = 0;

/* --- Der Raum, in dem jedes Möbel steht --- */
/* --- Die vier Ansichten eines Stücks ---
   Dieselbe Zeichnung, vier Blickwinkel: von vorn, leicht gedreht, als
   Ausschnitt und aus der Entfernung im Raum. Umgesetzt über Bildausschnitt
   und eine Verformung — so gilt es für jede Möbelform gleichermaßen. */
const VIEWS = [
  { key: "front",  box: "0 0 800 1000" },
  { key: "winkel", box: "0 0 800 1000",
    // Seitlich gestaucht statt geschert: so wirkt das Stück gedreht,
    // ohne dass die Senkrechten kippen.
    tf: "translate(400 720) rotate(-1) scale(0.82 1.02) translate(-400 -720)", licht: 0.78 },
  { key: "detail", box: "215 400 380 380" },
  { key: "raum",   box: "-230 -150 1260 1575", licht: 1.25 }
];

function scene(t, build, viewIndex) {
  const id = "a" + (++artSeq);
  const v = VIEWS[viewIndex] || VIEWS[0];
  // Der Grund reicht weit über das Bild hinaus, damit auch der weite
  // Ausschnitt („im Raum“) keine leeren Ränder zeigt.
  const G = { x: -400, y: -400, w: 1700, h: 2000 };
  const inhalt = build(t, id);
  return `<svg viewBox="${v.box}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img">
  <defs>
    <linearGradient id="${id}w" x1="0.1" y1="0" x2="0.8" y2="1">
      <stop offset="0" stop-color="${t.bg1}"/>
      <stop offset="0.52" stop-color="${t.bg2}"/>
      <stop offset="1" stop-color="${t.bg3}"/>
    </linearGradient>
    <radialGradient id="${id}p" gradientUnits="userSpaceOnUse" cx="430" cy="340" r="${520 * (v.licht || 1)}">
      <stop offset="0" stop-color="${t.light}" stop-opacity="0.9"/>
      <stop offset="0.5" stop-color="${t.light}" stop-opacity="0.32"/>
      <stop offset="1" stop-color="${t.light}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="${id}f" gradientUnits="userSpaceOnUse" x1="0" y1="720" x2="0" y2="1200">
      <stop offset="0" stop-color="${t.floor}"/>
      <stop offset="1" stop-color="${t.floorDeep}"/>
    </linearGradient>
    <radialGradient id="${id}r" gradientUnits="userSpaceOnUse" cx="400" cy="800" r="420">
      <stop offset="0" stop-color="${t.light}" stop-opacity="0.5"/>
      <stop offset="0.55" stop-color="${t.light}" stop-opacity="0.18"/>
      <stop offset="1" stop-color="${t.light}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="${id}s" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#000" stop-opacity="0.42"/>
      <stop offset="0.45" stop-color="#000" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="${id}v" gradientUnits="userSpaceOnUse" cx="400" cy="400" r="820">
      <stop offset="0.42" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.26"/>
    </radialGradient>
  </defs>

  <rect x="${G.x}" y="${G.y}" width="${G.w}" height="${G.h}" fill="url(#${id}w)"/>
  <rect x="${G.x}" y="${G.y}" width="${G.w}" height="${G.h}" fill="url(#${id}p)"/>

  <rect x="${G.x}" y="720" width="${G.w}" height="${G.h + G.y - 720}" fill="url(#${id}f)"/>
  <ellipse cx="400" cy="800" rx="420" ry="160" fill="url(#${id}r)"/>
  <line x1="${G.x}" y1="720" x2="${G.x + G.w}" y2="720" stroke="${t.light}" stroke-opacity="0.35" stroke-width="1.5"/>

  ${v.tf ? `<g transform="${v.tf}">${inhalt}</g>` : inhalt}

  <rect x="${G.x}" y="${G.y}" width="${G.w}" height="${G.h}" fill="url(#${id}v)"/>
</svg>`;
}

/* Weicher Schlagschatten unter dem Möbel */
const shadow = (id, x, w) =>
  `<ellipse cx="${x}" cy="730" rx="${w * 1.2}" ry="30" fill="url(#${id}s)"/>`;

/* --- Möbel-Silhouetten --- */
const ART = {
  sofa: (t, v) => scene(t, (t, id) => `
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
    <rect x="588" y="618" width="16" height="100" rx="6" fill="${t.accent}"/>`, v),

  sessel: (t, v) => scene(t, (t, id) => `
    ${shadow(id, 400, 165)}
    <path d="M262 430c0-62 46-104 138-104s138 42 138 104v86H262z" fill="${t.obj}" opacity="0.86"/>
    <path d="M262 430c0-62 46-104 138-104v190h-138z" fill="${t.light}" opacity="0.07"/>
    <rect x="252" y="500" width="296" height="130" rx="30" fill="${t.obj}"/>
    <rect x="286" y="524" width="228" height="72" rx="20" fill="${t.accent}" opacity="0.45"/>
    <rect x="296" y="628" width="15" height="92" rx="6" fill="${t.accent}"/>
    <rect x="489" y="628" width="15" height="92" rx="6" fill="${t.accent}"/>`, v),

  tisch: (t, v) => scene(t, (t, id) => `
    ${shadow(id, 400, 240)}
    <rect x="150" y="452" width="500" height="30" rx="12" fill="${t.obj}"/>
    <rect x="150" y="452" width="500" height="9" rx="4" fill="${t.light}" opacity="0.18"/>
    <rect x="176" y="482" width="448" height="12" fill="${t.obj}" opacity="0.5"/>
    <rect x="214" y="494" width="20" height="226" fill="${t.obj}"/>
    <rect x="566" y="494" width="20" height="226" fill="${t.obj}"/>
    <rect x="214" y="588" width="372" height="14" fill="${t.accent}" opacity="0.72"/>`, v),

  stuhl: (t, v) => scene(t, (t, id) => `
    ${shadow(id, 400, 120)}
    <path d="M320 268h160c14 0 22 12 18 26l-44 176H346l-44-176c-4-14 4-26 18-26z" fill="${t.obj}" opacity="0.9"/>
    <path d="M320 268h56l-24 202h-6l-44-176c-4-14 4-26 18-26z" fill="${t.light}" opacity="0.08"/>
    <rect x="300" y="470" width="200" height="26" rx="10" fill="${t.obj}"/>
    <rect x="314" y="496" width="14" height="224" fill="${t.accent}"/>
    <rect x="472" y="496" width="14" height="224" fill="${t.accent}"/>
    <rect x="314" y="614" width="172" height="11" fill="${t.obj}" opacity="0.55"/>`, v),

  lampe: (t, v) => scene(t, (t, id) => `
    ${shadow(id, 400, 110)}
    <ellipse cx="400" cy="420" rx="250" ry="180" fill="${t.light}" opacity="0.28"/>
    <path d="M296 236h208l58 168H238z" fill="${t.accent}" opacity="0.72"/>
    <path d="M296 236h104v168H238z" fill="${t.light}" opacity="0.2"/>
    <path d="M296 236h208l58 168H238z" fill="none" stroke="${t.obj}" stroke-opacity="0.3" stroke-width="4"/>
    <rect x="392" y="404" width="16" height="292" fill="${t.obj}"/>
    <ellipse cx="400" cy="700" rx="96" ry="20" fill="${t.obj}"/>`, v),

  haengeleuchte: (t, v) => scene(t, (t, id) => `
    <ellipse cx="400" cy="820" rx="230" ry="60" fill="${t.light}" opacity="0.5"/>
    <ellipse cx="400" cy="118" rx="62" ry="9" fill="${t.obj}" opacity="0.55"/>
    <rect x="395" y="118" width="10" height="132" fill="${t.obj}" opacity="0.75"/>
    <rect x="196" y="250" width="408" height="11" rx="5" fill="${t.obj}"/>
    ${[0,1,2,3,4].map((i) => {
      const x = 226 + i * 87;
      const len = [206, 292, 158, 268, 194][i];
      return `<rect x="${x - 2}" y="261" width="4" height="${len}" fill="${t.obj}" opacity="0.6"/>
              <ellipse cx="${x}" cy="${261 + len + 34}" rx="35" ry="42" fill="${t.accent}" opacity="0.55"/>
              <ellipse cx="${x - 11}" cy="${261 + len + 22}" rx="11" ry="14" fill="${t.light}" opacity="0.6"/>`;
    }).join("")}`, v),

  regal: (t, v) => scene(t, (t, id) => `
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
    <rect x="252" y="466" width="54" height="64" fill="${t.obj}" opacity="0.5"/>`, v),

  bett: (t, v) => scene(t, (t, id) => `
    ${shadow(id, 400, 268)}
    <rect x="212" y="272" width="376" height="198" rx="18" fill="${t.obj}" opacity="0.86"/>
    <line x1="400" y1="278" x2="400" y2="464" stroke="${t.light}" stroke-opacity="0.14" stroke-width="2"/>
    <rect x="140" y="468" width="520" height="132" rx="16" fill="${t.obj}"/>
    <rect x="172" y="440" width="150" height="58" rx="18" fill="${t.accent}" opacity="0.55"/>
    <rect x="340" y="440" width="150" height="58" rx="18" fill="${t.accent}" opacity="0.55"/>
    <rect x="140" y="600" width="520" height="26" rx="8" fill="${t.accent}" opacity="0.58"/>
    <rect x="164" y="626" width="16" height="94" fill="${t.obj}"/>
    <rect x="620" y="626" width="16" height="94" fill="${t.obj}"/>`, v),

  sideboard: (t, v) => scene(t, (t, id) => `
    ${shadow(id, 400, 230)}
    <rect x="164" y="404" width="472" height="234" rx="10" fill="${t.obj}"/>
    <rect x="164" y="404" width="472" height="10" rx="5" fill="${t.light}" opacity="0.14"/>
    <line x1="400" y1="414" x2="400" y2="638" stroke="${t.bg1}" stroke-opacity="0.3" stroke-width="3"/>
    <rect x="336" y="506" width="128" height="9" rx="4" fill="${t.accent}"/>
    <rect x="196" y="638" width="16" height="82" fill="${t.accent}"/>
    <rect x="588" y="638" width="16" height="82" fill="${t.accent}"/>`, v),

  teppich: (t, v) => scene(t, (t, id) => `
    <ellipse cx="400" cy="566" rx="272" ry="152" fill="#000" opacity="0.12"/>
    <ellipse cx="400" cy="560" rx="270" ry="150" fill="${t.obj}" opacity="0.85"/>
    <ellipse cx="400" cy="560" rx="212" ry="115" fill="none" stroke="${t.accent}" stroke-width="10" opacity="0.75"/>
    <ellipse cx="400" cy="560" rx="140" ry="72" fill="none" stroke="${t.bg1}" stroke-width="8" opacity="0.45"/>
    <ellipse cx="400" cy="560" rx="66" ry="32" fill="${t.accent}" opacity="0.7"/>`, v),

  spiegel: (t, v) => scene(t, (t, id) => `
    ${shadow(id, 400, 130)}
    <rect x="272" y="180" width="256" height="472" rx="128" fill="${t.accent}" opacity="0.82"/>
    <rect x="294" y="202" width="212" height="428" rx="106" fill="${t.bg1}" opacity="0.88"/>
    <path d="M330 560c0-108 34-206 92-282" stroke="#fff" stroke-opacity="0.45" stroke-width="14" fill="none" stroke-linecap="round"/>
    <rect x="356" y="652" width="88" height="68" rx="8" fill="${t.obj}"/>`, v)
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

/* Helligkeit eines Farbwerts (0 = schwarz, 1 = weiß) */
function luminance(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/* Zeigt das Produkt in der gewählten Ausführung.
   Helle Möbel stehen dabei in einem dunklen Raum und umgekehrt — sonst
   verschwindet ein cremefarbenes Sofa vor einer cremefarbenen Wand. */
function artFor(product, colorIndex = 0, viewIndex = 0) {
  /* Liegt eine Fotostrecke vor, geht sie der Zeichnung vor. Die Ansichten
     der Galerie werden dann zu den Bildern der Strecke. */
  if (product.photos && product.photos.length) {
    const src = product.photos[viewIndex % product.photos.length];
    return `<img src="${src}" alt="${product.name}" loading="lazy" decoding="async">`;
  }
  const hex = product.swatches[colorIndex] || product.swatches[0];
  // Helle Möbel vor dunklem Grund, dunkle vor hellem.
  const base = luminance(hex) > 0.62 ? TONES.tief : TONES.studio;
  const tone = Object.assign({}, base, { obj: hex });
  return (ART[product.shape] || ART.sofa)(tone, viewIndex);
}

/* --- Katalog ---
   Sprachunabhängig: id, Kategorie, Form, Farbstimmung, Preis, Gewicht,
   Farbwerte. Alles Sprachliche steht unter t.<sprache>. --- */
const PRODUCTS = [
  {
    /* Einziges Stück mit echter Fotostrecke statt Zeichnung. */
    id: "leuchte-artischocke", used: true, stueck: 2, grade: "sehrgut", year: "2016", name: "PH Artichoke", categoryKey: "leuchten", shape: "haengeleuchte", tone: "sand",
    price: 4900, weight: "12 kg", swatches: ["#b87333"],
    photos: ["assets/img/ph-artichoke-1.jpg", "assets/img/ph-artichoke-2.jpg", "assets/img/ph-artichoke-3.jpg", "assets/img/ph-artichoke-4.jpg"],
    t: {
      de: { short: "H\u00e4ngeleuchte von Poul Henningsen, 72 Kupferbl\u00e4tter, gebaut von Louis Poulsen.",
        description: "Die PH Artichoke entwarf Poul Henningsen 1958 f\u00fcr den Langelinie-Pavillon in Kopenhagen; gebaut wird sie seither von Louis Poulsen. Zw\u00f6lf Reihen mit insgesamt 72 Kupferbl\u00e4ttern verdecken das Leuchtmittel vollst\u00e4ndig \u2014 aus jedem Winkel des Raumes sieht man nur weiches, reflektiertes Licht, nie die Lampe selbst. Dieses Exemplar hing in einem Privathaus am Elbhang. Das Kupfer hat die ungleichm\u00e4\u00dfige Patina angesetzt, die diese Leuchte erst sch\u00f6n macht; die Elektrik haben wir gepr\u00fcft und auf LED umgestellt.",
        material: "Kupfer, verchromter Stahl", dimensions: "\u00d8 60 \u00d7 H 52 cm, Abh\u00e4ngung bis 300 cm",
        origin: "Louis Poulsen, D\u00e4nemark", lead: "sofort verf\u00fcgbar", colors: ["Kupfer"] },
      en: { short: "Pendant by Poul Henningsen, 72 copper leaves, built by Louis Poulsen.",
        description: "Poul Henningsen designed the PH Artichoke in 1958 for the Langelinie Pavilion in Copenhagen; Louis Poulsen has built it ever since. Twelve rows of 72 copper leaves hide the bulb completely \u2014 from any angle in the room you see only soft reflected light, never the lamp itself. This piece hung in a private house on the Elbe hillside. The copper has taken on the uneven patina that makes this lamp what it is; we have tested the wiring and converted it to LED.",
        material: "Copper, chrome-plated steel", dimensions: "\u00d8 60 \u00d7 H 52 cm, drop up to 300 cm",
        origin: "Louis Poulsen, Denmark", lead: "available now", colors: ["Copper"] },
      fr: { short: "Suspension de Poul Henningsen, 72 feuilles de cuivre, fabriqu\u00e9e par Louis Poulsen.",
        description: "Poul Henningsen a dessin\u00e9 la PH Artichoke en 1958 pour le pavillon Langelinie de Copenhague ; Louis Poulsen la fabrique depuis. Douze rang\u00e9es de 72 feuilles de cuivre masquent enti\u00e8rement la source \u2014 de tout point de la pi\u00e8ce on ne voit qu\u2019une lumi\u00e8re douce et r\u00e9fl\u00e9chie, jamais la lampe. Cet exemplaire a \u00e9clair\u00e9 une maison priv\u00e9e sur les hauteurs de l\u2019Elbe. Le cuivre a pris la patine irr\u00e9guli\u00e8re qui fait tout le charme de cette suspension ; l\u2019\u00e9lectricit\u00e9 a \u00e9t\u00e9 contr\u00f4l\u00e9e et convertie en LED.",
        material: "Cuivre, acier chrom\u00e9", dimensions: "\u00d8 60 \u00d7 H 52 cm, hauteur jusqu\u2019\u00e0 300 cm",
        origin: "Louis Poulsen, Danemark", lead: "disponible imm\u00e9diatement", colors: ["Cuivre"] },
      es: { short: "L\u00e1mpara de suspensi\u00f3n de Poul Henningsen, 72 hojas de cobre, fabricada por Louis Poulsen.",
        description: "Poul Henningsen dise\u00f1\u00f3 la PH Artichoke en 1958 para el pabell\u00f3n Langelinie de Copenhague; Louis Poulsen la fabrica desde entonces. Doce hileras con 72 hojas de cobre ocultan por completo la bombilla \u2014 desde cualquier punto de la estancia solo se ve luz reflejada y suave, nunca la l\u00e1mpara. Esta pieza estuvo en una casa particular sobre la ladera del Elba. El cobre ha adquirido la p\u00e1tina irregular que da car\u00e1cter a esta l\u00e1mpara; hemos revisado la instalaci\u00f3n el\u00e9ctrica y la hemos convertido a LED.",
        material: "Cobre, acero cromado", dimensions: "\u00d8 60 \u00d7 Al 52 cm, ca\u00edda hasta 300 cm",
        origin: "Louis Poulsen, Dinamarca", lead: "disponible ahora", colors: ["Cobre"] }
    }
  },
  {
    id: "sessel-salina", used: true, grade: "sehrgut", year: "2019", name: "Salina", categoryKey: "sessel", shape: "sessel", tone: "sand",
    price: 900, weight: "28 kg", swatches: ["#ded7c9"],
    photos: ["assets/img/sessel-salina-1.jpg", "assets/img/sessel-salina-2.jpg", "assets/img/sessel-salina-3.jpg"],
    t: {
      de: { short: "Breiter Sessel mit losem Leinenbezug, Sch\u00fcrze und Paspel.",
        description: "Ein Sessel, in dem man quer sitzen kann: breite Sitzfl\u00e4che, weiche Kissen, eine Lehne, die nach hinten nachgibt. Der Bezug aus gewaschenem Leinen liegt lose auf, l\u00e4uft unten in eine Sch\u00fcrze aus und ist an den Kanten mit Paspel gefasst. Er l\u00e4sst sich abziehen und waschen; der vorhandene ist fleckenfrei und nur an den Armkanten leicht wei\u00df gerieben, wie es Leinen tut. Teppich, Beistelltisch und Kissen der Aufnahmen geh\u00f6ren nicht zum Angebot.",
        material: "Leinenbezug abnehmbar, Federkern, Massivholzrahmen", dimensions: "B 100 \u00d7 T 95 \u00d7 H 88 cm, Sitzh\u00f6he 45 cm",
        origin: "Polsterei Brianza, Italien", lead: "sofort verf\u00fcgbar", colors: ["Naturleinen"] },
      en: { short: "Wide armchair with a loose linen cover, skirt and piping.",
        description: "An armchair you can sit across: a wide seat, soft cushions, a back that gives a little. The washed linen cover sits loose, runs out into a skirt at the bottom and is piped along the edges. It can be taken off and washed; the one on it is unstained and only lightly rubbed pale along the arm edges, as linen does. Rug, side table and cushions in the photographs are not part of the offer.",
        material: "Removable linen cover, sprung seat, solid timber frame", dimensions: "W 100 \u00d7 D 95 \u00d7 H 88 cm, seat height 45 cm",
        origin: "Brianza upholstery, Italy", lead: "available now", colors: ["Natural linen"] },
      fr: { short: "Large fauteuil \u00e0 housse de lin amovible, jupe et passepoil.",
        description: "Un fauteuil o\u00f9 l\u2019on peut s\u2019asseoir en travers : assise large, coussins souples, dossier qui c\u00e8de un peu. La housse en lin lav\u00e9 est pos\u00e9e librement, se termine en jupe et se borde d\u2019un passepoil. Elle se retire et se lave ; celle-ci est sans taches, \u00e0 peine blanchie sur l\u2019ar\u00eate des accoudoirs, comme le fait le lin. Le tapis, la table d\u2019appoint et les coussins des photographies ne font pas partie de l\u2019offre.",
        material: "Housse de lin amovible, assise \u00e0 ressorts, cadre en bois massif", dimensions: "L 100 \u00d7 P 95 \u00d7 H 88 cm, assise 45 cm",
        origin: "Tapisserie de Brianza, Italie", lead: "disponible imm\u00e9diatement", colors: ["Lin naturel"] },
      es: { short: "Butaca ancha con funda de lino suelta, faldón y ribete.",
        description: "Una butaca en la que se puede sentar de lado: asiento ancho, cojines blandos, respaldo que cede un poco. La funda de lino lavado va suelta, termina abajo en un fald\u00f3n y lleva ribete en los cantos. Se quita y se lava; la actual no tiene manchas y solo est\u00e1 algo aclarada en el canto de los brazos, como hace el lino. La alfombra, la mesa auxiliar y los cojines de las fotograf\u00edas no forman parte de la oferta.",
        material: "Funda de lino desenfundable, asiento con muelles, estructura de madera maciza", dimensions: "An 100 \u00d7 Pr 95 \u00d7 Al 88 cm, asiento 45 cm",
        origin: "Tapicer\u00eda de Brianza, Italia", lead: "disponible ahora", colors: ["Lino natural"] }
    }
  },
  {
    id: "bett-duna", used: true, grade: "wieneu", year: "2020", name: "Duna", categoryKey: "betten", shape: "bett", tone: "studio",
    price: 1400, weight: "72 kg", swatches: ["#efece5"],
    photos: ["assets/img/bett-duna-1.jpg", "assets/img/bett-duna-2.jpg", "assets/img/bett-duna-3.jpg"],
    t: {
      de: { short: "Doppelbett mit weich geschwungenem Kopfteil, heller Bezug.",
        description: "Ein Doppelbett in voller Breite. Das Kopfteil ist gepolstert und oben weich geschwungen, der Unterbau rundum bezogen und gefedert, ohne sichtbare F\u00fc\u00dfe \u2014 das Bett steht ruhig im Raum. Der Bezug ist fleckenfrei, die Federung ohne Kuhle; Matratze auf Wunsch. Bettw\u00e4sche, Nachttische und Wandleuchten der Aufnahmen geh\u00f6ren nicht zum Angebot.",
        material: "Leinenmischgewebe, gefederter Unterbau, Massivholzrahmen", dimensions: "B 180 \u00d7 L 200 \u00d7 H 105 cm",
        origin: "Polsterei Levante, Spanien", lead: "sofort verf\u00fcgbar", colors: ["Wollwei\u00df"] },
      en: { short: "Double bed with a softly curved headboard, pale cover.",
        description: "A double bed in full width. The headboard is upholstered and softly curved along the top, the base covered all round and sprung, with no visible legs \u2014 the bed sits quietly in the room. The cover is unstained, the springing free of hollows; mattress on request. Bed linen, nightstands and wall lamps in the photographs are not part of the offer.",
        material: "Linen blend, sprung base, solid timber frame", dimensions: "W 180 \u00d7 L 200 \u00d7 H 105 cm",
        origin: "Levante upholstery workshop, Spain", lead: "available now", colors: ["Wool white"] },
      fr: { short: "Lit double \u00e0 t\u00eate de lit doucement galb\u00e9e, tissu clair.",
        description: "Un lit double pleine largeur. La t\u00eate de lit est rembourr\u00e9e et doucement galb\u00e9e sur le dessus, le sommier habill\u00e9 sur tout son pourtour et suspendu, sans pieds apparents \u2014 le lit repose calmement dans la pi\u00e8ce. Le tissu est sans taches, la suspension sans creux ; matelas sur demande. Le linge de lit, les chevets et les appliques des photographies ne font pas partie de l\u2019offre.",
        material: "M\u00e9lange de lin, sommier suspendu, cadre en bois massif", dimensions: "L 180 \u00d7 l 200 \u00d7 H 105 cm",
        origin: "Atelier de tapisserie Levante, Espagne", lead: "disponible imm\u00e9diatement", colors: ["Blanc laine"] },
      es: { short: "Cama de matrimonio con cabecero de curva suave, tejido claro.",
        description: "Una cama de matrimonio a todo lo ancho. El cabecero va tapizado y curvado con suavidad en la parte alta; la base est\u00e1 forrada en todo su contorno y suspendida, sin patas a la vista \u2014 la cama descansa serena en la habitaci\u00f3n. El tejido no tiene manchas y la suspensi\u00f3n no presenta hundimientos; colch\u00f3n bajo petici\u00f3n. La ropa de cama, las mesillas y los apliques de las fotograf\u00edas no forman parte de la oferta.",
        material: "Mezcla de lino, base suspendida, estructura de madera maciza", dimensions: "An 180 \u00d7 L 200 \u00d7 Al 105 cm",
        origin: "Tapicer\u00eda Levante, Espa\u00f1a", lead: "disponible ahora", colors: ["Blanco lana"] }
    }
  },
  {
    id: "stuhl-ombra", used: true, grade: "sehrgut", year: "2020", name: "Ombra", categoryKey: "stuehle", shape: "stuhl", tone: "ink",
    price: 1500, weight: "9 kg", swatches: ["#1c1b1a"],
    photos: ["assets/img/stuhl-ombra-1.jpg"],
    t: {
      de: { short: "Drehstuhl mit Armlehnen, schwarzes Leder, Knopfheftung.",
        description: "Ein Drehstuhl, der seine Form dem R\u00fccken verdankt: Die Schale l\u00e4uft in zwei knappe Armlehnen aus, vier Kn\u00f6pfe halten das Leder in der Lehne. Das Kreuzgestell aus schwarz lackiertem Stahl dreht leise und stellt sich von selbst zur\u00fcck. Das Leder ist durchgef\u00e4rbt, ohne Risse und nur an den Armkanten leicht gegl\u00e4ttet. Die Aufnahme zeigt den Stuhl an einem Esstisch; Tisch und Zubeh\u00f6r geh\u00f6ren nicht zum Angebot.",
        material: "Leder schwarz, Kreuzgestell Stahl schwarz", dimensions: "B 62 \u00d7 T 58 \u00d7 H 80 cm, Sitzh\u00f6he 46 cm",
        origin: "Polsterei Jutland, D\u00e4nemark", lead: "sofort verf\u00fcgbar", colors: ["Schwarz"] },
      en: { short: "Swivel chair with arms, black leather, buttoned back.",
        description: "A swivel chair that owes its shape to the back: the shell runs out into two short arms, and four buttons hold the leather in the backrest. The cross base in black lacquered steel turns quietly and returns by itself. The leather is dyed through, free of cracks and only lightly polished along the arm edges. The photograph shows the chair at a dining table; table and accessories are not included.",
        material: "Black leather, black steel cross base", dimensions: "W 62 \u00d7 D 58 \u00d7 H 80 cm, seat height 46 cm",
        origin: "Jutland upholstery, Denmark", lead: "available now", colors: ["Black"] },
      fr: { short: "Chaise pivotante \u00e0 accoudoirs, cuir noir, dossier capitonn\u00e9.",
        description: "Une chaise pivotante qui doit sa forme au dos : la coque se prolonge en deux accoudoirs courts et quatre boutons retiennent le cuir du dossier. Le pi\u00e9tement en croix, acier laqu\u00e9 noir, tourne sans bruit et revient de lui-m\u00eame. Le cuir est teint\u00e9 dans la masse, sans fissures, l\u00e9g\u00e8rement liss\u00e9 seulement sur l\u2019ar\u00eate des accoudoirs. La photographie montre la chaise \u00e0 une table de repas ; la table et les accessoires ne sont pas compris.",
        material: "Cuir noir, pi\u00e9tement en croix acier noir", dimensions: "L 62 \u00d7 P 58 \u00d7 H 80 cm, assise 46 cm",
        origin: "Tapisserie du Jutland, Danemark", lead: "disponible imm\u00e9diatement", colors: ["Noir"] },
      es: { short: "Silla giratoria con brazos, cuero negro, respaldo capitonado.",
        description: "Una silla giratoria que debe su forma al respaldo: la carcasa se prolonga en dos brazos cortos y cuatro botones sujetan el cuero del respaldo. La base en cruz de acero lacado negro gira en silencio y vuelve sola a su sitio. El cuero est\u00e1 te\u00f1ido en masa, sin grietas, apenas pulido en el canto de los brazos. La fotograf\u00eda muestra la silla en una mesa de comedor; la mesa y los accesorios no est\u00e1n incluidos.",
        material: "Cuero negro, base en cruz de acero negro", dimensions: "An 62 \u00d7 Pr 58 \u00d7 Al 80 cm, asiento 46 cm",
        origin: "Tapicer\u00eda de Jutlandia, Dinamarca", lead: "disponible ahora", colors: ["Negro"] }
    }
  },
  {
    id: "hocker-vite", used: true, grade: "sehrgut", year: "2019", name: "Vite", categoryKey: "stuehle", shape: "stuhl", tone: "studio",
    price: 200, weight: "4 kg", swatches: ["#efece6"],
    photos: ["assets/img/hocker-vite-1.jpg", "assets/img/hocker-vite-2.jpg", "assets/img/hocker-vite-3.jpg"],
    t: {
      de: { short: "Barhocker, wei\u00df lackierter Stahl, Sitz aus Eiche, stufenlos h\u00f6henverstellbar.",
        description: "Ein Barhocker, der ohne Hebel auskommt: Der Sitz aus massiver Eiche sitzt auf einer Gewindespindel und wird durch Drehen h\u00f6her oder tiefer gestellt. Das Gestell ist wei\u00df lackierter Stahl, der Fu\u00dfring aus Edelstahl. Lack und Sitz sind ohne Schaden, der Fu\u00dfring zeigt den \u00fcblichen matten Glanz vom Gebrauch. Die Aufnahmen zeigen zwei Hocker; angeboten wird einer.",
        material: "Stahl wei\u00df lackiert, Sitz Eiche, Fu\u00dfring Edelstahl", dimensions: "\u00d8 35 \u00d7 H 60\u201375 cm (drehbar verstellbar)",
        origin: "Metallwerkstatt Brianza, Italien", lead: "sofort verf\u00fcgbar", colors: ["Wei\u00df / Eiche"] },
      en: { short: "Bar stool, white lacquered steel, oak seat, freely height-adjustable.",
        description: "A bar stool that needs no lever: the solid oak seat sits on a threaded spindle and is raised or lowered simply by turning it. The frame is white lacquered steel, the footrest stainless. Lacquer and seat are undamaged; the footrest shows the usual matt sheen of use. The photographs show two stools; one is on offer.",
        material: "White lacquered steel, oak seat, stainless footrest", dimensions: "\u00d8 35 \u00d7 H 60\u201375 cm (adjusted by turning)",
        origin: "Brianza metal workshop, Italy", lead: "available now", colors: ["White / oak"] },
      fr: { short: "Tabouret de bar, acier laqu\u00e9 blanc, assise en ch\u00eane, hauteur r\u00e9glable.",
        description: "Un tabouret de bar qui se passe de levier : l\u2019assise en ch\u00eane massif repose sur une vis sans fin et se r\u00e8gle en la faisant tourner. Le pi\u00e9tement est en acier laqu\u00e9 blanc, le repose-pied en inox. La laque et l\u2019assise sont intactes ; le repose-pied montre le l\u00e9ger satin\u00e9 de l\u2019usage. Les photographies montrent deux tabourets ; un seul est propos\u00e9.",
        material: "Acier laqu\u00e9 blanc, assise en ch\u00eane, repose-pied inox", dimensions: "\u00d8 35 \u00d7 H 60\u201375 cm (r\u00e9glage par rotation)",
        origin: "Atelier m\u00e9tal de Brianza, Italie", lead: "disponible imm\u00e9diatement", colors: ["Blanc / ch\u00eane"] },
      es: { short: "Taburete de bar, acero lacado blanco, asiento de roble, altura regulable.",
        description: "Un taburete de bar que prescinde de palancas: el asiento de roble macizo va sobre un husillo roscado y se sube o baja simplemente gir\u00e1ndolo. La estructura es de acero lacado blanco y el reposapi\u00e9s de acero inoxidable. Lacado y asiento est\u00e1n intactos; el reposapi\u00e9s presenta el brillo mate propio del uso. Las fotograf\u00edas muestran dos taburetes; se ofrece uno.",
        material: "Acero lacado blanco, asiento de roble, reposapi\u00e9s inoxidable", dimensions: "\u00d8 35 \u00d7 Al 60\u201375 cm (se regula girando)",
        origin: "Taller met\u00e1lico de Brianza, Italia", lead: "disponible ahora", colors: ["Blanco / roble"] }
    }
  },
  {
    id: "bett-marin", used: true, grade: "wieneu", year: "2021", name: "Marin", categoryKey: "betten", shape: "bett", tone: "studio",
    price: 700, weight: "34 kg", swatches: ["#f1eee8"],
    photos: ["assets/img/betten-marin-1.jpg", "assets/img/betten-marin-2.jpg"],
    t: {
      de: { short: "Einzelbett mit gepolstertem Kopfteil, heller Bezug.",
        description: "Ein Einzelbett, rundum gepolstert und gefedert. Das Kopfteil ist schlicht gehalten und mit demselben hellen Gewebe bezogen; ein schmaler dunkler Sockel hebt das Bett vom Boden ab. Es stand im G\u00e4stezimmer eines Ferienhauses und ist kaum benutzt \u2014 der Bezug ist fleckenfrei, die Federung ohne Kuhle. Die Aufnahmen zeigen das Zimmer mit zwei Betten; angeboten wird eines davon. Bettwaren und Dekoration geh\u00f6ren nicht dazu.",
        material: "Leinenmischgewebe, gefederter Unterbau, Massivholzrahmen", dimensions: "B 100 \u00d7 L 200 \u00d7 H 105 cm",
        origin: "Polsterei Levante, Spanien", lead: "sofort verf\u00fcgbar", colors: ["Wollwei\u00df"] },
      en: { short: "Single bed with an upholstered headboard, pale cover.",
        description: "A single bed, upholstered and sprung all round. The headboard is kept plain and covered in the same pale cloth; a narrow dark plinth lifts the bed off the floor. It stood in the guest room of a holiday house and has barely been used \u2014 the cover is unstained, the springing free of hollows. The photographs show the room with two beds; one of them is on offer. Bedding and decoration are not included.",
        material: "Linen blend, sprung base, solid timber frame", dimensions: "W 100 \u00d7 L 200 \u00d7 H 105 cm",
        origin: "Levante upholstery workshop, Spain", lead: "available now", colors: ["Wool white"] },
      fr: { short: "Lit simple \u00e0 t\u00eate de lit rembourr\u00e9e, tissu clair.",
        description: "Un lit simple, rembourr\u00e9 et suspendu sur tout son pourtour. La t\u00eate de lit reste sobre, dans le m\u00eame tissu clair ; un socle sombre et \u00e9troit le d\u00e9tache du sol. Il se trouvait dans la chambre d\u2019amis d\u2019une maison de vacances et a \u00e0 peine servi \u2014 le tissu est sans tache, la suspension sans creux. Les photographies montrent la pi\u00e8ce avec deux lits ; c\u2019est l\u2019un d\u2019eux qui est propos\u00e9. La literie et la d\u00e9coration ne sont pas comprises.",
        material: "M\u00e9lange de lin, sommier suspendu, cadre en bois massif", dimensions: "L 100 \u00d7 l 200 \u00d7 H 105 cm",
        origin: "Atelier de tapisserie Levante, Espagne", lead: "disponible imm\u00e9diatement", colors: ["Blanc laine"] },
      es: { short: "Cama individual con cabecero tapizado, tejido claro.",
        description: "Una cama individual, tapizada y suspendida en todo su contorno. El cabecero es sobrio y va forrado con el mismo tejido claro; un z\u00f3calo oscuro y estrecho la separa del suelo. Estuvo en la habitaci\u00f3n de invitados de una casa de vacaciones y apenas se ha usado \u2014 el tejido no tiene manchas y la suspensi\u00f3n no presenta hundimientos. Las fotograf\u00edas muestran la habitaci\u00f3n con dos camas; se ofrece una de ellas. La ropa de cama y la decoraci\u00f3n no est\u00e1n incluidas.",
        material: "Mezcla de lino, base suspendida, estructura de madera maciza", dimensions: "An 100 \u00d7 L 200 \u00d7 Al 105 cm",
        origin: "Tapicer\u00eda Levante, Espa\u00f1a", lead: "disponible ahora", colors: ["Blanco lana"] }
    }
  },
  {
    id: "kueche-costa", used: true, grade: "sehrgut", year: "2018", name: "Costa", categoryKey: "kuechen", shape: "sideboard", tone: "studio",
    price: 17500, weight: "\u2014", swatches: ["#f3f1ed"],
    photos: ["assets/img/kueche-costa-1.jpg", "assets/img/kueche-costa-2.jpg", "assets/img/kueche-costa-3.jpg"],
    t: {
      de: { short: "Grifflose Einbauk\u00fcche in Wei\u00df und Nussbaum, mit Kochinsel und Ger\u00e4ten.",
        description: "Eine grifflose Einbauk\u00fcche aus einem Neubau an der Costa Blanca, ausgebaut und eingelagert. Wei\u00df lackierte Fronten treffen auf H\u00e4ngeschr\u00e4nke und eine Barplatte aus massivem Nussbaum; die Arbeitsplatten sind aus wei\u00dfem Mineralwerkstoff. Zur K\u00fccheninsel geh\u00f6rt ein Induktionsfeld, in der Hochschrankzeile stecken zwei Backofen, ein Weinklimaschrank und der K\u00fchlschrank. Alle Ger\u00e4te laufen und wurden von uns gepr\u00fcft. Wir bauen vor Ort ab und wieder auf; auf Wunsch passen wir die Zeile an Ihren Grundriss an. Barhocker, Geschirr und Dekoration der Aufnahmen geh\u00f6ren nicht zum Angebot.",
        material: "Lack matt wei\u00df, Nussbaum massiv, Mineralwerkstoff", dimensions: "Zeile 420 cm, Insel 340 \u00d7 95 cm, Barplatte 340 \u00d7 60 cm",
        origin: "Neubau Costa Blanca, Spanien", lead: "nach Absprache", colors: ["Wei\u00df / Nussbaum"] },
      en: { short: "Handleless fitted kitchen in white and walnut, with island and appliances.",
        description: "A handleless fitted kitchen from a new-build house on the Costa Blanca, dismantled and in storage. White lacquered fronts meet wall units and a breakfast bar in solid walnut; the worktops are white mineral composite. The island carries an induction hob, the tall run holds two ovens, a wine cabinet and the fridge. Every appliance works and has been tested by us. We dismantle and reinstall on site and will adapt the run to your floor plan on request. Bar stools, tableware and decoration in the photographs are not part of the offer.",
        material: "Matt white lacquer, solid walnut, mineral composite", dimensions: "Run 420 cm, island 340 \u00d7 95 cm, bar top 340 \u00d7 60 cm",
        origin: "New-build, Costa Blanca, Spain", lead: "by arrangement", colors: ["White / walnut"] },
      fr: { short: "Cuisine int\u00e9gr\u00e9e sans poign\u00e9es, blanc et noyer, avec \u00eelot et appareils.",
        description: "Une cuisine int\u00e9gr\u00e9e sans poign\u00e9es, provenant d\u2019une maison neuve de la Costa Blanca, d\u00e9mont\u00e9e et stock\u00e9e. Les fa\u00e7ades laqu\u00e9es blanches c\u00f4toient des \u00e9l\u00e9ments hauts et un plan de bar en noyer massif ; les plans de travail sont en r\u00e9sine min\u00e9rale blanche. L\u2019\u00eelot re\u00e7oit une table \u00e0 induction, la colonne abrite deux fours, une cave \u00e0 vin et le r\u00e9frig\u00e9rateur. Tous les appareils fonctionnent et ont \u00e9t\u00e9 contr\u00f4l\u00e9s. Nous assurons la d\u00e9pose et la repose, et adaptons la lin\u00e9aire \u00e0 votre plan sur demande. Les tabourets, la vaisselle et la d\u00e9coration des photographies ne font pas partie de l\u2019offre.",
        material: "Laque blanche mate, noyer massif, r\u00e9sine min\u00e9rale", dimensions: "Lin\u00e9aire 420 cm, \u00eelot 340 \u00d7 95 cm, plan de bar 340 \u00d7 60 cm",
        origin: "Maison neuve, Costa Blanca, Espagne", lead: "sur rendez-vous", colors: ["Blanc / noyer"] },
      es: { short: "Cocina integrada sin tiradores, en blanco y nogal, con isla y electrodom\u00e9sticos.",
        description: "Una cocina integrada sin tiradores procedente de una vivienda de obra nueva en la Costa Blanca, desmontada y almacenada. Los frentes lacados en blanco conviven con muebles altos y una barra de nogal macizo; las encimeras son de material mineral blanco. La isla incorpora una placa de inducci\u00f3n y la columna aloja dos hornos, una vinoteca y el frigor\u00edfico. Todos los electrodom\u00e9sticos funcionan y han sido revisados por nosotros. Nos encargamos del desmontaje y del montaje, y adaptamos el frente a su plano si lo desea. Los taburetes, la vajilla y la decoraci\u00f3n de las fotograf\u00edas no forman parte de la oferta.",
        material: "Lacado blanco mate, nogal macizo, material mineral", dimensions: "Frente 420 cm, isla 340 \u00d7 95 cm, barra 340 \u00d7 60 cm",
        origin: "Obra nueva, Costa Blanca, Espa\u00f1a", lead: "a convenir", colors: ["Blanco / nogal"] }
    }
  }
];

/* Ein gebrauchtes Stück ist ein Einzelstück und nur einmal zu haben. */
/* Gebraucht heißt meist Einzelstück. Liegt ein Stück mehrfach vor, sagt
   das Feld „stueck“, wie oft — dann darf die Menge gewählt werden. */
const bestand = (product) => (product.used ? (product.stueck || 1) : 99);

/* Rubriken, in denen tatsächlich etwas steht — in der Reihenfolge der
   Gesamtliste. Filterleiste, Fußzeile und Startseite richten sich danach,
   damit keine leere Rubrik angeboten wird. */
function belegteKategorien() {
  return CATEGORY_KEYS.filter((k) => k !== "alle" && PRODUCTS.some((p) => p.categoryKey === k));
}

/* Die Ansichten der Galerie: bei einer Fotostrecke ein Eintrag je Bild,
   sonst die vier gezeichneten Blickwinkel. */
function ansichten(product) {
  if (product.photos && product.photos.length) {
    return product.photos.map((src, i) => ({ key: "foto", label: t("gallery.image", { n: i + 1 }) }));
  }
  return VIEWS.map((v) => ({ key: v.key, label: t("view." + v.key) }));
}

/* Liefert die Texte eines Produkts in der aktiven Sprache. */
function pt(product, lang) {
  return (product.t && (product.t[lang] || product.t[getLang()] || product.t.de)) || {};
}

/* Farbfelder mit übersetzten Namen */
function productColors(product) {
  const names = pt(product).colors || [];
  return product.swatches.map((hex, i) => ({ hex, name: names[i] || "" }));
}
