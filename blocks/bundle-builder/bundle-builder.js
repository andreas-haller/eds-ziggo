/**
 * bundle-builder: the package configurator of the program pages (source z-sticky-page-sections:
 * builder steps in the content column, order basket in the sticky side column, order bar fixed
 * at the bottom below 1024px).
 *
 * Authoring: one row per item; cell 1 names the item kind (+ "selected" for the preselected
 * card of a group), cell 2 (and 3) carry its content. Rows are rendered in order; consecutive
 * product / promo / card / service rows form one group.
 *   step        <h2> (icon image + title), intro <p>, help trigger <p><em>…</em></p>;
 *               an <h3> title keeps its level (product page "Dit zit er in je pakket")
 *   usp         first <p> = title (starts with :icon:), the rest = collapsed body; consecutive
 *               usp rows form one accordion (source vfz-accordion-item--has-icon)
 *   benefit     <h2>, <p> text, <p><a> link, <h3> question, <ul> answers, <p> answer info
 *   product     optional <p> top ribbon (before the images), <p> mobile + <p> desktop image,
 *               <h3> name, <ul> USPs (each starts with :icon:, a <del> item = not included),
 *               <p><strong>offer</strong> saving</p>, <p><em>bottom ribbon</em></p>;
 *               without images: <h3> + <p> = the "none" choice
 *   addon       <p> image, <h3>, <p> text, <ul> select options, <p> select label,
 *               <p><em>…</em></p> info triggers (shown under the box)
 *   addon-band  <p> icon, <h3>, <p> sub line, <ul> USPs (image + label), optional <p> image
 *   legend      <p> screen-reader name of the next product / promo group
 *   note        <p> logo, <p> text
 *   teaser      <p> image, <h2>, <p> text, <ul> bullets ("teaser hidden" ships it hidden,
 *               as the source does with its A/B teaser)
 *   promo       <p> image, <p> :icon: label, <h3> title, optional <p><em>more</em></p>
 *   card        <p> image, <h3>, <p> text (hardware card)
 *   service     <p> image, <h3>, <p> text (service card)
 *   basket      <p> image, <h3> order title, <p><del>was</del> <strong>now</strong></p>,
 *               <p><em>promotion</em></p>
 *   basket-item <h3>, <p><strong>price</strong></p>, <p> promotion text
 *   basket-total <p> label, then the value: <p><strong>price</strong></p> (+ <p> per text)
 *   basket-cta  <p><strong><a></a></strong></p> primary, <p><a></a></p> secondary
 * @ew-exempt metadata: the kind cell (cell 1) is never displayed as text
 * @ew-exempt form control: the addon <select> options mirror the authored <ul> (kept, hidden)
 * @ew-exempt presentational clone: the mobile order bar repeats basket label, promo and prices
 */

let uid = 0;

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

