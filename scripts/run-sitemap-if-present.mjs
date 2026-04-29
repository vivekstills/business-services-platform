/**
 * Vite build calls this after copying data → public content.json.
 * Older git commits have package.json that runs the sitemap step but no
 * scripts/generate-sitemap.ts yet; skipping avoids ERR_MODULE_NOT_FOUND.
 */
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, 'scripts', 'generate-sitemap.ts');
if (!existsSync(target)) {
  process.stderr.write('run-sitemap-if-present: scripts/generate-sitemap.ts missing, skipping sitemap regen (using public/sitemap.xml from repo)\n');
  process.exit(0);
}
execSync('tsx scripts/generate-sitemap.ts', { stdio: 'inherit', cwd: root });
