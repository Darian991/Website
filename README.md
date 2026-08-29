# Maison Noir — Website für Luxusmöbel

Eine vollständige Website für den Verkauf hochwertiger Möbel. Gebaut mit reinem
HTML, CSS und JavaScript — kein Build-Prozess, keine Abhängigkeiten.

## Seiten

| Datei | Inhalt |
|---|---|
| `index.html` | Startseite mit Bühnenbild, ausgewählten Stücken, Kategorien, Newsletter |
| `kollektion.html` | Alle Produkte mit Kategoriefilter und Sortierung |
| `produkt.html` | Produktdetail (Galerie, Farbwahl, Menge, Beschreibung) |
| `warenkorb.html` | Warenkorb mit Mengenänderung und Zusammenfassung |
| `ueber-uns.html` | Manufaktur, Verfahren, Pflegehinweise |
| `kontakt.html` | Kontaktformular und Showroom-Angaben |

## Aufbau

```
assets/css/style.css   Gesamtes Design (Farben, Typografie, Layout, Responsive)
assets/js/data.js      Produktkatalog + alle Abbildungen als SVG
assets/js/app.js       Warenkorb, Kopf-/Fußzeile, Filter, Formulare
```

Kopf- und Fußzeile werden von `app.js` in die Platzhalter `#site-header` und
`#site-footer` eingesetzt — sie müssen also nur an einer Stelle gepflegt werden.

## Ansehen

Einfach `index.html` im Browser öffnen. Oder mit einem lokalen Server:

```bash
python3 -m http.server 8000
# dann http://localhost:8000 aufrufen
```

## Produkte ändern

Alle Produkte stehen in `assets/js/data.js` im Array `PRODUCTS`. Ein neuer
Eintrag sieht so aus:

```js
{
  id: "sofa-neu",          // eindeutig, erscheint in der Adresszeile
  name: "Neues Sofa",
  category: "Sofas",       // muss in CATEGORIES stehen
  shape: "sofa",           // Abbildung: sofa, sessel, tisch, stuhl, lampe,
                           // regal, bett, sideboard, teppich, spiegel
  tone: "sand",            // Farbstimmung: sand, clay, sage, stone, ink, rose
  price: 4900,             // in Euro
  badge: "Neuheit",        // optional
  short: "Kurzbeschreibung für die Übersicht.",
  description: "Ausführlicher Text auf der Produktseite.",
  material: "…", dimensions: "…", weight: "…", origin: "…", lead: "8–10 Wochen",
  colors: [{ name: "Cognac", hex: "#9a6a3f" }]
}
```

## Abbildungen

Die Produktbilder sind als SVG in `data.js` gezeichnet, damit die Seite ohne
externe Dateien funktioniert. Sobald echte Fotos vorliegen, lassen sie sich
ersetzen: in `productCard()` (app.js) und auf der Produktseite `artFor(p)` durch
ein `<img src="…" alt="…">` austauschen.

## Was noch fehlt für den echten Betrieb

* **Zahlung**: Der Button „Verbindlich anfragen“ ist eine Demo. Für echte
  Zahlungen eignet sich Stripe Checkout oder ein Shop-System wie Shopify.
* **Formulare**: Kontakt- und Newsletter-Formular zeigen nur eine Bestätigung an.
  Sie brauchen ein Backend oder einen Dienst wie Formspree.
* **Rechtstexte**: Impressum, Datenschutzerklärung, AGB und Widerrufsbelehrung
  sind in der Fußzeile verlinkt, aber noch nicht geschrieben — in Deutschland
  sind sie für einen Shop Pflicht.
* **Fotos**: echte Produktfotos statt der SVG-Illustrationen.

## Hinweis

Firmenname, Adresse, Telefonnummer und Produkttexte sind erfunden und dienen
als Platzhalter.
