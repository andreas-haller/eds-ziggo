/**
 * priority-band: Priority band on a full-bleed background visual (the live background video's
 * poster; the stream itself is owner-supplied) with title, sub title and a light CTA.
 *
 * Authoring rows:
 *   media row: picture (background visual)
 *   text row: <h2> title, <h3> sub title, CTA <p><em><strong><a> (light button)
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
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const media = nodes.filter((n) => n.matches('picture, img') || n.querySelector('picture, img'));
  const headings = nodes.filter((n) => /^H[1-6]$/.test(n.tagName));
  const ctas = nodes.filter((n) => n.tagName === 'P' && n.querySelector('a') && !media.includes(n));
  const used = [...media, ...headings, ...ctas];
  const rest = nodes.filter((n) => !used.includes(n));

  const prio = el('div', 'prio');
  const mediaBox = el('div', 'prio-media');
  media.forEach((m) => mediaBox.append(wrapNode(m, 'prio-visual')));
  prio.append(mediaBox);
  const col = el('div', 'prio-col');
  headings.forEach((h, i) => col.append(wrapNode(h, i === 0 ? 'prio-title' : 'prio-sub')));
  rest.forEach((n) => col.append(n));
  if (ctas.length) col.append(el('div', 'prio-cta', ...ctas));
  prio.append(el('div', 'prio-content', col));
  block.replaceChildren(prio);
  dualLabel(block);
}
