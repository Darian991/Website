/* =========================================================
   STUDIO LUSSO — Berater
   Beantwortet Fragen zum Sortiment und zum Service. Die Antworten
   kommen aus denselben Daten wie die Seite selbst (PRODUCTS, I18N),
   damit Preise, Zustand und Verfügbarkeit nie auseinanderlaufen.
   Kein Server, kein Schlüssel, keine Übertragung von Eingaben.
   ========================================================= */

/* Ein Stichwort trifft am Wortanfang: „liefer“ erkennt Lieferung und
   liefern, aber „iva“ nicht mitten in „privat“. */
function botHit(text, stem) {
  const s = stem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp("(^|[^a-z0-9])" + s).test(text);
}

/* Stichwörter aller vier Sprachen in einem Topf: Wer auf der englischen
   Seite deutsch tippt, bekommt trotzdem eine Antwort. */
const BOT_INTENTS = [
  { key: "greeting", words: ["hallo", "hallochen", "guten tag", "guten morgen", "guten abend", "servus", "moin", "gruss gott", "gruß gott", "gruezi", "tach", "hey", "hi ", "hello", "hiya", "howdy", "good morning", "good afternoon", "good evening", "good day", "bonjour", "bonsoir", "salut", "coucou", "hola", "buenos dias", "buenas tardes", "buenas noches", "buenas", "buen dia"] },
  { key: "thanks", words: ["danke", "dankeschon", "thank", "thanks", "merci", "gracias"] },
  { key: "delivery", words: ["liefer", "versand", "zustell", "transport", "spedition", "delivery", "deliver", "shipping", "ship ", "livrais", "livrer", "envoi", "entrega", "envio", "montage", "aufbau", "assembl", "montaje"] },
  { key: "returns", words: ["ruckgabe", "rucksend", "zuruckgeb", "zuruckschick", "umtausch", "widerruf", "retour", "return", "refund", "devoluc", "devolver", "reembolso"] },
  { key: "warranty", words: ["garantie", "gewahrleist", "warranty", "guarantee", "garantia", "mangel", "defekt", "reklamat"] },
  { key: "payment", words: ["bezahl", "zahlung", "zahlen", "anzahlung", "rechnung", "rate", "mwst", "steuer", "payment", "pay ", "paying", "invoice", "deposit", "vat", "paiement", "payer", "acompte", "facture", "tva", "pago", "pagar", "anticipo", "factura"] },
  { key: "voucher", words: ["gutschein", "rabatt", "code", "voucher", "discount", "coupon", "promo", "bon de", "reduction", "cupon", "descuento"] },
  { key: "showroom", words: ["showroom", "laden", "geschaft", "adresse", "offnungs", "geoffnet", "hamburg", "vorbei", "besuch", "address", "opening", "open ", "visit", "store", "adresse", "horaire", "ouvert", "visiter", "direccion", "horario", "abierto", "visitar", "tienda"] },
  { key: "contact", words: ["kontakt", "telefon", "anrufen", "erreich", "mail", "termin", "beratung", "berater", "mensch", "mitarbeit", "contact", "phone", "call ", "appointment", "advice", "human", "telefono", "cita", "asesor", "rendez"] },
  { key: "used", words: ["gebraucht", "second", "zweiter hand", "zustand", "vorbesitz", "neu", "abgenutzt", "kratzer", "pre-owned", "preowned", "used", "condition", "occasion", "seconde main", "etat", "segunda mano", "estado", "usado"] },
  { key: "care", words: ["pflege", "reinig", "putzen", "leder", "holz", "stoff", "material", "care", "clean", "leather", "wood", "fabric", "entretien", "cuir", "bois", "tissu", "matiere", "cuidado", "limpi", "cuero", "madera", "tejido"] },
  { key: "sustain", words: ["nachhalt", "umwelt", "okolog", "klima", "kreislauf", "sustain", "environment", "ecolog", "circular", "durable", "durabilit", "sostenib", "medio ambiente"] },
  { key: "stock", words: ["verfugbar", "vorratig", "lager", "sofort", "wie viele", "noch da", "noch zu haben", "verkauft", "vergriffen", "available", "stock", "in store", "how many", "sold", "disponib", "combien reste", "vendu", "cuantas quedan", "vendido"] },
  { key: "cart", words: ["warenkorb", "korb", "bestell", "kaufen", "reservier", "cart", "basket", "order", "buy", "checkout", "reserve", "panier", "commande", "acheter", "cesta", "pedido", "comprar"] },
  { key: "lang", words: ["sprache", "deutsch", "englisch", "franzosisch", "spanisch", "language", "english", "german", "french", "spanish", "langue", "idioma", "espanol"] },
  /* Alltag: Der Berater soll auf alles etwas erwidern können, nicht nur
     auf Warenkunde. Wo er nichts wissen kann — beim Wetter etwa — sagt er
     das freundlich, statt stumm zu bleiben. */
  { key: "howareyou", words: ["wie geht es", "wie gehts", "wie geht's", "alles gut bei dir", "how are you", "how're you", "how do you do", "how is it going", "comment vas", "comment allez", "ca va", "que tal estas", "como estas", "como esta usted"] },
  { key: "weather", words: ["wetter", "regnet", "regen", "sonnig", "schneit", "draussen kalt", "draussen warm", "weather", "raining", "sunny", "snowing", "meteo", "il pleut", "fait beau", "tiempo hace", "clima", "llueve", "hace sol"] },
  { key: "time", words: ["uhrzeit", "wie spat", "welcher tag", "welches datum", "welcher wochentag", "what time", "what day", "todays date", "what is the date", "quelle heure", "quel jour", "quelle date", "que hora", "que dia", "que fecha"] },
  { key: "identity", words: ["wer bist du", "was bist du", "bist du ein mensch", "bist du echt", "bist du ein bot", "roboter", "kunstliche intelligenz", "wie heisst du", "dein name", "who are you", "what are you", "are you a robot", "are you human", "are you real", "your name", "qui es-tu", "qui etes-vous", "es-tu un robot", "ton nom", "quien eres", "eres un robot", "eres humano", "tu nombre"] },
  { key: "help", words: ["was kannst du", "wobei kannst du", "kannst du mir helfen", "konnen sie mir helfen", "hilfe", "helfen", "what can you do", "can you help", "how can you help", "que peux-tu", "pouvez-vous m aider", "aidez", "que puedes hacer", "puede ayudarme", "ayuda"] },
  { key: "joke", words: ["witz", "erzahl mir was lustiges", "joke", "something funny", "blague", "chiste", "algo gracioso"] },
  { key: "compliment", words: ["du bist super", "du bist toll", "du bist gut", "du bist nett", "du bist schlau", "sehr hilfreich", "you are great", "youre great", "you are nice", "you are helpful", "tu es super", "tu es genial", "eres genial", "eres muy amable", "muy util"] },
  { key: "bye", words: ["tschuss", "auf wiedersehen", "bis dann", "bis bald", "ciao", "schonen tag noch", "bye", "goodbye", "see you", "have a nice day", "au revoir", "bonne journee", "a bientot", "adios", "hasta luego", "buen dia"] },
  { key: "love", words: ["ich liebe dich", "magst du mich", "willst du mich heiraten", "hast du gefuhle", "love you", "marry me", "do you like me", "je t aime", "veux-tu m epouser", "te quiero", "te amo", "quieres casarte"] },
  { key: "insult", words: ["du bist blod", "du bist dumm", "du bist nutzlos", "idiot", "du taugst nichts", "you are stupid", "youre stupid", "you are useless", "useless bot", "tu es nul", "eres tonto", "eres inutil"] },

  { key: "sizes", words: ["mase", "gros", "abmess", "breit", "hoh", "hoch", "tief", "gewicht", "schwer", "zentimeter", "passt in", "dimension", "size", "width", "wide", "height", "tall", "depth", "deep", "weight", "heavy", "how big", "taille", "largeur", "large", "hauteur", "haut", "profond", "poids", "lourd", "medida", "mide", "tamano", "ancho", "alto", "profund", "peso", "pesa"] }
];

