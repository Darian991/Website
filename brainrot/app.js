/* =========================================================
   brainrot — redet dich raus aus TikTok, YouTube & Co.

   Alles läuft im Browser, nichts wird verschickt.
   Die Zahlen bleiben auf dem Handy (localStorage).
   ========================================================= */

/* ---------- Die Apps ---------- */
/* minuten = wie lange man da ungefähr hängen bleibt, wenn man "nur kurz" reingeht */
const APPS = {
  tiktok: {
    name: "TikTok", emoji: "🎵", klein: "For You Page", minuten: 30, url: "https://www.tiktok.com",
    fakten: [
      "Der Feed hat kein Ende. Kein letztes Video, kein „fertig“. Das ist Absicht.",
      "Der Algorithmus lernt in Minuten, was dich festhält – nicht, was dir guttut.",
      "Jedes Wischen ist wie ein kleines Glücksspiel: Vielleicht kommt ja jetzt das richtig gute Video."
    ]
  },
  youtube: {
    name: "YouTube", emoji: "▶️", klein: "Shorts & Autoplay", minuten: 30, url: "https://www.youtube.com",
    fakten: [
      "Autoplay startet das nächste Video, bevor du überhaupt entscheiden kannst.",
      "Shorts sind TikTok im YouTube-Kostüm.",
      "Die Vorschläge sind dafür gemacht, dass du bleibst – nicht, dass du schlauer wirst."
    ]
  },
  snapchat: {
    name: "Snapchat", emoji: "👻", klein: "Flammen & Stories", minuten: 15, url: "https://www.snapchat.com",
    fakten: [
      "Flammen sind dafür gebaut, dass du jeden Tag zurückkommst – aus Angst, sie zu verlieren.",
      "Hinter dem Chat wartet Spotlight: ein Feed ohne Ende.",
      "Die roten Punkte sollen dich nervös machen, bis du draufdrückst."
    ]
  },
  instagram: {
    name: "Instagram", emoji: "📸", klein: "Reels", minuten: 20, url: "https://www.instagram.com",
    fakten: [
      "Reels sind ein Feed ohne Ende – genau wie TikTok.",
      "Du siehst die besten Momente von anderen und vergleichst sie mit deinem ganz normalen Dienstag.",
      "Runterziehen zum Aktualisieren funktioniert wie ein Spielautomat."
    ]
  },
  andere: {
    name: "die App", emoji: "📱", klein: "Was anderes", minuten: 20, url: null,
    fakten: [
      "Viele Apps sind so gebaut, dass du möglichst lange bleibst. Deine Zeit ist ihr Geld.",
      "Hast du die App gerade bewusst aufgemacht – oder war das dein Daumen?"
    ]
  }
};

const ALTERNATIVEN = [
  "10 Liegestütze 💪", "ein großes Glas Wasser 💧", "5 Minuten rausgehen 🌳",
  "ein Lied hören – und sonst nichts machen 🎧", "jemanden anrufen, statt zu scrollen 📞",
  "was zeichnen ✏️", "5 Minuten Zimmer aufräumen 🧹", "10 Seiten lesen 📖",
  "einen Snack machen 🍎", "10 Minuten Hausaufgaben anfangen (ja, wirklich) 📚",
  "aus dem Fenster gucken und gar nichts tun ☁️", "dich strecken, einmal alles 🙆"
];

const LOB = [
  "Stark. 💪 Das war dein Kopf, nicht dein Daumen.",
  "Boss-Move. 😎",
  "Dein Gehirn sagt danke. 🧠✨",
  "Genau so. Du bestimmst, nicht die App. 🔥"
];

/* ---------- Kleinkram ---------- */
const $ = (s) => document.querySelector(s);
const zufall = (liste) => liste[Math.floor(Math.random() * liste.length)];
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
const heute = (d = new Date()) =>
  d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");

