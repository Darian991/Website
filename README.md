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

Die Seitenauswahl steht doppelt bereit: in der Kopfzeile, solange dort Platz
ist, und ab 1240 px abwärts als eigener Streifen (`.subnav`) direkt unter dem
Gutscheinband. So ist jede Seite auf Tablet und Telefon mit einem Griff
erreichbar, ohne Umweg über den Menüknopf. Der Menüknopf bleibt daneben
bestehen, weil dort die Sprachwahl liegt.

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
* `BOT_ALLES_WORDS` — „was habt ihr“, „zeig mir alles“. Der Berater zählt
  dann den ganzen Bestand auf. Bei einem kleinen Laden ist das die
  häufigste Frage überhaupt.
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
* Alltagsfragen — Begrüßung, „wie geht es dir“, Wetter, Uhrzeit und Datum,
  „wer bist du“, „was kannst du“, Witz, Lob, Verabschiedung, Beleidigung.
  Uhrzeit und Datum kommen aus der Uhr des Besuchers und sind damit echt;
  beim Wetter sagt der Berater freundlich, dass er nicht hinaussehen kann.
  Ein ganzer Satz ohne Bezug zum Laden bekommt `bot.a.smalltalk` statt der
  Verlegenheitsantwort — der Berater bleibt so nie stumm.
* `BOT_GRUSS` — Grußformeln je Sprache. Sie wiegen bei der Spracherkennung
  schwerer als Funktionswörter, damit schon ein einzelnes „hola“ oder
  „bonjour“ die Sprache festlegt. Mehrdeutiges wie „hi“ und „hey“ steht
  bewusst nicht darin; als ganze Eingabe gelten sie trotzdem als Gruß.
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
ganz, wenn im Betriebssystem weniger Bewegung eingestellt ist.

### Echte Fotos statt Zeichnung

Ein Produkt mit einem Feld `photos` zeigt Fotos statt der Zeichnung:

```js
photos: ["assets/img/ph-artichoke-1.jpg", "assets/img/ph-artichoke-2.jpg", …]
```

`artFor()` gibt dann ein `<img>` zurück, und alle Stellen erben das
automatisch: Karte, Suche, Warenkorb und die Galerie der Produktseite. Die
Galerie richtet sich nach der Länge der Strecke, nicht mehr nach den vier
gezeichneten Blickwinkeln (`ansichten()` in `data.js`). Das erste Bild ist
das Titelbild der Karte, also dorthin das ruhigste, am besten quadratnahe
Motiv stellen.

### Eine einzige Aufnahme

Hat ein Stück nur ein Bild, entfallen Pfeile, Zähler und die Reihe der
Kleinbilder — Bedienelemente, die nichts tun, verwirren mehr als sie
helfen. Ab zwei Bildern ist die Galerie wieder vollständig da.

### Nur das Stück selbst

Auf der Produktseite stand früher unter jedem Stück ein Abschnitt
„Ebenfalls sehenswert“, der mit allem aufgefüllt wurde, was der Laden sonst
führt. Bei wenigen Stücken sah das aus wie weitere Aufnahmen desselben
Stücks. Der Abschnitt zeigt jetzt nur noch dieselbe Rubrik und erscheint
erst, wenn es dort mindestens zwei weitere Stücke gibt (`renderRelated()`
in `produkt.html`). Solange der Bestand klein ist, zeigt eine Produktseite
damit ausschließlich Bilder des angebotenen Stücks.

### Rubriken folgen dem Bestand

Filterleiste, Fußzeile und die Kacheln der Startseite zeigen nur Rubriken,
in denen wirklich etwas steht — `belegteKategorien()` in `data.js` liefert
sie. Verkauft sich die letzte Leuchte, verschwindet „Leuchten" von selbst;
ein alter Verweis darauf führt weiterhin auf eine Seite, die sauber „0
Stücke" meldet.

### Neue Rubrik anlegen

Die Rubriken stehen an einer Stelle: `CATEGORY_KEYS` in `assets/js/i18n.js`.
Ein Eintrag dort, dazu `cat.<schlüssel>` in allen vier Sprachen, und die
Filterleiste, die Brotkrumen und die Adressen (`?kategorie=…`) ziehen
nach — auch in den anderen Sprachen, weil `categoryKeyFrom()` alle
Anzeigenamen kennt. Damit der Berater die Rubrik versteht, gehören die
Alltagswörter dazu noch in `BOT_CATEGORIES` in `assets/js/berater.js`.

### Mehrfach vorhandene Stücke

