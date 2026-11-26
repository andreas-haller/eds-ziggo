import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * Ziggo footer: template-slotted from the /footer document.
 * /footer sections (fixed contract):
 *   1. link columns: repeated <h2> + <ul> pairs (desktop columns, mobile <details>)
 *   2. "Snel naar" category links <ul>
 *   3. social links <ul> (link text = network name; icon from /icons/social-<name>.svg)
 *   4. legal links <ul>
 */

function el(tag, className, ...kids) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...kids);
  return e;
}

/* presentational copies must not keep the editor's indices (EW4) */
function stripInstrumentation(node) {
  node.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  node.removeAttribute('data-prose-index');
  return node;
}

function slug(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function buildColumns(section) {
  const desktop = el('div', 'footer-cols footer-cols-desktop');
  const mobile = el('div', 'footer-cols footer-cols-mobile');
  if (!section) return [desktop, mobile];
  const wrapper = section.querySelector('.default-content-wrapper') || section;
  let col = null;
  [...wrapper.children].forEach((node) => {
    if (/^H[1-6]$/.test(node.tagName)) {
      col = el('div', 'fcol', el('div', 'fcol-title', node));
      desktop.append(col);
    } else if (node.tagName === 'UL' && col) {
      col.append(el('div', 'fcol-list', node));
    }
  });
  [...desktop.children].forEach((c) => {
    const title = c.querySelector('.fcol-title');
    const list = c.querySelector('.fcol-list');
    const chevron = el('span', 'zi zi-chevron-down icon-chevron-down');
    chevron.setAttribute('aria-hidden', 'true');
    const summary = el('summary', '', stripInstrumentation(title.cloneNode(true)), chevron);
    const details = el('details', 'fcol', summary);
    if (list) details.append(stripInstrumentation(list.cloneNode(true)));
    mobile.append(details);
  });
  return [desktop, mobile];
}

function navOf(section, className, label) {
  const nav = el('nav', className);
  nav.setAttribute('aria-label', label);
  const ul = section ? section.querySelector('ul') : null;
  if (ul) nav.append(el('div', 'list', ul));
  return nav;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  const sections = fragment ? [...fragment.querySelectorAll(':scope > .section')] : [];
  const [colsSec, catSec, socialSec, legalSec] = sections;

  const links = el('nav', 'footer-links', ...buildColumns(colsSec));
  links.setAttribute('aria-label', 'Footer navigatie');

  const social = navOf(socialSec, 'social', 'Social media menu');
  social.querySelectorAll('a').forEach((a) => {
    const name = slug(a.textContent);
    const label = el('span', 'sr-only', ...a.childNodes);
    const glyph = el('span', 'social-icon');
    glyph.setAttribute('aria-hidden', 'true');
    a.append(label, glyph);
    fetch(`${window.hlx?.codeBasePath || ''}/icons/social-${name}.svg`)
      .then((r) => (r.ok ? r.text() : ''))
      .then((txt) => {
        const svg = new DOMParser().parseFromString(txt, 'image/svg+xml').querySelector('svg');
        if (!svg) return;
        svg.querySelectorAll('[fill]:not([fill="none"])').forEach((n) => n.setAttribute('fill', 'currentcolor'));
        svg.setAttribute('role', 'presentation');
        svg.removeAttribute('viewBox');
        glyph.replaceWith(svg);
      });
  });

  const subfooter = el(
    'div',
    'subfooter',
    navOf(catSec, 'subfooter-nav subfooter-nav-cat', 'Snel naar menu'),
    social,
    navOf(legalSec, 'subfooter-nav subfooter-nav-legal', 'Algemene informatie en voorwaarden menu'),
  );

  const inner = el('div', 'footer-inner', links, subfooter);
  block.replaceChildren(el('div', 'site-footer', inner));
}
