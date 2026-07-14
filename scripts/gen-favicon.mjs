// Rasterizes app/icon.svg into a multi-size favicon.ico (PNG-in-ICO, Vista+).
// Run: node scripts/gen-favicon.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const root = process.cwd();
const svg = readFileSync(join(root, "app", "icon.svg"));
const sizes = [16, 32, 48];

function packIco(pngBuffers, sizes) {
  const count = pngBuffers.length;
  const headerSize = 6 + 16 * count;
  let offset = headerSize;
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);

  const entries = [];
  pngBuffers.forEach((buf, i) => {
    const size = sizes[i];
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bit count
    entry.writeUInt32LE(buf.length, 8); // bytes in resource
    entry.writeUInt32LE(offset, 12); // image offset
    offset += buf.length;
    header.set(entry, 6 + 16 * i);
    entries.push(entry);
  });

  return Buffer.concat([header, ...pngBuffers]);
}

const pngBuffers = await Promise.all(
  sizes.map((size) => sharp(svg, { density: 384 }).resize(size, size).png().toBuffer())
);

writeFileSync(join(root, "app", "favicon.ico"), packIco(pngBuffers, sizes));
console.log(`Wrote app/favicon.ico (${sizes.join(", ")}px)`);

// apple-touch-icon: opaque background required, no alpha.
const appleIcon = await sharp(svg, { density: 384 })
  .resize(180, 180)
  .flatten({ background: "#2063B0" })
  .png()
  .toBuffer();
writeFileSync(join(root, "app", "apple-icon.png"), appleIcon);
console.log("Wrote app/apple-icon.png (180px)");