/* ---------- Speicher ---------- */
const LEER = { siege: 0, minuten: 0, verloren: 0, tage: [] };
function laden() {
  try { return { ...LEER, ...JSON.parse(localStorage.getItem("brainrot") || "{}") }; }
  catch { return { ...LEER }; }
}
function speichern(s) {
  try { localStorage.setItem("brainrot", JSON.stringify(s)); } catch {}
}
function serie(tage) {
  const set = new Set(tage);
  const d = new Date();
  if (!set.has(heute(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(heute(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function zahlenZeigen() {
  const s = laden();
  $("#z-siege").textContent = s.siege;
  $("#z-minuten").textContent = s.minuten;
  $("#z-serie").textContent = serie(s.tage);
}

/* ---------- Stimme ---------- */
let tonAn = (() => { try { return localStorage.getItem("brainrot-ton") !== "aus"; } catch { return true; } })();
function tonKnopf() { $("#ton").textContent = tonAn ? "🔊" : "🔇"; }
function sprechen(text) {
  if (!tonAn || !("speechSynthesis" in window)) return;
  const sauber = text.replace(/\p{Extended_Pictographic}|️/gu, "").trim();
  if (!sauber) return;
  const u = new SpeechSynthesisUtterance(sauber);
  u.lang = "de-DE";
  u.rate = 1.05;
  const stimme = speechSynthesis.getVoices().find((v) => v.lang && v.lang.startsWith("de"));
  if (stimme) u.voice = stimme;
  speechSynthesis.speak(u);
}

/* ---------- Seiten ---------- */
let lauf = 0; // jede neue Unterhaltung bekommt eine Nummer; alte brechen dann ab
const ABBRUCH = Symbol("abbruch");

function zeige(id) {
  document.querySelectorAll(".seite").forEach((s) => (s.hidden = s.id !== id));
  window.scrollTo(0, 0);
  if (id !== "chat") {
    lauf++;
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    zahlenZeigen();
  }
}

/* ---------- Gespräch ---------- */
function unterhaltung() {
  const nr = ++lauf;
  const verlauf = $("#verlauf");
  const antworten = $("#antworten");
  verlauf.innerHTML = "";
  antworten.innerHTML = "";
  const pruefe = () => { if (nr !== lauf) throw ABBRUCH; };
  const runter = () => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

  function blase(text, wer) {
    const b = document.createElement("div");
    b.className = "blase blase--" + wer;
    b.textContent = text;
    verlauf.appendChild(b);
    runter();
    return b;
  }

  async function sag(text) {
    pruefe();
    const tippt = document.createElement("div");
    tippt.className = "blase blase--bot blase--tippt";
    tippt.innerHTML = "<i></i><i></i><i></i>";
    verlauf.appendChild(tippt);
    runter();
    await pause(Math.min(450 + text.length * 16, 1700));
    tippt.remove();
    pruefe();
    blase(text, "bot");
    sprechen(text);
    await pause(250);
  }

  /* optionen: [[text, wert, art?]] — gibt den gewählten Wert zurück */
  function frag(optionen) {
    pruefe();
    antworten.innerHTML = "";
    return new Promise((fertig) => {
      const knoepfe = optionen.map(([text, wert, art]) => {
        const k = document.createElement("button");
        k.className = "knopf" + (art ? " knopf--" + art : "");
        k.textContent = text;
        k.onclick = () => {
          if (nr !== lauf) return;
          antworten.innerHTML = "";
          blase(text, "ich");
          fertig(wert);
        };
        antworten.appendChild(k);
        return k;
      });
      runter();
      frag.knoepfe = knoepfe;
    });
  }

  async function atmen(mal) {
    pruefe();
    const box = document.createElement("div");
    box.className = "atmen";
    box.innerHTML = '<div class="atmen__kreis"></div><div class="atmen__text"></div>';
    verlauf.appendChild(box);
    runter();
    const kreis = box.firstChild, text = box.lastChild;
    let uebersprungen = false;
    antworten.innerHTML = "";
    const weiter = document.createElement("button");
    weiter.className = "knopf knopf--leise";
    weiter.textContent = "Überspringen";
    weiter.onclick = () => (uebersprungen = true);
    antworten.appendChild(weiter);
    for (let i = 0; i < mal && !uebersprungen; i++) {
      text.textContent = "einatmen";
      kreis.classList.add("gross");
      for (let t = 0; t < 40 && !uebersprungen; t++) { await pause(100); pruefe(); }
      text.textContent = "ausatmen";
      kreis.classList.remove("gross");
      for (let t = 0; t < 40 && !uebersprungen; t++) { await pause(100); pruefe(); }
    }
    text.textContent = "✓";
    antworten.innerHTML = "";
  }

  return { sag, frag, atmen, pruefe, antworten };
}

function konfetti() {
  const zeichen = ["🎉", "✨", "🧠", "💪", "🔥", "⭐"];
  for (let i = 0; i < 24; i++) {
    const k = document.createElement("div");
    k.className = "konfetti";
    k.textContent = zufall(zeichen);
    k.style.left = Math.random() * 100 + "vw";
    k.style.animationDelay = Math.random() * 0.6 + "s";
    document.body.appendChild(k);
    setTimeout(() => k.remove(), 3000);
  }
}

async function gespraech(schluessel) {
  const app = APPS[schluessel] || APPS.andere;
  zeige("chat");
  const { sag, frag, atmen, antworten } = unterhaltung();
  const name = app.name;

  async function gewonnen(minuten) {
    const s = laden();
    s.siege++;
    s.minuten += minuten;
    if (!s.tage.includes(heute())) s.tage.push(heute());
    s.tage = s.tage.slice(-400);
    speichern(s);
    konfetti();
    await sag(zufall(LOB));
    await sag(`Du hast gerade ungefähr ${minuten} Minuten gerettet. Insgesamt schon ${s.minuten}. 🕒`);
    const n = serie(s.tage);
    if (n > 1) await sag(`Und das ist Tag ${n} am Stück. 🔥`);
    await frag([["Fertig 👋", "fertig", "gut"]]);
    zeige("start");
  }

  async function verloren() {
    const s = laden();
    s.verloren++;
    speichern(s);
    await sag("Okay. Deine Entscheidung. 👍 Ich bin nicht sauer.");
    await sag("Aber stell dir einen Wecker auf 10 Minuten. Wenn er klingelt: raus.");
    antworten.innerHTML = "";
    if (app.url) {
      const a = document.createElement("a");
      a.className = "knopf";
      a.style.textDecoration = "none";
      a.style.textAlign = "center";
      a.href = app.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = `${name} öffnen`;
      antworten.appendChild(a);
    }
    const zurueck = document.createElement("button");
    zurueck.className = "knopf knopf--leise";
    zurueck.textContent = "Zurück zum Start";
    zurueck.onclick = () => zeige("start");
    antworten.appendChild(zurueck);
  }

  async function letzteChance() {
    await sag("Sicher? Fast alle wollen „nur kurz“ – und dann ist plötzlich eine Stunde weg.");
    await sag("Warte noch 10 Sekunden. Wenn du's dann immer noch willst, ist das deine Entscheidung.");
    const warten = frag([
      ["✅ Okay, doch nicht", "doch-nicht", "gut"],
      ["Trotzdem öffnen (10)", "oeffnen"]
    ]);
    const [, oeffnen] = frag.knoepfe;
    oeffnen.disabled = true;
    (async () => {
      for (let i = 10; i > 0 && oeffnen.isConnected; i--) {
        oeffnen.textContent = `Trotzdem öffnen (${i})`;
        await pause(1000);
      }
      if (oeffnen.isConnected) { oeffnen.disabled = false; oeffnen.textContent = "Trotzdem öffnen"; }
    })();
    const wahl = await warten;
    if (wahl === "doch-nicht") return gewonnen(app.minuten);
    return verloren();
  }

  async function ideen() {
    const schon = new Set();
    for (;;) {
      let alt = zufall(ALTERNATIVEN);
      if (schon.size >= ALTERNATIVEN.length) schon.clear();
      while (schon.has(alt)) alt = zufall(ALTERNATIVEN);
      schon.add(alt);
      await sag(`Wie wär's stattdessen mit: ${alt}`);
      const wahl = await frag([
        ["✅ Okay, ich lass es", "gut", "gut"],
        ["🔁 Andere Idee", "neu"],
        ["😩 Ich will trotzdem", "trotzdem"]
      ]);
      if (wahl === "gut") return gewonnen(app.minuten);
      if (wahl === "trotzdem") return letzteChance();
      await sag(zufall(["Okay, okay.", "Kein Ding.", "Nächster Versuch:"]));
    }
  }

  try {
    await sag(`Stopp. ✋ Du willst ${schluessel === "andere" ? "eine App" : name} öffnen?`);
    await sag(zufall(app.fakten));
    await sag("Ganz ehrlich: Warum gerade?");

    const grund = await frag([
      ["😐 Mir ist langweilig", "langweilig"],
      ["🤷 Einfach so, Gewohnheit", "gewohnheit"],
      ["🎯 Ich will was Bestimmtes", "bestimmt"],
      ["💬 Jemand hat mir geschrieben", "nachricht"]
    ]);

    if (grund === "bestimmt" || grund === "nachricht") {
      if (grund === "bestimmt") {
        await sag("Okay, fair. Dann mach's wie ein Profi:");
        await sag("Rein, das eine Ding erledigen, raus. Nicht durch den Feed scrollen.");
      } else {
        await sag("Dann antworte – aber nur das.");
        await sag("Schreib zurück und mach die App sofort wieder zu. Keine Stories, kein Feed.");
      }
      const wahl = await frag([
        ["🤝 Deal: max. 5 Minuten", "deal", "gut"],
        ["✅ Kann auch warten, ich lass es", "lassen"],
        ["😬 Ehrlich gesagt will ich nur scrollen", "scrollen"]
      ]);
      if (wahl === "deal") {
        await sag("Deal. Stell dir einen 5-Minuten-Wecker. Ich vertrau dir. 🤝");
        return gewonnen(Math.max(app.minuten - 5, 5));
      }
      if (wahl === "lassen") return gewonnen(app.minuten);
      await sag("Danke für die Ehrlichkeit. Das ist schon mal mehr als die meisten. 😄");
    } else if (grund === "langweilig") {
      await sag("Langeweile ist eigentlich gut – da kommen die besten Ideen her.");
      await sag("Wenn du jetzt scrollst, ist die Langeweile nicht weg. Sie ist nur zugedeckt.");
    } else {
      await sag("Genau das ist der Trick: Dein Daumen war schneller als dein Kopf.");
      await sag("Du hast die App gar nicht wirklich öffnen wollen. Sie hat dich gerufen.");
    }

    await sag("Mach kurz mit. Drei Atemzüge, zusammen mit mir.");
    await atmen(3);
    await sag("Und? Fühlt sich der Daumen noch genauso an?");
    await ideen();
  } catch (e) {
    if (e !== ABBRUCH) throw e;
  }
}

/* ---------- Einrichten ---------- */
function linksBauen() {
  const basis = location.origin + location.pathname.replace(/index\.html$/, "");
  const box = $("#links");
  box.innerHTML = "";
  ["tiktok", "youtube", "snapchat", "instagram"].forEach((k) => {
    const url = basis + "?app=" + k;
    const zeile = document.createElement("div");
    zeile.className = "kopierzeile";
    const code = document.createElement("code");
    code.textContent = url;
    const knopf = document.createElement("button");
    knopf.textContent = "Kopieren";
    knopf.onclick = async () => {
      try { await navigator.clipboard.writeText(url); knopf.textContent = "Kopiert ✓"; }
      catch { knopf.textContent = "Bitte markieren"; }
      setTimeout(() => (knopf.textContent = "Kopieren"), 1800);
    };
    zeile.append(code, knopf);
    box.appendChild(zeile);
  });
}

/* ---------- Start ---------- */
function start() {
  const apps = $("#apps");
  Object.entries(APPS).forEach(([k, a]) => {
    const b = document.createElement("button");
    b.className = "app";
    b.innerHTML = `<span class="app__emoji"></span><span class="app__name"></span><span class="app__klein"></span>`;
    b.children[0].textContent = a.emoji;
    b.children[1].textContent = k === "andere" ? "Andere App" : a.name;
    b.children[2].textContent = a.klein;
    b.onclick = () => gespraech(k);
    apps.appendChild(b);
  });

  document.querySelectorAll("[data-nav]").forEach((b) => (b.onclick = () => zeige(b.dataset.nav)));

  tonKnopf();
  $("#ton").onclick = () => {
    tonAn = !tonAn;
    try { localStorage.setItem("brainrot-ton", tonAn ? "an" : "aus"); } catch {}
    if (!tonAn && "speechSynthesis" in window) speechSynthesis.cancel();
    tonKnopf();
  };

  $("#zuruecksetzen").onclick = () => {
    if (confirm("Wirklich alle Zahlen löschen?")) { speichern({ ...LEER }); zahlenZeigen(); }
  };

  linksBauen();
  zahlenZeigen();

  /* ?app=tiktok → sofort losreden (für die Kurzbefehl-Automation) */
  const app = new URLSearchParams(location.search).get("app");
  if (app && APPS[app]) gespraech(app);

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}

start();
