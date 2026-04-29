/**
 * Recomputes `readingTime` for every article in data/content.json from `content`.
 * Run after bulk edits, or use npm run update-reading-times.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { formatReadingTimeLabel } from '../src/utils/readingTime.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const path = join(__dirname, '../data/content.json');

const raw = readFileSync(path, 'utf8');
const data = JSON.parse(raw) as { articles?: { content: string; readingTime?: string }[] };

if (!Array.isArray(data.articles)) {
  console.error('content.json has no articles array');
  process.exit(1);
}

data.articles = data.articles.map((a) => ({
  ...a,
  readingTime: formatReadingTimeLabel(a.content ?? ''),
}));

writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
console.log(`Updated readingTime for ${data.articles.length} articles in ${path}`);
