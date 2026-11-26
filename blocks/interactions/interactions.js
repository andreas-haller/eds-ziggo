/**
 * interactions: contact tabs — a bar above the page on small screens, fixed side tabs from
 * 1024px whose panel slides out on hover (source vfz-interactions).
 *
 * Authoring: one row per tab.
 *   cell 1: the glyph as icon notation, e.g. :product-phone: or :dialogue: (ziggo-ui-icon-v22)
 *   cell 2: the slide-out panel: <p><strong>title</strong></p> + <p>status line</p>
 *   cell 3: the short tab label
 *   optional cell 4: a link — the tab target (the source tabs open the call / chat layers)
 * Author this block in the FIRST section: on small screens the bar sits above the hero.
 * @ew-exempt metadata: the glyph key cell (cell 1) is never displayed as text
 */

const GLYPHS = {
  'product-phone': '%',
  dialogue: 'N',
  chat: 'O',
};

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

/* read (and remove) the icon marker: pipeline span.icon, or raw :name: off-pipeline */
function takeGlyph(scope) {
  const span = scope.querySelector('span.icon');
  if (span) {
    const cls = [...span.classList].find((c) => c.startsWith('icon-'));
    const p = span.closest('p');
    span.remove();
    if (p && !p.textContent.trim() && !p.children.length) p.remove();
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
  if (block.querySelector('.int-item')) return;
  const items = [...block.children].map((row) => {
    const cells = [...row.children];
    const glyph = cells[0] ? takeGlyph(cells[0]) : '';
    const link = cells[3] ? cells[3].querySelector('a') : null;
    const item = el('a', 'int-item');
    // the source tabs are self-links (href="") whose script opens the call / chat layer
    item.href = link ? link.href : '#';
    if (!link) item.addEventListener('click', (e) => e.preventDefault());
    const expanded = el('div', 'int-expanded');
    if (cells[1]) expanded.append(...cells[1].childNodes);
    const strong = expanded.querySelector('strong');
    if (strong && !strong.querySelector('.int-chevron')) {
      const chev = el('span', 'zi int-chevron chevron-icon');
      chev.setAttribute('aria-hidden', 'true');
      strong.append(' ', chev);
    }
    const icon = el('span', `zi int-icon int-icon-${glyph}`);
    icon.setAttribute('aria-hidden', 'true');
    icon.dataset.glyph = GLYPHS[glyph] || '';
    if (glyph === 'dialogue' || glyph === 'chat') icon.append(el('span', 'int-orb int-orb-offline'));
    const text = el('div', 'int-text');
    if (cells[2]) text.append(...ensureP(cells[2]).childNodes);
    item.append(expanded, el('div', 'int-content', icon, text));
    return item;
  });
  const nav = el('nav', 'int-nav', ...items);
  nav.setAttribute('aria-label', 'Interacties');
  block.replaceChildren(nav);
}