/* Rubriken samt Alltagswörtern, die Kundinnen und Kunden tippen */
const BOT_CATEGORIES = {
  sofas: ["sofa", "couch", "canape", "sofá", "settee"],
  sessel: ["sessel", "armchair", "fauteuil", "butaca", "sillon"],
  tische: ["tisch", "table", "esstisch", "mesa", "couchtisch"],
  stuehle: ["stuhl", "stuhle", "chair", "chaise", "silla"],
  leuchten: ["leuchte", "lampe", "lampen", "licht", "beleucht", "lamp", "light", "pendant", "luminaire", "lumiere", "lampara", "iluminac"],
  aufbewahrung: ["regal", "schrank", "sideboard", "kommode", "aufbewahr", "shelf", "shelv", "storage", "cabinet", "etager", "rangement", "estanter", "almacenaje", "armario"],
  betten: ["bett", "betten", "bed ", "beds", "schlaf", "lit ", "cama"],
  accessoires: ["accessoire", "accessory", "accessories", "teppich", "spiegel", "rug", "mirror", "tapis", "miroir", "alfombra", "espejo"]
};

/* Fragen nach einer Eigenschaft — bequem, hochwertig, schön, lohnt sich.
   Darauf antwortet der Berater bejahend: Das ist Verkauf, keine Behauptung
   über nachprüfbare Tatsachen. Fragen nach Zustand, Alter, Maß oder Material
   laufen weiterhin über die echten Angaben und werden nicht schöngeredet. */
