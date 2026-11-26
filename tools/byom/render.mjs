#!/usr/bin/env node
/**
 * Render the json2html templates locally, the way the worker does: the overview gets the whole
 * sheet JSON, each detail page gets the sheet row whose `path` matches (arrayKey data, pathKey path).
 *
 * Usage (needs `npm i mustache`): node render.mjs <repo-root> <sheet.json> <out-dir>
 * Writes <out-dir>/randapparatuur.html and <out-dir>/randapparatuur/details/<id>.html
 */
import fs from 'node:fs';
import path from 'node:path';
import Mustache from 'mustache';

const [root, sheetFile, outDir] = process.argv.slice(2);
const sheet = JSON.parse(fs.readFileSync(sheetFile, 'utf8'));
const tpl = (name) => fs.readFileSync(path.join(root, 'templates', 'randapparatuur', name), 'utf8');

const write = (rel, html) => {
  const file = path.join(outDir, `${rel}.html`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
};

write('randapparatuur', Mustache.render(tpl('overview.html'), sheet));
const product = tpl('product.html');
sheet.data.forEach((row) => write(row.path.slice(1), Mustache.render(product, row)));
console.log(`✓ rendered overview + ${sheet.data.length} product pages → ${outDir}`);
