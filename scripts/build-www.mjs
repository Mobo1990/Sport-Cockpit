// Kopiert die ausgelieferten Dateien (Liste SHELL aus sw.js) nach www/ – das ist der Inhalt der iOS-App.
import { readFileSync, rmSync, mkdirSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
const sw = readFileSync('sw.js', 'utf8');
const m = sw.match(/const SHELL = \[([\s\S]*?)\];/);
if (!m) throw new Error('SHELL-Liste in sw.js nicht gefunden');
const files = [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1]).filter(f => f !== './');
rmSync('www', { recursive: true, force: true });
for (const f of files) { const to = join('www', f); mkdirSync(dirname(to), { recursive: true }); copyFileSync(f, to); }
console.log(`www/: ${files.length} Dateien kopiert`);
