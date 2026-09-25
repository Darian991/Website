/* =========================================================
   Kasse — erzeugt eine Bezahlseite bei Stripe

   Warum das hier liegt und nicht im Browser: Der geheime
   Stripe-Schluessel darf die Seite nie erreichen. Wer ihn liest,
   kann in unserem Namen Geld bewegen. Dieses Stueck Code laeuft
   deshalb bei Netlify auf dem Server, wo der Schluessel als
   Umgebungsvariable liegt und fuer Besucher unerreichbar ist.

   Ebenso wichtig: Preise kommen NICHT aus dem Browser. Der
   Warenkorb schickt nur, welches Stueck und wie viele. Was es
   kostet, schlaegt diese Funktion selbst im Katalog nach — sonst
   koennte jemand die Kueche fuer einen Euro kaufen.

   Einrichten:
     1. Konto bei stripe.com anlegen und freischalten lassen
     2. In Netlify unter "Environment variables" setzen:
          STRIPE_SECRET_KEY = sk_live_... (bzw. sk_test_... zum Proben)
     3. Im Stripe-Dashboard unter "Zahlungsmethoden" einschalten,
        was angeboten werden soll: Karte, Apple Pay, Google Pay,
        PayPal, Klarna, SEPA-Lastschrift. Apple Pay und Google Pay
        brauchen bei dieser Loesung keine weitere Einrichtung — die
        Bezahlseite liegt bei Stripe selbst.
   ========================================================= */

const fs = require("fs");
const path = require("path");

const GUTSCHEIN = { code: "WILLKOMMEN75", betrag: 75 };

/* Den Katalog aus denselben Dateien lesen, die auch die Website nutzt.
   So gibt es keine zweite Preisliste, die auseinanderlaufen kann. */
let katalog = null;
function laden() {
  if (katalog) return katalog;
  const wurzel = path.join(__dirname, "..", "..");
  const lies = (f) => fs.readFileSync(path.join(wurzel, f), "utf8");
  katalog = new Function(
    lies("assets/js/i18n.js") + "\n" + lies("assets/js/data.js") + "; return { PRODUCTS, SITE_URL };"
  )();
  return katalog;
}
const produkte = () => laden().PRODUCTS;

/* Woher die Seite erreichbar ist. Netlify setzt URL selbst; sonst gilt,
   was in assets/js/i18n.js steht. Bewusst NICHT das, was der Browser
   mitschickt: Sonst koennte jemand die Rueckkehr nach der Zahlung auf
   eine fremde Adresse umbiegen. */
function basisAdresse() {
  const gesetzt = process.env.URL || process.env.DEPLOY_PRIME_URL;
  return String(gesetzt || laden().SITE_URL || "").replace(/\/+$/, "");
}

const bestand = (p) => (p.verkauft ? 0 : (p.used ? (p.stueck || 1) : 99));

