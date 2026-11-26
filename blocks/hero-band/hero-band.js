/**
 * hero-band: campaign band, photo + headline, sub line, CTAs and legal line.
 *
 * Authoring (content-classified, row order free):
 *   pictures: first = mobile image (shown < 768px), second = desktop background (>= 768px)
 *   heading (h1/h2) or the first text paragraph = headline (bold runs in <strong>)
 *   next text paragraph before the CTAs = sub line
 *   CTA paragraphs: <strong><a> = dark button, <em><a> = outline button
 *   text paragraphs after the CTAs = legal line
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    let kids = [...cell.children];
    if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].querySelector('picture, img')
      && kids[0].childNodes.length > 1) {
      kids = [...kids[0].childNodes].map((n) => {
        if (n.nodeType === 1) return n;
        // HARNESS-ONLY fallback: bare text in a media-led wrapper (never in DA content)
        if (n.textContent.trim()) {
          const p = document.createElement('p');
          p.append(n);
          return p;
        }
        return null;
      }).filter(Boolean);
    }
    out.push(...kids);
  });
  return out;
}

const isMedia = (n) => n.matches('picture, img') || !!n.querySelector('picture, img');
// a CTA paragraph holds links only; a sentence with an inline link stays copy (source ziggo-go banner)
const linkText = (n) => [...n.querySelectorAll('a')].map((a) => a.textContent).join('').trim();
const isCta = (n) => n.tagName === 'P' && !!n.querySelector('a') && !isMedia(n)
  && linkText(n).replace(/\s+/g, '') === n.textContent.trim().replace(/\s+/g, '');

/* source buttons carry their label twice (source .btn-title / .btn-title--large, one shown per
   breakpoint); mirror that so the delivered link text matches the source */
function dualLabel(scope) {
  // the closing banner's plain text link is a source button too (cluster-article)
  const sel = scope.classList.contains('banner') ? '.hero-ctas a' : 'a.button';
  scope.querySelectorAll(sel).forEach((a) => {
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

/* ==== BEGIN hero-band (listing) variant — owned by archetype-listing; scoped to .hero-band.listing
   source zenderoverzicht hero: gradient band, centred h1 + sub, category link strip, and an info
   notification (second cell: heading + body) in a centred half column.
   @ew-exempt chrome: the notification close button label "Sluit notificatie" (source sr-only)
   ==== */
function listingGlyph(name) {
  const g = document.createElement('span');
  g.className = `zi zi-${name}`;
  g.setAttribute('aria-hidden', 'true');
  return g;
}

function decorateListing(block) {
  if (block.querySelector('.hero-content')) return;
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const headCell = cells.find((c) => c.querySelector('h1')) || cells[0];
  const noteCell = cells.find((c) => c !== headCell && c.textContent.trim());
  const col = document.createElement('div');
  col.className = 'hero-col';
  if (headCell) {
    const kids = [...headCell.children];
    const title = kids.find((n) => /^H[1-6]$/.test(n.tagName));
    const sub = kids.find((n) => n !== title && /^H[1-6]$/.test(n.tagName));
    const links = kids.find((n) => /^(UL|OL)$/.test(n.tagName));
    if (title) col.append(wrapNode(title, 'hero-title'));
    if (sub) col.append(wrapNode(sub, 'hero-sub'));
    if (links) {
      const nav = wrapNode(links, 'hero-catlinks');
      col.append(nav);
    }
    kids.filter((n) => !col.contains(n)).forEach((n) => col.append(n));
  }
  if (noteCell) {
    const note = document.createElement('div');
    note.className = 'hero-note';
    note.setAttribute('role', 'status');
    const text = document.createElement('div');
    text.className = 'hero-note-text';
    text.append(...noteCell.childNodes);
    const icon = document.createElement('div');
    icon.className = 'hero-note-icon';
    icon.append(listingGlyph('information-circle'));
    const close = document.createElement('div');
    close.className = 'hero-note-close';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'hero-note-btn';
    const sr = document.createElement('span');
    sr.className = 'hero-note-sr';
    sr.textContent = 'Sluit notificatie';
    btn.append(sr, ' ', listingGlyph('close'));
    btn.addEventListener('click', () => {
      note.hidden = true;
    });
    close.append(btn);
    note.append(text, icon, close);
    col.append(wrapNode(note, 'hero-note-row'));
  }
  const content = document.createElement('div');
  content.className = 'hero-content';
  content.append(col);
  const hero = document.createElement('div');
  hero.className = 'hero';
  hero.append(content);
  block.replaceChildren(hero);
}
/* ==== END hero-band (listing) variant ==== */

export default function decorate(block) {
  if (block.classList.contains('listing')) {
    decorateListing(block);
    return;
  }
  const nodes = collectNodes(block);
  if (!nodes.length) return;
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  // a picture paragraph in the heading's cell is a badge above the title (certification mark)
  const badge = heading ? nodes.find((n) => isMedia(n) && n.parentElement === heading.parentElement
    && !n.textContent.trim()) : null;
  const media = nodes.filter((n) => isMedia(n) && n !== badge);
  const ctas = nodes.filter(isCta);
  const firstCta = nodes.indexOf(ctas[0]);
  const texts = nodes.filter((n) => n.tagName === 'P' && !isMedia(n) && !isCta(n));
  const before = texts.filter((n) => firstCta < 0 || nodes.indexOf(n) < firstCta);
  const after = texts.filter((n) => firstCta >= 0 && nodes.indexOf(n) > firstCta);
  // a text line authored above the h1 is the eyebrow over the headline (source terugkijken)
  const eyebrow = heading && block.classList.contains('article')
    ? before.find((n) => nodes.indexOf(n) < nodes.indexOf(heading)) : null;
  if (eyebrow) before.splice(before.indexOf(eyebrow), 1);
  const title = heading || before.shift();
  // the sub line: the first text paragraph before the CTAs, else a second heading (h1 + h2)
  const sub = before.shift()
    || nodes.find((n) => n !== title && /^H[1-6]$/.test(n.tagName)) || null;

  const hero = document.createElement('div');
  hero.className = 'hero';
  if (media[0]) hero.append(wrapNode(media[0], 'hero-img'));
  if (media[1]) hero.append(wrapNode(media[1], 'hero-bg'));
  const img = hero.querySelector('img');
  if (img) {
    img.loading = 'eager';
    img.setAttribute('fetchpriority', 'high');
  }

  const col = document.createElement('div');
  col.className = 'hero-col';
  if (badge) col.append(wrapNode(badge, 'hero-badge'));
  if (eyebrow) col.append(wrapNode(eyebrow, 'hero-eyebrow'));
  if (title) col.append(wrapNode(title, 'hero-title'));
  if (sub) col.append(wrapNode(sub, 'hero-sub'));
  before.forEach((n) => col.append(wrapNode(n, 'hero-sub')));
  if (ctas.length) {
    const actions = document.createElement('div');
    actions.className = 'hero-ctas';
    actions.append(...ctas);
    col.append(actions);
  }
  after.forEach((n) => col.append(wrapNode(n, 'hero-legal')));
  // leftovers (lists, extra headings) stay visible rather than vanish
  nodes.filter((n) => !hero.contains(n) && !col.contains(n)).forEach((n) => col.append(n));

  const content = document.createElement('div');
  content.className = 'hero-content';
  content.append(col);
  hero.append(content);
  block.replaceChildren(hero);
  dualLabel(block);
}