const BOT_LOB_WORDS = [
  "bequem", "gemutlich", "komfortabel", "hochwertig", "qualitat", "gute", "guter", "gutes",
  "schone", "stabil", "robust", "haltbar", "langlebig", "wertig", "elegant", "weich",
  "angenehm", "lohnt", "empfehl", "zufrieden", "taugt", "wirklich so gut",
  "comfortable", "comfy", "cosy", "cozy", "quality", "sturdy", "durable", "beautiful",
  "nice", "worth", "recommend", "well made",
  "confortable", "moelleux", "solide", "qualite", "recommand", "vaut", "agreable", "belle",
  "comodo", "comoda", "calidad", "resistente", "duradero", "bonito", "bonita", "merece",
  "recomend", "agradable"
];

/* „schön“ wird ohne Umlaut zu „schon“ — und das heißt auch „bereits“.
   Als Lob zählt es nur, wenn nicht nach dem Verbleib gefragt wird. */
const BOT_SCHON_AUS = ["verkauft", "weg", "vergeben", "bestellt", "versendet", "reserviert", "sold", "gone", "vendu", "vendido"];

/* Fragen nach Maßen oder Material werden nicht gelobt, sondern beantwortet */
const BOT_SPEC_WORDS = ["material", "matiere", "materia", "woraus", "besteht", "made of", "made from"];

const BOT_LIMIT_WORDS = ["unter", "bis", "hochstens", "maximal", "max", "weniger", "budget", "billiger", "gunstiger", "under", "below", "less", "up to", "cheaper", "moins", "sous", "jusqu", "menos", "hasta", "presupuesto", "barato"];
const BOT_CHEAP_WORDS = ["gunstigst", "billigst", "preiswertest", "cheapest", "least expensive", "moins cher", "mas barat", "economic"];
const BOT_DEAR_WORDS = ["teuerst", "hochste", "most expensive", "dearest", "plus cher", "mas car"];

/* Zahl aus der Frage lesen: 3000, 3.000, 3,000, 3k, 3 tsd */
function botBudget(text) {
  const m = text.match(/(\d[\d.,\s]*)\s*(k\b|tsd|tausend|mil\b|mille)?/);
  if (!m) return 0;
  const zahl = parseInt(m[1].replace(/[.,\s]/g, ""), 10);
  if (!Number.isFinite(zahl) || zahl <= 0) return 0;
  return m[2] && zahl < 1000 ? zahl * 1000 : zahl;
}

const botEsc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------- In welcher Sprache wird gefragt? ----------
   Kunden schreiben nicht immer in der Sprache, die oben eingestellt ist.
   Erkannt wird an häufigen Funktionswörtern; wer in mehreren Sprachen
   vorkommt („la“, „no“, „que“), zählt entsprechend weniger. */
