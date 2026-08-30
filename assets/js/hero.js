/* =========================================================
   MAISON NOIR — Bühnenbild der Startseite
   Auf Canvas gezeichnet, weil erst damit möglich wird, was ein
   Raum glaubwürdig macht: echte Unschärfe, ein Lichtschacht aus
   dem Fenster, eine Spiegelung im Parkett, Staub im Licht.
   Das Bild wird einmal in einen Zwischenspeicher gezeichnet;
   pro Bild kommen nur Staub und Korn hinzu.
   ========================================================= */

const HERO_W = 1600;
const HERO_H = 900;

/* Warme und kühle Töne getrennt — Licht ist warm, Schatten kühl.
   Dieser Gegensatz lässt einen Raum teuer aussehen. */
const HERO = {
  wallTop:   "#3a352b",
  wallDeep:  "#0f0e0a",
  shadowCool:"#141821",
  glassLow:  "#43321e",
  glassMid:  "#946b3a",
  glassHigh: "#d8b880",
  light:     "#ffdc9e",
  floorNear: "#2a251c",
  floorFar:  "#4a3f30",
  wood:      "#1e1a14",
  brass:     "#c39a52"
};

function heroCanvas(host) {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label",
    "Abendlicher Wohnraum: Licht fällt durch ein hohes Bogenfenster auf Parkett, davor ein Sofa und eine Stehleuchte");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  host.innerHTML = "";
  host.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) { host.innerHTML = heroScene(); return; }          // Rückfall auf die SVG-Fassung

  const canBlur = typeof ctx.filter === "string";
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let scene = null;      // fertig gezeichneter Raum
  let grain = null;      // Kornmuster
  let motes = [];        // Staub im Licht
  let view = { scale: 1, dx: 0, dy: 0, w: 0, h: 0 };
  let running = false;

  /* ---------- Bausteine ---------- */

  function windowPath(c) {
    c.beginPath();
    c.moveTo(1002, 664);
    c.lineTo(1002, 330);
    c.arc(1198, 330, 196, Math.PI, 0);
    c.lineTo(1394, 664);
    c.closePath();
  }

  function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }

  /* Sofa und Leuchte — einmal beschrieben, mehrfach benutzt
     (aufrecht für den Raum, gespiegelt für den Boden). */
  function drawFurniture(c) {
    c.save();
    c.translate(62, 0);
    // Sofa
    c.fillStyle = HERO.wood;
    roundRect(c, 768, 464, 484, 106, 26); c.fill();
    c.fillStyle = "#2b261d";
    roundRect(c, 784, 520, 452, 124, 24); c.fill();
    c.fillStyle = "rgba(180,142,74,.42)";
    roundRect(c, 812, 546, 186, 68, 16); c.fill();
    roundRect(c, 1022, 546, 186, 68, 16); c.fill();
    c.fillStyle = HERO.wood;
    roundRect(c, 748, 492, 48, 152, 22); c.fill();
    roundRect(c, 1216, 492, 48, 152, 22); c.fill();
    // Lichtkante auf der Fensterseite
    c.fillStyle = "rgba(255,220,158,.24)";
    roundRect(c, 1240, 496, 12, 144, 6); c.fill();
    c.fillStyle = HERO.brass;
    c.fillRect(806, 642, 13, 62);
    c.fillRect(1193, 642, 13, 62);

    // Stehleuchte
    c.fillStyle = HERO.brass;
    c.fillRect(1415, 392, 9, 300);
    c.beginPath(); c.ellipse(1420, 692, 54, 11, 0, 0, Math.PI * 2); c.fill();
    c.restore();
  }

  function drawShade(c) {
    const g = c.createLinearGradient(0, 296, 0, 392);
    g.addColorStop(0, "#f0dcae");
    g.addColorStop(1, "#c39a52");
    c.fillStyle = g;
    c.beginPath();
    c.moveTo(1422, 296); c.lineTo(1542, 296); c.lineTo(1574, 392); c.lineTo(1390, 392);
    c.closePath(); c.fill();
    c.fillStyle = "rgba(255,255,255,.10)";
    c.beginPath();
    c.moveTo(1422, 296); c.lineTo(1466, 296); c.lineTo(1446, 392); c.lineTo(1390, 392);
    c.closePath(); c.fill();
  }

  /* ---------- Der Raum ---------- */

  function paintScene() {
    const c = scene.getContext("2d");
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, HERO_W, HERO_H);

    /* Wand — leicht unscharf, damit das Sofa davor schärfer wirkt */
    const wall = c.createLinearGradient(0, 0, 420, HERO_H);
    wall.addColorStop(0, HERO.wallTop);
    wall.addColorStop(0.55, "#221d16");
    wall.addColorStop(1, HERO.wallDeep);
    c.fillStyle = wall;
    c.fillRect(0, 0, HERO_W, HERO_H);

    // Kühler Schatten in der linken Hälfte — Gegenspieler zum warmen Licht
    const cool = c.createLinearGradient(0, 0, 900, 300);
    cool.addColorStop(0, "rgba(20,24,33,.55)");
    cool.addColorStop(1, "rgba(20,24,33,0)");
    c.fillStyle = cool;
    c.fillRect(0, 0, HERO_W, HERO_H);

    // Wandfelder, sehr zurückgenommen
    if (canBlur) c.filter = "blur(1.5px)";
    c.strokeStyle = "rgba(231,211,170,.045)";
    c.lineWidth = 2;
    for (let i = 0; i < 3; i++) { c.strokeRect(96 + i * 190, 150, 150, 430); }
    c.beginPath(); c.moveTo(0, 118); c.lineTo(HERO_W, 118); c.stroke();
    if (canBlur) c.filter = "none";

    /* Fenster */
    const glass = c.createLinearGradient(1000, 140, 1200, 664);
    glass.addColorStop(0, HERO.glassLow);
    glass.addColorStop(0.42, HERO.glassMid);
    glass.addColorStop(1, HERO.glassHigh);
    c.save(); windowPath(c); c.fillStyle = glass; c.fill();
    // Sprossen
    c.strokeStyle = "rgba(24,20,15,.5)"; c.lineWidth = 7;
    c.beginPath(); c.moveTo(1198, 140); c.lineTo(1198, 664); c.stroke();
    c.beginPath(); c.moveTo(1002, 392); c.lineTo(1394, 392); c.stroke();
    c.restore();
    c.save(); windowPath(c);
    c.strokeStyle = "rgba(243,222,182,.28)"; c.lineWidth = 5; c.stroke();
    c.restore();

    /* Lichtschacht — der eigentliche Grund für Canvas: ohne echte
       Unschärfe sieht ein Lichtstrahl immer nach Papierschnitt aus. */
    c.save();
    c.globalCompositeOperation = "lighter";
    if (canBlur) c.filter = "blur(60px)";
    const shaft = c.createLinearGradient(1200, 200, 700, 900);
    shaft.addColorStop(0, "rgba(255,220,158,.13)");
    shaft.addColorStop(0.55, "rgba(255,220,158,.045)");
    shaft.addColorStop(1, "rgba(255,220,158,0)");
    c.fillStyle = shaft;
    c.beginPath();
    c.moveTo(1002, 200); c.lineTo(1394, 200); c.lineTo(1560, 900); c.lineTo(560, 900);
    c.closePath(); c.fill();
    c.restore();

    /* Boden */
    const floor = c.createLinearGradient(0, 640, 0, HERO_H);
    floor.addColorStop(0, "#16130e");
    floor.addColorStop(0.18, HERO.floorFar);
    floor.addColorStop(0.5, "#332c22");
    floor.addColorStop(1, HERO.floorNear);
    c.save();
    if (canBlur) c.filter = "blur(6px)";       // weicher Übergang zur Wand
    c.fillStyle = floor;
    c.fillRect(-20, 640, HERO_W + 40, HERO_H - 620);
    c.restore();

    // Dielenfugen, nach vorn breiter werdend
    c.strokeStyle = "rgba(196,163,110,.10)";
    c.lineWidth = 1.5;
    for (let i = 0; i < 10; i++) {
      const y = 664 + Math.pow(i / 9, 1.8) * 236;
      c.beginPath(); c.moveTo(0, y); c.lineTo(HERO_W, y); c.stroke();
    }

    /* Spiegelung im Parkett: dieselben Möbel gestaucht, gespiegelt,
       stark unscharf und fast durchsichtig. */
    c.save();
    c.beginPath(); c.rect(0, 664, HERO_W, HERO_H - 664); c.clip();
    c.globalAlpha = 0.20;
    if (canBlur) c.filter = "blur(9px)";
    c.translate(0, 1328);          // 2 × Bodenkante
    c.scale(1, -0.55);
    c.translate(0, 664 * (1 / 0.55) - 664);
    drawFurniture(c);
    c.restore();

    // Lichtteppich unter dem Fenster
    c.save();
    c.globalCompositeOperation = "lighter";
    if (canBlur) c.filter = "blur(50px)";
    const pool = c.createRadialGradient(1180, 760, 20, 1180, 760, 460);
    pool.addColorStop(0, "rgba(255,220,158,.11)");
    pool.addColorStop(1, "rgba(255,220,158,0)");
    c.fillStyle = pool;
    c.fillRect(600, 664, 1000, 236);
    c.restore();

    /* Teppich */
    c.save();
    if (canBlur) c.filter = "blur(3px)";
    c.fillStyle = "rgba(138,116,84,.14)";
    c.beginPath(); c.ellipse(1060, 790, 500, 96, 0, 0, Math.PI * 2); c.fill();
    c.restore();

    /* Weicher Schattenwurf, dann die Möbel scharf darüber */
    c.save();
    if (canBlur) c.filter = "blur(26px)";
    c.fillStyle = "rgba(0,0,0,.72)";
    c.beginPath(); c.ellipse(1072, 706, 290, 30, 0, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.ellipse(1482, 700, 80, 16, 0, 0, Math.PI * 2); c.fill();
    c.restore();

    /* Schein der Leuchte — hinter den Möbeln, damit das Sofa lesbar bleibt */
    c.save();
    c.globalCompositeOperation = "lighter";
    const lamp = c.createRadialGradient(1420, 368, 10, 1420, 368, 380);
    lamp.addColorStop(0, "rgba(255,230,180,.15)");
    lamp.addColorStop(0.35, "rgba(255,230,180,.055)");
    lamp.addColorStop(1, "rgba(255,230,180,0)");
    c.fillStyle = lamp;
    c.fillRect(1040, 0, 560, 760);
    c.restore();

    drawFurniture(c);
    drawShade(c);

    /* Nur der Schirm selbst leuchtet noch, eng begrenzt */
    c.save();
    c.globalCompositeOperation = "lighter";
    const bulb = c.createRadialGradient(1482, 344, 10, 1482, 344, 150);
    bulb.addColorStop(0, "rgba(255,232,186,.18)");
    bulb.addColorStop(1, "rgba(255,232,186,0)");
    c.fillStyle = bulb;
    c.fillRect(1312, 200, 288, 280);
    c.restore();

    /* Die linke Seite läuft ins Dunkle aus. Dort steht die Schrift,
       und das Sofa taucht so aus dem Schatten auf, statt abgeschnitten
       neben dem Text zu enden. */
    const fade = c.createLinearGradient(0, 0, 1120, 0);
    fade.addColorStop(0, "rgba(12,11,8,.88)");
    fade.addColorStop(0.45, "rgba(12,11,8,.52)");
    fade.addColorStop(1, "rgba(12,11,8,0)");
    c.fillStyle = fade;
    c.fillRect(0, 0, HERO_W, HERO_H);

    /* Vignette */
    const vig = c.createRadialGradient(960, 396, 240, 960, 396, 1120);
    vig.addColorStop(0, "rgba(0,0,0,0)");
    vig.addColorStop(1, "rgba(0,0,0,.70)");
    c.fillStyle = vig;
    c.fillRect(0, 0, HERO_W, HERO_H);
  }

  /* ---------- Korn ---------- */

  function makeGrain() {
    const size = 180;
    const g = document.createElement("canvas");
    g.width = g.height = size;
    const gc = g.getContext("2d");
    const img = gc.createImageData(size, size);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 120 + Math.random() * 135;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 26;
    }
    gc.putImageData(img, 0, 0);
    return g;
  }

  /* ---------- Staub im Licht ---------- */

  function makeMotes() {
    const list = [];
    for (let i = 0; i < 34; i++) {
      list.push({
        x: 620 + Math.random() * 900,
        y: 180 + Math.random() * 700,
        r: 0.7 + Math.random() * 1.5,
        a: 0.06 + Math.random() * 0.16,
        vy: -(0.04 + Math.random() * 0.10),
        vx: 0.02 + Math.random() * 0.05,
        phase: Math.random() * Math.PI * 2
      });
    }
    return list;
  }

  /* ---------- Ausgabe ---------- */

  function resize() {
    const rect = host.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    canvas.width = w * dpr;
    canvas.height = h * dpr;

    const scale = Math.max(w / HERO_W, h / HERO_H);
    /* Im Hochformat bliebe bei mittiger Ausrichtung nur die leere linke
       Wand übrig. Der Ausschnitt wandert deshalb nach rechts, wo Fenster,
       Sofa und Leuchte stehen. */
    const hochformat = w / h < 1.15;
    const ax = hochformat ? 0.70 : 0.5;
    view = {
      scale: scale * dpr,
      dx: (w * dpr - HERO_W * scale * dpr) * ax,
      dy: (h * dpr - HERO_H * scale * dpr) / 2,
      w, h
    };

    if (!scene) {
      scene = document.createElement("canvas");
      scene.width = HERO_W;
      scene.height = HERO_H;
      paintScene();
    }
    draw(0);
  }

  function draw(time) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(view.scale, 0, 0, view.scale, view.dx, view.dy);

    ctx.drawImage(scene, 0, 0);

    /* Im Hochformat liegt die Schrift über dem hellen Fenster — dort
       braucht es einen zusätzlichen Schleier. */
    if (view.w / view.h < 1.15) {
      const sichtbarLinks = -view.dx / view.scale;
      const veil = ctx.createLinearGradient(sichtbarLinks, 0, sichtbarLinks + view.w / view.scale, 0);
      veil.addColorStop(0, "rgba(12,11,8,.82)");
      veil.addColorStop(0.75, "rgba(12,11,8,.58)");
      veil.addColorStop(1, "rgba(12,11,8,.40)");
      ctx.fillStyle = veil;
      ctx.fillRect(0, 0, HERO_W, HERO_H);
    }

    // Staub
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    motes.forEach((m) => {
      const flicker = 0.65 + 0.35 * Math.sin(time / 1400 + m.phase);
      ctx.fillStyle = "rgba(255,226,176," + (m.a * flicker).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    // Korn
    ctx.save();
    ctx.globalCompositeOperation = "overlay";
    const pattern = ctx.createPattern(grain, "repeat");
    if (pattern) { ctx.fillStyle = pattern; ctx.fillRect(0, 0, HERO_W, HERO_H); }
    ctx.restore();
  }

  function step(time) {
    if (!running) return;
    motes.forEach((m) => {
      m.y += m.vy;
      m.x += m.vx;
      if (m.y < 140) { m.y = 900; m.x = 620 + Math.random() * 900; }
      if (m.x > 1560) m.x = 620;
    });
    draw(time);
    requestAnimationFrame(step);
  }

  grain = makeGrain();
  motes = makeMotes();
  resize();

  if (typeof ResizeObserver === "function") {
    let last = 0;
    new ResizeObserver(() => {
      const w = Math.round(host.getBoundingClientRect().width);
      if (w === last) return;                 // Adressleiste auf dem Handy löst sonst dauernd aus
      last = w;
      resize();
    }).observe(host);
  } else {
    window.addEventListener("resize", resize);
  }

  // Bewegung nur, solange das Bild zu sehen ist
  if (!still && typeof IntersectionObserver === "function") {
    new IntersectionObserver((entries) => {
      const visible = entries.some((e) => e.isIntersecting);
      if (visible && !running) { running = true; requestAnimationFrame(step); }
      else if (!visible) running = false;
    }, { threshold: 0.02 }).observe(host);
  }
}
