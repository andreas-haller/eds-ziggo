/**
 * swimming-lane: two auto-scrolling (marquee) rows of entertainment cards, with a pause toggle
 * and a closing CTA.
 *
 * Authoring: one row per card, then the CTA row.
 *   card cell 1: picture (card image) + optional picture (channel logo)
 *   card cell 2: <p><a href>accessible card label</a></p> + optional <p> copyright line
 *   CTA row: <em><a> outline button ("Ontdek het allemaal")
 * Cards split into two lanes: lane 1 = first half (rounded up), lane 2 = the rest.
 * Each strip is duplicated for the seamless loop; the copy strips instrumentation (EW4).
 */

const SECONDS_PER_CARD = [255.42857142857142 / 28, 156.72727272727272 / 27];

function el(tag, className, ...kids) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...kids);
  return e;
}

function wrapNode(node, className) {
  return el('div', className, node);
}

function stripInstrumentation(node) {
  node.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  node.removeAttribute('data-prose-index');
  return node;
}

function buildCard(row) {
  const pics = [...row.querySelectorAll('picture')];
  const media = pics.length ? pics : [...row.querySelectorAll('img')];
  const ps = [...row.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img'));
  const labelP = ps.find((p) => p.querySelector('a'));
  const link = labelP ? labelP.querySelector('a') : null;
  const card = el('li', 'lane-card');
  const a = el('a', 'lane-link');
  a.href = link ? link.href : '#';
  if (labelP) a.append(wrapNode(labelP, 'lane-label'));
  if (link) link.replaceWith(...link.childNodes);
  if (media[0]) a.append(wrapNode(media[0], 'lane-img'));
  if (media[1]) a.append(wrapNode(media[1], 'lane-logo'));
  else a.append(el('span', 'lane-logo lane-logo-empty'));
  // hover button (source .vfz-swimming-lane__card-button): presentational, aria-hidden;
  // the link name is the authored label
  const btnLabel = el('span', 'lane-btn', el('span', 'btn-title', 'Bekijk meer'));
  btnLabel.setAttribute('aria-hidden', 'true');
  btnLabel.append(el('span', 'zi zi-arrow-right icon-arrow-right'));
  a.append(btnLabel);
  // copyright line sits inside the card link, as in the source
  ps.filter((p) => p !== labelP).forEach((p) => {
    // inline span like the source copyright (keeps the paragraph's attributes)
    const copy = el('span', '');
    [...p.attributes].forEach((at) => copy.setAttribute(at.name, at.value));
    copy.classList.add('lane-copy');
    copy.append(...p.childNodes);
    a.append(copy);
  });
  card.append(a);
  return card;
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
  const cardRows = rows.filter((r) => r.querySelector('picture, img'));
  const ctaRows = rows.filter((r) => !cardRows.includes(r));
  const half = Math.ceil(cardRows.length / 2);
  const lanes = [cardRows.slice(0, half), cardRows.slice(half)].filter((l) => l.length);

  const root = el('div', 'lane');
  root.dataset.paused = 'true';
  const skip = el('a', 'sr-only', 'Sla aanbevelingen over');
  skip.href = '#lane-all';
  root.append(skip);
  lanes.forEach((laneRows, i) => {
    const strip = el('ul', 'lane-strip');
    laneRows.forEach((r) => strip.append(buildCard(r)));
    const copy = stripInstrumentation(strip.cloneNode(true));
    // the loop copy mirrors the source's runtime duplicate (aria-hidden, unfocusable)
    copy.setAttribute('aria-hidden', 'true');
    copy.querySelectorAll('a').forEach((a) => { a.tabIndex = -1; });
    const rail = el('div', 'lane-rail', strip, copy);
    const perCard = SECONDS_PER_CARD[i] || SECONDS_PER_CARD[SECONDS_PER_CARD.length - 1];
    rail.style.setProperty('--duration', `${perCard * laneRows.length}s`);
    root.append(el('div', 'lane-lanes', rail));
  });

  const controls = el('div', 'lane-controls');
  const all = el('div', 'lane-all');
  all.id = 'lane-all';
  ctaRows.forEach((r) => all.append(...r.querySelectorAll('p')));
  all.querySelectorAll('a').forEach((a) => {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  });
  const toggle = el('button', '');
  toggle.type = 'button';
  toggle.setAttribute('aria-pressed', 'true');
  const glyph = el('span', 'zi zi-play icon-play');
  glyph.setAttribute('aria-hidden', 'true');
  const toggleLabel = el('span', 'sr-only', 'Afspelen hervatten');
  toggle.append(glyph, toggleLabel);
  controls.append(all, el('div', 'lane-toggle', toggle));
  root.append(controls);
  block.replaceChildren(root);
  addArrow(block, '.lane-all a.button');

  toggle.addEventListener('click', () => {
    const paused = root.dataset.paused !== 'true';
    root.dataset.paused = String(paused);
    toggle.setAttribute('aria-pressed', String(paused));
    glyph.className = `zi zi-${paused ? 'play' : 'pause'} icon-${paused ? 'play' : 'pause'}`;
    toggleLabel.textContent = paused ? 'Afspelen hervatten' : 'Pauzeren';
  });
}
