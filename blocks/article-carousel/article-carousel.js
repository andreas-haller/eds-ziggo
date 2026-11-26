/**
 * article-carousel: small article-card carousel (Priority "winacties").
 *
 * Authoring: one row per card.
 *   cell 1: picture
 *   cell 2: <h3><a href>card title</a></h3> (the whole card is the link)
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

export default function decorate(block) {
  const rows = [...block.children];
  const track = el('ul', 'acar-track');
  rows.forEach((row, i) => {
    const pic = row.querySelector('picture, img');
    const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
    const link = row.querySelector('a');
    const card = el('li', 'acard');
    card.setAttribute('aria-label', `${i + 1} van ${rows.length}`);
    if (link) {
      const overlay = el('a', 'acard-link', el('span', 'sr-only', link.textContent));
      overlay.href = link.href;
      card.append(overlay);
    }
    if (pic) card.append(wrapNode(pic, 'acard-img'));
    if (heading) card.append(wrapNode(heading, 'acard-title'));
    [...row.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img'))
      .forEach((p) => card.append(wrapNode(p, 'acard-text')));
    if (link) link.replaceWith(...link.childNodes);
    track.append(card);
  });
  const prev = navButton('prev', 'Laat vorige zien');
  const next = navButton('next', 'Laat volgende zien');
  const acar = el('div', 'acar', track, el('div', 'acar-nav', prev, next));
  acar.setAttribute('aria-label', 'Carousel');
  block.replaceChildren(acar);

  const n = track.children.length;
  let index = 0;
  const step = () => (track.firstElementChild ? track.firstElementChild.offsetWidth + 16 : 0);
  const move = () => {
    track.style.transform = `translateX(${-index * step()}px)`;
    prev.disabled = index === 0;
    next.disabled = index >= n - 1;
  };
  prev.disabled = true;
  prev.addEventListener('click', () => {
    index = Math.max(0, index - 1);
    move();
  });
  next.addEventListener('click', () => {
    index = Math.min(n - 1, index + 1);
    move();
  });
}
