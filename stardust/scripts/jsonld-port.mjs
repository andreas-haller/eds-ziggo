#!/usr/bin/env node
// Port the source's JSON-LD (captured in stardust/current/pages/<slug>.html) into a
// `JSON-LD` row of each delivered page's metadata block. Strings are kept verbatim; the
// source's raw control characters inside strings (invalid JSON) are escaped so it parses.
// Usage: node stardust/scripts/jsonld-port.mjs [--only slug,slug] [--dry-run]
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';

const args = process.argv.slice(2);
const only = args.includes('--only') ? args[args.indexOf('--only') + 1].split(',') : null;
const dry = args.includes('--dry-run');
const CUR = 'stardust/current/pages/';

function lenient(s) {
  let out = ''; let inStr = false; let esc = false;
  for (const ch of s) {
    if (inStr) {
      if (esc) { esc = false; out += ch; continue; }
      if (ch === '\\') { esc = true; out += ch; continue; }
      if (ch === '"') { inStr = false; out += ch; continue; }
      const c = ch.charCodeAt(0);
      if (c < 0x20) { out += ch === '\n' ? '\\n' : ch === '\r' ? '\\r' : ch === '\t' ? '\\t' : `\\u${c.toString(16).padStart(4, '0')}`; continue; }
      out += ch;
    } else { if (ch === '"') inStr = true; out += ch; }
  }
  return JSON.parse(out);
}
const escHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const changed = [];
for (const f of readdirSync(CUR).filter((x) => x.endsWith('.json'))) {
  const slug = f.slice(0, -5);
  if (only && !only.includes(slug)) continue;
  const rec = JSON.parse(readFileSync(CUR + f, 'utf8'));
  const side = CUR + (rec.renderedHtml ? rec.renderedHtml.split('/').pop() : `${slug}.html`);
  if (!existsSync(side)) continue;
  const html = readFileSync(side, 'utf8');
  const blocks = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => lenient(m[1].trim()));
  if (!blocks.length) continue;
  const path = new URL(rec.url).pathname.replace(/\/$/, '') || '/index';
  const file = `content${path}.html`;
  if (!existsSync(file)) { console.error(`MISSING ${file} (${slug})`); continue; }
  let doc = readFileSync(file, 'utf8');
  const value = JSON.stringify(blocks.length === 1 ? blocks[0] : blocks);
  const row = `<div><div>JSON-LD</div><div>${escHtml(value)}</div></div>`;
  const re = /<div><div>JSON-LD<\/div><div>[\s\S]*?<\/div><\/div>/;
  if (re.test(doc)) doc = doc.replace(re, row);
  else if (/<div class="metadata">/.test(doc)) doc = doc.replace(/<div class="metadata">/, `<div class="metadata">${row}`);
  else { console.error(`NO-METADATA ${file}`); continue; }
  if (!dry) writeFileSync(file, doc);
  changed.push(path);
  console.log(`${slug}\t${blocks.length} block(s)\t${value.length} chars\t${file}`);
}
if (!dry) writeFileSync('stardust/.labs/jsonld-paths.txt', `${changed.join('\n')}\n`);
