/**
 * feature-cards: section head (kicker + title) over a USP card carousel and a closing CTA.
 *
 * Authoring rows:
 *   head rows (no image): kicker heading (h1/h2, light) + title heading (<strong> = bold run)
 *   card rows: cell 1 picture; cell 2 <h3> title, <p> text, <p><a href>link label</a></p>
 *   trailing rows after the cards: CTA paragraph (<em><a> = outline button)
 * Each card is one link (the authored link label stays as the arrow's accessible text).
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

const hasMedia = (row) => !!row.querySelector('picture, img');

function navButton(dir, label) {
  const b = el('button', 'nav-btn');
  b.type = 'button';
  b.dataset[dir] = '';
  const glyph = el('span', `zi zi-chevron-${dir === 'prev' ? 'left' : 'right'} icon-chevron-${dir === 'prev' ? 'left' : 'right'}`);
  glyph.setAttribute('aria-hidden', 'true');
  b.append(glyph, el('span', 'sr-only', label));
  return b;
}

function buildCard(row, index, total) {
  const pic = row.querySelector('picture, img');
  const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
  const ps = [...row.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img'));
  // groups: the card link is the link-only paragraph; an inline link in the copy stays in the text
  const linkOnly = ps.find((p) => p.querySelector('a')
    && p.textContent.trim() === p.querySelector('a').textContent.trim());
  const linkP = (row.closest('.groups') && linkOnly) || ps.find((p) => p.querySelector('a'));
  const link = linkP ? linkP.querySelector('a') : null;
  const card = el('article', 'ucard');
  if (link) {
    // the source's whole-card overlay link, named after the card title (presentational copy)
    const overlay = el('a', 'ucard-link', el('span', 'sr-only', (heading || link).textContent));
    overlay.href = link.href;
    card.append(overlay);
  }
  const body = el('div', 'ucard-body');
  if (heading) body.append(wrapNode(heading, 'ucard-title'));
  ps.filter((p) => p !== linkP).forEach((p) => body.append(wrapNode(p, 'ucard-text')));
  if (link) {
    const more = el('a', 'ucard-more');
    more.href = link.href;
    const arrow = el('span', 'ucard-arrow');
    const glyph = el('span', 'zi zi-arrow-right icon-arrow-right');
    glyph.setAttribute('aria-hidden', 'true');
    arrow.append(glyph);
    more.append(wrapNode(linkP, 'sr-only'), arrow);
    link.replaceWith(...link.childNodes);
    body.append(more);
  }
  const container = el('div', 'ucard-container');
  if (pic) container.append(wrapNode(pic, 'ucard-img'));
  container.append(body);
  card.append(container);
  const li = el('li', '', card);
  li.setAttribute('aria-label', `${index + 1} van ${total}`);
  return li;
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
  const firstCard = rows.findIndex(hasMedia);
  const headRows = firstCard < 0 ? rows : rows.slice(0, firstCard);
  const cardRows = rows.filter(hasMedia);
  const lastCard = firstCard < 0 ? -1 : rows.indexOf(cardRows[cardRows.length - 1]);
  const tailRows = lastCard < 0 ? [] : rows.slice(lastCard + 1);

  const inner = el('div', 'why-inner');
  const head = el('div', 'sec-head');
  headRows.forEach((r) => {
    const nodes = [...r.querySelectorAll('h1, h2, h3, h4, h5, h6, p')];
    // a link paragraph in the head row is the head CTA (light variant), not a title
    const headings = nodes.filter((n) => !(n.tagName === 'P' && n.querySelector('a')));
    nodes.forEach((h) => {
      if (!headings.includes(h)) {
        head.append(wrapNode(h, 'why-head-cta'));
        return;
      }
      const i = headings.indexOf(h);
      head.append(wrapNode(h, headings.length > 1 && i === 0 ? 'why-kicker' : 'why-title'));
    });
  });
  if (head.children.length) inner.append(head);

  const track = el('ul', 'ccar-track');
  cardRows.forEach((r, i) => track.append(buildCard(r, i, cardRows.length)));
  const nav = el('div', 'ccar-nav', navButton('prev', 'Laat vorige zien'), navButton('next', 'Laat volgende zien'));
  // source: <section aria-roledescription="carousel" aria-label="Internet options">
  const ccar = el('section', 'ccar', track, nav);
  ccar.setAttribute('aria-roledescription', 'carousel');
  ccar.setAttribute('aria-label', 'Internet options');
  inner.append(ccar);

  const ctaPs = tailRows.flatMap((r) => [...r.querySelectorAll('p, h2, h3, ul')]);
  if (ctaPs.length) inner.append(el('div', 'why-cta', ...ctaPs));
  block.replaceChildren(inner);
  dualLabel(block);
  addArrow(block, '.why-cta a.button');

  const prev = nav.querySelector('[data-prev]');
  const next = nav.querySelector('[data-next]');
  const step = () => (track.firstElementChild ? track.firstElementChild.offsetWidth + 16 : 0);
  const sync = () => {
    prev.disabled = track.scrollLeft <= 1;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
  };
  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  track.addEventListener('scroll', sync, { passive: true });
  prev.disabled = true;
}
