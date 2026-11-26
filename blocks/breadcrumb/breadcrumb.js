/**
 * breadcrumb: trail under the subnavigation (source breadcrumb-v2).
 *
 * Authoring: one cell holding a list; one item per level.
 *   first item = the home link (its text becomes the accessible name; a home glyph is shown)
 *   linked items = ancestors; an unlinked item = the current page
 */

export default function decorate(block) {
  if (block.querySelector('nav.crumbs')) return;
  const list = block.querySelector('ul, ol');
  if (!list) return;
  list.classList.add('crumbs-list');
  const items = [...list.children];
  items.forEach((li, i) => {
    li.classList.add('crumbs-item');
    const a = li.querySelector('a');
    if (i === 0 && a) {
      a.classList.add('crumbs-home');
      a.setAttribute('aria-label', a.textContent.trim());
      const glyph = document.createElement('span');
      glyph.className = 'zi crumbs-glyph crumbs-icon';
      glyph.setAttribute('aria-hidden', 'true');
      a.prepend(glyph);
    } else if (a) {
      a.classList.add('crumbs-link');
    } else {
      li.classList.add('crumbs-current');
      li.setAttribute('aria-current', 'page');
    }
  });
  const nav = document.createElement('nav');
  nav.className = 'crumbs';
  nav.setAttribute('aria-label', 'Breadcrumb');
  nav.append(list);
  const wrap = document.createElement('div');
  wrap.className = 'crumbs-wrap';
  wrap.append(nav);
  block.replaceChildren(wrap);
}
