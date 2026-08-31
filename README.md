# Studio Lusso — Website für Luxusmöbel

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
assets/js/i18n.js      Alle Texte in Deutsch, Englisch, Französisch und Spanisch
assets/js/data.js      Produktkatalog + Produktabbildungen als SVG
assets/js/hero.js      Bühnenbild der Startseite, auf Canvas gezeichnet
assets/js/app.js       Warenkorb, Suche, Kopf-/Fußzeile, Filter, Formulare
assets/js/berater.js   Berater: beantwortet Fragen aus Katalog und Texten
tools/build.js         Schreibt die deutschen Texte fest in die Seiten
                       und baut preview.html (alles in einer Datei)
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
node tools/build.js
```

Statt eigener Adressen pro Seite nutzt sie die Raute (`#kollektion.html`).

## Sprachen

Die Website gibt es in Deutsch, Englisch, Französisch und Spanisch. Beim ersten
Besuch wird die Sprache des Browsers verwendet; die Wahl über DE/EN/FR/ES in der
Kopfzeile wird im Browser gespeichert. Preise, Datumsangaben und Zahlen
folgen der jeweiligen Schreibweise (8.490 € · €8,490 · 8 490 €).

**Texte ändern** — alle Oberflächen- und Seitentexte stehen in
`assets/js/i18n.js`, jeweils unter demselben Schlüssel pro Sprache.
Nach jeder Änderung `node tools/build.js` ausführen: das schreibt die
deutschen Fassungen fest in die Seiten (damit sie auch ohne JavaScript
lesbar und für Suchmaschinen auffindbar sind) und baut die Vorschau neu.

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

## Berater

Unten rechts liegt auf jeder Seite ein Berater, der Fragen beantwortet:
zu einzelnen Stücken, zu einem Budget, zu Lieferung, Rückgabe, Gewährleistung,
Zahlung, Gutschein, Showroom und Zustand. Er kommt ohne Server, ohne
Fremddienst und ohne Schlüssel aus — Eingaben verlassen den Browser nicht.

Die Antworten stammen aus denselben Daten wie die Seite: Preise, Zustand und
Verfügbarkeit kommen live aus `PRODUCTS`, die festen Auskünfte aus `I18N`.
Damit kann der Berater nichts behaupten, was auf der Seite nicht steht.

**Erweitern** — in `assets/js/berater.js`:

* `BOT_INTENTS` — je Thema eine Liste von Stichwörtern (alle vier Sprachen in
  einem Topf, damit auch deutsche Fragen auf der englischen Seite ankommen).
  Ein Stichwort trifft am Wortanfang. Die Antwort steht unter `bot.a.<thema>`
  in `assets/js/i18n.js` und muss in allen vier Sprachen vorhanden sein.
* `BOT_CATEGORIES` — Alltagswörter je Rubrik („couch“ → Sofas).
* `BOT_LOB_WORDS` — Fragen nach einer Eigenschaft („bequem“, „hochwertig“,
  „lohnt sich“). Darauf antwortet der Berater bejahend und wirbt für das
  Stück. Das ist Verkauf und bewusst so gewollt.
  **Nicht** bejaht werden Fragen nach nachprüfbaren Tatsachen — Zustand,
  Baujahr, Maße, Material, Preis, Verfügbarkeit. Die laufen weiter über die
  echten Angaben aus `PRODUCTS`. Ein erfundenes „Ja“ auf „ist das neu?“ oder
  „ist das echtes Leder?“ wäre eine Falschangabe gegenüber Kundinnen und
  Kunden — nach deutschem Recht abmahnfähig und ein Grund zur Rückabwicklung.
  Wer weitere Lobwörter aufnimmt, sollte deshalb nur Eigenschaften ergänzen,
  über die man streiten kann, keine Tatsachen.
* `botAnswer()` — die Reihenfolge der Prüfungen: Produktname, Superlativ,
  Budget, Thema, Rubrik, Volltextsuche, Rückfall.
