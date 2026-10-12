# brainrot 🧠🚫

Eine App, die dich aus TikTok, YouTube, Snapchat und Instagram **rausredet**.

Du tippst an, was du öffnen willst – brainrot fragt dich warum, macht mit dir
drei Atemzüge, schlägt dir was Besseres vor und zählt, wie oft du widerstanden
hast und wie viele Minuten du gerettet hast. Mit Stimme (🔊 oben rechts).

## Online stellen (am einfachsten)

1. Geh auf **https://app.netlify.com/drop**
2. Zieh den Ordner `brainrot` ins Fenster.
3. Fertig – du bekommst einen Link wie `https://irgendwas.netlify.app`.

Oder: Die Website in diesem Repo läuft eh auf Netlify, dann ist brainrot
automatisch unter `/brainrot/` erreichbar.

## Aufs Handy

- **iPhone & iPad:** Link in Safari öffnen → Teilen → „Zum Home-Bildschirm“.
- **Android:** Link in Chrome öffnen → Menü ⋮ → „App installieren“.

## Automatisch starten, wenn du TikTok öffnest

Eine Website darf andere Apps nicht sperren oder löschen – das darf nur das
Handy selbst. Aber auf iPhone und iPad geht das hier:

Kurzbefehle → Automation → + → App → TikTok → „Wird geöffnet“ →
„Sofort ausführen“ → Aktion „URL öffnen“ mit
`https://DEIN-LINK/?app=tiktok`

Dann geht jedes Mal brainrot auf. (Steht auch in der App unter ⚙️.)

## Dateien

| Datei | Was drin ist |
|---|---|
| `index.html` | Die drei Seiten: Start, Gespräch, Einrichten |
| `app.js` | Das Gespräch, die Texte, die Zahlen |
| `style.css` | Aussehen |
| `sw.js` | Damit die App auch ohne Internet startet |
| `manifest.webmanifest`, `icon*` | Name und Symbol auf dem Home-Bildschirm |

Texte ändern? Alles steht oben in `app.js` (`APPS`, `ALTERNATIVEN`, `LOB`).