function sr(text) {
  return el('span', 'sr-only', text);
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

const isMedia = (n) => n.matches('picture, img') || !!n.querySelector('picture, img');
const isEm = (n) => n.tagName === 'P' && !!n.querySelector('em')
  && n.textContent.trim() === n.querySelector('em').textContent.trim();
const isPlain = (n) => n.tagName === 'P' && !isMedia(n) && !isEm(n);

/* icon markers: pipeline span.icon -> icon-font glyph span; raw :name: off-pipeline */
function glyphify(scope) {
  scope.querySelectorAll('span.icon').forEach((span) => {
    const cls = [...span.classList].find((c) => c.startsWith('icon-'));
    span.replaceChildren();
    span.classList.add('zi', `zi-${cls ? cls.slice(5) : ''}`);
    span.setAttribute('aria-hidden', 'true');
  });
  // HARNESS-ONLY fallback: raw :name: notation (the delivery pipeline emits span.icon)
  scope.querySelectorAll('li, p').forEach((n) => {
    if (n.querySelector('.zi')) return;
    const first = n.firstChild;
    if (!first || first.nodeType !== Node.TEXT_NODE) return;
    const m = first.textContent.match(/^\s*:([a-z0-9-]+):\s*/);
    if (!m) return;
    first.splitText(m[0].length);
    const span = el('span', `icon icon-${m[1]} zi zi-${m[1]}`);
    span.setAttribute('aria-hidden', 'true');
    n.replaceChild(span, first);
  });
}

function radioMark() {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('class', 'radio-anim');
  svg.setAttribute('width', '22');
  svg.setAttribute('height', '22');
  svg.setAttribute('viewBox', '0 0 22 22');
  const c = document.createElementNS(ns, 'circle');
  c.setAttribute('cx', '11');
  c.setAttribute('cy', '11');
  c.setAttribute('r', '11');
  const l = document.createElementNS(ns, 'polyline');
  l.setAttribute('points', '6.5 11.2 9.5 14.2 15.5 7.8');
  svg.append(c, l);
  const box = el('div', 'pcard-radio', svg);
  box.setAttribute('aria-hidden', 'true');
  return box;
}

/* radio input + screen-reader name; the visible title stays the authored heading */
function chooser(className, group, checked, label) {
  const input = el('input', 'sr-only');
  input.type = 'radio';
  input.name = group;
  input.checked = checked;
  return el('label', className, input, ...label);
}

/* a help / info trigger: the source <button> opens a layer; the authored <p> stays the text */
function trigger(p, className) {
  const t = el('div', className, p);
  t.setAttribute('role', 'button');
  t.tabIndex = 0;
  return t;
}

/* wrap the text nodes after a leading node into one span (moved, never rebuilt) */
function wrapRest(p, after, className) {
  const rest = [];
  let n = after ? after.nextSibling : p.firstChild;
  while (n) {
    rest.push(n);
    n = n.nextSibling;
  }
  if (rest.length) p.append(el('span', className, ...rest));
}

function selectable(group, cardSel) {
  group.addEventListener('change', (e) => {
    const card = e.target.closest(cardSel);
    if (!card) return;
    group.querySelectorAll(cardSel).forEach((c) => c.classList.toggle('is-selected', c === card));
    card.classList.add('is-animating');
    setTimeout(() => card.classList.remove('is-animating'), 1800);
  });
}

function buildStep(nodes) {
  const step = el('div', 'step');
  const h = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  add(step, wrap(h, 'step-title'));
  nodes.filter((n) => n !== h).forEach((n) => {
    if (isEm(n)) step.append(trigger(n, 'help-trigger'));
    else step.append(wrap(n, 'step-intro'));
  });
  return step;
}

function slide(header, body) {
  const open = header.getAttribute('aria-expanded') === 'true';
  header.setAttribute('aria-expanded', String(!open));
  header.parentElement.classList.toggle('is-open', !open);
  body.hidden = open;
}

/* one usp accordion item: icon + title header toggles the authored body */
function buildUsp(nodes) {
  uid += 1;
  const id = `bb-usp-${uid}`;
  const [first, ...rest] = nodes;
  const icon = first ? first.querySelector('.zi') : null;
  if (icon) icon.classList.add('usp-icon');
  const chevron = el('span', 'zi zi-chevron-down usp-chevron');
  chevron.setAttribute('aria-hidden', 'true');
  const header = add(el('div', 'usp-header'), icon, wrap(first, 'usp-title'), chevron);
  header.setAttribute('role', 'button');
  header.tabIndex = 0;
  header.setAttribute('aria-expanded', 'false');
  header.setAttribute('aria-controls', id);
  const body = el('div', 'usp-body', ...rest);
  body.id = id;
  body.hidden = true;
  header.addEventListener('click', () => slide(header, body));
  header.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      slide(header, body);
    }
  });
  return el('div', 'usp', header, body);
}

function buildBenefit(nodes) {
  const h2 = nodes.find((n) => n.tagName === 'H2');
  const h3 = nodes.find((n) => n.tagName === 'H3');
  const ul = nodes.find((n) => n.tagName === 'UL');
  const iq = nodes.indexOf(h3);
  const before = nodes.filter((n, i) => n.tagName === 'P' && (iq < 0 || i < iq));
  const after = nodes.filter((n, i) => n.tagName === 'P' && iq >= 0 && i > iq);
  const how = before.find((n) => n.querySelector('a'));
  const initial = el('div', 'vfb-initial');
  add(initial, wrap(h2, 'vfb-title'));
  before.filter((n) => n !== how).forEach((n) => initial.append(wrap(n, 'vfb-desc')));
  add(initial, wrap(how, 'vfb-how'), wrap(h3, 'vfb-q'));
  if (ul) {
    uid += 1;
    ul.classList.add('yn');
    ul.setAttribute('role', 'radiogroup');
    [...ul.children].forEach((li, i) => {
      const mark = el('span', i === 0 ? 'yn-dot yn-dot-on' : 'yn-dot');
      mark.setAttribute('aria-hidden', 'true');
      const label = el('span', 'yn-label', mark, ' ', ...li.childNodes);
      li.className = i === 0 ? 'yn-opt is-active' : 'yn-opt';
      li.append(chooser('yn-choice', `yn-${uid}`, i === 0, [label]));
    });
    ul.addEventListener('change', (e) => {
      ul.querySelectorAll('.yn-opt').forEach((o) => {
        const on = o.contains(e.target);
        o.classList.toggle('is-active', on);
        o.querySelector('.yn-dot').classList.toggle('yn-dot-on', on);
      });
    });
    initial.append(ul);
  }
  const info = el('div', 'vfb-info', ...after);
  return el('div', 'step', el('div', 'vfb', initial, el('div', 'vfb-main', info)));
}

