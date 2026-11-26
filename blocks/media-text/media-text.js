/**
 * media-text: two-column band, picture beside a text column (source hero-container grouping).
 *
 * Authoring:
 *   row 1, two cells: the picture cell and the text cell, in desktop reading order
 *     (left first); below 768px the picture always stacks on top.
 *     Text cell: heading + paragraphs / list / CTA paragraph. A leading picture-only
 *     paragraph turns the column into an icon-led group card (icon row, title, text).
 *   further rows, two cells (optional): accordion items appended under the text column —
 *     cell 1 the item title (<p>), cell 2 the item body.
 * Variants: half (6/6 columns, plain picture), light (gray band), accent (orange compact
 *   title), fill (60vh band from 1024px), tips (80vh band on small screens, icon centred).
 * Behaviour (observed on live): accordion body slides open in .3s, chevron flips at once.
 */

let uid = 0;

function el(tag, className, ...kids) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...kids);
  return e;
}

const isPictureOnly = (n) => !!n && n.matches('p, div')
  && !!n.querySelector('picture, img') && !n.textContent.trim();
const hasHeading = (n) => !!n.querySelector('h1, h2, h3, h4, h5, h6');

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

function toggle(header, body) {
  const open = header.getAttribute('aria-expanded') === 'true';
  header.setAttribute('aria-expanded', String(!open));
  if (open) {
    body.hidden = true;
    return;
  }
  body.hidden = false;
  const h = body.scrollHeight;
  body.style.height = '0px';
  body.classList.add('is-sliding');
  requestAnimationFrame(() => {
    body.style.height = `${h}px`;
  });
  body.addEventListener('transitionend', () => {
    body.style.height = '';
    body.classList.remove('is-sliding');
  }, { once: true });
}

function buildItem(cells) {
  uid += 1;
  const id = `mt-acc-${uid}`;
  const title = el('div', 'acc-title', ...cells[0].childNodes);
  const chevron = el('span', 'acc-chevron');
  chevron.setAttribute('aria-hidden', 'true');
  const header = el('div', 'acc-header', title, chevron);
  header.setAttribute('role', 'button');
  header.tabIndex = 0;
  header.setAttribute('aria-expanded', 'false');
  header.setAttribute('aria-controls', id);
  const body = el('div', 'acc-body');
  cells.slice(1).forEach((c) => body.append(...c.childNodes));
  body.id = id;
  body.hidden = true;
  header.addEventListener('click', () => toggle(header, body));
  header.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle(header, body);
    }
  });
  return el('div', 'acc', header, body);
}

export default function decorate(block) {
  if (block.querySelector('.mt-row')) return;
  const rows = [...block.children];
  const first = rows.shift();
  if (!first) return;
  const cells = [...first.children];
  let textCell = cells.find(hasHeading)
    || cells.find((c) => !isPictureOnly(c.firstElementChild)) || null;
  let mediaCell = cells.find((c) => c !== textCell && c.querySelector('picture, img')) || null;
  if (!textCell && !mediaCell) return;
  if (textCell === mediaCell) textCell = null;
  if (!mediaCell && cells.length > 1) [mediaCell] = cells.filter((c) => c !== textCell);

  const textCol = el('div', 'mt-col mt-text');
  if (textCell) {
    const nodes = [...textCell.children];
    if (isPictureOnly(nodes[0])) {
      const icon = nodes.shift();
      const body = el('div', 'mt-body', ...nodes);
      textCol.append(el('div', 'mt-group', el('div', 'mt-icon', icon), body));
    } else {
      textCol.append(el('div', 'mt-copy', ...nodes));
    }
  }
  const items = rows.filter((r) => r.children.length >= 2)
    .map((r) => buildItem([...r.children].map(ensureP)));
  if (items.length) {
    (textCol.firstElementChild || textCol).append(el('div', 'acc-group', ...items));
  }
  // single-cell trailing rows stay visible under the text column
  const host = textCol.firstElementChild || textCol;
  rows.filter((r) => r.children.length === 1)
    .forEach((r) => host.append(...r.firstElementChild.childNodes));

  const mediaCol = el('div', 'mt-col mt-media');
  if (mediaCell) mediaCol.append(el('div', 'mt-frame', ...mediaCell.childNodes));

  const row = el('div', 'mt-row');
  const mediaFirst = mediaCell && textCell && cells.indexOf(mediaCell) < cells.indexOf(textCell);
  block.classList.add(mediaFirst ? 'media-first' : 'text-first');
  if (mediaFirst) row.append(mediaCol, textCol);
  else row.append(textCol, mediaCol);
  block.replaceChildren(el('div', 'mt-inner', row));
  // source buttons carry their label twice (.btn-title / .btn-title--large, one per breakpoint)
  block.querySelectorAll('a.button').forEach((a) => {
    if (a.querySelector('.btn-title')) return;
    const label = a.textContent.trim();
    if (!label) return;
    a.append(el('span', 'btn-title', ...a.childNodes), ' ', el('span', 'btn-title-large', label));
  });
}
