/**
 * streaming-hero: service hero band (source header60 on a streaming page): orange band with a
 * photo cover from 1024px (a separate banner image stacks above the text below 1024px),
 * headline, check list and CTA buttons.
 *
 * Authoring (content-classified, cell and row order free):
 *   pictures: first = small-screen banner (shown < 1024px), second = desktop cover (>= 1024px)
 *   <h1> (or the first heading) = headline
 *   <ul> = check list; each item may start with the :check: icon notation
 *   CTA paragraphs: <strong><a> = primary button, <em><a> = outline button
 *   other paragraphs = text under the headline
 */

function el(tag, className, ...kids) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...kids);
  return e;
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

const isMedia = (n) => n.matches('picture, img') || !!n.querySelector('picture, img');
const isCta = (n) => n.tagName === 'P' && !!n.querySelector('a') && !isMedia(n)
  && n.textContent.trim() === n.querySelector('a').textContent.trim();

export default function decorate(block) {
  if (block.querySelector(':scope > .sh-hero')) return;
  const nodes = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => nodes.push(...cell.children));
  const media = nodes.filter(isMedia);
  const title = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const lists = nodes.filter((n) => n.matches('ul, ol'));
  const ctas = nodes.filter(isCta);
  const texts = nodes.filter((n) => n.tagName === 'P' && !isMedia(n) && !ctas.includes(n));

  const hero = el('div', 'sh-hero');
  if (media[0]) hero.append(el('div', 'sh-img', media[0]));
  if (media[1]) hero.append(el('div', 'sh-bg', media[1]));
  const img = hero.querySelector('img');
  if (img) {
    img.loading = 'eager';
    img.setAttribute('fetchpriority', 'high');
  }

  const col = el('div', 'sh-col');
  if (title) col.append(el('div', 'sh-title', title));
  texts.forEach((n) => col.append(el('div', 'sh-text', n)));
  lists.forEach((n) => col.append(el('div', 'sh-checks', n)));
  if (ctas.length) col.append(el('div', 'sh-ctas', ...ctas));
  // leftovers stay visible rather than vanish
  nodes.filter((n) => !hero.contains(n) && !col.contains(n)).forEach((n) => col.append(n));

  hero.append(el('div', 'sh-content', col));
  block.replaceChildren(hero);
  glyphify(col);
  dualLabel(col);
}