function buildUsps(ul) {
  glyphify(ul);
  ul.classList.add('pcard-usps');
  [...ul.children].forEach((li) => {
    li.classList.add('pcard-usp');
    const icon = li.querySelector('.zi');
    if (icon) icon.classList.add('pcard-usp-icon');
    const del = li.querySelector('del');
    const label = [...li.childNodes].filter((n) => n !== icon);
    if (del) {
      if (icon) icon.classList.add('pcard-usp-icon-crossed');
      del.prepend(sr('Niet van toepassing'), ' ');
      li.append(el('span', 'pcard-usp-plain', ...(icon ? [icon] : []), ' ', ...label));
    } else {
      const btn = el(
        'span',
        'pcard-usp-btn',
        ...(icon ? [icon] : []),
        ' ',
        el('span', 'pcard-usp-title', ...label),
      );
      btn.setAttribute('role', 'button');
      btn.tabIndex = 0;
      li.append(btn);
    }
  });
  return ul;
}

function buildProduct(nodes, selected, group) {
  const card = el('div', selected ? 'pcard is-selected' : 'pcard');
  const h3 = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const media = nodes.filter(isMedia);
  const name = h3 ? sr(h3.textContent) : sr('');
  card.append(chooser('pcard-label', group, selected, [name]));
  if (!media.length) {
    card.classList.add('pcard-none');
    const body = add(el('div', 'pcard-body'), wrap(h3, 'pcard-title'));
    nodes.filter(isPlain).forEach((n) => body.append(wrap(n, 'pcard-none-label')));
    card.append(body, el('div', 'pcard-footer', radioMark()));
    return card;
  }
  const ih = nodes.indexOf(media[0]);
  const top = nodes.find((n, i) => isPlain(n) && i < ih);
  if (top) card.append(el('div', 'ribbon ribbon-top', top));
  card.append(el('div', 'pcard-img pcard-img-m', media[0]));
  if (media[1]) card.append(el('div', 'pcard-img pcard-img-d', media[1]));
  const content = add(el('div', 'pcard-content'), wrap(h3, 'pcard-title'));
  const ul = nodes.find((n) => n.tagName === 'UL');
  if (ul) content.append(buildUsps(ul));
  const footer = el('div', 'pcard-footer');
  const offer = nodes.find((n, i) => isPlain(n) && i > ih && n.querySelector('strong'));
  if (offer) {
    const strong = offer.querySelector('strong');
    strong.classList.add('ribbon-text');
    wrapRest(offer, strong, 'ribbon-add');
    footer.append(el('div', 'ribbon ribbon-combi', offer));
  }
  footer.append(radioMark());
  content.append(footer);
  card.append(content);
  nodes.filter((n, i) => isEm(n) && i > ih)
    .forEach((n) => card.append(el('div', 'ribbon ribbon-large', n)));
  // leftovers stay visible rather than vanish
  nodes.filter((n) => !card.contains(n)).forEach((n) => content.append(n));
  return card;
}

