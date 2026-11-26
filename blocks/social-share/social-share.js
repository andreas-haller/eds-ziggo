/**
 * social-share: row of round-cornered share buttons on a light band (source social-share).
 *
 * Authoring: one row per network.
 *   cell 1: the glyph as icon notation, e.g. :facebook: :linkedin: :mail: :whatsapp:
 *   cell 2: the share link; its text is the button's accessible name (shown to screen readers)
 * The glyph name also picks the button colour; whatsapp only shows on small screens.
 * @ew-exempt metadata: the glyph key cell (cell 1) is never displayed as text
 */

/* ziggo-ui-icon-v22 code points (source .icon-* rules) */
const GLYPHS = {
  facebook: '[',
  linkedin: '`',
  mail: 'F',
  whatsapp: 'Z',
};

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
  if (m) {
    const p = [...scope.querySelectorAll('p')].find((n) => n.textContent.includes(m[0]));
    if (p && p.textContent.trim() === m[0]) p.remove();
  }
  return m ? m[1] : '';
}

export default function decorate(block) {
  if (block.querySelector('.share-row')) return;
  const row = el('div', 'share-row');
  [...block.children].forEach((r) => {
    const a = r.querySelector('a[href]');
    if (!a) return;
    const cells = [...r.children];
    const name = takeGlyph(cells.length > 1 ? cells[0] : r);
    a.className = `share-btn share-btn-${name}`;
    a.removeAttribute('title');
    a.setAttribute('aria-label', a.textContent.trim());
    const label = el('span', 'share-label', ...a.childNodes);
    const g = el('span', `zi icon-${name} share-glyph`);
    g.setAttribute('aria-hidden', 'true');
    g.dataset.glyph = GLYPHS[name] || '';
    a.append(g, label);
    // the link moves with its paragraph (shown inline, as the source anchors are)
    const host = a.closest('p') || a;
    if (row.childNodes.length) row.append('\n');
    row.append(host);
  });
  const share = el('div', 'share', row);
  block.replaceChildren(el('div', 'share-inner', share));
}