* `BOT_MARKER` — häufige Funktionswörter je Sprache. Daran erkennt der
  Berater, in welcher Sprache gefragt wird, und antwortet in dieser Sprache
  — auch wenn die Seite auf eine andere eingestellt ist. Preise, Rubriken
  und Zustandsangaben folgen mit. Wörter, die in mehreren Sprachen
  vorkommen, zählen entsprechend weniger; Umlaute, ñ und ¿ geben zusätzlich
  den Ausschlag. Ist eine Eingabe zu kurz für ein sicheres Urteil, bleibt es
  bei der Sprache des laufenden Gesprächs, sonst bei der der Seite.

Ein echtes Sprachmodell wäre der nächste Schritt, braucht aber einen kleinen
Server: Ein API-Schlüssel darf niemals in einer statischen Seite stehen, weil
er dort für jeden lesbar wäre. Der Berater ist so gebaut, dass `botAnswer()`
gegen einen Aufruf an dieses Backend getauscht werden kann, ohne dass die
Oberfläche sich ändert.

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
externe Dateien funktioniert. Sie zeigen das Möbel in der gewählten
Ausführung: `artFor(produkt, farbposition)` färbt den Korpus um. Helle Möbel
bekommen dabei einen dunklen Raum und umgekehrt, sonst verschwindet ein
cremefarbenes Sofa vor einer cremefarbenen Wand.

Das Bühnenbild der Startseite (`hero.js`) wird dagegen auf Canvas gezeichnet.
Erst damit sind echte Unschärfe, ein Lichtschacht aus dem Fenster, eine
Spiegelung im Parkett und Staub im Licht möglich. Der Raum wird einmal in
einen Zwischenspeicher gezeichnet; pro Bild kommen nur Staub und Korn hinzu.
Die Bewegung ruht, sobald das Bild aus dem Sichtfeld scrollt, und entfällt
ganz, wenn im Betriebssystem weniger Bewegung eingestellt ist. Sobald echte Fotos vorliegen, lassen sie sich
ersetzen: in `productCard()` (app.js) und auf der Produktseite `artFor(p)` durch
ein `<img src="…" alt="…">` austauschen.

## Ohne JavaScript

Die Seiten enthalten alle Texte fest im Quelltext — Überschriften, Fließtext,
Navigation und die Beschreibung für Suchmaschinen sind also auch ohne
JavaScript da. Warenkorb, Suche, Sprachwahl und die Produktliste auf der
Kollektionsseite brauchen JavaScript; darauf weist die Fußzeile dann hin.

## Was noch fehlt für den echten Betrieb

* **Zahlung**: Der Button „Verbindlich anfragen“ ist eine Demo. Für echte
  Zahlungen eignet sich Stripe Checkout oder ein Shop-System wie Shopify.
* **Formulare**: Kontakt- und Newsletter-Formular zeigen nur eine Bestätigung an.
  Sie brauchen ein Backend oder einen Dienst wie Formspree.
* **Mehrsprachige Adressen**: Die Sprache wird im Browser gespeichert, alle
  Sprachen teilen sich dieselbe Adresse. Für Suchmaschinen bräuchte jede
  Sprache eigene Adressen (`/en/kollektion`) samt `hreflang` — das geht mit
  einer rein statischen Seite nicht und wäre der nächste Schritt.
* **Rechtstexte**: Impressum, Datenschutzerklärung, AGB und Widerrufsbelehrung
  sind in der Fußzeile verlinkt, aber noch nicht geschrieben — in Deutschland
  sind sie für einen Shop Pflicht.
* **Fotos**: echte Produktfotos statt der SVG-Illustrationen.
* **Berater mit Sprachmodell**: heute beantwortet er Fragen aus den eigenen
  Daten. Für freie Antworten braucht es ein Backend mit API-Schlüssel.

## Hinweis

Firmenname, Adresse, Telefonnummer und Produkttexte sind erfunden und dienen
als Platzhalter.
