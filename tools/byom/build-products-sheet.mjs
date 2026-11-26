#!/usr/bin/env node
/**
 * Build the randapparatuur products sheet (DA single-sheet JSON) from the source site:
 * the offers feed for name/brand/price/image/stock and each detail page for the description.
 *
 * Usage: node build-products-sheet.mjs <offers.json> <details-dir> <out.json>
 */
import fs from 'node:fs';
import path from 'node:path';

const [offersFile, detailsDir, outFile] = process.argv.slice(2);
if (!outFile) {
  console.error('Usage: build-products-sheet.mjs <offers.json> <details-dir> <out.json>');
  process.exit(2);
}

const ORIGIN = 'https://randapparatuur.ziggo.nl';
const offers = JSON.parse(fs.readFileSync(offersFile, 'utf8'));

const euro = (n) => `€ ${Number(n).toFixed(2).replace('.', ',')}`;

const clean = (s) => s
  .replace(/\s+(target|border|class|id|width|height|style)="[^"]*"/g, '')
  .replace(/(href|src)="\//g, `$1="${ORIGIN}/`)
  .replace(/\s*\/>/g, '>')
  .replace(/<p>\s*<\/p>/g, '')
  .replace(/\s+/g, ' ')
  .replace(/>\s+</g, '><')
  .trim();

/**
 * The description fieldset (the plain <fieldset> after the pdp-product one), split into
 * { description, specs, note }: the text, the spec table (div#device-specs) and what follows it.
 */
function description(html) {
  const start = html.indexOf('<fieldset class="pdp-product">');
  const open = html.indexOf('<fieldset>', start + 1);
  if (start < 0 || open < 0) return { description: '', specs: '', note: '' };
  const close = html.indexOf('</fieldset>', open);
  const body = html.slice(open + '<fieldset>'.length, close);
  const specsAt = body.indexOf('<div id="device-specs"');
  if (specsAt < 0) return { description: clean(body), specs: '', note: '' };
  const specsBlock = body.slice(specsAt).replace(/^<div[^>]*>/, '').replace(/<\/div>\s*$/, '');
  const table = specsBlock.match(/<table[\s\S]*?<\/table>/)?.[0] || '';
  const text = clean(body.slice(0, specsAt));
  const rest = clean(specsBlock.replace(table, ''));
  return {
    // some pages wrap their whole text in the specs container: then the rest is the text;
    // a trailing "Specificaties" heading is dropped (the page adds its own above the list)
    description: (text || rest).replace(/<h[2-4]>\s*Specificaties\s*<\/h[2-4]>$/, ''),
    specs: specList(table),
    note: text ? rest : '',
  };
}

const strip = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

/** spec table -> <ul><li><strong>label</strong> value</li></ul> (tables do not survive in a block cell) */
function specList(table) {
  const items = [...table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map(([, tr]) => {
    const cells = [...tr.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(([, td]) => td);
    if (cells.length < 2) return '';
    const label = strip(cells[0]);
    const value = clean(cells.slice(1).join(' ').replace(/<\/?p>/g, ' ').replace(/<br\s*\/?>/g, ', '));
    return label && value ? `<li><strong>${label}</strong> ${value}</li>` : '';
  }).filter(Boolean);
  return items.length ? `<ul>${items.join('')}</ul>` : '';
}

/** the Ziggo Geschikt badge image becomes a flag (the block shows the badge icon) */
function badge(note) {
  const certified = /ziggo_geschikt/.test(note);
  const text = note.replace(/<p>\s*<img[^>]*ziggo_geschikt[^>]*>\s*<\/p>/g, '')
    .replace(/<img[^>]*ziggo_geschikt[^>]*>/g, '').trim();
  return { certified, note: text };
}

const rows = offers.map((o) => {
  const id = String(o.offer_id);
  const file = path.join(detailsDir, `${id}.html`);
  const html = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  const desc = description(html);
  if (!desc.description) console.warn(`! ${id}: no description found`);
  const { certified, note } = badge(desc.note);
  if (/<img/.test(desc.description)) console.warn(`! ${id}: image inside the description`);
  const available = o.lifecycle === 'RUNNING';
  return {
    path: `/randapparatuur/details/${id}`,
    id,
    sku: o.product_sku || '',
    brand: (o.brand || '').trim(),
    title: (o.product_title || '').trim(),
    subtitle: (o.product_subtitle || '').trim(),
    price: euro(o.oneoff_sales_price),
    amount: String(o.oneoff_sales_price),
    color: (o.color_name || '').trim(),
    image: o.images?.[0] ? `${ORIGIN}${o.images[0]}` : '',
    stock: available ? 'Op voorraad' : 'Tijdelijk niet beschikbaar',
    available: available ? 'true' : '',
    description: desc.description,
    specs: desc.specs,
    note,
    certified: certified ? 'true' : '',
    source: `${ORIGIN}/randapparatuur/details/${id}`,
  };
});

const sheet = {
  total: rows.length,
  limit: rows.length,
  offset: 0,
  data: rows,
  ':type': 'sheet',
};
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, `${JSON.stringify(sheet, null, 2)}\n`);
console.log(`✓ ${rows.length} products → ${outFile}`);
