/**
 * faq-accordion: centred question list with expanding answers (source vfz-accordion).
 *
 * Authoring rows (classified by content, order free):
 *   a single-cell row holding a heading = the section title (shown centred above the list)
 *   two-cell rows = one item each: cell 1 the question (<p>), cell 2 the answer (any content)
 * Behaviour (observed on live): the header toggles its body; the body opens with a .3s height
 * slide, the chevron flips and the title turns gray-700 at once.
 */

let uid = 0;

function el(tag, className, ...kids) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...kids);
  return e;
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

function toggle(header, body) {
  const open = header.getAttribute('aria-expanded') === 'true';
  header.setAttribute('aria-expanded', String(!open));
  if (open) {
    body.hidden = true;
    return;
  }
  body.hidden = false;
  const h = body.scrollHeight;
  body.style.height = '0px';
  body.classList.add('is-sliding');
  requestAnimationFrame(() => {
    body.style.height = `${h}px`;
  });
  body.addEventListener('transitionend', () => {
    body.style.height = '';
    body.classList.remove('is-sliding');
  }, { once: true });
}

function buildItem(qCell, aCell) {
  uid += 1;
  const id = `faq-acc-${uid}`;
  const title = el('div', 'acc-title', ...qCell.childNodes);
  const chevron = el('span', 'acc-chevron');
  chevron.setAttribute('aria-hidden', 'true');
  const header = el('div', 'acc-header', title, chevron);
  header.setAttribute('role', 'button');
  header.tabIndex = 0;
  header.setAttribute('aria-expanded', 'false');
  header.setAttribute('aria-controls', id);
  const body = el('div', 'acc-body', ...aCell.childNodes);
  body.id = id;
  body.hidden = true;
  header.addEventListener('click', () => toggle(header, body));
  header.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle(header, body);
    }
  });
  return el('div', 'acc', header, body);
}

export default function decorate(block) {
  if (block.querySelector('.acc-group')) return;
  const head = el('div', 'faq-head');
  const group = el('div', 'acc-group');
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      group.append(buildItem(ensureP(cells[0]), ensureP(cells[1])));
      cells.slice(2).forEach((c) => group.lastElementChild.querySelector('.acc-body')
        .append(...c.childNodes));
    } else if (cells[0]) {
      head.append(...cells[0].childNodes);
    }
  });
  const inner = el('div', 'faq-inner');
  if (head.childNodes.length) inner.append(head);
  inner.append(group);
  block.replaceChildren(inner);
}