Gebraucht heißt meist Einzelstück, deshalb ist die Menge normalerweise fest
auf eins. Gibt es ein Stück mehrfach, sagt das Feld `stueck: 2`, wie oft.
Produktseite und Warenkorb zeigen dann eine Mengenauswahl, gedeckelt auf den
Bestand, und statt „Einzelstück" steht „2 Exemplare verfügbar".

**Aus einem Raumbild ein Produktbild schneiden**: Oft gibt es nur eine
Aufnahme, auf der das Stück mitsamt Zimmer zu sehen ist. Drei brauchbare
Bilder entstehen daraus durch Ausschnitte — Übersicht, Einzelstück,
Detail.

Wird ein Ausschnitt dabei hochgerechnet, weicht er auf. Ein einziger Sprung
auf das Doppelte und ein Zug mit großem Radius hinterher malen nur Ränder
um die Formen. Deutlich besser in zwei Stufen, mit kleinem Radius vor,
zwischen und nach dem Vergrößern:

```
UnsharpMask(0.8, 60 %)  →  auf √2 vergrößern
UnsharpMask(0.8, 80 %)  →  auf die Zielgröße vergrößern
UnsharpMask(0.7, 110 %)
```

Damit bleibt die Struktur des Gewebes erhalten statt zu verschmieren.

**Wie groß liefern?** So groß, wie der Kasten das Bild anzeigt. Das Hauptbild
der Produktseite misst 625 Punkte im Quadrat, auf einem feinen Bildschirm
also 1250 echte Punkte. Ein kleineres Bild rechnet der Browser dort selbst
hoch — und zwar stumpf, ohne zu schärfen. Deshalb liefert der Zuschnitt
1250 Punkte an der kurzen Kante. Das Bild wird dadurch nicht detailreicher,
aber die Schärfung überlebt den Weg auf den Bildschirm.

**In welchem Seitenverhältnis?** Fast quadratisch. Der Kasten ist ein Quadrat
und schneidet mit `object-fit: cover` alles ab, was darüber hinausragt: von
einem Bild im Format 16:9 sieht man auf der Produktseite nur den mittleren
Ausschnitt. Ein breiter Zuschnitt verschenkt also genau die Punkte, für die
er hochgerechnet wurde — und zeigt vom Möbelstück nur die Mitte. Lieber den
Ausschnitt gleich quadratisch setzen und dafür etwas mehr Raum mitnehmen:
Der kleinere Vergrößerungsfaktor bringt mehr Schärfe, als der engere
Ausschnitt an Nähe bringt.

Gespeichert wird solches Material mit Güte 88 statt 82 — was an feiner
Zeichnung gewonnen wurde, darf die Kompression nicht gleich wieder
wegnehmen. Über das Zweieinhalbfache der Ausgangsgröße hinaus lohnt sich das
Hochrechnen trotzdem nicht: Was im Original nicht steht, entsteht auch hier
nicht.

Die Dateien liegen in `assets/img/`. `tools/build.js` bettet sie als
Daten-URI in `preview.html` ein, und diese eine Datei soll handlich bleiben —
rund 250 KB je Produktbild sind die Obergrenze.

**Vor der Veröffentlichung**: Produktfotos brauchen ein Nutzungsrecht. Fotos
von Herstellern und Händlern sind urheberrechtlich geschützt, auch wenn sie
im Netz frei zu finden sind. Eigene Aufnahmen der tatsächlich angebotenen
Stücke sind bei gebrauchter Ware ohnehin der bessere Verkaufsweg.

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
* **Rückgabe**: Die Seite weist derzeit kein Rückgaberecht aus. Beim Verkauf
  an Privatpersonen über das Internet gilt in der EU trotzdem das gesetzliche
  Widerrufsrecht von 14 Tagen — es lässt sich weder abbedingen noch
  wegschreiben. Ohne Widerrufsbelehrung verlängert sich die Frist auf ein
  Jahr und vierzehn Tage. Wer nur an Gewerbetreibende verkauft oder
  ausschließlich vor Ort abgibt, ist davon nicht betroffen.
* **Rechtstexte**: Impressum, Datenschutzerklärung, AGB und Widerrufsbelehrung
  sind in der Fußzeile verlinkt, aber noch nicht geschrieben — in Deutschland
  sind sie für einen Shop Pflicht.
* **Fotos**: echte Produktfotos statt der SVG-Illustrationen. Ein Stück
  (PH Artichoke) hat bereits eine Fotostrecke; für die übrigen fehlen sie.
  Das Nutzungsrecht an jedem Foto muss vorher geklärt sein.
* **Berater mit Sprachmodell**: heute beantwortet er Fragen aus den eigenen
  Daten. Für freie Antworten braucht es ein Backend mit API-Schlüssel.

## Hinweis

Firmenname, Adresse, Telefonnummer und Produkttexte sind erfunden und dienen
als Platzhalter.