function buildAddon(nodes) {
  const media = nodes.find(isMedia);
  const h3 = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const ul = nodes.find((n) => n.tagName === 'UL');
  const iu = nodes.indexOf(ul);
  const desc = nodes.filter((n, i) => isPlain(n) && (iu < 0 || i < iu));
  const label = nodes.find((n, i) => isPlain(n) && iu >= 0 && i > iu);
  const body = add(el('div', 'campaign-body'), wrap(h3, 'campaign-ptitle'));
  if (desc.length) body.append(el('div', 'campaign-desc', ...desc));
  if (ul) {
    uid += 1;
    const id = `bb-select-${uid}`;
    const select = el('select', 'select-field');
    select.id = id;
    [...ul.children].forEach((li) => select.append(el('option', '', li.textContent.trim())));
    ul.classList.add('select-source');
    const lab = el('label', 'select-label', ...(label ? label.childNodes : []));
    lab.htmlFor = id;
    if (label) label.remove();
    const chev = el('span', 'zi zi-chevron-down select-button');
    chev.setAttribute('aria-hidden', 'true');
    body.append(el('div', 'select', select, lab, chev, ul));
  }
  const box = el('div', 'campaign', el('div', 'campaign-product', wrap(media, 'campaign-pimg'), body));
  const actions = el('div', 'campaign-actions');
  nodes.filter(isEm).forEach((n, i) => {
    const t = trigger(n, 'campaign-more');
    // the first trigger opens the add-on's own info layer (source aria-label)
    if (i === 0 && h3) {
      t.setAttribute('aria-label', `Open venster met meer informatie over ${h3.textContent.trim()}`);
    }
    actions.append(t);
  });
  return { box, actions };
}

function buildBand(nodes) {
  const media = nodes.filter(isMedia);
  const h3 = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const ul = nodes.find((n) => n.tagName === 'UL');
  const sub = nodes.find(isPlain);
  const iu = nodes.indexOf(ul);
  const icon = media.find((n) => nodes.indexOf(n) < nodes.indexOf(h3));
  const image = media.find((n) => iu >= 0 && nodes.indexOf(n) > iu);
  const title = add(el('div', 'campaign-head-title'), h3, wrap(sub, 'campaign-sub'));
  const band = el('div', 'campaign-band', el(
    'div',
    'campaign-head',
    wrap(icon, 'campaign-head-icon'),
    title,
  ));
  if (ul) {
    ul.classList.add('campaign-usps');
    [...ul.children].forEach((li) => {
      li.classList.add('campaign-usp');
      const pic = li.querySelector('picture') || li.querySelector('img');
      const rest = [...li.childNodes].filter((n) => n !== pic && !n.contains(pic));
      const holder = pic ? [...li.childNodes].find((n) => n === pic || n.contains(pic)) : null;
      if (holder) holder.classList.add('campaign-usp-icon');
      li.append(el('div', 'campaign-usp-title', ...rest));
    });
    band.append(ul);
  }
  if (image) {
    band.classList.add('campaign-band-img');
    band.append(el('div', 'campaign-image', image));
  }
  return band;
}

function buildPromo(nodes, selected, group) {
  const media = nodes.find(isMedia);
  const h3 = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const label = nodes.find(isPlain);
  const more = nodes.find(isEm);
  if (label) {
    glyphify(label);
    const icon = label.querySelector('.zi');
    if (icon) wrapRest(label, icon, 'promo-label-text');
  }
  const card = el('div', selected ? 'promo is-selected' : 'promo');
  card.append(chooser('promo-click', group, selected, [sr(`Selecteer ${h3 ? h3.textContent : ''}`)]));
  card.append(wrap(media, 'promo-img'));
  const footer = el('div', 'promo-footer');
  if (more) {
    const t = trigger(more, 'promo-more');
    if (h3) t.setAttribute('aria-label', `Open venster met meer informatie over ${h3.textContent.trim()}`);
    footer.append(t);
  }
  footer.append(radioMark());
  const content = add(
    el('div', 'promo-content'),
    wrap(label, 'promo-label'),
    wrap(h3, 'promo-title'),
    footer,
  );
  card.append(el('div', 'promo-body', content));
  return card;
}

function buildCard(nodes, prefix) {
  const media = nodes.find(isMedia);
  const h3 = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const texts = nodes.filter(isPlain);
  const body = add(el('div', `${prefix}-body`), wrap(h3, `${prefix}-title`));
  if (texts.length) body.append(el('div', `${prefix}-desc`, ...texts));
  return el('div', prefix, wrap(media, `${prefix}-media`), body);
}

/* price "34,95" -> whole "34," + cents "95" spans (text node split, never rebuilt) */
function splitPrice(holder) {
  if (!holder) return;
  const t = [...holder.childNodes].find((n) => n.nodeType === Node.TEXT_NODE && /\d,\d/.test(n.textContent));
  if (!t) return;
  const i = t.textContent.indexOf(',');
  const cents = t.splitText(i + 1);
  const whole = el('span', 'basket-whole');
  t.replaceWith(whole);
  whole.append(t);
  whole.after(el('span', 'basket-cents', cents));
}

function overlay(text) {
  const o = el('div', 'bb-overlay', sr(text));
  o.hidden = true;
  return o;
}