const BOT_MARKER = {
  de: ["ist", "sind", "bin", "war", "der", "die", "das", "den", "dem", "und", "ich", "du", "bist", "dir", "dich", "wir", "uns", "ihr", "wie", "was", "wo", "wer", "wann", "warum", "wieso", "welche", "welcher", "haben", "habt", "hat", "hast", "kann", "kannst", "koennen", "koennt", "soll", "muss", "wird", "werden", "bitte", "danke", "nicht", "kein", "keine", "gibt", "geht", "gehts", "mit", "fuer", "auf", "noch", "schon", "ein", "eine", "einen", "sie", "mir", "mich", "euch", "mein", "meine", "dein", "deine", "kostet", "wieviel", "viel", "gebraucht", "auch", "aber", "oder", "sehr", "bei", "von", "zum", "zur", "hier", "alles", "etwas", "nichts", "gut", "heute", "morgen"],
  en: ["is", "are", "am", "was", "were", "the", "and", "i", "how", "what", "where", "who", "when", "why", "which", "do", "does", "did", "dont", "doesnt", "can", "could", "would", "should", "will", "please", "thanks", "thank", "not", "there", "this", "that", "these", "with", "for", "on", "an", "you", "your", "me", "my", "mine", "its", "cost", "costs", "much", "many", "used", "also", "but", "or", "very", "at", "from", "to", "have", "has", "had", "it", "tell", "show", "need", "want", "looking", "about", "here", "something", "anything", "nothing", "today"],
  fr: ["est", "sont", "suis", "etes", "etait", "le", "la", "les", "et", "je", "tu", "nous", "comment", "quoi", "ou", "qui", "quand", "pourquoi", "avez", "avoir", "avons", "peut", "peux", "puis", "pouvez", "merci", "pas", "il", "elle", "avec", "pour", "sur", "un", "une", "vous", "votre", "moi", "mon", "ma", "mes", "ton", "prix", "coute", "combien", "aussi", "mais", "tres", "de", "du", "des", "ce", "cette", "cela", "quel", "quelle", "est-ce", "bien", "tout", "tous", "fait", "faire", "cherche", "montrer", "bonjour", "aujourd"],
  es: ["es", "son", "soy", "estoy", "estas", "el", "la", "los", "las", "y", "yo", "tu", "como", "que", "donde", "quien", "cuando", "porque", "tiene", "tienen", "tienes", "puedo", "puede", "gracias", "favor", "no", "hay", "con", "para", "sobre", "un", "una", "usted", "precio", "cuesta", "cuanto", "cuantos", "tambien", "pero", "muy", "del", "esta", "este", "esa", "algun", "alguna", "algo", "nada", "todo", "todos", "quiero", "busco", "dime", "dame", "hola", "cual", "cuales", "mi", "su", "sus", "hoy"]
};

/* Wörter, die nur in einer Sprache vorkommen, wiegen am schwersten */
const BOT_MARKER_GEWICHT = (() => {
  const zaehler = {};
  Object.keys(BOT_MARKER).forEach((l) => BOT_MARKER[l].forEach((w) => { zaehler[w] = (zaehler[w] || 0) + 1; }));
  const tabelle = {};
  Object.keys(BOT_MARKER).forEach((l) => {
    tabelle[l] = {};
    BOT_MARKER[l].forEach((w) => { tabelle[l][w] = 1 / zaehler[w]; });
  });
  return tabelle;
})();

/* Grußformeln verraten die Sprache im Alleingang: „hola“ ist ein Wort und
   trotzdem eindeutig. Mehrdeutiges wie „hi“ oder „hey“ steht bewusst nicht
   hier — dabei bliebe es beim Raten. */
const BOT_GRUSS = {
  de: ["hallo", "hallochen", "guten tag", "guten morgen", "guten abend", "servus", "moin", "gruss gott", "gruß gott", "gruezi", "tach", "na ihr"],
  en: ["hello", "good morning", "good afternoon", "good evening", "good day", "hiya", "howdy"],
  fr: ["bonjour", "bonsoir", "salut", "coucou"],
  es: ["hola", "buenos dias", "buenas tardes", "buenas noches", "buenas", "buen dia"]
};

