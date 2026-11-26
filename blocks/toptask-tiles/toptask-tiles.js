/**
 * toptask-tiles: row of linked task tiles under the hero (icon-font glyph, label, sub text).
 *
 * Authoring: one row per tile.
 *   cell 1: the glyph as icon notation, e.g. :product-tv: (ziggo-ui-icon-v22 glyph name)
 *   cell 2: <p><a href>label</a></p> + <p>sub text</p> (sub text is hidden in the source design)
 * The whole tile is the link (card-as-link: the authored anchor is unwrapped, EW6).
 * @ew-exempt metadata: the glyph key cell (cell 1) is never displayed as text
 */

function el(tag, className, ...kids) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...kids);
  return e;
}

/* read (and remove) the icon marker: pipeline span.icon, or raw :name: off-pipeline */
function takeGlyph(scope) {
  const span = scope.querySelector('span.icon');
  if (span) {
    const cls = [...span.classList].find((c) => c.startsWith('icon-'));
    span.remove();
    return cls ? cls.slice(5) : '';
  }
  // HARNESS-ONLY fallback: raw icon notation (the delivery pipeline emits span.icon)
  const m = scope.textContent.match(/:([a-z0-9-]+):/);
  return m ? m[1] : '';
}

export default function decorate(block) {
  const grid = el('div', 'toptask');
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find((c) => !c.querySelector('a')) || null;
    const textCell = cells.find((c) => c.querySelector('a')) || cells[cells.length - 1];
    if (!textCell) return;
    const link = textCell.querySelector('a');
    const glyph = iconCell ? takeGlyph(iconCell) : takeGlyph(textCell);
    const tile = el('a', 'tile');
    tile.href = link ? link.href : '#';
    const icon = el('span', `tile-icon zi zi-${glyph}`);
    icon.setAttribute('aria-hidden', 'true');
    const chevron = el('span', 'zi zi-chevron-right icon-chevron-right');
    chevron.setAttribute('aria-hidden', 'true');
    const ps = [...textCell.querySelectorAll('p')];
    const labelP = link ? link.closest('p') : ps[0];
    const title = el('div', 'tile-title', el('div', 'tile-label', labelP || ''), chevron);
    if (link) link.replaceWith(...link.childNodes);
    const sub = el('div', 'tile-text', ...ps.filter((p) => p !== labelP));
    tile.append(el('div', 'tile-container', icon, title, sub));
    grid.append(tile);
  });
  block.replaceChildren(el('div', 'toptask-inner', grid));
}
