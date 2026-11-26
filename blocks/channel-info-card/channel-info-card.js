/**
 * channel-info-card: the channel fact card beside the channel text (source channel-info-block).
 *
 * Authoring (rows classified by content, order free):
 *   a picture/image row          = the channel logo
 *   label | icon notation        = channel number + option glyphs,
 *                                  e.g. Kanaal 001 | :hd: :ziggo-go:
 *   label | list                 = a fact group, one li per item,
 *                                  e.g. Onderdeel van: | Kabel TV / TV Standard
 *   a list (or paragraphs) of links = the links under the card (chevron added)
 * Author the block in the same section as the channel text (default content): the section
 * lays out as text column + card column (card first on small screens).
 * @ew-exempt metadata: the icon-notation cell (glyph keys) is never displayed as text
 */

/* ziggo-ui-icon-v22 code points (source .icon-* rules); unknown names keep an empty glyph */
const GLYPHS = {
  hd: 'S',
  'chevron-right': '+',
};

function el(tag, className, ...kids) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...kids);
  return e;
}

function glyph(name) {
  const g = el('span', `zi icon-${name} cic-glyph`);
  g.setAttribute('aria-hidden', 'true');
  g.dataset.glyph = GLYPHS[name] || '';
  return g;
}

/* icon names from the pipeline's span.icon, or raw :name: notation off-pipeline */
function iconNames(cell) {
  const spans = [...cell.querySelectorAll('span.icon')];
  if (spans.length) {
    return spans.map((s) => [...s.classList].find((c) => c.startsWith('icon-')))
      .filter(Boolean).map((c) => c.slice(5));
  }
  // HARNESS-ONLY fallback: raw icon notation (the delivery pipeline emits span.icon)
  return [...cell.textContent.matchAll(/:([a-z0-9-]+):/g)].map((m) => m[1]);
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

/* source lists read "a, b" — a comma glyph after every item but the last */
function commaList(list) {
  list.classList.add('cic-list');
  const items = [...list.children];
  items.forEach((li, i) => {
    if (i < items.length - 1 && !li.querySelector('.cic-comma')) {
      li.append(el('span', 'cic-comma', ','));
    }
  });
  return list;
}

/* the section's own buttons carry the source dual label (.btn-title / .btn-title--large) */
function dualLabel(section) {
  if (!section) return;
  section.querySelectorAll('.default-content-wrapper a.button').forEach((a) => {
    if (a.querySelector('.btn-title')) return;
    const label = a.textContent.trim();
    if (!label) return;
    const title = el('span', 'btn-title', ...a.childNodes);
    const large = el('span', 'btn-title-large', label);
    large.setAttribute('aria-hidden', 'true');
    a.append(title, ' ', large);
  });
}

export default function decorate(block) {
  if (block.querySelector('.cic-short, .cic-image')) return;
  const image = el('div', 'cic-image');
  const short = el('div', 'cic-short');
  const details = el('div', 'cic-details');
  const links = el('div', 'cic-links');

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    // runtime icon spans carry an <img> too: only a real picture/image makes the logo row
    if (row.querySelector('picture, img:not(.icon img)')) {
      image.append(...row.querySelectorAll('picture, img:not(picture img, .icon img)'));
      return;
    }
    const last = cells[cells.length - 1];
    if (cells.length > 1 && (last.querySelector('span.icon') || /:[a-z0-9-]+:/.test(last.textContent))) {
      const number = el('div', 'cic-number', ...ensureP(cells[0]).childNodes);
      const extras = el('div', 'cic-extras');
      iconNames(last).forEach((name) => extras.append(glyph(name)));
      short.append(number, el('div', 'cic-divider'), extras);
      return;
    }
    if (row.querySelector('a[href]')) {
      row.querySelectorAll('a[href]').forEach((a) => {
        a.classList.add('cic-link');
        if (!a.querySelector('.cic-glyph')) a.prepend(glyph('chevron-right'), ' ');
      });
      cells.forEach((c) => links.append(...c.childNodes));
      return;
    }
    if (cells.length > 1) {
      const header = el('div', 'cic-header', ...ensureP(cells[0]).childNodes);
      const body = el('div', 'cic-body', ...ensureP(cells[1]).childNodes);
      body.querySelectorAll('ul, ol').forEach(commaList);
      details.append(header, body);
      return;
    }
    // leftovers stay visible rather than vanish
    cells.forEach((c) => details.append(...c.childNodes));
  });

  const card = el('div', 'cic');
  [image, short, details, links].filter((n) => n.childNodes.length).forEach((n) => card.append(n));
  block.replaceChildren(card);
  const img = card.querySelector('img');
  if (img) img.loading = 'eager';
  dualLabel(block.closest('.section'));
}
