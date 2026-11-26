/**
 * mediabox-cards: centred intro, a row of product cards and a closing line with a CTA.
 *
 * Authoring rows (classified by content):
 *   rows before the first picture row = intro: eyebrow paragraph(s), heading, lead paragraph(s)
 *   rows with a picture = one card each: picture, <h3> title, text, CTA paragraph
 *     (<em><a> = white outline button, as on the source)
 *   rows after the cards = closing: title paragraph + CTA paragraph (<em><a> = outline button)
 */

function el(tag, className, ...kids) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...kids);
  return e;
}

const isCta = (n) => n.tagName === 'P' && !!n.querySelector('a') && !n.querySelector('picture, img')
  && n.textContent.trim() === n.querySelector('a').textContent.trim();
const isHeading = (n) => /^H[1-6]$/.test(n.tagName);

function cellNodes(row) {
  return [...row.children].flatMap((c) => [...c.children]);
}

function buildIntro(nodes) {
  const intro = el('div', 'mb-intro');
  let hIdx = nodes.findIndex(isHeading);
  // source pairs: <h2> eyebrow directly followed by the <h3> title (televisie siblings)
  if (hIdx === 0 && nodes[1] && isHeading(nodes[1])) hIdx = 1;
  nodes.forEach((n, i) => {
    if (hIdx > 0 && i < hIdx) intro.append(el('div', 'mb-eyebrow', n));
    else if (i === hIdx) intro.append(el('div', 'mb-title', n));
    else intro.append(el('div', 'mb-lead', n));
  });
  return intro;
}

function buildOutro(nodes) {
  const outro = el('div', 'mb-outro');
  nodes.forEach((n) => {
    outro.append(isCta(n) ? el('div', 'mb-cta', n) : el('div', 'mb-outro-title', n));
  });
  return outro;
}

function buildCard(nodes) {
  const box = el('div', 'mb-box');
  nodes.forEach((n) => {
    if (n.querySelector('picture, img') && !n.textContent.trim()) box.append(el('div', 'mb-img', n));
    else if (isCta(n)) box.append(el('div', 'mb-cta', n));
    else if (isHeading(n)) box.append(el('div', 'mb-card-title', n));
    else box.append(el('div', 'mb-text', n));
  });
  return el('div', 'mb-card', box);
}

export default function decorate(block) {
  if (block.querySelector('.mb-inner')) return;
  const rows = [...block.children];
  const firstCard = rows.findIndex((r) => r.querySelector('picture, img'));
  let lastCard = -1;
  rows.forEach((r, i) => {
    if (r.querySelector('picture, img')) lastCard = i;
  });
  const inner = el('div', 'mb-inner');
  const introRows = firstCard < 0 ? rows : rows.slice(0, firstCard);
  const introNodes = introRows.flatMap(cellNodes);
  if (introNodes.length) inner.append(buildIntro(introNodes));
  if (firstCard >= 0) {
    const cards = el('div', 'mb-cards');
    rows.slice(firstCard, lastCard + 1).forEach((r) => cards.append(buildCard(cellNodes(r))));
    inner.append(cards);
    const outroNodes = rows.slice(lastCard + 1).flatMap(cellNodes);
    if (outroNodes.length) inner.append(buildOutro(outroNodes));
  }
  block.replaceChildren(inner);
  // source buttons carry their label twice (.btn-title / .btn-title--large, one per breakpoint)
  block.querySelectorAll('.mb-cta a').forEach((a) => {
    if (a.querySelector('.btn-title')) return;
    const label = a.textContent.trim();
    if (!label) return;
    a.append(el('span', 'btn-title', ...a.childNodes), ' ', el('span', 'btn-title-large', label));
  });
}
