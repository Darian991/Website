/* =========================================================
   STUDIO LUSSO — Bühnenbild der Startseite

   Die Broschüre öffnet mit einer großformatigen Materialaufnahme
   neben einer weißen Textfläche. Genau das bildet diese Datei nach:
   links eine auf Canvas berechnete Steinmaserung, rechts die Aussage
   auf Weiß. Canvas deshalb, weil eine glaubwürdige Maserung aus
   überlagerten Störungen entsteht — als Vektorgrafik bliebe sie flach.
   ========================================================= */

const HERO_W = 1200;
const HERO_H = 1400;

/* Farben der Broschüre: warmes Greige, gebrochenes Weiß, dunkles Braun */
const HERO = {
  hell:   [246, 244, 241],
  greige: [168, 158, 148],
  tief:   [ 92,  82,  73],
  dunkel: [ 58,  50,  41],
  ader:   [232, 228, 222]
};

function heroCanvas(host) {
  if (typeof host.__heroCleanup === "function") host.__heroCleanup();

  const canvas = document.createElement("canvas");
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "Großformatige Aufnahme eines geäderten Natursteins in warmen Grautönen");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  host.innerHTML = "";
  host.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) { host.style.background = "#a89e94"; return; }

  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let stein = null;
  let view = { scale: 1, dx: 0, dy: 0 };
  let drift = 0;
  let running = false;

  /* --- Wertrauschen: geglättete Zufallszahlen, daraus entsteht die Maserung --- */
  function rauschFeld(groesse, saat) {
    const f = new Float32Array(groesse * groesse);
    let z = saat;
    const zufall = () => { z = (z * 1103515245 + 12345) & 0x7fffffff; return z / 0x7fffffff; };
    for (let i = 0; i < f.length; i++) f[i] = zufall();
    return f;
  }

  function abtasten(feld, groesse, x, y) {
    const xi = Math.floor(x), yi = Math.floor(y);
    const fx = x - xi, fy = y - yi;
    const g = (a, b) => feld[((b % groesse) + groesse) % groesse * groesse + ((a % groesse) + groesse) % groesse];
    const s = (t) => t * t * (3 - 2 * t);                 // weiche Blende
    const u = s(fx), v = s(fy);
    return (g(xi, yi) * (1 - u) + g(xi + 1, yi) * u) * (1 - v)
         + (g(xi, yi + 1) * (1 - u) + g(xi + 1, yi + 1) * u) * v;
  }

  function fbm(feld, groesse, x, y, lagen) {
    let summe = 0, gewicht = 0, amp = 1, frq = 1;
    for (let i = 0; i < lagen; i++) {
      summe += amp * abtasten(feld, groesse, x * frq, y * frq);
      gewicht += amp;
      amp *= 0.5; frq *= 2.07;
    }
    return summe / gewicht;
  }

  const misch = (a, b, t) => [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t)
  ];

  /* --- Die Steinplatte einmal berechnen --- */
  function malStein() {
    stein = document.createElement("canvas");
    stein.width = HERO_W;
    stein.height = HERO_H;
    const c = stein.getContext("2d");
    const bild = c.createImageData(HERO_W, HERO_H);
    const d = bild.data;

    const G = 128;
    const grob = rauschFeld(G, 20250830);
    const fein = rauschFeld(G, 77123);

    for (let y = 0; y < HERO_H; y++) {
      for (let x = 0; x < HERO_W; x++) {
        const nx = x / HERO_W, ny = y / HERO_H;

        // Zwei Störungsfelder verziehen die Adern. Ohne diese Verzerrung
        // entstünden gleichmäßige Wellen — Stein ist nie gleichmäßig.
        const warp  = fbm(grob, G, nx * 1.8, ny * 0.9, 5);
        const warp2 = fbm(fein, G, nx * 4.0 + 5, ny * 2.0 + 3, 4);

        // Grundton: heller Stein mit weichen Wolken
        const wolke = fbm(fein, G, nx * 2.2 + 11, ny * 1.1 + 7, 5);
        let farbe = misch(HERO.hell, HERO.greige, Math.min(1, wolke * 0.9));

        // breite, weiche Verschattung
        const schatten = Math.max(0, fbm(grob, G, nx * 1.2 + 3, ny * 0.6 + 9, 4) - 0.45) / 0.55;
        farbe = misch(farbe, HERO.tief, Math.pow(schatten, 1.6) * 0.3);

        // Hauptadern: durch die hohe Potenz bleiben nur schmale Linien übrig
        const s1 = Math.sin((nx * 2.6 + ny * 1.2 + warp * 3.6) * Math.PI * 2);
        const ader1 = Math.pow(1 - Math.min(1, Math.abs(s1)), 14);
        farbe = misch(farbe, HERO.dunkel, ader1 * 0.55);

        // zweite, feinere Aderschar quer dazu
        const s2 = Math.sin((nx * 1.1 - ny * 3.1 + warp2 * 2.4) * Math.PI * 2);
        const ader2 = Math.pow(1 - Math.min(1, Math.abs(s2)), 22);
        farbe = misch(farbe, HERO.tief, ader2 * 0.4);

        // helle Kalkspur neben der Hauptader
        const hell = Math.pow(1 - Math.min(1, Math.abs(s1 - 0.28) * 2.2), 18);
        farbe = misch(farbe, HERO.ader, hell * 0.5);

        // Korn
        const korn = (fbm(fein, G, nx * 120, ny * 120, 2) - 0.5) * 9;

        const i = (y * HERO_W + x) * 4;
        d[i]     = Math.max(0, Math.min(255, farbe[0] + korn));
        d[i + 1] = Math.max(0, Math.min(255, farbe[1] + korn));
        d[i + 2] = Math.max(0, Math.min(255, farbe[2] + korn));
        d[i + 3] = 255;
      }
    }
    c.putImageData(bild, 0, 0);

    // Licht von oben links, wie bei einer Aufnahme im Studio
    const licht = c.createLinearGradient(0, 0, HERO_W, HERO_H);
    licht.addColorStop(0, "rgba(255,255,255,.26)");
    licht.addColorStop(0.5, "rgba(255,255,255,0)");
    licht.addColorStop(1, "rgba(58,50,41,.22)");
    c.fillStyle = licht;
    c.fillRect(0, 0, HERO_W, HERO_H);
  }

  function resize() {
    const rect = host.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const scale = Math.max((w * dpr) / HERO_W, (h * dpr) / HERO_H) * 1.06;   // Reserve für die Bewegung
    view = { scale, w, h };
    if (!stein) malStein();
    draw();
  }

  /* Ganz langsames Wandern des Ausschnitts — der Stein „atmet“ */
  function draw() {
    const bw = HERO_W * view.scale;
    const bh = HERO_H * view.scale;
    const dx = (canvas.width - bw) / 2 + Math.sin(drift) * (bw - canvas.width) * 0.4;
    const dy = (canvas.height - bh) / 2 + Math.cos(drift * 0.7) * 8;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(stein, dx, dy, bw, bh);
  }

  function step() {
    if (!running) return;
    drift += 0.00035;
    draw();
    requestAnimationFrame(step);
  }

  resize();

  let ro = null, io = null;
  if (typeof ResizeObserver === "function") {
    let lastW = 0, lastH = 0;
    ro = new ResizeObserver(() => {
      const box = host.getBoundingClientRect();
      const w = Math.round(box.width), h = Math.round(box.height);
      if (w === lastW && Math.abs(h - lastH) < 40) return;
      lastW = w; lastH = h;
      resize();
    });
    ro.observe(host);
  } else {
    window.addEventListener("resize", resize);
  }

  if (!still && typeof IntersectionObserver === "function") {
    io = new IntersectionObserver((entries) => {
      const sichtbar = entries.some((e) => e.isIntersecting);
      if (sichtbar && !running) { running = true; requestAnimationFrame(step); }
      else if (!sichtbar) running = false;
    }, { threshold: 0.02 });
    io.observe(host);
  }

  host.__heroCleanup = function () {
    running = false;
    if (ro) ro.disconnect();
    if (io) io.disconnect();
    window.removeEventListener("resize", resize);
    host.__heroCleanup = null;
  };
}
