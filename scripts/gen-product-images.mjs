// Generates minimal branded SVG product images into public/products/.
// Run: node scripts/gen-product-images.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "public", "products");
mkdirSync(outDir, { recursive: true });

const wrap = (bg, content) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bg[0]}"/>
      <stop offset="100%" stop-color="${bg[1]}"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#bg)"/>
  ${content}
</svg>`;

const jersey = (body, trim) => `
  <g transform="translate(300 310)">
    <path d="M -150 -140 L -80 -180 Q 0 -150 80 -180 L 150 -140 L 190 -60 L 120 -30 L 120 180 Q 0 200 -120 180 L -120 -30 L -190 -60 Z"
      fill="${body}" stroke="${trim}" stroke-width="10" stroke-linejoin="round"/>
    <path d="M -80 -180 Q 0 -150 80 -180 Q 40 -120 0 -120 Q -40 -120 -80 -180 Z" fill="${trim}"/>
    <circle cx="0" cy="30" r="46" fill="none" stroke="${trim}" stroke-width="8" opacity="0.85"/>
    <text x="0" y="48" text-anchor="middle" font-family="Manrope, system-ui, sans-serif" font-size="52" font-weight="700" fill="${trim}">10</text>
  </g>`;

const scarf = (a, b) => `
  <g transform="translate(300 300) rotate(-18)">
    <rect x="-240" y="-55" width="480" height="110" rx="14" fill="${a}"/>
    ${Array.from({ length: 6 }, (_, i) => `<rect x="${-240 + 20 + i * 76}" y="-55" width="38" height="110" fill="${b}"/>`).join("")}
    <path d="M -240 -55 l -34 -30 v 170 l 34 -30 Z" fill="${a}"/>
    <path d="M 240 -55 l 34 -30 v 170 l -34 -30 Z" fill="${b}"/>
  </g>`;

const signed = (fill, ink) => `
  <g transform="translate(300 300)">
    <rect x="-190" y="-190" width="380" height="380" rx="10" fill="#fff" stroke="${fill}" stroke-width="16"/>
    ${jersey(fill, ink).replace('translate(300 310)', 'translate(0 20) scale(0.62)')}
    <path d="M -120 -120 q 40 -40 70 -6 q 24 26 -12 30 q 60 -10 100 -34" fill="none" stroke="${ink}" stroke-width="7" stroke-linecap="round"/>
  </g>`;

const ticket = (a, b) => `
  <g transform="translate(300 300) rotate(-8)">
    <path d="M -220 -110 h 440 a 0 0 0 0 0 0 0 v 62 a 26 26 0 0 0 0 52 v 106 h -440 v -106 a 26 26 0 0 0 0 -52 Z" fill="${a}"/>
    <rect x="80" y="-110" width="8" height="220" fill="${b}" opacity="0.6" stroke-dasharray="4 10"/>
    <text x="-190" y="-40" font-family="Manrope, system-ui, sans-serif" font-size="40" font-weight="700" fill="#fff">FINAL</text>
    <text x="-190" y="10" font-family="JetBrains Mono, monospace" font-size="22" fill="#fff" opacity="0.85">SEC 104 · ROW G</text>
    <text x="-190" y="70" font-family="JetBrains Mono, monospace" font-size="22" fill="#fff" opacity="0.85">GATE 4 · 19:45</text>
    <text x="110" y="-40" font-family="Manrope, system-ui, sans-serif" font-size="26" font-weight="700" fill="#fff" transform="rotate(90 110 -40)">ADMIT ONE</text>
  </g>`;

const sticker = (a, b) => `
  <g transform="translate(300 300)">
    <circle r="170" fill="${a}" stroke="#fff" stroke-width="14"/>
    <circle r="120" fill="none" stroke="${b}" stroke-width="10"/>
    <path d="M 0 -74 L 22 -30 L 70 -24 L 35 10 L 44 58 L 0 36 L -44 58 L -35 10 L -70 -24 L -22 -30 Z" fill="${b}"/>
    <text x="0" y="150" text-anchor="middle" font-family="Manrope, system-ui, sans-serif" font-size="30" font-weight="800" fill="${b}" letter-spacing="6">FANS</text>
  </g>`;

const files = {
  "jersey-red.svg": wrap(["#fdf2f2", "#fbe3e3"], jersey("#C0392B", "#f5e9d8")),
  "jersey-blue.svg": wrap(["#f0f4fd", "#e2e9fa"], jersey("#274690", "#f2c94c")),
  "jersey-white.svg": wrap(["#f4f6f8", "#e8ecf1"], jersey("#f5f6f8", "#274690")),
  "jersey-green.svg": wrap(["#f0faf4", "#dff3e8"], jersey("#1E8449", "#f7f9f7")),
  "scarf-red.svg": wrap(["#fdf4ef", "#fae5da"], scarf("#C0392B", "#f5e9d8")),
  "scarf-blue.svg": wrap(["#eff3fc", "#e0e8f9"], scarf("#274690", "#f2c94c")),
  "scarf-teal.svg": wrap(["#effaf9", "#dcf2f0"], scarf("#0E7C7B", "#f4f1ea")),
  "signed-red.svg": wrap(["#faf3f3", "#f3e2e2"], signed("#C0392B", "#22262e")),
  "signed-blue.svg": wrap(["#f2f5fc", "#e4eaf8"], signed("#274690", "#22262e")),
  "ticket-blue.svg": wrap(["#eef2fb", "#dde6f8"], ticket("#274690", "#f2c94c")),
  "ticket-green.svg": wrap(["#eefaf3", "#dcf2e6"], ticket("#1E8449", "#f4f1ea")),
  "sticker-yellow.svg": wrap(["#fdfaf0", "#faf1d8"], sticker("#f2c94c", "#274690")),
  "sticker-red.svg": wrap(["#fdf2f2", "#f9e2e2"], sticker("#C0392B", "#f5e9d8")),
};

for (const [name, svg] of Object.entries(files)) {
  writeFileSync(join(outDir, name), svg);
}
console.log(`Wrote ${Object.keys(files).length} SVGs to public/products/`);
