/**
 * product-list: the webshop product overview (source randapparatuur.ziggo.nl/randapparatuur).
 * Rendered by json2html from the products sheet, but authorable by hand too.
 *
 * Authoring: one row per product; cells are classified by content, so order is free:
 *   the cell with a picture  = product image
 *   the cell with a heading  = optional <strong> brand, heading with the link to the product page,
 *                              optional subtitle paragraph
 *   the other cell           = price paragraph (contains €) and stock paragraph;
 *                              stock in <em> marks the product as not available
 * The whole card links to the product page.
 * A row without picture and link (e.g. a single heading cell) is the list header.
 */

function el(tag, className, ...kids) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...kids.filter(Boolean));
  return e;
}

function card(row) {
  const cells = [...row.children];
  const mediaCell = cells.find((c) => c.querySelector('picture, img'));
  const textCell = cells.find((c) => c !== mediaCell && c.querySelector('h1, h2, h3, h4, h5, h6'))
    || cells.find((c) => c !== mediaCell && c.querySelector('a'));
  const rest = cells.filter((c) => c !== mediaCell && c !== textCell);

  const link = textCell?.querySelector('a[href]');
  const href = link?.getAttribute('href');
  const heading = textCell?.querySelector('h1, h2, h3, h4, h5, h6');
  const title = (heading || link)?.textContent.trim() || '';
  const brand = textCell?.querySelector('p > strong:only-child')?.textContent.trim() || '';
  const subtitle = [...(textCell?.querySelectorAll('p') || [])]
    .find((p) => !p.querySelector('strong, a') && p.textContent.trim())?.textContent.trim() || '';

  const paras = rest.flatMap((c) => [...c.querySelectorAll('p')]);
  const priceP = paras.find((p) => /€|\d+,\d{2}/.test(p.textContent));
  const stockP = paras.find((p) => p !== priceP && p.textContent.trim());
  const unavailable = !!stockP?.querySelector('em');

  const picture = mediaCell?.querySelector('picture') || mediaCell?.querySelector('img');
  const body = el(
    'div',
    'pl-body',
    brand ? el('p', 'pl-brand', brand) : null,
    el('h3', 'pl-title', title),
    subtitle ? el('p', 'pl-subtitle', subtitle) : null,
  );
  const dot = el('span', 'pl-stock-dot');
  dot.setAttribute('aria-hidden', 'true');
  const foot = el(
    'div',
    'pl-foot',
    priceP ? el('p', 'pl-price', priceP.textContent.trim()) : null,
    stockP ? el('p', `pl-stock ${unavailable ? 'is-out' : 'is-in'}`, dot, stockP.textContent.trim()) : null,
    href ? el('span', 'pl-cta', 'Details') : null,
  );

  const inner = [picture ? el('div', 'pl-media', picture) : null, body, foot];
  const li = el('li', `pl-card${unavailable ? ' unavailable' : ''}`);
  if (href) {
    const a = el('a', 'pl-link', ...inner);
    a.href = href;
    a.setAttribute('aria-label', [brand, title, subtitle].filter(Boolean).join(' '));
    li.append(a);
  } else {
    li.append(...inner.filter(Boolean));
  }
  return li;
}

export default function decorate(block) {
  if (block.querySelector('.pl-grid')) return;
  const heads = new Set([...block.children]
    .filter((row) => !row.querySelector('picture, img, a[href]') && row.textContent.trim()));
  const rows = [...block.children];
  const isHead = (row) => heads.has(row);
  const head = rows.filter(isHead).map((row) => el('div', 'pl-head', ...[...row.children].flatMap((c) => [...c.childNodes])));
  const ul = el('ul', 'pl-grid', ...rows.filter((r) => !isHead(r)).map(card));
  block.replaceChildren(...head, ul);
}
