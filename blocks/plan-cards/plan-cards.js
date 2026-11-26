/**
 * plan-cards: section title over a 3-up grid of plan cards on the brand gradient.
 *
 * Authoring rows:
 *   head row: <h2> section title
 *   one row per plan: optional <p> ribbon (before the heading), <h3> plan name,
 *     <ul> USPs (each item starts with an icon :glyph:, :close: = not included),
 *     CTA paragraph (<strong><a> = primary, <em><a> = outline)
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

/* icon markers inside USP items: pipeline span.icon -> icon-font glyph span */
function glyphify(ul) {
  ul.querySelectorAll('span.icon').forEach((span) => {
    const cls = [...span.classList].find((c) => c.startsWith('icon-'));
    span.replaceChildren();
    span.classList.add('zi', `zi-${cls ? cls.slice(5) : ''}`);
    span.setAttribute('aria-hidden', 'true');
  });
  // HARNESS-ONLY fallback: raw :name: notation (the delivery pipeline emits span.icon)
  ul.querySelectorAll(':scope > li').forEach((li) => {
    if (li.querySelector('.zi')) return;
    const first = li.firstChild;
    if (!first || first.nodeType !== Node.TEXT_NODE) return;
    const m = first.textContent.match(/^\s*:([a-z0-9-]+):\s*/);
    if (!m) return;
    first.splitText(m[0].length);
    const span = el('span', `icon icon-${m[1]} zi zi-${m[1]}`);
    span.setAttribute('aria-hidden', 'true');
    li.replaceChild(span, first);
  });
  // per USP, as in the source: an included item is one info-trigger box (icon + sr prefix +
  // label, source <button>); a crossed item is icon + title span (source
  // <span class="z-usp-list__usp-title"><span class="sr-only">…</span> label</span>)
  ul.querySelectorAll(':scope > li').forEach((li) => {
    if (li.querySelector('.usp-title, .usp-trigger')) return;
    const icon = li.querySelector('.zi');
    const crossed = !!icon && icon.classList.contains('zi-close');
    const sr = el('span', 'sr-only', crossed ? 'Niet van toepassing' : 'Meer informatie over');
    const label = [...li.childNodes].filter((n) => n !== icon);
    if (crossed) {
      li.append(el('span', 'usp-title', sr, ' ', ...label));
    } else {
      li.append(el('span', 'usp-trigger', ...(icon ? [icon] : []), sr, ' ', ...label));
    }
  });
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
  const isPlan = (r) => !!r.querySelector('ul, h3');
  const inner = el('div', 'plans-inner');
  const grid = el('div', 'plans-grid');
  rows.forEach((row) => {
    if (!isPlan(row)) {
      [...row.querySelectorAll('h1, h2, h3, h4, p')].forEach((n) => inner.append(wrapNode(n, 'plans-title')));
      return;
    }
    const all = [...row.querySelectorAll(':scope > div > *')];
    const firstList = all.findIndex((n) => n.tagName === 'UL' || n.tagName === 'OL');
    // a lone-<em> paragraph before the name is the ribbon ("Meest gekozen")
    const isRibbon = (n) => n.tagName === 'P' && !n.querySelector('a')
      && !!n.querySelector(':scope > em:only-child') && n.textContent.trim() === n.firstElementChild.textContent.trim();
    // the plan name: a heading, else (tv) the last plain paragraph before the USP list
    const heading = row.querySelector('h1, h2, h3, h4, h5, h6')
      || all.slice(0, firstList < 0 ? 0 : firstList)
        .filter((n) => n.tagName === 'P' && !n.querySelector('a') && !isRibbon(n)).pop() || null;
    const hIdx = all.indexOf(heading);
    const ribbon = all.find((n, i) => n.tagName === 'P' && i < hIdx && !n.querySelector('a'));
    const lists = all.filter((n) => n.tagName === 'UL' || n.tagName === 'OL');
    const ctas = all.filter((n) => n.tagName === 'P' && n.querySelector('a'));
    // the picture cell: a picture/img (the pipeline unwraps a lone paragraph) or its <p>
    const pic = all.find((n) => n.matches('picture, img')
      || (n.tagName === 'P' && !!n.querySelector('picture, img') && !n.textContent.trim()));
    const rest = all.filter((n) => n !== ribbon && n !== heading && n !== pic
      && !lists.includes(n) && !ctas.includes(n));
    const plan = el('article', ribbon ? 'plan plan-ribbon' : 'plan');
    if (ribbon) plan.append(wrapNode(ribbon, 'ribbon'));
    if (pic) plan.append(wrapNode(pic, 'plan-media'));
    const body = el('div', 'plan-body');
    if (heading) body.append(wrapNode(heading, 'plan-title'));
    if (block.classList.contains('media')) {
      // media: the card copy in authored order (ribbons, offer line, plain list, price), CTAs last
      all.filter((n) => n !== heading && n !== pic && !ctas.includes(n)).forEach((n) => {
        if (n.tagName === 'UL' || n.tagName === 'OL') body.append(wrapNode(n, 'plan-list'));
        else if (n.tagName === 'P' && n.querySelector(':scope > em:only-child')) body.append(wrapNode(n, 'plan-tag'));
        else body.append(wrapNode(n, 'plan-copy'));
      });
      if (ctas.length) body.append(el('div', 'plan-cta', ...ctas));
      plan.append(body);
      grid.append(plan);
      return;
    }
    lists.forEach((ul) => {
      glyphify(ul);
      body.append(wrapNode(ul, 'usps'));
    });
    rest.forEach((n) => {
      // tv price line "13,50 p.m.": the unit is set small beside the amount (text node split)
      // tv promo label "12 maanden gratis" (a lone <em> paragraph after the list)
      if (n.tagName === 'P' && block.classList.contains('tv') && n.querySelector(':scope > em:only-child')
        && !n.querySelector('a')) {
        body.append(wrapNode(n, 'plan-promo'));
        return;
      }
      // tv offer price "van <del>16,45</del> voor <strong>0,00</strong> p.m.": van / voor are
      // screen-reader words on the source (sr-only spans around the authored text nodes)
      if (n.tagName === 'P' && block.classList.contains('tv') && n.querySelector('del')) {
        [...n.childNodes].filter((c) => c.nodeType === 3 && /^\s*(van|voor)\s*$/.test(c.textContent))
          .forEach((c) => {
            const sr = el('span', 'sr-only');
            c.replaceWith(sr);
            sr.append(c);
          });
      }
      if (n.tagName === 'P' && block.classList.contains('tv') && !n.querySelector('.price-unit')) {
        const t = [...n.childNodes].reverse().find((c) => c.nodeType === 3 && /\sp\.m\.\s*$/.test(c.textContent));
        if (t) {
          const tail = t.splitText(t.textContent.search(/\sp\.m\.\s*$/));
          const unit = el('span', 'price-unit');
          tail.replaceWith(unit);
          unit.append(tail);
        }
        body.append(wrapNode(n, 'plan-price'));
        return;
      }
      body.append(n);
    });
    if (ctas.length) body.append(el('div', 'plan-cta', ...ctas));
    plan.append(body);
    grid.append(plan);
  });
  inner.append(grid);
  block.replaceChildren(inner);
  dualLabel(block);
  addArrow(block, '.plan-cta a.button');
}
