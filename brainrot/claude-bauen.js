/* Baut claude.html: brainrot als eine einzige Datei, damit man es
   direkt in Claude öffnen kann.   node brainrot/claude-bauen.js */
const fs = require("fs");
const path = require("path");
const lies = (f) => fs.readFileSync(path.join(__dirname, f), "utf8");

const html = lies("index.html");
const icon = "data:image/svg+xml;base64," + Buffer.from(lies("icon.svg")).toString("base64");
const body = html.slice(html.indexOf("<body>") + 6, html.indexOf("</body>"))
  .replace('<script src="app.js"></script>', "")
  .replace(/src="icon\.svg"/g, `src="${icon}"`)
  .trim();

/* In Claude polstert die Seite selbst schon oben und unten. */
const extra = `
:root { color-scheme: dark; }
body { padding: 0; }
.kopf { top: env(safe-area-inset-top, 0px); }`;

const aus = `<title>brainrot</title>
<meta name="description" content="Redet dich raus aus TikTok, YouTube, Snapchat und Instagram.">
<style>
${lies("style.css")}${extra}
</style>
${body}
<script>
window.BRAINROT_IN_CLAUDE = true;
${lies("app.js")}
</script>
`;
fs.writeFileSync(path.join(__dirname, "claude.html"), aus);
console.log("claude.html gebaut (" + Math.round(aus.length / 1024) + " KB)");
