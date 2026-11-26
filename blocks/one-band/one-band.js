/**
 * one-band: "One van Vodafone & Ziggo" USP card on a full-bleed photo, with a CTA.
 * (The heading above it is default content in its own section, style one-head.)
 *
 * Authoring rows:
 *   background row: picture(s) only: first = mobile background, second = desktop background
 *   USP rows: cell 1 icon picture, cell 2 <p> text (<strong> = bold run)
 *   CTA row: <strong><a> = primary button
 */

function el(tag, className, ...kids) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...kids);
  return e;
}

function wrapNode(node, className) {
  return el('div', className, node);
}

/* source buttons carry their label twice (source .btn-title / .btn-title--large, one shown per
   breakpoint); mirror that so the delivered link text matches the source */
function dualLabel(scope) {
  scope.querySelectorAll('a.button').forEach((a) => {
    if (a.querySelector('.btn-title')) return;
    const label = a.textContent.trim();
    if (!label) return;
    const title = document.createElement('span');
    title.className = 'btn-title';
    title.append(...a.childNodes);
    const large = document.createElement('span');
    large.className = 'btn-title-large';
    large.textContent = label;
    a.append(title, ' ', large);
  });
}

export default function decorate(block) {
  const rows = [...block.children];
  const textOf = (r) => [...r.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img'));
  const bgRow = rows.find((r) => r.querySelector('picture, img') && !textOf(r).length);
  const ctaRows = rows.filter((r) => r !== bgRow && r.querySelector('a') && !r.querySelector('img'));
  const uspRows = rows.filter((r) => r !== bgRow && !ctaRows.includes(r));

  const band = el('div', 'one-splash');
  if (bgRow) {
    const pics = [...bgRow.querySelectorAll('picture')];
    const media = pics.length ? pics : [...bgRow.querySelectorAll('img')];
    media.forEach((m, i) => band.append(wrapNode(m, i === 0 ? 'bg bg-sm' : 'bg bg-lg')));
  }
  const inner = el('div', 'one-inner');
  const usps = el('div', 'one-usps');
  uspRows.forEach((r) => {
    const usp = el('div', 'one-usp');
    const pic = r.querySelector('picture, img');
    if (pic) usp.append(wrapNode(pic, 'one-icon'));
    textOf(r).forEach((p) => usp.append(wrapNode(p, 'one-text')));
    usps.append(usp);
  });
  inner.append(el('div', 'one-card', usps));
  const ctas = ctaRows.flatMap((r) => [...r.querySelectorAll('p')]);
  if (ctas.length) inner.append(el('div', 'one-cta', ...ctas));
  band.append(inner);
  block.replaceChildren(band);
  dualLabel(block);
}
