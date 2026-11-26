/**
 * streaming-tier-table: subscription tiers side by side as white cards (source streaming-page
 * "Kies het abonnement dat bij jou past").
 *
 * Authoring: a comparison table, ONE COLUMN PER TIER (add a column to add a tier).
 *   head: a one-cell row holding a heading = the section title
 *   name row: the first multi-cell row — per tier the brand line (<p>) or a brand logo
 *     (<p><picture>, centred above the name) and the tier name in bold (<p><strong>)
 *   feature rows: one per attribute — per tier the label, a line break and the value in bold
 *     (or label and bold value as two paragraphs); an :information-circle: notation after
 *     the value paints the info glyph
 *   order row: the row holding the button links — per tier the price paragraph
 *     (<strong>amount</strong> p.m.) and the CTA (<strong><a>)
 * Variants: center (head centred in the middle 8/12); xl (price amount at h1 size);
 *   tabs (below 768px one tier at a time behind tab buttons; the first multi-cell row then
 *   holds the tab labels, one plain paragraph per tier)
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

/* icon markers: pipeline span.icon -> empty glyph span (icon font paints it) */
function glyphify(scope) {
  // HARNESS-ONLY fallback: raw :name: notation (the delivery pipeline emits span.icon)
  const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
  const hits = [];
  while (walker.nextNode()) {
    if (/:[a-z0-9-]+:/.test(walker.currentNode.textContent)) hits.push(walker.currentNode);
  }
  hits.forEach((node) => {
    const m = node.textContent.match(/:([a-z0-9-]+):/);
    const rest = node.splitText(m.index);
    rest.splitText(m[0].length);
    rest.replaceWith(el('span', `icon icon-${m[1]}`));
  });
  scope.querySelectorAll('span.icon').forEach((span) => {
    span.replaceChildren();
    span.setAttribute('aria-hidden', 'true');
  });
}

/* source buttons carry their label twice (.btn-title / .btn-title--large, one per breakpoint) */
function dualLabel(scope) {
  scope.querySelectorAll('a.button').forEach((a) => {
    if (a.querySelector('.btn-title')) return;
    const label = a.textContent.trim();
    if (!label) return;
    const title = el('span', 'btn-title', ...a.childNodes);
    a.append(title, ' ', el('span', 'btn-title-large', label));
  });
}

const divider = (extra = '') => el('div', `stt-divider${extra}`);

export default function decorate(block) {
  if (block.querySelector(':scope > .stt-inner')) return;
  const head = el('div', 'stt-head');
  const rows = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) {
      if (cells[0]) head.append(...ensureP(cells[0]).children);
      return;
    }
    rows.push(cells.map(ensureP));
  });
  const labelRow = block.classList.contains('tabs') ? rows.shift() : null;
  const orderRow = rows.find((cells) => cells.some((c) => c.querySelector('a.button')));
  const rest = rows.filter((r) => r !== orderRow);
  const nameRow = rest.shift();
  const count = Math.max(...rows.map((r) => r.length), 0);

  const grid = el('div', 'stt-grid');
  for (let i = 0; i < count; i += 1) {
    const body = el('div', 'stt-body');
    if (nameRow && nameRow[i]) {
      const name = el('div', 'stt-name', ...nameRow[i].children);
      const logo = [...name.children].find((n) => n.querySelector('picture, img') && !n.textContent.trim());
      if (logo) {
        name.classList.add('stt-name-logo');
        name.prepend(el('div', 'stt-logo', logo));
      }
      body.append(name, divider(' stt-divider-head'));
    }
    rest.forEach((cells) => {
      if (!cells[i]) return;
      body.append(el('div', 'stt-item', ...cells[i].children), divider());
    });
    const card = el('div', 'stt-card', body);
    if (orderRow && orderRow[i]) {
      const foot = el('div', 'stt-foot');
      [...orderRow[i].children].forEach((n) => {
        foot.append(el('div', n.querySelector('a.button') ? 'stt-cta' : 'stt-price', n));
      });
      card.append(foot);
    }
    grid.append(el('div', 'stt-col', card));
  }
  const inner = el('div', 'stt-inner');
  if (head.children.length) inner.append(head);
  if (labelRow) {
    const uid = `stt-${Math.random().toString(36).slice(2, 8)}`;
    const tabs = el('div', 'stt-tabs');
    tabs.setAttribute('role', 'tablist');
    const cols = [...grid.children];
    const select = (idx) => {
      [...tabs.children].forEach((b, j) => {
        b.setAttribute('aria-selected', String(j === idx));
        b.tabIndex = j === idx ? 0 : -1;
        cols[j]?.classList.toggle('stt-active', j === idx);
      });
    };
    cols.forEach((col, i) => {
      // the authored label paragraph moves into the tab (kept editable)
      const btn = el('div', 'stt-tab', ...(labelRow[i] ? labelRow[i].children : []));
      btn.id = `${uid}-tab-${i}`;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-controls', `${uid}-panel-${i}`);
      btn.addEventListener('click', () => select(i));
      col.id = `${uid}-panel-${i}`;
      col.setAttribute('role', 'tabpanel');
      col.setAttribute('aria-labelledby', btn.id);
      tabs.append(btn);
    });
    tabs.addEventListener('keydown', (e) => {
      const idx = [...tabs.children].indexOf(document.activeElement);
      if (idx < 0) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        select(idx);
        return;
      }
      if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      const next = (idx + (e.key === 'ArrowRight' ? 1 : -1) + cols.length) % cols.length;
      select(next);
      tabs.children[next].focus();
    });
    select(0);
    inner.append(tabs);
  }
  inner.append(grid);
  block.replaceChildren(inner);
  glyphify(grid);
  dualLabel(grid);
}
