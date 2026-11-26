/**
 * product-detail: a webshop product page (source randapparatuur.ziggo.nl/randapparatuur/details).
 * Rendered by json2html from the products sheet, but authorable by hand too.
 *
 * Authoring: two-cell rows, key | value (keys are case-insensitive, rows are optional):
 *   image        product picture
 *   brand        brand line above the title
 *   title        product name (h1)
 *   subtitle     variant line, e.g. "2 meter"
 *   price        formatted price, e.g. "€ 5,25"
 *   stock        stock text; <em>…</em> marks the product as not available
 *   sku          article number
 *   order        <strong><a> order button
 *   back         <em><a> back link
 *   description  rich text
 *   specs        heading + list of <strong>label</strong> value items
 *   note         rich text under the specs
 *   certified    the Ziggo Geschikt badge (icon + label)
 * Rows with another key are kept as extra text under the description.
 */

function el(tag, className, ...kids) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...kids.filter(Boolean));
  return e;
}

/** the key | value rows as a Map of key -> value cell */
function readRows(block) {
  const rows = new Map();
  const extra = [];
  [...block.children].forEach((row) => {
    const [keyCell, valueCell] = row.children;
    if (!valueCell) {
      if (keyCell) extra.push(keyCell);
      return;
    }
    const key = keyCell.textContent.trim().toLowerCase().replace(/\s+/g, '-');
    if (rows.has(key)) extra.push(valueCell);
    else rows.set(key, valueCell);
  });
  return { rows, extra };
}

/** the cell's children moved into a new wrapper (null when the cell is missing or empty) */
function take(cell, className, tag = 'div') {
  if (!cell || (!cell.textContent.trim() && !cell.querySelector('picture, img, .icon'))) return null;
  return el(tag, className, ...cell.childNodes);
}

const text = (cell) => (cell ? cell.textContent.trim() : '');

export default function decorate(block) {
  if (block.querySelector('.pd-main')) return;
  const { rows, extra } = readRows(block);
  const get = (k) => rows.get(k);

  const unavailable = !!get('stock')?.querySelector('em');
  block.classList.toggle('unavailable', unavailable);

  // media column
  const media = take(get('image'), 'pd-media');

  // buy box
  const box = el('div', 'pd-box');
  if (text(get('brand'))) box.append(el('p', 'pd-brand', text(get('brand'))));
  const titleCell = get('title');
  const h1 = titleCell?.querySelector('h1, h2');
  if (h1) {
    h1.classList.add('pd-title');
    box.append(h1);
  } else if (text(titleCell)) {
    box.append(el('h1', 'pd-title', text(titleCell)));
  }
  if (text(get('subtitle'))) box.append(el('p', 'pd-subtitle', text(get('subtitle'))));
  if (text(get('price'))) box.append(el('p', 'pd-price', text(get('price'))));
  if (text(get('stock'))) {
    const dot = el('span', 'pd-stock-dot');
    dot.setAttribute('aria-hidden', 'true');
    box.append(el('p', `pd-stock ${unavailable ? 'is-out' : 'is-in'}`, dot, text(get('stock'))));
  }
  const actions = el('div', 'pd-actions', ...['order', 'back'].map((k) => take(get(k), `pd-${k}`)));
  if (actions.children.length) box.append(actions);
  if (text(get('sku'))) box.append(el('p', 'pd-sku', `Artikelnummer ${text(get('sku'))}`));
  const badge = take(get('certified'), 'pd-certified');
  if (badge) {
    // HARNESS-ONLY fallback: raw :name: notation (the delivery pipeline emits span.icon)
    const p = badge.querySelector('p') || badge;
    const m = !badge.querySelector('.icon') && p.firstChild?.nodeType === Node.TEXT_NODE
      && p.firstChild.textContent.match(/^\s*:([a-z0-9-]+):\s*/);
    if (m) {
      p.firstChild.textContent = p.firstChild.textContent.slice(m[0].length);
      const img = el('img');
      img.src = `${window.hlx.codeBasePath}/icons/${m[1]}.svg`;
      img.alt = '';
      p.prepend(el('span', `icon icon-${m[1]}`, img));
    }
    box.append(badge);
  }

  // details below
  const known = ['image', 'brand', 'title', 'subtitle', 'price', 'stock', 'sku', 'order', 'back',
    'description', 'specs', 'note', 'certified'];
  const others = [...rows.entries()].filter(([k]) => !known.includes(k)).map(([, c]) => c);
  const details = el(
    'div',
    'pd-details',
    take(get('description'), 'pd-description'),
    ...others.map((c) => take(c, 'pd-extra')),
    ...extra.map((c) => take(c, 'pd-extra')),
    take(get('specs'), 'pd-specs'),
    take(get('note'), 'pd-note'),
  );
  details.querySelectorAll('.pd-specs li').forEach((li) => {
    const label = li.querySelector(':scope > strong:first-child');
    if (!label) return;
    const value = el('span', 'pd-spec-value', ...[...li.childNodes].filter((n) => n !== label));
    label.classList.add('pd-spec-label');
    li.replaceChildren(label, value);
  });

  const main = el('div', 'pd-main', media, box);
  block.replaceChildren(...[main, details.children.length ? details : null].filter(Boolean));
}
