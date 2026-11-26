/**
 * media-carousel: centred-slide entertainment carousel with peeking neighbours.
 *
 * Authoring: one row per slide.
 *   cell 1: picture(s): first = portrait (mobile), second = landscape (desktop)
 *   cell 2: title (<h3> or <p>), sub line <p>, slide link <p><a>accessible label</a></p>
 *     (plain link = whole-slide link), CTA <p><em><strong><a> (light button)
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

function navButton(dir, label) {
  const b = el('button', 'nav-btn');
  b.type = 'button';
  b.dataset[dir] = '';
  const glyph = el('span', `zi zi-chevron-${dir === 'prev' ? 'left' : 'right'} icon-chevron-${dir === 'prev' ? 'left' : 'right'}`);
  glyph.setAttribute('aria-hidden', 'true');
  b.append(glyph, el('span', 'sr-only', label));
  return b;
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

/* source CTA arrow: an aria-hidden icon-font span inside the button */
function addArrow(scope, selector) {
  scope.querySelectorAll(selector).forEach((a) => {
    if (a.querySelector('.btn-arrow')) return;
    const arrow = document.createElement('span');
    arrow.className = 'btn-arrow zi zi-arrow-right icon-arrow-right';
    arrow.setAttribute('aria-hidden', 'true');
    a.append(arrow);
  });
}

export default function decorate(block) {
  const rows = [...block.children];
  const track = el('ul', 'mcar-track');
  rows.forEach((row, i) => {
    const media = [...row.querySelectorAll('picture')];
    const pics = media.length ? media : [...row.querySelectorAll('img')];
    const nodes = [...row.querySelectorAll(':scope > div > *')]
      .filter((n) => !n.querySelector('picture, img') && !n.matches('picture, img'));
    const ctas = nodes.filter((n) => n.tagName === 'P' && n.querySelector('a.button, strong a, em a'));
    const links = nodes.filter((n) => n.tagName === 'P' && n.querySelector('a') && !ctas.includes(n));
    const texts = nodes.filter((n) => !ctas.includes(n) && !links.includes(n));
    const slide = el('li', 'mslide');
    slide.setAttribute('aria-label', `${i + 1} van ${rows.length}`);
    const bg = el('div', 'mslide-bg');
    pics.forEach((p, k) => bg.append(wrapNode(p, k === 0 ? 'bg-sm' : 'bg-lg')));
    slide.append(bg);
    links.forEach((p) => slide.append(wrapNode(p, 'mslide-link')));
    const text = el('div', 'mslide-text');
    texts.forEach((n, k) => text.append(wrapNode(n, k === 0 ? 'mslide-title' : 'mslide-sub')));
    const content = el('div', 'mslide-content', text);
    if (ctas.length) content.append(el('div', 'mslide-cta', ...ctas));
    slide.append(content);
    track.append(slide);
  });
  const nav = el('div', 'mcar-nav', navButton('prev', 'Laat vorige zien'), navButton('next', 'Laat volgende zien'));
  const mcar = el('div', 'mcar', nav, track);
  mcar.setAttribute('aria-label', 'Entertainment');
  block.replaceChildren(mcar);
  dualLabel(block);
  addArrow(block, '.mslide-cta a.button');

  const n = track.children.length;
  let index = n > 1 ? 1 : 0;
  const go = (d) => {
    index = (index + d + n) % n;
    track.style.setProperty('--i', index);
  };
  track.style.setProperty('--i', index);
  nav.querySelector('[data-prev]').addEventListener('click', () => go(-1));
  nav.querySelector('[data-next]').addEventListener('click', () => go(1));
}
