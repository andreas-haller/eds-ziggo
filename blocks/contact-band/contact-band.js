/**
 * contact-band: orange "questions?" band with a white box of contact channels
 * (source checkout contact module).
 *
 * Authoring rows:
 *   head row (headings only): <h2> title, optional <h3> sub line
 *   one row per channel: <p> icon image, <h4> channel name, <p> text,
 *     <p><a>:glyph: label</a></p> link (glyph = ziggo-ui-icon-v22 name, e.g. product-phone)
 */

function el(tag, className, ...kids) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...kids);
  return e;
}

function wrap(node, className) {
  return node ? el('div', className, node) : null;
}

function add(parent, ...kids) {
  kids.filter(Boolean).forEach((k) => parent.append(k));
  return parent;
}

const isMedia = (n) => n.matches('picture, img') || !!n.querySelector('picture, img');
const isHeading = (n) => /^H[1-6]$/.test(n.tagName);

/* icon markers in the link: pipeline span.icon -> glyph span; raw :name: off-pipeline */
function glyphify(a) {
  a.querySelectorAll('span.icon').forEach((span) => {
    const cls = [...span.classList].find((c) => c.startsWith('icon-'));
    span.replaceChildren();
    span.classList.add('zi', `zi-${cls ? cls.slice(5) : ''}`);
    span.setAttribute('aria-hidden', 'true');
  });
  // HARNESS-ONLY fallback: raw :name: notation (the delivery pipeline emits span.icon)
  const first = a.firstChild;
  if (!a.querySelector('.zi') && first && first.nodeType === Node.TEXT_NODE) {
    const m = first.textContent.match(/^\s*:([a-z0-9-]+):\s*/);
    if (m) {
      first.splitText(m[0].length);
      const span = el('span', `icon icon-${m[1]} zi zi-${m[1]}`);
      span.setAttribute('aria-hidden', 'true');
      a.replaceChild(span, first);
    }
  }
}

/* source buttons carry their label twice (.btn-title / .btn-title--large, one per breakpoint) */
function dualLabel(a) {
  if (a.querySelector('.btn-title')) return;
  const icon = a.querySelector('.zi');
  const kids = [...a.childNodes].filter((n) => n !== icon);
  const title = el('span', 'btn-title', ...kids);
  const large = el('span', 'btn-title-large', title.textContent.trim());
  a.append(title, ' ', large);
  if (icon) icon.after(' ');
}

export default function decorate(block) {
  if (block.querySelector('.cb-inner')) return;
  block.querySelectorAll('a').forEach((a) => glyphify(a));
  const head = el('div', 'cb-head');
  const grid = el('div', 'cb-grid');
  [...block.children].forEach((row) => {
    const nodes = [];
    [...row.children].forEach((cell) => nodes.push(...cell.children));
    // head row: headings only, or a heading + sub line paragraph without a picture
    if (nodes.length && (nodes.every(isHeading) || (nodes.some(isHeading) && !nodes.some(isMedia)
      && !nodes.some((n) => n.querySelector('a'))))) {
      head.append(...nodes);
      return;
    }
    const icon = nodes.find(isMedia);
    const link = nodes.find((n) => n.tagName === 'P' && n.querySelector('a') && !isMedia(n));
    const texts = nodes.filter((n) => n.tagName === 'P' && n !== icon && n !== link);
    // the channel name: a heading, else (cards variant) the first text paragraph
    const title = nodes.find(isHeading) || (texts.length > 1 ? texts.shift() : null);
    if (link) {
      const a = link.querySelector('a');
      a.classList.remove('button', 'primary', 'secondary', 'accent');
      a.classList.add('cb-btn');
      glyphify(a);
      dualLabel(a);
      link.classList.remove('button-wrapper');
    }
    const col = add(el('div', 'cb-col'), wrap(icon, 'cb-icon'), wrap(title, 'cb-title'));
    if (texts.length) col.append(el('div', 'cb-text', ...texts));
    add(col, wrap(link, 'cb-link'));
    grid.append(col);
  });
  const inner = el('div', 'cb-inner');
  if (head.children.length) inner.append(head);
  if (grid.children.length) inner.append(el('div', 'cb-box', grid));
  block.replaceChildren(inner);
}
