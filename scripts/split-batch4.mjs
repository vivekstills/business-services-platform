import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const t = fs
  .readFileSync(path.join(__dirname, 'batch4-extracted.txt'), 'utf8')
  .replace(/---PAGE \d+---\r?\n/g, '');
const markers = [];
for (let n = 1; n <= 5; n++) {
  const idx = t.indexOf(`ARTICLE ${n} OF 5`);
  if (idx === -1) {
    console.error('missing marker', n);
    process.exit(1);
  }
  markers.push(idx);
}
markers.push(t.length);
const outDir = path.join(__dirname, 'batch4-raw');
fs.mkdirSync(outDir, { recursive: true });
for (let n = 0; n < 5; n++) {
  const chunk = t.slice(markers[n], markers[n + 1]).trim();
  fs.writeFileSync(path.join(outDir, `article-${n + 1}.txt`), chunk);
  console.log(n + 1, chunk.length);
}
