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

  haengeleuchte: (t) => scene(t, (t, id) => `
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
    }).join("")}`),

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

/* Helligkeit eines Farbwerts (0 = schwarz, 1 = weiß) */
function luminance(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/* Zeigt das Produkt in der gewählten Ausführung.
   Helle Möbel stehen dabei in einem dunklen Raum und umgekehrt — sonst
   verschwindet ein cremefarbenes Sofa vor einer cremefarbenen Wand. */
function artFor(product, colorIndex = 0) {
  const hex = product.swatches[colorIndex] || product.swatches[0];
  // Helle Möbel vor dunklem Grund, dunkle vor hellem.
  const base = luminance(hex) > 0.62 ? TONES.tief : TONES.studio;
  const tone = Object.assign({}, base, { obj: hex });
  return (ART[product.shape] || ART.sofa)(tone);
}

/* --- Katalog ---
   Sprachunabhängig: id, Kategorie, Form, Farbstimmung, Preis, Gewicht,
   Farbwerte. Alles Sprachliche steht unter t.<sprache>. --- */
const PRODUCTS = [
  {
    id: "sofa-milano", used: true, grade: "sehrgut", year: "2021", name: "Milano", categoryKey: "sofas", shape: "sofa", tone: "sand",
    price: 8490, weight: "68 kg", swatches: ["#9a6a3f", "#d9c9ae", "#3a3a38"],
    t: {
      de: { short: "Dreisitzer aus italienischem Anilinleder auf einem Rahmen aus massiver Eiche.",
        description: "Das Sofa Milano verbindet großzügige Proportionen mit einer bemerkenswert leichten Silhouette. Der Korpus wird in Handarbeit über einen Rahmen aus lufttrockneter Eiche gespannt, die Sitzkissen bestehen aus einem Kern aus Kaltschaum mit einer Auflage aus Gänsedaunen. Das pflanzlich gegerbte Anilinleder entwickelt über die Jahre eine eigene Patina.",
        material: "Anilinleder, Eiche massiv, Gänsedaunen", dimensions: "B 240 × T 98 × H 72 cm",
        origin: "Manufaktur Brianza, Italien", lead: "10–12 Wochen", colors: ["Cognac", "Sandbeige", "Anthrazit"] },
      en: { short: "Three-seater in Italian aniline leather on a solid oak frame.",
        description: "Milano pairs generous proportions with a remarkably light silhouette. The body is drawn by hand over a frame of air-dried oak; the seat cushions have a cold-foam core topped with goose down. The vegetable-tanned aniline leather develops a patina of its own over the years.",
        material: "Aniline leather, solid oak, goose down", dimensions: "W 240 × D 98 × H 72 cm",
        origin: "Brianza workshop, Italy", lead: "10–12 weeks", colors: ["Cognac", "Sand beige", "Anthracite"] },
      fr: { short: "Canapé trois places en cuir aniline italien sur une structure en chêne massif.",
        description: "Le Milano associe des proportions généreuses à une silhouette remarquablement légère. La carcasse est tendue à la main sur une structure en chêne séché à l'air ; les coussins d'assise ont une âme en mousse froide surmontée de duvet d'oie. Le cuir aniline à tannage végétal développe sa propre patine au fil des ans.",
        material: "Cuir aniline, chêne massif, duvet d'oie", dimensions: "L 240 × P 98 × H 72 cm",
        origin: "Atelier de Brianza, Italie", lead: "10–12 semaines", colors: ["Cognac", "Beige sable", "Anthracite"] },
      es: { short: "Sofá de tres plazas en piel anilina italiana sobre estructura de roble macizo.",
        description: "El Milano une unas proporciones generosas con una silueta notablemente ligera. El cuerpo se tensa a mano sobre una estructura de roble secado al aire; los cojines de asiento llevan un núcleo de espuma fría rematado con plumón de oca. La piel anilina de curtido vegetal desarrolla con los años su propia pátina.",
        material: "Piel anilina, roble macizo, plumón de oca", dimensions: "An 240 × Pr 98 × Al 72 cm",
        origin: "Taller de Brianza, Italia", lead: "10–12 semanas", colors: ["Coñac", "Beige arena", "Antracita"] }
    }
  },
  {
    id: "sofa-riviera", used: true, grade: "gut", year: "2018", name: "Riviera", categoryKey: "sofas", shape: "sofa", tone: "sage",
    price: 6950, weight: "52 kg", swatches: ["#9aa78d", "#e8e0d2", "#7d8a99"],
    t: {
      de: { short: "Modularer Zweisitzer mit Bezug aus belgischem Leinen.",
        description: "Riviera ist als modulares System konzipiert und lässt sich jederzeit erweitern. Der Bezug aus gewaschenem belgischem Leinen ist vollständig abnehmbar und waschbar. Die konisch gedrechselten Füße aus Messing geben dem Volumen optische Leichtigkeit.",
        material: "Belgisches Leinen, Buche, Messing", dimensions: "B 196 × T 94 × H 74 cm",
        origin: "Atelier Flandern, Belgien", lead: "8–10 Wochen", colors: ["Salbei", "Elfenbein", "Taubenblau"] },
      en: { short: "Modular two-seater covered in Belgian linen.",
        description: "Riviera is conceived as a modular system and can be extended at any time. The washed Belgian linen cover comes off completely and is machine washable. The tapered turned brass feet lend the volume a visual lightness.",
        material: "Belgian linen, beech, brass", dimensions: "W 196 × D 94 × H 74 cm",
        origin: "Flanders workshop, Belgium", lead: "8–10 weeks", colors: ["Sage", "Ivory", "Dove blue"] },
      fr: { short: "Canapé deux places modulaire recouvert de lin belge.",
        description: "Riviera est conçu comme un système modulaire et peut être agrandi à tout moment. La housse en lin belge lavé s'enlève entièrement et passe en machine. Les pieds en laiton tournés coniques donnent de la légèreté au volume.",
        material: "Lin belge, hêtre, laiton", dimensions: "L 196 × P 94 × H 74 cm",
        origin: "Atelier des Flandres, Belgique", lead: "8–10 semaines", colors: ["Sauge", "Ivoire", "Bleu tourterelle"] },
      es: { short: "Sofá de dos plazas modular tapizado en lino belga.",
        description: "Riviera está concebido como un sistema modular y puede ampliarse en cualquier momento. La funda de lino belga lavado se retira por completo y es lavable a máquina. Las patas torneadas cónicas de latón aportan ligereza visual al volumen.",
        material: "Lino belga, haya, latón", dimensions: "An 196 × Pr 94 × Al 74 cm",
        origin: "Taller de Flandes, Bélgica", lead: "8–10 semanas", colors: ["Salvia", "Marfil", "Azul tórtola"] }
    }
  },
  {
    id: "sessel-orsini", used: true, grade: "wieneu", year: "2022", name: "Orsini", categoryKey: "sessel", shape: "sessel", tone: "clay",
    price: 3280, weight: "24 kg", swatches: ["#b2705a", "#e6dcc9", "#38445c"],
    t: {
      de: { short: "Loungesessel mit geschwungener Rückenlehne und Bouclé-Bezug.",
        description: "Ein Sessel, der zum Verweilen einlädt. Die umlaufende Rückenlehne wird aus einem Stück formverleimt und anschließend von Hand gepolstert. Der Bouclé-Bezug aus Schurwolle ist besonders strapazierfähig und angenehm warm.",
        material: "Bouclé aus Schurwolle, Formsperrholz, Messing", dimensions: "B 88 × T 84 × H 76 cm",
        origin: "Werkstatt Kopenhagen, Dänemark", lead: "6–8 Wochen", colors: ["Terrakotta", "Creme", "Nachtblau"] },
      en: { short: "Lounge chair with a curved back and bouclé cover.",
        description: "A chair that invites you to stay. The wrap-around back is moulded from a single piece of laminated wood and then upholstered by hand. The new-wool bouclé is particularly hard-wearing and pleasantly warm.",
        material: "New-wool bouclé, moulded plywood, brass", dimensions: "W 88 × D 84 × H 76 cm",
        origin: "Copenhagen workshop, Denmark", lead: "6–8 weeks", colors: ["Terracotta", "Cream", "Midnight blue"] },
      fr: { short: "Fauteuil lounge à dossier galbé, revêtement bouclé.",
        description: "Un fauteuil qui invite à rester. Le dossier enveloppant est moulé d'une seule pièce en bois lamellé, puis garni à la main. Le bouclé en laine vierge est particulièrement résistant et agréablement chaud.",
        material: "Bouclé en laine vierge, contreplaqué moulé, laiton", dimensions: "L 88 × P 84 × H 76 cm",
        origin: "Atelier de Copenhague, Danemark", lead: "6–8 semaines", colors: ["Terre cuite", "Crème", "Bleu nuit"] },
      es: { short: "Butaca de salón con respaldo curvo y tapizado en bouclé.",
        description: "Una butaca que invita a quedarse. El respaldo envolvente se moldea de una sola pieza de madera laminada y después se tapiza a mano. El bouclé de lana virgen es especialmente resistente y agradablemente cálido.",
        material: "Bouclé de lana virgen, contrachapado moldeado, latón", dimensions: "An 88 × Pr 84 × Al 76 cm",
        origin: "Taller de Copenhague, Dinamarca", lead: "6–8 semanas", colors: ["Terracota", "Crema", "Azul noche"] }
    }
  },
  {
    id: "sessel-luca", used: true, grade: "sehrgut", year: "2019", name: "Luca", categoryKey: "sessel", shape: "sessel", tone: "ink",
    price: 4150, weight: "31 kg", swatches: ["#2f4438", "#5d2b30", "#33322e"],
    t: {
      de: { short: "Ohrensessel in Samt mit hoher Rückenlehne.",
        description: "Luca zitiert die klassische Ohrensessel-Form und übersetzt sie in eine reduzierte Gegenwartssprache. Der Baumwollsamt ist lichtecht und schmutzabweisend ausgerüstet, die Federung besteht aus handgebundenen Stahlfedern.",
        material: "Baumwollsamt, Nussbaum, Stahlfedern", dimensions: "B 92 × T 90 × H 108 cm",
        origin: "Manufaktur Rhein, Deutschland", lead: "8–10 Wochen", colors: ["Tannengrün", "Bordeaux", "Graphit"] },
      en: { short: "Wing chair in velvet with a high back.",
        description: "Luca quotes the classic wing-chair form and translates it into a pared-back contemporary language. The cotton velvet is lightfast and stain-repellent; the suspension uses hand-tied steel springs.",
        material: "Cotton velvet, walnut, steel springs", dimensions: "W 92 × D 90 × H 108 cm",
        origin: "Rhine workshop, Germany", lead: "8–10 weeks", colors: ["Fir green", "Bordeaux", "Graphite"] },
      fr: { short: "Bergère à oreilles en velours, dossier haut.",
        description: "Luca cite la forme classique de la bergère à oreilles et la traduit dans un langage contemporain épuré. Le velours de coton est résistant à la lumière et déperlant ; la suspension repose sur des ressorts d'acier guindés à la main.",
        material: "Velours de coton, noyer, ressorts d'acier", dimensions: "L 92 × P 90 × H 108 cm",
        origin: "Atelier du Rhin, Allemagne", lead: "8–10 semaines", colors: ["Vert sapin", "Bordeaux", "Graphite"] },
      es: { short: "Butaca orejera de terciopelo con respaldo alto.",
        description: "Luca cita la forma clásica de la orejera y la traduce a un lenguaje contemporáneo depurado. El terciopelo de algodón es resistente a la luz y repelente a las manchas; la suspensión emplea muelles de acero atados a mano.",
        material: "Terciopelo de algodón, nogal, muelles de acero", dimensions: "An 92 × Pr 90 × Al 108 cm",
        origin: "Taller del Rin, Alemania", lead: "8–10 semanas", colors: ["Verde abeto", "Burdeos", "Grafito"] }
    }
  },
  {
    id: "tisch-atelier", used: true, grade: "sehrgut", year: "2020", name: "Atelier", categoryKey: "tische", shape: "tisch", tone: "stone",
    price: 5890, weight: "94 kg", swatches: ["#6b4a30", "#4a3b2c", "#d5c8b2"],
    t: {
      de: { short: "Esstisch aus Nussbaum massiv für acht Personen.",
        description: "Die Tischplatte wird aus durchgehenden Bohlen eines einzigen Nussbaumstamms gefertigt — jede Platte ist damit ein Unikat. Die Oberfläche ist mit Hartwachsöl behandelt und kann jederzeit partiell aufgearbeitet werden.",
        material: "Nussbaum massiv, Hartwachsöl", dimensions: "B 260 × T 100 × H 75 cm",
        origin: "Schreinerei Schwarzwald, Deutschland", lead: "12–14 Wochen", colors: ["Nussbaum natur", "Eiche geräuchert", "Esche weiß"] },
      en: { short: "Dining table in solid walnut, seats eight.",
        description: "The top is made from continuous boards of a single walnut trunk — which makes every top unique. The surface is finished with hard wax oil and can be refreshed in parts at any time.",
        material: "Solid walnut, hard wax oil", dimensions: "W 260 × D 100 × H 75 cm",
        origin: "Black Forest joinery, Germany", lead: "12–14 weeks", colors: ["Natural walnut", "Smoked oak", "White ash"] },
      fr: { short: "Table de salle à manger en noyer massif, huit places.",
        description: "Le plateau est réalisé à partir de planches continues issues d'un seul tronc de noyer — chaque plateau est donc unique. La surface est traitée à l'huile-cire dure et peut être reprise localement à tout moment.",
        material: "Noyer massif, huile-cire dure", dimensions: "L 260 × P 100 × H 75 cm",
        origin: "Menuiserie de la Forêt-Noire, Allemagne", lead: "12–14 semaines", colors: ["Noyer naturel", "Chêne fumé", "Frêne blanc"] },
      es: { short: "Mesa de comedor de nogal macizo para ocho personas.",
        description: "El tablero se fabrica con tablas continuas de un único tronco de nogal — por eso cada tablero es único. La superficie está tratada con aceite-cera duro y puede repararse por zonas en cualquier momento.",
        material: "Nogal macizo, aceite-cera duro", dimensions: "An 260 × Pr 100 × Al 75 cm",
        origin: "Ebanistería de la Selva Negra, Alemania", lead: "12–14 semanas", colors: ["Nogal natural", "Roble ahumado", "Fresno blanco"] }
    }
  },
  {
    id: "tisch-onda", used: true, grade: "wieneu", year: "2022", name: "Onda", categoryKey: "tische", shape: "tisch", tone: "rose",
    price: 2740, weight: "58 kg", swatches: ["#d8c6ad", "#3b3a38", "#5b6b58"],
    t: {
      de: { short: "Couchtisch mit Platte aus Travertin und Sockel aus Messing.",
        description: "Onda setzt einen ruhigen Gegenpol im Wohnraum. Die 4 cm starke Platte aus römischem Travertin ruht auf einem gebürsteten Messingsockel. Der Stein ist gegen Flecken imprägniert, behält aber seine offene, lebendige Struktur.",
        material: "Travertin, gebürstetes Messing", dimensions: "Ø 110 × H 34 cm",
        origin: "Steinmetz Tivoli, Italien", lead: "10–12 Wochen", colors: ["Travertin hell", "Marmor Nero", "Marmor Verde"] },
      en: { short: "Coffee table with a travertine top on a brass base.",
        description: "Onda sets a calm counterpoint in the living room. The 4 cm Roman travertine top rests on a brushed brass base. The stone is sealed against stains but keeps its open, living structure.",
        material: "Travertine, brushed brass", dimensions: "Ø 110 × H 34 cm",
        origin: "Tivoli stonemasons, Italy", lead: "10–12 weeks", colors: ["Light travertine", "Nero marble", "Verde marble"] },
      fr: { short: "Table basse à plateau en travertin sur socle en laiton.",
        description: "Onda pose un contrepoint calme dans le séjour. Le plateau de 4 cm en travertin romain repose sur un socle en laiton brossé. La pierre est imperméabilisée contre les taches mais conserve sa structure ouverte et vivante.",
        material: "Travertin, laiton brossé", dimensions: "Ø 110 × H 34 cm",
        origin: "Tailleurs de pierre de Tivoli, Italie", lead: "10–12 semaines", colors: ["Travertin clair", "Marbre Nero", "Marbre Verde"] },
      es: { short: "Mesa de centro con tablero de travertino sobre base de latón.",
        description: "Onda pone un contrapunto sereno en el salón. El tablero de 4 cm de travertino romano descansa sobre una base de latón cepillado. La piedra está sellada contra las manchas, pero conserva su estructura abierta y viva.",
        material: "Travertino, latón cepillado", dimensions: "Ø 110 × Al 34 cm",
        origin: "Canteros de Tívoli, Italia", lead: "10–12 semanas", colors: ["Travertino claro", "Mármol Nero", "Mármol Verde"] }
    }
  },
  {
    id: "stuhl-vela", used: true, grade: "gut", year: "2017", name: "Vela", categoryKey: "stuehle", shape: "stuhl", tone: "sand",
    price: 690, weight: "6 kg", swatches: ["#e3dccb", "#b98d5c", "#4d5157"],
    t: {
      de: { short: "Esszimmerstuhl mit gepolsterter Sitzfläche und Eichengestell.",
        description: "Vela ist auf das Wesentliche reduziert: ein schlankes Gestell aus massiver Eiche, eine ergonomisch geformte Rückenlehne und eine großzügig gepolsterte Sitzfläche. Stapelbar bis vier Stück.",
        material: "Eiche massiv, Wollfilz", dimensions: "B 48 × T 54 × H 82 cm",
        origin: "Werkstatt Jütland, Dänemark", lead: "4–6 Wochen", colors: ["Naturweiß", "Karamell", "Schiefer"] },
      en: { short: "Dining chair with an upholstered seat and oak frame.",
        description: "Vela is reduced to essentials: a slim solid-oak frame, an ergonomically shaped back and a generously padded seat. Stacks up to four high.",
        material: "Solid oak, wool felt", dimensions: "W 48 × D 54 × H 82 cm",
        origin: "Jutland workshop, Denmark", lead: "4–6 weeks", colors: ["Natural white", "Caramel", "Slate"] },
      fr: { short: "Chaise de salle à manger, assise garnie et piètement en chêne.",
        description: "Vela est réduite à l'essentiel : un piètement fin en chêne massif, un dossier de forme ergonomique et une assise généreusement garnie. Empilable jusqu'à quatre.",
        material: "Chêne massif, feutre de laine", dimensions: "L 48 × P 54 × H 82 cm",
        origin: "Atelier du Jutland, Danemark", lead: "4–6 semaines", colors: ["Blanc naturel", "Caramel", "Ardoise"] },
      es: { short: "Silla de comedor con asiento tapizado y estructura de roble.",
        description: "Vela está reducida a lo esencial: una estructura esbelta de roble macizo, un respaldo de forma ergonómica y un asiento generosamente acolchado. Apilable hasta cuatro unidades.",
        material: "Roble macizo, fieltro de lana", dimensions: "An 48 × Pr 54 × Al 82 cm",
        origin: "Taller de Jutlandia, Dinamarca", lead: "4–6 semanas", colors: ["Blanco natural", "Caramelo", "Pizarra"] }
    }
  },
  {
    id: "stuhl-marchese", used: true, grade: "sehrgut", year: "2020", name: "Marchese", categoryKey: "stuehle", shape: "stuhl", tone: "ink",
    price: 980, weight: "8 kg", swatches: ["#7d5636", "#2b2a27", "#a97f42"],
    t: {
      de: { short: "Armlehnstuhl mit Lederbezug und Rahmen aus Nussbaum.",
        description: "Der Armlehnstuhl Marchese wurde für lange Abende am Tisch entworfen. Die Armlehnen sind aus dem Rahmen herausgearbeitet, der Sattelledersitz wird von Hand über einen Gurtboden gespannt.",
        material: "Sattelleder, Nussbaum massiv", dimensions: "B 58 × T 56 × H 84 cm",
        origin: "Manufaktur Brianza, Italien", lead: "8–10 Wochen", colors: ["Tabak", "Schwarz", "Ocker"] },
      en: { short: "Armchair with a leather seat and walnut frame.",
        description: "The Marchese armchair was designed for long evenings at the table. The arms are worked out of the frame itself; the saddle-leather seat is stretched by hand over a webbed base.",
        material: "Saddle leather, solid walnut", dimensions: "W 58 × D 56 × H 84 cm",
        origin: "Brianza workshop, Italy", lead: "8–10 weeks", colors: ["Tobacco", "Black", "Ochre"] },
      fr: { short: "Chaise à accoudoirs, assise en cuir et cadre en noyer.",
        description: "La chaise Marchese a été dessinée pour les longues soirées à table. Les accoudoirs sont taillés dans le cadre lui-même ; l'assise en cuir de selle est tendue à la main sur un fond sanglé.",
        material: "Cuir de selle, noyer massif", dimensions: "L 58 × P 56 × H 84 cm",
        origin: "Atelier de Brianza, Italie", lead: "8–10 semaines", colors: ["Tabac", "Noir", "Ocre"] },
      es: { short: "Silla con brazos, asiento de cuero y marco de nogal.",
        description: "La silla Marchese se diseñó para las sobremesas largas. Los brazos están tallados en el propio marco; el asiento de cuero de silla se tensa a mano sobre un fondo de cinchas.",
        material: "Cuero de silla, nogal macizo", dimensions: "An 58 × Pr 56 × Al 84 cm",
        origin: "Taller de Brianza, Italia", lead: "8–10 semanas", colors: ["Tabaco", "Negro", "Ocre"] }
    }
  },
  {
    id: "lampe-soleil", used: false, name: "Soleil", categoryKey: "leuchten", shape: "lampe", tone: "sand",
    price: 1290, weight: "9 kg", swatches: ["#e5d3ab", "#ece7dc", "#a6663f"],
    t: {
      de: { badge: "Limitiert", short: "Stehleuchte mit handgefaltetem Schirm aus Pergamentpapier.",
        description: "Der Schirm der Soleil wird von Hand aus Pergamentpapier gefaltet und über ein Gestell aus Messingdraht gespannt. Das Licht fällt weich und warm — ideal als Grundbeleuchtung neben dem Sofa. Dimmbar über einen Fußschalter.",
        material: "Pergamentpapier, Messing, Marmorfuß", dimensions: "Ø 46 × H 168 cm",
        origin: "Atelier Lyon, Frankreich", lead: "6–8 Wochen", colors: ["Naturpergament", "Alabaster", "Kupfer"] },
      en: { badge: "Limited", short: "Floor lamp with a hand-folded parchment shade.",
        description: "The Soleil shade is folded by hand from parchment paper and stretched over a brass wire frame. The light falls soft and warm — ideal as ambient light beside the sofa. Dimmable with a foot switch.",
        material: "Parchment paper, brass, marble base", dimensions: "Ø 46 × H 168 cm",
        origin: "Lyon workshop, France", lead: "6–8 weeks", colors: ["Natural parchment", "Alabaster", "Copper"] },
      fr: { badge: "Édition limitée", short: "Lampadaire à abat-jour en parchemin plié à la main.",
        description: "L'abat-jour du Soleil est plié à la main dans du papier parchemin et tendu sur une armature en fil de laiton. La lumière est douce et chaude — idéale comme éclairage d'ambiance près du canapé. Variateur au pied.",
        material: "Papier parchemin, laiton, pied en marbre", dimensions: "Ø 46 × H 168 cm",
        origin: "Atelier de Lyon, France", lead: "6–8 semaines", colors: ["Parchemin naturel", "Albâtre", "Cuivre"] },
      es: { badge: "Edición limitada", short: "Lámpara de pie con pantalla de pergamino plegada a mano.",
        description: "La pantalla del Soleil se pliega a mano en papel pergamino y se tensa sobre una armadura de alambre de latón. La luz cae suave y cálida — ideal como luz ambiente junto al sofá. Regulable con interruptor de pie.",
        material: "Papel pergamino, latón, base de mármol", dimensions: "Ø 46 × Al 168 cm",
        origin: "Taller de Lyon, Francia", lead: "6–8 semanas", colors: ["Pergamino natural", "Alabastro", "Cobre"] }
    }
  },
  {
    id: "leuchte-alba", used: false, name: "Alba", categoryKey: "leuchten", shape: "haengeleuchte", tone: "studio",
    price: 15000, weight: "34 kg", swatches: ["#c8b48a", "#e7e2d8", "#7d6a4e"],
    t: {
      de: { badge: "Sonderanfertigung", short: "Hängeleuchte mit fünf mundgeblasenen Glaskörpern an einem Träger aus massivem Messing.",
        description: "Alba entsteht als Sonderanfertigung nach Maß. Fünf Glaskörper werden in Murano einzeln mundgeblasen — keiner gleicht dem anderen. Sie hängen an einem Träger aus massivem Messing, dessen Länge auf den Raum abgestimmt wird. Die Höhe jedes einzelnen Glases lässt sich beim Aufbau frei bestimmen, sodass die Leuchte einer Tafel, einer Treppe oder einem Luftraum folgt.",
        material: "Mundgeblasenes Muranoglas, massives Messing", dimensions: "B 180 × T 30 × H 90–260 cm (Abhängung nach Maß)",
        origin: "Glashütte Murano, Italien", lead: "16–20 Wochen", colors: ["Messing gebürstet", "Alabasterweiß", "Bronze dunkel"] },
      en: { badge: "Made to order", short: "Pendant with five mouth-blown glass bodies on a solid brass carrier.",
        description: "Alba is made to order and to measure. Five glass bodies are individually mouth-blown in Murano — no two alike. They hang from a solid brass carrier whose length is matched to the room. The height of each glass is set freely during installation, so the piece can follow a table, a staircase or an atrium.",
        material: "Mouth-blown Murano glass, solid brass", dimensions: "W 180 × D 30 × H 90–260 cm (drop made to measure)",
        origin: "Murano glassworks, Italy", lead: "16–20 weeks", colors: ["Brushed brass", "Alabaster white", "Dark bronze"] },
      fr: { badge: "Sur mesure", short: "Suspension à cinq corps de verre soufflés à la bouche sur un support en laiton massif.",
        description: "Alba est réalisée sur mesure. Cinq corps de verre sont soufflés à la bouche un à un à Murano — aucun n\u2019est identique. Ils sont suspendus à un support en laiton massif dont la longueur s\u2019accorde à la pièce. La hauteur de chaque verre se règle librement à la pose, afin que la suspension épouse une table, un escalier ou un vide.",
        material: "Verre de Murano soufflé à la bouche, laiton massif", dimensions: "L 180 × P 30 × H 90–260 cm (hauteur sur mesure)",
        origin: "Verrerie de Murano, Italie", lead: "16–20 semaines", colors: ["Laiton brossé", "Blanc albâtre", "Bronze foncé"] },
      es: { badge: "Hecho a medida", short: "Lámpara de suspensión con cinco cuerpos de vidrio soplados a boca sobre un soporte de latón macizo.",
        description: "Alba se realiza a medida. Cinco cuerpos de vidrio se soplan a boca uno a uno en Murano — no hay dos iguales. Cuelgan de un soporte de latón macizo cuya longitud se ajusta a la estancia. La altura de cada vidrio se decide libremente durante el montaje, de modo que la lámpara siga una mesa, una escalera o un espacio a doble altura.",
        material: "Vidrio de Murano soplado a boca, latón macizo", dimensions: "An 180 × Pr 30 × Al 90–260 cm (caída a medida)",
        origin: "Vidriería de Murano, Italia", lead: "16–20 semanas", colors: ["Latón cepillado", "Blanco alabastro", "Bronce oscuro"] }
    }
  },
  {
    id: "leuchte-vertice", used: false, name: "Vertice", categoryKey: "leuchten", shape: "lampe", tone: "studio",
    price: 11400, weight: "46 kg", swatches: ["#e8e0d0", "#cfc3ae", "#4a4239"],
    t: {
      de: { short: "Stehleuchte mit Schirm aus geschliffenem Alabaster auf einem Fuß aus Blaustein.",
        description: "Der Schirm der Vertice wird aus einem einzigen Block Alabaster geschliffen und so weit ausgedünnt, dass das Licht durch den Stein hindurchtritt. Jede Maserung ist ein Unikat. Der Fuß aus belgischem Blaustein hält die Leuchte ohne Verankerung; das Vorschaltgerät ist im Schaft verborgen.",
        material: "Alabaster, belgischer Blaustein, Messing", dimensions: "Ø 52 × H 176 cm",
        origin: "Steinmetz Volterra, Italien", lead: "12–14 Wochen", colors: ["Alabaster natur", "Alabaster honig", "Blaustein dunkel"] },
      en: { short: "Floor lamp with a ground alabaster shade on a bluestone base.",
        description: "The Vertice shade is ground from a single block of alabaster and thinned until the light passes through the stone. Every vein is unique. The Belgian bluestone base holds the lamp without fixing; the driver is concealed in the stem.",
        material: "Alabaster, Belgian bluestone, brass", dimensions: "Ø 52 × H 176 cm",
        origin: "Volterra stonemasons, Italy", lead: "12–14 weeks", colors: ["Natural alabaster", "Honey alabaster", "Dark bluestone"] },
      fr: { short: "Lampadaire à abat-jour en albâtre taillé sur un socle en pierre bleue.",
        description: "L\u2019abat-jour du Vertice est taillé dans un seul bloc d\u2019albâtre, aminci jusqu\u2019à ce que la lumière traverse la pierre. Chaque veine est unique. Le socle en pierre bleue de Belgique tient la lampe sans fixation ; l\u2019alimentation est dissimulée dans le fût.",
        material: "Albâtre, pierre bleue de Belgique, laiton", dimensions: "Ø 52 × H 176 cm",
        origin: "Tailleurs de pierre de Volterra, Italie", lead: "12–14 semaines", colors: ["Albâtre naturel", "Albâtre miel", "Pierre bleue foncée"] },
      es: { short: "Lámpara de pie con pantalla de alabastro tallado sobre base de piedra azul.",
        description: "La pantalla del Vertice se talla en un único bloque de alabastro y se adelgaza hasta que la luz atraviesa la piedra. Cada veta es única. La base de piedra azul belga sostiene la lámpara sin anclaje; el equipo va oculto en el fuste.",
        material: "Alabastro, piedra azul belga, latón", dimensions: "Ø 52 × Al 176 cm",
        origin: "Canteros de Volterra, Italia", lead: "12–14 semanas", colors: ["Alabastro natural", "Alabastro miel", "Piedra azul oscura"] }
    }
  },
  {
    id: "regal-biblio", used: true, grade: "sehrgut", year: "2019", name: "Biblio", categoryKey: "aufbewahrung", shape: "regal", tone: "stone",
    price: 3960, weight: "86 kg", swatches: ["#4a3b2c", "#c1a37a", "#2e2c28"],
    t: {
      de: { short: "Bibliotheksregal aus geräucherter Eiche, vier Ebenen.",
        description: "Biblio ist ein Regal für Sammlungen. Die Böden sind in der Höhe verstellbar und tragen bis zu 60 kg pro Ebene. Die Verbindungen sind gezinkt und kommen ohne sichtbare Beschläge aus.",
        material: "Eiche geräuchert, Messingdübel", dimensions: "B 180 × T 38 × H 210 cm",
        origin: "Schreinerei Schwarzwald, Deutschland", lead: "10–12 Wochen", colors: ["Eiche geräuchert", "Eiche natur", "Schwarz gebeizt"] },
      en: { short: "Library shelf in smoked oak, four levels.",
        description: "Biblio is a shelf for collections. The shelves are height-adjustable and carry up to 60 kg each. The joints are dovetailed and need no visible fittings.",
        material: "Smoked oak, brass dowels", dimensions: "W 180 × D 38 × H 210 cm",
        origin: "Black Forest joinery, Germany", lead: "10–12 weeks", colors: ["Smoked oak", "Natural oak", "Black stained"] },
      fr: { short: "Bibliothèque en chêne fumé, quatre niveaux.",
        description: "Biblio est une étagère pour les collections. Les tablettes sont réglables en hauteur et supportent jusqu'à 60 kg chacune. Les assemblages sont à queues d'aronde et se passent de ferrures visibles.",
        material: "Chêne fumé, tourillons en laiton", dimensions: "L 180 × P 38 × H 210 cm",
        origin: "Menuiserie de la Forêt-Noire, Allemagne", lead: "10–12 semaines", colors: ["Chêne fumé", "Chêne naturel", "Noir teinté"] },
      es: { short: "Estantería de biblioteca en roble ahumado, cuatro alturas.",
        description: "Biblio es una estantería para colecciones. Los estantes son regulables en altura y soportan hasta 60 kg cada uno. Las uniones son de cola de milano y prescinden de herrajes visibles.",
        material: "Roble ahumado, pasadores de latón", dimensions: "An 180 × Pr 38 × Al 210 cm",
        origin: "Ebanistería de la Selva Negra, Alemania", lead: "10–12 semanas", colors: ["Roble ahumado", "Roble natural", "Negro teñido"] }
    }
  },
  {
    id: "sideboard-linea", used: true, grade: "wieneu", year: "2021", name: "Linea", categoryKey: "aufbewahrung", shape: "sideboard", tone: "clay",
    price: 4480, weight: "74 kg", swatches: ["#6b4a30", "#c1a37a", "#5a5f45"],
    t: {
      de: { short: "Sideboard mit Schiebetüren und Innenausbau aus Ahorn.",
        description: "Hinter den grifflosen Schiebetüren von Linea verbirgt sich ein sorgfältig gearbeiteter Innenausbau aus hellem Ahorn mit verstellbaren Böden und zwei Schubladen mit Filzeinlage.",
        material: "Nussbaum, Ahorn, Messing", dimensions: "B 200 × T 45 × H 72 cm",
        origin: "Manufaktur Rhein, Deutschland", lead: "10–12 Wochen", colors: ["Nussbaum", "Eiche natur", "Olivgrün"] },
      en: { short: "Sideboard with sliding doors and a maple interior.",
        description: "Behind Linea's handle-free sliding doors sits a carefully made interior of pale maple with adjustable shelves and two felt-lined drawers.",
        material: "Walnut, maple, brass", dimensions: "W 200 × D 45 × H 72 cm",
        origin: "Rhine workshop, Germany", lead: "10–12 weeks", colors: ["Walnut", "Natural oak", "Olive green"] },
      fr: { short: "Buffet à portes coulissantes, intérieur en érable.",
        description: "Derrière les portes coulissantes sans poignée de Linea se cache un aménagement soigné en érable clair, avec tablettes réglables et deux tiroirs doublés de feutre.",
        material: "Noyer, érable, laiton", dimensions: "L 200 × P 45 × H 72 cm",
        origin: "Atelier du Rhin, Allemagne", lead: "10–12 semaines", colors: ["Noyer", "Chêne naturel", "Vert olive"] },
      es: { short: "Aparador con puertas correderas e interior de arce.",
        description: "Tras las puertas correderas sin tirador de Linea se esconde un interior cuidadosamente ejecutado en arce claro, con estantes regulables y dos cajones forrados de fieltro.",
        material: "Nogal, arce, latón", dimensions: "An 200 × Pr 45 × Al 72 cm",
        origin: "Taller del Rin, Alemania", lead: "10–12 semanas", colors: ["Nogal", "Roble natural", "Verde oliva"] }
    }
  },
  {
    id: "bett-sereno", used: true, grade: "gut", year: "2018", name: "Sereno", categoryKey: "betten", shape: "bett", tone: "sage",
    price: 5240, weight: "88 kg", swatches: ["#9aa78d", "#ded3bd", "#6e7d8a"],
    t: {
      de: { short: "Polsterbett mit hohem Kopfteil in Leinen.",
        description: "Das großzügige Kopfteil von Sereno ist in einzelne Segmente unterteilt und mit Rosshaar unterfüttert. Der Bettrahmen ist aus massiver Buche gezapft und trägt einen Lattenrost mit 42 Federleisten.",
        material: "Leinen, Buche massiv, Rosshaar", dimensions: "B 200 × L 220 × H 118 cm (Liegefläche 180 × 200)",
        origin: "Manufaktur Rhein, Deutschland", lead: "12–14 Wochen", colors: ["Salbei", "Leinen natur", "Rauchblau"] },
      en: { short: "Upholstered bed with a tall linen headboard.",
        description: "Sereno's generous headboard is divided into separate panels and backed with horsehair. The bed frame is mortised from solid beech and carries a slatted base with 42 sprung slats.",
        material: "Linen, solid beech, horsehair", dimensions: "W 200 × L 220 × H 118 cm (mattress 180 × 200)",
        origin: "Rhine workshop, Germany", lead: "12–14 weeks", colors: ["Sage", "Natural linen", "Smoke blue"] },
      fr: { short: "Lit rembourré à haute tête de lit en lin.",
        description: "La généreuse tête de lit du Sereno est divisée en panneaux et doublée de crin. Le cadre est assemblé à tenons en hêtre massif et reçoit un sommier à 42 lattes.",
        material: "Lin, hêtre massif, crin", dimensions: "L 200 × P 220 × H 118 cm (couchage 180 × 200)",
        origin: "Atelier du Rhin, Allemagne", lead: "12–14 semaines", colors: ["Sauge", "Lin naturel", "Bleu fumée"] },
      es: { short: "Cama tapizada con cabecero alto de lino.",
        description: "El generoso cabecero del Sereno se divide en paneles y va reforzado con crin. El armazón está ensamblado a espiga en haya maciza y sostiene un somier de 42 láminas.",
        material: "Lino, haya maciza, crin", dimensions: "An 200 × La 220 × Al 118 cm (colchón 180 × 200)",
        origin: "Taller del Rin, Alemania", lead: "12–14 semanas", colors: ["Salvia", "Lino natural", "Azul humo"] }
    }
  },
  {
    id: "teppich-nomade", used: true, grade: "sehrgut", year: "2016", name: "Nomade", categoryKey: "accessoires", shape: "teppich", tone: "clay",
    price: 2180, weight: "22 kg", swatches: ["#a5643f", "#d4c2a4", "#484540"],
    t: {
      de: { short: "Handgeknüpfter Teppich aus Hochlandwolle.",
        description: "Nomade wird von Hand aus reiner Hochlandwolle geknüpft — rund 900 Arbeitsstunden stecken in einem Stück. Die leicht changierende Farbgebung entsteht durch die Färbung mit Pflanzenfarben.",
        material: "Hochlandwolle, pflanzengefärbt", dimensions: "300 × 200 cm",
        origin: "Knüpferei Anatolien, Türkei", lead: "8–10 Wochen", colors: ["Rost", "Sand", "Kohle"] },
      en: { short: "Hand-knotted rug in highland wool.",
        description: "Nomade is knotted by hand from pure highland wool — around 900 working hours go into one piece. The gently shifting colour comes from dyeing with plant pigments.",
        material: "Highland wool, plant-dyed", dimensions: "300 × 200 cm",
        origin: "Anatolian knotters, Turkey", lead: "8–10 weeks", colors: ["Rust", "Sand", "Charcoal"] },
      fr: { short: "Tapis noué main en laine des hauts plateaux.",
        description: "Nomade est noué à la main en pure laine des hauts plateaux — environ 900 heures de travail par pièce. Les nuances légèrement changeantes viennent de la teinture végétale.",
        material: "Laine des hauts plateaux, teinture végétale", dimensions: "300 × 200 cm",
        origin: "Noueurs d'Anatolie, Turquie", lead: "8–10 semaines", colors: ["Rouille", "Sable", "Charbon"] },
      es: { short: "Alfombra anudada a mano en lana de altiplano.",
        description: "Nomade se anuda a mano en pura lana de altiplano — unas 900 horas de trabajo por pieza. El color, levemente cambiante, procede del tinte vegetal.",
        material: "Lana de altiplano, tinte vegetal", dimensions: "300 × 200 cm",
        origin: "Anudadores de Anatolia, Turquía", lead: "8–10 semanas", colors: ["Óxido", "Arena", "Carbón"] }
    }
  },
  {
    id: "spiegel-luna", used: true, grade: "wieneu", year: "2022", name: "Luna", categoryKey: "accessoires", shape: "spiegel", tone: "rose",
    price: 1480, weight: "34 kg", swatches: ["#b08d4a", "#7d6144", "#2e2c28"],
    t: {
      de: { short: "Standspiegel mit Rahmen aus poliertem Messing.",
        description: "Luna ist ein Ganzkörperspiegel mit einem Rahmen aus poliertem Messing, der mit den Jahren sanft nachdunkelt. Das Kristallglas ist 6 mm stark und facettiert geschliffen.",
        material: "Poliertes Messing, Kristallglas", dimensions: "B 80 × H 190 cm",
        origin: "Atelier Lyon, Frankreich", lead: "6–8 Wochen", colors: ["Messing poliert", "Bronze", "Schwarz matt"] },
      en: { short: "Floor mirror framed in polished brass.",
        description: "Luna is a full-length mirror in a polished brass frame that darkens gently over the years. The crystal glass is 6 mm thick with a bevelled edge.",
        material: "Polished brass, crystal glass", dimensions: "W 80 × H 190 cm",
        origin: "Lyon workshop, France", lead: "6–8 weeks", colors: ["Polished brass", "Bronze", "Matt black"] },
      fr: { short: "Miroir sur pied encadré de laiton poli.",
        description: "Luna est un miroir en pied dans un cadre en laiton poli qui fonce doucement au fil des ans. Le verre cristal fait 6 mm d'épaisseur, à bord biseauté.",
        material: "Laiton poli, verre cristal", dimensions: "L 80 × H 190 cm",
        origin: "Atelier de Lyon, France", lead: "6–8 semaines", colors: ["Laiton poli", "Bronze", "Noir mat"] },
      es: { short: "Espejo de pie con marco de latón pulido.",
        description: "Luna es un espejo de cuerpo entero con marco de latón pulido que se oscurece suavemente con los años. El cristal tiene 6 mm de grosor y canto biselado.",
        material: "Latón pulido, cristal", dimensions: "An 80 × Al 190 cm",
        origin: "Taller de Lyon, Francia", lead: "6–8 semanas", colors: ["Latón pulido", "Bronce", "Negro mate"] }
    }
  }
];

/* Ein gebrauchtes Stück ist ein Einzelstück und nur einmal zu haben. */
const bestand = (product) => (product.used ? 1 : 99);

/* Liefert die Texte eines Produkts in der aktiven Sprache. */
function pt(product) {
  return (product.t && (product.t[getLang()] || product.t.de)) || {};
}

/* Farbfelder mit übersetzten Namen */
function productColors(product) {
  const names = pt(product).colors || [];
  return product.swatches.map((hex, i) => ({ hex, name: names[i] || "" }));
}
