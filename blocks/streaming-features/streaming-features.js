/**
 * streaming-features: icon-led feature group (source streaming-page "why" / "watch" rows and
 * the contact band): a section head, icon + text features and an optional picture.
 *
 * Authoring rows (classified by content, order free):
 *   head: a one-cell row holding a heading (+ optional lead paragraphs)
 *   media: a one-cell row holding only a picture — the features then stack in one column
 *     beside the picture (picture right from 768px, on top below); without it the
 *     features sit side by side, one per column
 *   feature: a two-cell row — cell 1 the icon picture, cell 2 the title (<h3>, or a
 *     paragraph in bold), text paragraphs and an optional link paragraph
 * Variants: contact (orange band, centred head, white channel cards; link paragraphs paint as
 *   text buttons, a trailing :chevron-right: notation as the glyph); media-start (the picture
 *   sits left of the features from 768px); center (head centred in the middle 8/12).
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
function dualLabel(a) {
  if (a.querySelector('.btn-title')) return;
  const icons = [...a.querySelectorAll('span.icon')];
  const kids = [...a.childNodes].filter((n) => !icons.includes(n));
  const title = el('span', 'btn-title', ...kids);
  const label = title.textContent.trim();
  a.prepend(title, ' ', el('span', 'btn-title-large', label));
  icons.forEach((i) => a.append(' ', i));
}

const isPictureOnly = (n) => !!n && !!n.querySelector('picture, img') && !n.textContent.trim();
const isHeading = (n) => /^H[1-6]$/.test(n.tagName);
const isBoldTitle = (n) => n.tagName === 'P' && n.children.length === 1
  && n.firstElementChild.matches('strong, b') && n.textContent.trim() === n.firstElementChild.textContent.trim();
const isLinkP = (n) => n.tagName === 'P' && n.querySelector('a')
  && n.textContent.trim() === n.querySelector('a').textContent.trim();

function buildFeature(iconCell, bodyCell, contact) {
  const feat = el('div', 'sf-feat');
  const icon = el('div', 'sf-icon');
  icon.append(...iconCell.children);
  const body = el('div', 'sf-body');
  const kids = [...ensureP(bodyCell).children];
  const title = kids.find((n) => isHeading(n) || isBoldTitle(n));
  kids.forEach((n) => {
    if (n === title) {
      body.append(el('div', isHeading(n) ? 'sf-title sf-title-heading' : 'sf-title', n));
    } else if (isLinkP(n)) {
      const a = n.querySelector('a');
      a.classList.remove('button', 'primary', 'secondary', 'accent');
      n.classList.remove('button-wrapper');
      glyphify(n);
      if (contact) {
        a.classList.add('sf-btn');
        dualLabel(a);
      }
      body.append(el('div', 'sf-link', n));
    } else {
      body.append(el('div', 'sf-text', n));
    }
  });
  feat.append(icon, body);
  return feat;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .sf-inner')) return;
  const contact = block.classList.contains('contact');
  const head = el('div', 'sf-head');
  const feats = [];
  let media = null;
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      feats.push(buildFeature(cells[0], cells[1], contact));
      return;
    }
    const cell = cells[0];
    if (!cell) return;
    if (isPictureOnly(cell) && !media) {
      media = el('div', 'sf-media');
      media.append(...cell.children);
      return;
    }
    head.append(...ensureP(cell).children);
  });

  const inner = el('div', 'sf-inner');
  if (head.children.length) inner.append(head);
  if (media) {
    block.classList.add('sf-has-media');
    inner.append(el('div', 'sf-split', el('div', 'sf-list', ...feats), media));
  } else if (feats.length) {
    inner.append(el('div', 'sf-grid', ...feats.map((f, i) => el('div', i ? 'sf-col' : 'sf-col sf-col-lead', f))));
  }
  block.replaceChildren(inner);
}
