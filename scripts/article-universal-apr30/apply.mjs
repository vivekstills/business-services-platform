import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..', '..');
const dir = __dirname;
const dataPath = path.join(root, 'data', 'content.json');

function wordCount(s) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function readingTimeFromWords(w) {
  if (w < 1500) return '3 min read';
  if (w < 2500) return '5 min read';
  if (w < 3500) return '7 min read';
  return '9 min read';
}

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));

let updated = 0;
for (const file of files) {
  const slug = file.replace(/\.md$/, '');
  const content = fs.readFileSync(path.join(dir, file), 'utf8').trim();
  const w = wordCount(content);
  const rt = readingTimeFromWords(w);
  const art = data.articles.find((a) => a.slug === slug);
  if (!art) {
    console.warn('SKIP — no article with slug:', slug);
    continue;
  }
  art.content = content;
  art.readingTime = rt;
  updated++;
  console.log(slug, 'words:', w, '→', rt);
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2) + '\n');
fs.writeFileSync(path.join(root, 'public', 'content.json'), JSON.stringify(data, null, 2) + '\n');
console.log('Updated', updated, 'articles.');