function buildBasket(parts) {
  const basket = el('aside', 'basket');
  basket.setAttribute('aria-label', 'Je bestelling');
  const top = el('div', 'basket-top', sr('Je bestelling'));
  const body = el('div', 'basket-body', overlay('Laden...'));
  const summary = el('div', 'basket-summary');
  const footer = el('div', 'basket-footer', overlay('Laden...'));
  const bar = { };
  parts.forEach(({ type, cells }) => {
    const nodes = cells[0] ? [...ensureP(cells[0]).children] : [];
    if (type === 'basket') {
      const media = nodes.find(isMedia);
      const h3 = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
      const price = nodes.find((n) => n.tagName === 'P' && n.querySelector('del, strong'));
      const promo = nodes.find(isEm);
      if (price) {
        const del = price.querySelector('del');
        const strong = price.querySelector('strong');
        bar.was = del ? del.textContent.trim() : '';
        bar.now = strong ? strong.textContent.trim() : '';
        splitPrice(del);
        splitPrice(strong);
        if (del) del.before(sr('Van'), ' ');
        if (strong && del) strong.before(sr('Voor'), ' ');
      }
      bar.promo = promo;
      const head = add(
        el('div', 'basket-item basket-item-head'),
        wrap(price, 'basket-price'),
        wrap(h3, 'basket-title'),
      );
      if (promo) head.append(el('p', 'sr-only', 'Dit product heeft de volgende promotie:'));
      add(head, wrap(promo, 'basket-promo'));
      add(top, wrap(media, 'basket-media'), head);
    } else if (type === 'basket-item') {
      const h3 = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
      const price = nodes.find((n) => n.tagName === 'P' && n.querySelector('strong'));
      const texts = nodes.filter((n) => isPlain(n) && n !== price);
      const item = add(
        el('div', 'basket-item basket-item-once'),
        wrap(price, 'basket-price'),
        wrap(h3, 'basket-item-title'),
      );
      if (texts.length) {
        item.append(el('p', 'sr-only', 'Dit product heeft de volgende promotie:'));
        item.append(el('div', 'basket-promo-text', ...texts));
      }
      body.append(item);
    } else if (type === 'basket-total') {
      const first = !summary.children.length;
      // label first, value after it (a third cell, if authored, adds to the value)
      const all = cells.flatMap((c) => [...ensureP(c).children]);
      const label = all.find((n) => n.tagName === 'P' && !n.querySelector('strong')) || null;
      const value = all.filter((n) => n !== label);
      const strong = value.map((v) => v.querySelector('strong')).find(Boolean);
      if (strong) splitPrice(strong);
      else value.forEach((v) => splitPrice(v));
      if (first) bar.label = label;
      // single-product basket: the order bar names the period (source "Per maand")
      const per = value.find((v) => !v.querySelector('strong'));
      if (first && per) bar.per = per;
      summary.append(el(
        'div',
        `basket-row ${first ? 'basket-row-first' : 'basket-row-after'}`,
        wrap(label, 'basket-row-label'),
        el('div', 'basket-row-value', ...value),
      ));
    } else if (type === 'basket-cta') {
      nodes.forEach((n) => {
        if (n.querySelector('a.primary, strong a')) {
          n.classList.add('basket-cta');
          bar.cta = n.querySelector('a');
        } else {
          n.classList.add('basket-secondary');
        }
        footer.append(n);
      });
    }
  });
  if (summary.children.length) body.append(summary);
  const hasFooter = footer.children.length > 1;
  add(basket, top.children.length > 1 ? top : null, body, hasFooter ? footer : null);
  return { basket, bar };
}

/* the mobile order bar repeats the basket head (presentational clones) */
function buildBar(bar) {
  const clone = (n) => {
    const c = n.cloneNode(true);
    c.querySelectorAll('.sr-only').forEach((s) => s.remove());
    return c;
  };
  const icon = (name) => {
    const s = el('span', `zi zi-${name}`);
    s.setAttribute('aria-hidden', 'true');
    return s;
  };
  const toggle = el('button', 'mbar-toggle', icon('chevron-up'), sr('Open je bestelling'));
  toggle.type = 'button';
  toggle.setAttribute('aria-expanded', 'false');
  const close = el('button', 'mbar-close', icon('close-circle'), sr('Sluit je bestelling'));
  close.type = 'button';
  const info = el('div', 'mbar-info');
  const label = bar.single && bar.per ? bar.per : bar.label;
  if (label) info.append(el('p', 'mbar-label', ...clone(label).childNodes));
  if (bar.promo) info.append(el('span', 'mbar-promo', bar.promo.textContent.trim()));
  const price = el('p', 'mbar-price', sr('Kosten'));
  if (bar.was) price.append(el('span', 'mbar-was', sr('Van'), ' ', bar.was));
  // without a was-price the source announces the single price as "Van"
  if (bar.now) price.append(' ', el('span', 'mbar-now', sr(bar.was ? 'Voor' : 'Van'), ' ', bar.now));
  const mbar = el('div', 'mbar', toggle, close, info, price);
  mbar.setAttribute('aria-label', 'Je bestelling');
  if (bar.cta) {
    const cta = clone(bar.cta);
    cta.className = 'button primary mbar-cta';
    mbar.append(cta);
  }
  return mbar;
}

