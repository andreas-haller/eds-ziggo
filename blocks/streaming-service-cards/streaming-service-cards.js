/**
 * streaming-service-cards: a row of service cards (source streaming-page "Ken je deze TV apps
 * al?" cards; `steps` variant: the "Hoe kijk je ...?" how-to cards).
 *
 * Authoring rows (classified by content, order free):
 *   head: a one-cell row holding a heading (+ optional paragraphs) = the section title
 *   card: a two-cell row — cell 1 the picture (service logo / step image), cell 2 the name
 *     heading, text paragraphs and a link paragraph ("Meer info", "Bestellen")
 *   a paragraph in italics only (<p><em>…</em></p>) in cell 2 = the card's promo ribbon label
 *   (offers: dark by default, orange when bold — <p><em><strong>…</strong></em></p>)
 * Variants: steps (image box on top, centred text under it, no card chrome); light (gray band,
 *   black head); center (head centred in the middle 8/12).
 */

function el(tag, className, ...kids) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...kids);
  return e;
}

/* the pipeline unwraps a lone paragraph to bare cell text; restore it so styles hold */
function ensureP(cell) {
  const inline = [...cell.childNodes].every((n) => n.nodeType === 3
    || (n.nodeType === 1 && !n.matches('p, div, ul, ol, h1, h2, h3, h4, h5, h6, picture, table')));
  if (inline && cell.textContent.trim()) {
    const p = document.createElement('p');
    p.append(...cell.childNodes);
    cell.append(p);
  }
  return cell;
}

const isHeading = (n) => /^H[1-6]$/.test(n.tagName);
const isRibbon = (n) => n.tagName === 'P' && n.children.length === 1
  && n.firstElementChild.matches('em, i') && !n.querySelector('a, picture, img')
  && n.textContent.trim() === n.firstElementChild.textContent.trim();

/* offer price line "van 26,94 voor 21,95": the source reads "van"/"voor" to screen readers only
   and strikes the old price — keep the words in the DOM, visually hidden (sr-only) */
const PRICE = /\b(van)(\s+)([\d.,]+-?)(\s+)(voor)\b/i;
function srOnly(text) {
  const s = document.createElement('span');
  s.className = 'sr-only';
  s.textContent = text;
  return s;
}
function hideWords(node) {
  const re = /\b(van|voor)\b/gi;
  const text = node.textContent;
  if (!re.test(text)) return;
  const frag = document.createDocumentFragment();
  let last = 0;
  text.replace(re, (m, w, i) => {
    if (i > last) frag.append(text.slice(last, i));
    frag.append(srOnly(w));
    last = i + w.length;
    return m;
  });
  if (last < text.length) frag.append(text.slice(last));
  node.replaceWith(frag);
}
function decoratePrice(p) {
  const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
  const texts = [];
  while (walker.nextNode()) texts.push(walker.currentNode);
  if (p.querySelector('del, s')) {
    texts.filter((t) => !t.parentElement.closest('strong, b')).forEach(hideWords);
    return;
  }
  const t = texts.find((n) => PRICE.test(n.textContent) && !n.parentElement.closest('strong, b'));
  if (!t) return;
  const m = t.textContent.match(PRICE);
  const [all, van, sp1, old, sp2, voor] = m;
  const before = t.textContent.slice(0, m.index);
  const after = t.textContent.slice(m.index + all.length);
  const del = document.createElement('del');
  del.textContent = old;
  t.replaceWith(before, srOnly(van), sp1, del, sp2, srOnly(voor), after);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .ssc-inner')) return;
  if (block.classList.contains('offers')) {
    block.querySelectorAll(':scope > div > div > p').forEach((p) => {
      if (!p.querySelector('a') && /\d,\d/.test(p.textContent)) decoratePrice(p);
    });
  }
  const head = el('div', 'ssc-head');
  const grid = el('div', 'ssc-grid');
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) {
      if (cells[0]) head.append(...ensureP(cells[0]).children);
      return;
    }
    const media = el('div', 'ssc-media', ...cells[0].children);
    const body = el('div', 'ssc-body');
    [...ensureP(cells[1]).children].forEach((n) => {
      n.classList.remove('button-wrapper');
      n.querySelectorAll('a.button').forEach((a) => a.classList.remove('button', 'primary', 'secondary', 'accent'));
      let cls = isHeading(n) ? 'ssc-title' : 'ssc-text';
      if (isRibbon(n)) cls = 'ssc-ribbon';
      body.append(el('div', cls, n));
    });
    grid.append(el('div', 'ssc-col', el('div', 'ssc-card', media, body)));
  });
  const inner = el('div', 'ssc-inner');
  if (head.children.length) inner.append(head);
  inner.append(grid);
  block.replaceChildren(inner);
}