function botSprache(frage) {
  const roh = String(frage || "");
  const text = normalize(roh);
  const woerter = text.split(/[^a-z0-9-]+/).filter(Boolean);

  const punkte = { de: 0, en: 0, fr: 0, es: 0 };

  /* Ein Gruß wiegt schwerer als jedes Funktionswort — und macht auch eine
     Eingabe aus einem einzigen Wort eindeutig. */
  let gegruesst = false;
  Object.keys(BOT_GRUSS).forEach((l) => {
    if (BOT_GRUSS[l].some((g) => botHit(text, g))) { punkte[l] += 2.5; gegruesst = true; }
  });
  if (woerter.length < 2 && !gegruesst) return null;

  woerter.forEach((w) => {
    Object.keys(punkte).forEach((l) => { punkte[l] += BOT_MARKER_GEWICHT[l][w] || 0; });
  });
  // Schriftzeichen sind ein starkes Indiz, das kein Funktionswort schlägt
  if (/[äöüß]/i.test(roh)) punkte.de += 1.5;
  if (/[ñ¿¡]/i.test(roh)) punkte.es += 1.5;
  if (/[çœ]|’|qu'/i.test(roh)) punkte.fr += 1;

  const rang = Object.keys(punkte).sort((a, b) => punkte[b] - punkte[a]);
  const erster = punkte[rang[0]], zweiter = punkte[rang[1]];
  if (erster < 1 || erster < zweiter * 1.4) return null;
  return I18N[rang[0]] ? rang[0] : null;
}

const botCond = (p, lang) => (p.grade ? t("grade." + p.grade, null, lang) : t("cond.used", null, lang));

/* ---------- Die eigentliche Antwort ---------- */
function botAnswer(frage, lang) {
  const bt = (key, vars) => t(key, vars, lang);
  const beuro = (n) => euro(n, lang);
  const q = normalize(frage).trim();
  if (!q) return { lang, text: bt("bot.a.fallback") };

  const gelobt = BOT_LOB_WORDS.some((w) => botHit(q, w)) ||
    (botHit(q, "schon") && !BOT_SCHON_AUS.some((w) => botHit(q, w)));

  /* Welche feste Auskunft passt? Das längste Stichwort gewinnt. */
  const intentTreffer = (key) => {
    const intent = BOT_INTENTS.find((i) => i.key === key);
    let punkte = 0;
    for (const w of intent.words) if (botHit(q, w)) punkte = Math.max(punkte, w.trim().length);
    return punkte;
  };
  let beste = null;
  for (const intent of BOT_INTENTS) {
    const punkte = intentTreffer(intent.key);
    if (punkte && (!beste || punkte > beste.punkte)) beste = { key: intent.key, punkte };
  }
  const festeAuskunft = () => {
    const jetzt = new Date();
    const ort = langLocale(lang);
    const vars = {
      code: GUTSCHEIN.code,
      betrag: beuro(GUTSCHEIN.betrag),
      zeit: jetzt.toLocaleTimeString(ort, { hour: "2-digit", minute: "2-digit" }),
      datum: jetzt.toLocaleDateString(ort, { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    };
    const antwort = { lang, text: bt("bot.a." + beste.key, vars) };
    if (["contact", "showroom", "identity", "insult"].indexOf(beste.key) > -1) antwort.contact = true;
    if (["used", "stock", "help"].indexOf(beste.key) > -1) antwort.all = true;
    return antwort;
  };
  const fragtNachAngaben = intentTreffer("sizes") > 0 || BOT_SPEC_WORDS.some((w) => botHit(q, w));

  /* „hi“, „hey“, „yo“ — zu kurz, um sie irgendwo im Satz zu suchen, aber
     als ganze Eingabe unmissverständlich ein Gruß. */
  if (["hi", "hey", "yo", "hoi", "jo", "hallo", "hola", "salut", "hello"].indexOf(q.replace(/[^a-z]/g, "")) > -1) {
    beste = { key: "greeting", punkte: 9 };
    return festeAuskunft();
  }

  /* 1. Ein Stück beim Namen genannt */
  const genannt = PRODUCTS.filter((p) => botHit(q, normalize(p.name)));
  if (genannt.length === 1) {
    const p = genannt[0];
    if (gelobt) {
      return {
        lang,
        text: bt("bot.a.lob.produkt", { name: p.name, short: pt(p, lang).short, cond: botCond(p, lang) }),
        products: [p]
      };
    }
    if (fragtNachAngaben) {
      const x = pt(p, lang);
      return {
        lang,
        text: bt("bot.a.spec", { name: p.name, dimensions: x.dimensions, weight: p.weight, material: x.material, origin: x.origin }),
        products: [p]
      };
    }
    // Wer nach Lieferung oder Pflege fragt und dabei ein Stück nennt, will
    // die Auskunft hören und nicht den Preis vorgelesen bekommen.
    if (beste && beste.punkte >= 5) return festeAuskunft();
    return {
      lang,
      text: bt("bot.a.price.one", { name: p.name, price: beuro(p.price), cond: botCond(p, lang) }),
      products: [p]
    };
  }
  if (genannt.length > 1) return { lang, text: bt("bot.a.found"), products: genannt };

  /* 2. Superlative */
  const sortiert = [...PRODUCTS].sort((a, b) => a.price - b.price);
  if (BOT_CHEAP_WORDS.some((w) => botHit(q, w))) {
    const p = sortiert[0];
    return { lang, text: bt("bot.a.cheapest", { name: p.name, price: beuro(p.price) }), products: [p] };
  }
  if (BOT_DEAR_WORDS.some((w) => botHit(q, w))) {
    const p = sortiert[sortiert.length - 1];
    return { lang, text: bt("bot.a.dearest", { name: p.name, price: beuro(p.price) }), products: [p] };
  }

  /* 3. Rubrik erkannt? (wird gleich für Budget und Rubrikliste gebraucht) */
  let rubrik = null;
  for (const key of Object.keys(BOT_CATEGORIES)) {
    if (BOT_CATEGORIES[key].some((w) => botHit(q, w))) { rubrik = key; break; }
  }

  /* 3b. Eigenschaftsfrage zu einer ganzen Rubrik */
  if (gelobt && rubrik) {
    const treffer = PRODUCTS.filter((p) => p.categoryKey === rubrik).sort((a, b) => a.price - b.price);
    return { lang, text: bt("bot.a.lob.rubrik", { cat: bt("cat." + rubrik) }), products: treffer.slice(0, 5) };
  }

  /* 4. Budget */
  const grenze = botBudget(q);
  const budgetFrage = grenze >= 100 && (BOT_LIMIT_WORDS.some((w) => botHit(q, w)) || rubrik || /€|euro/.test(q));
  if (budgetFrage) {
    const pool = rubrik ? PRODUCTS.filter((p) => p.categoryKey === rubrik) : PRODUCTS;
    const treffer = pool.filter((p) => p.price <= grenze).sort((a, b) => b.price - a.price);
    if (treffer.length) {
      const schluessel = treffer.length === 1 ? "bot.a.budget.one" : "bot.a.budget";
      return { lang, text: bt(schluessel, { max: beuro(grenze), n: treffer.length }), products: treffer.slice(0, 5) };
    }
    const billigste = [...pool].sort((a, b) => a.price - b.price)[0] || sortiert[0];
    return {
      lang,
      text: bt("bot.a.budget.none", { max: beuro(grenze), name: billigste.name, price: beuro(billigste.price) }),
      products: [billigste]
    };
  }

  /* 5. Feste Auskünfte */
  if (beste && beste.punkte >= 3) return festeAuskunft();

  /* 6. Rubrik ohne Budget */
  if (rubrik) {
    const treffer = PRODUCTS.filter((p) => p.categoryKey === rubrik).sort((a, b) => a.price - b.price);
    const cat = bt("cat." + rubrik);
    if (!treffer.length) return { lang, text: bt("bot.a.cat.none", { cat }), all: true };
    const schluessel = treffer.length === 1 ? "bot.a.cat.one" : "bot.a.cat";
    return { lang, text: bt(schluessel, { cat, n: treffer.length }), products: treffer.slice(0, 5) };
  }

  /* 7. Volltextsuche über die Kollektion */
  const langGenug = q.split(/[^a-z0-9]+/).some((w) => w.length >= 3);
  const gefunden = langGenug ? searchProducts(frage, lang).slice(0, 5) : [];
  if (gefunden.length) return { lang, text: bt("bot.a.found"), products: gefunden };

  /* 8. Eigenschaftsfrage ohne erkennbaren Bezug */
  if (gelobt) return { lang, text: bt("bot.a.lob.allgemein"), all: true };

  /* 9. Ein ganzer Satz ohne Bezug zum Laden ist Plauderei, kein Missverständnis.
     Eine bloße Wortmeldung dagegen kann eine missglückte Suche sein. */
  const woerter = q.split(/[^a-z0-9]+/).filter(Boolean).length;
  if (woerter >= 3) return { lang, text: bt("bot.a.smalltalk"), all: true };

  return { lang, text: bt("bot.a.fallback"), contact: true, all: true };
}

/* ---------- Oberfläche ---------- */
let botGebunden = false;

function initBerater() {
  const host = $("#site-footer");
  if (!host || $("#bot-panel")) return;

  const wrap = document.createElement("div");
  wrap.className = "bot-wrap";
  wrap.innerHTML = `
  <button class="bot-launch" id="bot-launch" type="button" aria-expanded="false" aria-controls="bot-panel" title="${botEsc(t("bot.launch"))}">
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.5 12.4c0 4-3.8 7.2-8.5 7.2-1 0-2-.15-2.9-.42L4 21l1.4-3.7C4.2 16 3.5 14.3 3.5 12.4c0-4 3.8-7.2 8.5-7.2s8.5 3.2 8.5 7.2Z"/>
    </svg>
    <span class="bot-launch__label">${botEsc(t("bot.launch"))}</span>
  </button>
  <section class="bot" id="bot-panel" role="dialog" aria-labelledby="bot-title">
    <header class="bot__head">
      <span class="bot__dot" aria-hidden="true"></span>
      <div class="bot__id">
        <strong id="bot-title">${botEsc(t("bot.title"))}</strong>
        <small data-i18n="bot.sub"></small>
      </div>
      <button class="close-x" id="bot-close" type="button" data-i18n-aria="bot.close">×</button>
    </header>
    <div class="bot__log" id="bot-log" role="log" aria-live="polite" data-i18n-aria="bot.log"></div>
    <div class="bot__chips" id="bot-chips"></div>
    <form class="bot__form" id="bot-form" novalidate>
      <input type="text" id="bot-input" autocomplete="off" data-i18n-placeholder="bot.placeholder" data-i18n-aria="bot.placeholder">
      <button class="bot__send" type="submit" data-i18n-aria="bot.send" title="${botEsc(t("bot.send"))}">
        <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 12h14M12 6l6 6-6 6"/>
        </svg>
      </button>
    </form>
    <p class="bot__hint" data-i18n="bot.hint"></p>
  </section>`;
  host.appendChild(wrap);
  applyI18n(wrap);

  const panel = $("#bot-panel");
  const launch = $("#bot-launch");
  const log = $("#bot-log");
  const input = $("#bot-input");
  const chips = $("#bot-chips");

  /* Geschlossen heißt: nicht sichtbar, nicht anklickbar, nicht antippbar */
  const setOpen = (open) => {
    if (!open && panel.contains(document.activeElement)) launch.focus();
    panel.classList.toggle("is-open", open);
    launch.classList.toggle("is-open", open);
    launch.setAttribute("aria-expanded", String(open));
    panel.inert = !open;
    panel.setAttribute("aria-hidden", String(!open));
    if (open) {
      if (!log.children.length) sag(t("bot.intro"));
      // Erst wenn das Feld sichtbar ist, darf der Fokus hinein
      requestAnimationFrame(() => input.focus());
      scrollDown();
    }
  };
  const isOpen = () => panel.classList.contains("is-open");

  const scrollDown = () => { log.scrollTop = log.scrollHeight; };

  /* Die Sprache des Gesprächs: erkannt an der Frage, sonst die zuletzt
     erkannte — sonst die eingestellte. So bleibt ein französisches Gespräch
     französisch, auch wenn eine kurze Rückfrage kein Merkmal enthält. */
  let gespraechsSprache = null;

  function blase(rolle, inhaltHtml, lang) {
    const el = document.createElement("div");
    el.className = "bot__msg bot__msg--" + rolle;
    const wer = rolle === "you" ? t("bot.you", null, lang) : t("bot.name", null, lang);
    el.innerHTML = `<span class="bot__who">${botEsc(wer)}</span>${inhaltHtml}`;
    log.appendChild(el);
    scrollDown();
    return el;
  }

  const sag = (text) => blase("bot", `<p>${botEsc(text)}</p>`);

  function antwortHtml(a) {
    const l = a.lang;
    let html = `<p>${botEsc(a.text)}</p>`;
    if (a.products && a.products.length) {
      html += `<ul class="bot__list">` + a.products.map((p) => `
        <li><a href="produkt.html?id=${encodeURIComponent(p.id)}" data-bot-link>
          <span>${botEsc(p.name)}</span><em>${botEsc(euro(p.price, l))}</em>
          <small>${botEsc(t("cat." + p.categoryKey, null, l))} · ${botEsc(botCond(p, l))}</small>
        </a></li>`).join("") + `</ul>`;
    }
    const links = [];
    if (a.all) links.push(`<a href="kollektion.html" data-bot-link>${botEsc(t("bot.cta.all", null, l))}</a>`);
    if (a.contact) links.push(`<a href="kontakt.html" data-bot-link>${botEsc(t("bot.cta.contact", null, l))}</a>`);
    if (links.length) html += `<p class="bot__cta">${links.join("")}</p>`;
    return html;
  }

  let denkt = null;
  function frage(text) {
    const sauber = text.trim().slice(0, 300);
    if (!sauber) return;
    const lang = botSprache(sauber) || gespraechsSprache || getLang();
    gespraechsSprache = lang;
    blase("you", `<p>${botEsc(sauber)}</p>`, lang);
    input.value = "";
    if (denkt) denkt.remove();
    denkt = blase("bot", `<p class="bot__typing"><i></i><i></i><i></i><span class="sr-only">${botEsc(t("bot.typing", null, lang))}</span></p>`, lang);
    const wartezeit = 260 + Math.min(500, sauber.length * 9);
    setTimeout(() => {
      if (denkt) { denkt.remove(); denkt = null; }
      const a = botAnswer(sauber, lang);
      blase("bot", antwortHtml(a), a.lang);
    }, wartezeit);
  }

  /* Vorschläge: einmal gestellt, verschwinden sie nicht — sie bleiben
     als schneller Einstieg stehen. */
  ["bot.suggest.budget", "bot.suggest.delivery", "bot.suggest.used", "bot.suggest.voucher"].forEach((k) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "bot__chip";
    b.textContent = t(k);
    b.addEventListener("click", () => frage(b.textContent));
    chips.appendChild(b);
  });

  launch.addEventListener("click", () => setOpen(!isOpen()));
  $("#bot-close").addEventListener("click", () => setOpen(false));
  $("#bot-form").addEventListener("submit", (e) => { e.preventDefault(); frage(input.value); });

  /* Ein Verweis in der Antwort führt weiter — in der Einzeldatei über die Raute */
  log.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-bot-link]");
    if (!a) return;
    e.preventDefault();
    goTo(a.getAttribute("href"));
    if (window.matchMedia("(max-width: 640px)").matches) setOpen(false);
  });

  if (!botGebunden) {
    botGebunden = true;
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const p = $("#bot-panel");
      if (p && p.classList.contains("is-open")) $("#bot-launch")?.click();
    });
    /* Warenkorb, Menü und Gutschein legen sich über den Berater —
       dann macht er Platz. */
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#cart-open, #burger, #promo-reopen")) return;
      const p = $("#bot-panel");
      if (p && p.classList.contains("is-open")) $("#bot-close")?.click();
    });
  }

  setOpen(false);
}
