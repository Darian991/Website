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
assets/js/i18n.js      Alle Texte in Deutsch, Englisch und Französisch
assets/js/data.js      Produktkatalog + alle Abbildungen als SVG
assets/js/app.js       Warenkorb, Suche, Kopf-/Fußzeile, Filter, Formulare
tools/build-preview.js Baut daraus preview.html (alles in einer Datei)
```

Kopf- und Fußzeile werden von `app.js` in die Platzhalter `#site-header` und
`#site-footer` eingesetzt — sie müssen also nur an einer Stelle gepflegt werden.

## Ansehen

Einfach `index.html` im Browser öffnen. Oder mit einem lokalen Server:

```bash
python3 -m http.server 8000
# dann http://localhost:8000 aufrufen
```

### Vorschau als einzelne Datei

`preview.html` enthält die komplette Website in einer einzigen Datei — praktisch
zum Verschicken oder Herzeigen. Die Datei wird aus denselben Quelldateien
erzeugt, es gibt also keine zweite Version, die auseinanderlaufen kann:

```bash
node tools/build-preview.js
```

Statt eigener Adressen pro Seite nutzt sie die Raute (`#kollektion.html`).

## Sprachen

Die Website gibt es in Deutsch, Englisch und Französisch. Beim ersten Besuch
wird die Sprache des Browsers verwendet; die Wahl über DE/EN/FR in der
Kopfzeile wird im Browser gespeichert. Preise, Datumsangaben und Zahlen
folgen der jeweiligen Schreibweise (8.490 € · €8,490 · 8 490 €).

**Texte ändern** — alle Oberflächen- und Seitentexte stehen in
`assets/js/i18n.js`, jeweils unter demselben Schlüssel pro Sprache:

```js
de: { "home.hero.title": "Möbel für ein<br>ganzes Leben." },
en: { "home.hero.title": "Furniture for<br>a whole life." },
fr: { "home.hero.title": "Des meubles pour<br>toute une vie." }
```

Im HTML wird ein Text über `data-i18n="schlüssel"` gesetzt, Text mit
Formatierung über `data-i18n-html`, Platzhalter in Feldern über
`data-i18n-placeholder`.

**Eine Sprache ergänzen** — in `i18n.js` einen Eintrag in `LANGS` anlegen
(Kürzel, Beschriftung, Name, Schreibweise wie `it-IT`), einen Block mit
denselben Schlüsseln in `I18N` ergänzen und bei jedem Produkt einen
weiteren Eintrag unter `t`. Fehlt ein Schlüssel, wird die deutsche Fassung
angezeigt — die Seite bleibt also immer benutzbar.

## Suche

Die Lupe in der Kopfzeile öffnet ein Suchfeld mit Vorschlägen; auf der
Kollektionsseite gibt es zusätzlich ein Suchfeld, das sich mit Kategorie und
Sortierung kombinieren lässt. Gesucht wird in Name, Kategorie, Material,
Herkunft, Farbnamen und Beschreibung — in der aktiven Sprache, ohne
Rücksicht auf Groß-/Kleinschreibung und Akzente. Die Suche steht in der
Adresszeile (`?suche=eiche`), ist also verlinkbar.

## Produkte ändern

Alle Produkte stehen in `assets/js/data.js` im Array `PRODUCTS`. Ein neuer
Eintrag sieht so aus:

```js
{
  id: "sofa-neu",            // eindeutig, erscheint in der Adresszeile
  name: "Bellagio",          // Eigenname, in allen Sprachen gleich
  categoryKey: "sofas",      // muss in CATEGORY_KEYS stehen
  shape: "sofa",             // Abbildung: sofa, sessel, tisch, stuhl, lampe,
                             // regal, bett, sideboard, teppich, spiegel
  tone: "sand",              // Farbstimmung: sand, clay, sage, stone, ink, rose
  price: 4900,               // in Euro
  weight: "40 kg",
  swatches: ["#9a6a3f", "#d9c9ae", "#3a3a38"],   // Farbwerte
  t: {
    de: { badge: "Neuheit", short: "…", description: "…", material: "…",
          dimensions: "B 200 × T 90 × H 75 cm", origin: "…",
          lead: "8–10 Wochen", colors: ["Cognac", "Sandbeige", "Anthrazit"] },
    en: { … }, fr: { … }
  }
}
```

Die Reihenfolge in `colors` gehört zu `swatches`. Der Warenkorb merkt sich
die Position der Farbe, nicht ihren Namen — deshalb wechselt eine bereits
gewählte Farbe die Sprache mit.

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