function antwort(code, daten) {
  return {
    statusCode: code,
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify(daten)
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return antwort(405, { fehler: "Nur POST" });

  const schluessel = process.env.STRIPE_SECRET_KEY;
  if (!schluessel) return antwort(503, { fehler: "Kasse noch nicht eingerichtet" });

  let eingang;
  try { eingang = JSON.parse(event.body || "{}"); }
  catch (e) { return antwort(400, { fehler: "Unlesbare Anfrage" }); }

  const korb = Array.isArray(eingang.korb) ? eingang.korb : [];
  if (!korb.length) return antwort(400, { fehler: "Leerer Warenkorb" });

  const sprache = ["de", "en", "fr", "es"].includes(eingang.sprache) ? eingang.sprache : "de";
  const liste = produkte();
  const basis = basisAdresse();
  const posten = [];
  let summe = 0;

  for (const zeile of korb) {
    const p = liste.find((x) => x.id === zeile.id);
    if (!p) return antwort(400, { fehler: "Unbekanntes Stück: " + zeile.id });
    if (p.verkauft) return antwort(409, { fehler: "Bereits verkauft: " + p.name });

    /* Menge gegen den echten Bestand deckeln. Ein gebrauchtes Stueck
       gibt es einmal — zweimal verkaufen waere der teuerste Fehler. */
    const menge = Math.max(1, Math.min(Number(zeile.menge) || 1, bestand(p)));
    const text = (p.t && (p.t[sprache] || p.t.de)) || {};

    summe += p.price * menge;
    posten.push({
      quantity: menge,
      price_data: {
        currency: "eur",
        unit_amount: Math.round(p.price * 100),
        /* Deutsche Preise sind Endpreise — die Mehrwertsteuer steckt drin. */
        tax_behavior: "inclusive",
        product_data: {
          name: p.name,
          description: (text.short || "").slice(0, 300),
          images: (p.photos || []).slice(0, 1).map((f) => basis + "/" + f),
          metadata: { id: p.id }
        }
      }
    });
  }

  /* Gutschein serverseitig noch einmal pruefen. Was der Browser sagt,
     zaehlt hier nicht. */
  const rabatte = [];
  if (String(eingang.code || "").trim().toUpperCase() === GUTSCHEIN.code) {
    rabatte.push({
      coupon_data: {
        name: GUTSCHEIN.code,
        amount_off: Math.round(Math.min(GUTSCHEIN.betrag, summe) * 100),
        currency: "eur",
        duration: "once"
      }
    });
  }

  /* Ohne Bibliothek — die Stripe-Schnittstelle nimmt ein Formular
     entgegen. Das spart eine Abhaengigkeit, die sonst mitgebaut
     werden muesste. */
  const felder = new URLSearchParams();
  felder.set("mode", "payment");
  felder.set("locale", sprache);
  felder.set("success_url", basis + "/warenkorb.html?bezahlt=1&sitzung={CHECKOUT_SESSION_ID}");
  felder.set("cancel_url", basis + "/warenkorb.html?bezahlt=abbruch");
  felder.set("billing_address_collection", "required");
  felder.set("phone_number_collection[enabled]", "true");
  felder.set("shipping_address_collection[allowed_countries][0]", "DE");
  felder.set("shipping_address_collection[allowed_countries][1]", "AT");
  felder.set("shipping_address_collection[allowed_countries][2]", "CH");
  posten.forEach((z, i) => {
    felder.set(`line_items[${i}][quantity]`, String(z.quantity));
    felder.set(`line_items[${i}][price_data][currency]`, z.price_data.currency);
    felder.set(`line_items[${i}][price_data][unit_amount]`, String(z.price_data.unit_amount));
    felder.set(`line_items[${i}][price_data][tax_behavior]`, z.price_data.tax_behavior);
    felder.set(`line_items[${i}][price_data][product_data][name]`, z.price_data.product_data.name);
    if (z.price_data.product_data.description) {
      felder.set(`line_items[${i}][price_data][product_data][description]`, z.price_data.product_data.description);
    }
    z.price_data.product_data.images.forEach((bild, b) => {
      if (/^https:\/\//.test(bild)) felder.set(`line_items[${i}][price_data][product_data][images][${b}]`, bild);
    });
    felder.set(`line_items[${i}][price_data][product_data][metadata][id]`, z.price_data.product_data.metadata.id);
  });
  rabatte.forEach((r, i) => {
    felder.set(`discounts[${i}][coupon_data][name]`, r.coupon_data.name);
    felder.set(`discounts[${i}][coupon_data][amount_off]`, String(r.coupon_data.amount_off));
    felder.set(`discounts[${i}][coupon_data][currency]`, r.coupon_data.currency);
    felder.set(`discounts[${i}][coupon_data][duration]`, r.coupon_data.duration);
  });

  const ruf = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      authorization: "Bearer " + schluessel,
      "content-type": "application/x-www-form-urlencoded"
    },
    body: felder
  });
  const daten = await ruf.json();

  if (!ruf.ok) {
    console.error("Stripe:", daten && daten.error);
    return antwort(502, { fehler: (daten && daten.error && daten.error.message) || "Stripe antwortet nicht" });
  }
  return antwort(200, { url: daten.url });
};