const GROUPS = {
  product: 'pgroup',
  promo: 'promos',
  card: 'hcards',
  service: 'scards',
  usp: 'usps',
};

export default function decorate(block) {
  if (block.querySelector('.bb-content')) return;
  glyphify(block);
  const content = el('div', 'bb-content', overlay('Bezig met laden...'));
  const basketParts = [];
  let step = null;
  let group = null;
  let groupType = '';
  let campaign = null;
  let groupName = '';
  let legend = null;

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const words = (cells[0] ? cells[0].textContent : '').trim().toLowerCase().split(/\s+/);
    const type = words[0];
    const selected = words.includes('selected');
    const rest = cells.slice(1);
    if (type.startsWith('basket')) {
      basketParts.push({ type, cells: rest });
      return;
    }
    const nodes = rest[0] ? [...ensureP(rest[0]).children] : [];
    if (GROUPS[type] !== groupType) {
      group = null;
      groupType = '';
    }
    if (type !== 'addon-band') campaign = null;
    const host = () => {
      if (!step) {
        step = el('div', 'step');
        content.append(step);
      }
      return step;
    };
    const ensureGroup = () => {
      if (group) return group;
      groupType = GROUPS[type];
      uid += 1;
      groupName = `bb-${type}-${uid}`;
      const choice = type === 'product' || type === 'promo';
      group = el(choice ? 'fieldset' : 'div', groupType);
      if (choice) selectable(group, type === 'product' ? '.pcard' : '.promo');
      if (choice && legend) group.append(el('legend', 'sr-only', ...legend));
      legend = null;
      host().append(group);
      return group;
    };
    if (type === 'legend') {
      legend = nodes;
    } else if (type === 'step') {
      step = buildStep(nodes);
      content.append(step);
    } else if (type === 'benefit') {
      step = buildBenefit(nodes);
      content.append(step);
    } else if (type === 'product') {
      ensureGroup().append(buildProduct(nodes, selected, groupName));
    } else if (type === 'promo') {
      ensureGroup().append(buildPromo(nodes, selected, groupName));
    } else if (type === 'card') {
      ensureGroup().append(buildCard(nodes, 'hcard'));
    } else if (type === 'service') {
      ensureGroup().append(buildCard(nodes, 'scard'));
    } else if (type === 'usp') {
      ensureGroup().append(buildUsp(nodes));
    } else if (type === 'addon') {
      campaign = buildAddon(nodes);
      add(host(), campaign.box, campaign.actions.children.length ? campaign.actions : null);
    } else if (type === 'addon-band') {
      const band = buildBand(nodes);
      if (campaign) campaign.box.append(band);
      else host().append(el('div', 'campaign', band));
    } else if (type === 'teaser') {
      const media = nodes.find(isMedia);
      const teaser = el(
        'section',
        'teaser',
        wrap(media, 'teaser-media'),
        el('div', 'teaser-body', ...nodes.filter((n) => n !== media)),
      );
      teaser.hidden = words.includes('hidden');
      host().append(teaser);
    } else if (type === 'note') {
      const logo = nodes.find(isMedia);
      const text = nodes.filter((n) => n !== logo);
      host().append(el('div', 'espn', wrap(logo, 'espn-logo'), el('div', 'espn-text', ...text)));
    } else {
      // unknown kind: keep the content visible in the current step
      host().append(...nodes);
    }
  });

  const side = el('div', 'bb-side');
  let bar = null;
  if (basketParts.length) {
    const built = buildBasket(basketParts);
    built.bar.single = block.classList.contains('product');
    side.append(built.basket);
    bar = buildBar(built.bar);
  }
  block.replaceChildren(content, side);
  if (bar) block.append(bar);
}
