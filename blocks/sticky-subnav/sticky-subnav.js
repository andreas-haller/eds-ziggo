/**
 * sticky-subnav: in-page anchor bar under the hero (source vfz-sticky-subnavigation).
 *
 * Authoring: one cell.
 *   <p> = the mobile "navigate to" label (shown < 768px)
 *   <ul> of <a href="#id"> = the anchor links; targets are sections carrying
 *   Section Metadata `id` (data-id), which this block mirrors onto the section id.
 * Behaviour (observed on live): the bar turns position:fixed at the top once scrolled
 * past, the link of the section in view gets the active underline; below 768px a chevron
 * toggles the list.
 */

function el(tag, className, ...kids) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...kids);
  return e;
}

function resolveTarget(href) {
  if (!href || !href.startsWith('#') || href.length < 2) return null;
  const id = decodeURIComponent(href.slice(1));
  let target = document.getElementById(id);
  if (!target) {
    target = [...document.querySelectorAll('main .section[data-id]')]
      .find((s) => s.dataset.id === id) || null;
    if (target) target.id = id;
  }
  return target;
}

function watch(block, bar, links) {
  const update = () => {
    const targets = links.map((a) => resolveTarget(a.getAttribute('href')));
    const { top } = block.getBoundingClientRect();
    if (!block.classList.contains('is-fixed')) {
      block.style.setProperty('--subnav-h', `${bar.offsetHeight}px`);
    }
    block.classList.toggle('is-fixed', top < 0);
    const probe = bar.offsetHeight + 1;
    let active = -1;
    targets.forEach((t, i) => {
      if (t && t.getBoundingClientRect().top <= probe) active = i;
    });
    links.forEach((a, i) => a.closest('li').classList.toggle('is-active', i === active));
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

export default function decorate(block) {
  if (block.querySelector('.subnav-bar')) return;
  const list = block.querySelector('ul, ol');
  const label = [...block.querySelectorAll('p')].find((p) => !list || !list.contains(p));

  const mobile = el('div', 'subnav-mobile');
  const selected = el('div', 'subnav-selected');
  if (label) selected.append(label);
  const toggle = el('button', 'subnav-toggle');
  toggle.type = 'button';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Menu');
  const glyph = el('span', 'zi subnav-chevron subnav-icon');
  glyph.setAttribute('aria-hidden', 'true');
  toggle.append(glyph);
  mobile.append(selected, toggle, el('div', 'subnav-underline'));

  const wrap = el('nav', 'subnav-wrap', mobile);
  if (list) {
    list.classList.add('subnav-list');
    list.id = list.id || `subnav-list-${Math.random().toString(36).slice(2, 8)}`;
    toggle.setAttribute('aria-controls', list.id);
    wrap.append(list);
  }
  const bar = el('div', 'subnav-bar', el('div', 'subnav-container', wrap));
  block.replaceChildren(bar);

  toggle.addEventListener('click', () => {
    const open = block.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  const links = list ? [...list.querySelectorAll('a[href]')] : [];
  links.forEach((a) => a.addEventListener('click', () => {
    resolveTarget(a.getAttribute('href'));
    block.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
  watch(block, bar, links);
}
