/**
 * address-checker: lead column of the program pages — category pill links, page title and the
 * availability check card (source uid / product-search), pulled up over the hero band.
 *
 * Authoring (content-classified, rows free):
 *   <ul> of links      = category pills (the link to the current page shows active)
 *   <h1>               = page title
 *   <h2>/<h3>          = card title
 *   <ul> without links = customer-type switch (first item active)
 *   <ol>               = address field labels (postcode, house number, addition)
 *   <p><em>…</em></p>  = message shown when the check runs without an address
 *   <p><strong><a>     = business link (shown when the business box is ticked)
 *   <p><strong>…</strong></p> (no link) = the check button
 *   other <p>          = business checkbox label
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

const isEm = (n) => n.tagName === 'P' && !!n.querySelector('em')
  && n.textContent.trim() === n.querySelector('em').textContent.trim();

function pills(ul) {
  ul.classList.add('catlinks-list');
  const here = window.location.pathname.replace(/\/$/, '') || '/';
  [...ul.children].forEach((li) => {
    li.classList.add('catlinks-item');
    const a = li.querySelector('a');
    if (!a) return;
    let path = '';
    try {
      path = new URL(a.getAttribute('href'), window.location.href).pathname.replace(/\/$/, '') || '/';
    } catch {
      return;
    }
    if (path === here) {
      li.classList.add('is-active');
      a.setAttribute('aria-current', 'page');
    }
  });
  return el('nav', 'catlinks', ul);
}

function segment(ul) {
  uid += 1;
  ul.classList.add('seg');
  ul.setAttribute('role', 'radiogroup');
  [...ul.children].forEach((li, i) => {
    const input = el('input', 'sr-only');
    input.type = 'radio';
    input.name = `ac-seg-${uid}`;
    input.checked = i === 0;
    const label = el('span', 'seg-label', ...li.childNodes);
    li.className = i === 0 ? 'seg-opt is-active' : 'seg-opt';
    li.append(el('label', 'seg-choice', input, label));
  });
  ul.addEventListener('change', (e) => {
    ul.querySelectorAll('.seg-opt').forEach((o) => o.classList.toggle('is-active', o.contains(e.target)));
  });
  return ul;
}

function fields(ol) {
  const form = el('form', 'addr-form');
  form.action = '#';
  ol.classList.add('addr');
  const kinds = ['zip', 'nr', 'ext'];
  [...ol.children].forEach((li, i) => {
    uid += 1;
    const id = `ac-field-${uid}`;
    const label = el('label', 'addr-label', ...li.childNodes);
    label.htmlFor = id;
    const input = el('input', 'addr-input');
    input.id = id;
    input.type = 'text';
    if (i === 0) input.autocomplete = 'postal-code';
    li.className = `addr-field addr-field-${kinds[i] || 'more'}`;
    li.append(label, input);
  });
  form.addEventListener('submit', (e) => e.preventDefault());
  form.append(ol);
  return form;
}

export default function decorate(block) {
  if (block.querySelector('.ac-content')) return;
  const nodes = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => nodes.push(...cell.children));
  const linkList = nodes.find((n) => n.tagName === 'UL' && n.querySelector('a'));
  const h1 = nodes.find((n) => n.tagName === 'H1');
  const title = nodes.find((n) => /^H[2-6]$/.test(n.tagName));
  const segList = nodes.find((n) => n.tagName === 'UL' && n !== linkList);
  const ol = nodes.find((n) => n.tagName === 'OL');
  const msg = nodes.find(isEm);
  const biz = nodes.find((n) => n.tagName === 'P' && n.querySelector('a'));
  const cta = nodes.find((n) => n.tagName === 'P' && !n.querySelector('a') && !isEm(n)
    && n.querySelector('strong') && n.textContent.trim() === n.querySelector('strong').textContent.trim());
  const check = nodes.find((n) => n.tagName === 'P' && ![msg, biz, cta].includes(n));

  const card = el('div', 'uid');
  add(card, wrap(title, 'uid-title'));
  if (segList) card.append(segment(segList));
  let message = null;
  if (msg) {
    const icon = el('span', 'zi zi-exclamation-triangle');
    icon.setAttribute('aria-hidden', 'true');
    message = el('div', 'uid-message', icon, msg);
    message.hidden = true;
    card.append(message);
  }
  let form = null;
  if (ol) {
    form = fields(ol);
    card.append(form);
  }
  let bizBox = null;
  if (check) {
    const input = el('input', 'sr-only');
    input.type = 'checkbox';
    const box = el('span', 'check-box');
    box.setAttribute('aria-hidden', 'true');
    card.append(el('label', 'check', input, box, el('span', 'check-label', check)));
    input.addEventListener('change', () => {
      if (bizBox) bizBox.hidden = !input.checked;
      card.classList.toggle('is-business', input.checked);
    });
  }
  if (biz) {
    bizBox = el('div', 'uid-biz', biz);
    bizBox.hidden = true;
    card.append(bizBox);
  }
  if (cta) {
    const btn = el('div', 'uid-cta', cta);
    btn.setAttribute('role', 'button');
    btn.tabIndex = 0;
    btn.addEventListener('click', () => {
      const empty = form && [...form.querySelectorAll('input')].slice(0, 2).some((i) => !i.value.trim());
      if (message) message.hidden = !empty;
    });
    card.append(btn);
  }
  const content = el('div', 'ac-content');
  if (linkList) content.append(pills(linkList));
  add(content, wrap(h1, 'ac-title'));
  if (card.children.length) content.append(card);
  // leftovers stay visible rather than vanish
  nodes.filter((n) => n.isConnected && block.contains(n)).forEach((n) => content.append(n));
  block.replaceChildren(content);
}
