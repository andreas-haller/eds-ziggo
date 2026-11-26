import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * Ziggo header: template-slotted from the /nav document.
 * /nav sections (fixed contract):
 *   1. audience strip: <ul> of links (first = active audience)
 *   2. brand: <p><img logo></p> + <p><a href="/">sr-only label</a></p>
 *   3. main nav: <ul> of top items; each item = label + nested <ul> whose entries are
 *      either a plain link ("Direct naar" quick links) or label + <ul> (a droplet group)
 *   4. tools: <ul>: links (Ziggo GO, Ziggo Mail), label + <ul> (Mijn Ziggo panel),
 *      bare label (Zoeken)
 * Behaviour (stardust/chrome/header-contract.json via the gated prototype): desktop
 * click droplets with backdrop, one open at a time, Escape/outside click close;
 * accordion groups; Mijn Ziggo panel; mobile Menu drawer; fixed navbar on scroll-up.
 */

const DESKTOP = window.matchMedia('(width >= 1024px)');
const MOTION = window.matchMedia('(width >= 1024px) and (prefers-reduced-motion: no-preference)');

const TOOL_ICONS = {
  'ziggo go': ['app-go', 'product-tv'],
  'ziggo mail': ['app-mail', 'mail'],
  'mijn ziggo': ['app-my', 'user'],
  zoeken: ['app-search', 'search'],
};

let uid = 0;

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

function icon(name) {
  const i = el('span', `zi zi-${name} icon-${name}`);
  i.setAttribute('aria-hidden', 'true');
  return i;
}

/* the delivered shape wraps a list item's leading text/link in a <p> (#98): read both */
function labelOf(li) {
  // the delivered shape wraps the label in a <p>: move its children, not the paragraph
  const frag = document.createDocumentFragment();
  const p = li.querySelector(':scope > p');
  if (p) {
    frag.append(...p.childNodes);
    return frag;
  }
  [...li.childNodes].forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE || (n.nodeType === 1 && !['UL', 'OL'].includes(n.tagName))) {
      frag.append(n);
    }
  });
  return frag;
}

function labelText(li) {
  const p = li.querySelector(':scope > p');
  if (p) return p.textContent.trim();
  return [...li.childNodes]
    .filter((n) => n.nodeType === Node.TEXT_NODE || !['UL', 'OL'].includes(n.tagName))
    .map((n) => n.textContent).join('').trim();
}

function linksOf(ul) {
  return ul ? [...ul.querySelectorAll(':scope > li')] : [];
}

function animateLeave(panel) {
  if (!panel || !panel.classList.contains('is-open')) return;
  panel.classList.remove('is-open');
  if (!MOTION.matches) return;
  panel.classList.add('is-leaving');
  panel.addEventListener('animationend', () => panel.classList.remove('is-leaving'), { once: true });
}

function buildAudience(section) {
  const bar = el('div', 'audience');
  const inner = el('div', 'container audience-inner');
  const links = section ? [...section.querySelectorAll('a')] : [];
  links.forEach((a, i) => {
    a.className = i === 0 ? 'audience-a audience-a-active' : 'audience-a';
    inner.append(a);
  });
  bar.append(inner);
  return bar;
}

function buildBrand(section) {
  const brand = el('a', 'navbar-brand');
  brand.href = '/';
  if (!section) return brand;
  const link = section.querySelector('a');
  // logo: an authored icon (:ziggo-logo-orange-v1: -> /icons/*.svg) or an authored picture
  const pic = section.querySelector('span.icon, picture, img');
  if (link) {
    brand.href = link.getAttribute('href');
    brand.append(el('span', 'sr-only', ...link.childNodes));
  }
  if (pic) {
    const img = pic.tagName === 'IMG' ? pic : pic.querySelector('img');
    if (img) {
      if (!img.alt) img.alt = 'Logo van Ziggo';
      img.width = 72;
      img.height = 30;
      img.loading = 'eager';
    }
    brand.append(pic);
  }
  return brand;
}

function buildDroplet(sub, idx) {
  const drop = el('div', 'droplet');
  drop.id = `droplet-${idx}`;
  drop.dataset.droplet = '';
  const quick = el('ul', 'droplet-quick');
  const groups = el('ul', 'droplet-groups');
  linksOf(sub).forEach((li, g) => {
    const nested = li.querySelector(':scope > ul');
    if (!nested) {
      const a = li.querySelector('a');
      if (a) quick.append(el('li', '', a));
      return;
    }
    const id = `dg-${idx}-${g}`;
    const toggle = el('button', 'droplet-toggle', el('span', '', labelOf(li)), icon('chevron-down'));
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', id);
    const list = el('ul', 'droplet-links');
    list.id = id;
    linksOf(nested).forEach((item) => {
      const a = item.querySelector('a');
      if (!a) return;
      const label = el('span', '', ...a.childNodes);
      a.append(icon('arrow-right'), label);
      list.append(el('li', '', a));
    });
    groups.append(el('li', 'droplet-group', toggle, list));
  });
  if (quick.children.length) drop.append(quick);
  if (groups.children.length) drop.append(groups);
  return drop;
}

function buildMainNav(section) {
  const list = el('ul', 'mainnav-list');
  const top = section ? section.querySelector('ul') : null;
  linksOf(top).forEach((li) => {
    uid += 1;
    const idx = `${uid}`;
    const text = labelText(li);
    const sub = li.querySelector(':scope > ul');
    const lbl = el('span', 'lbl', el('span', 'n', labelOf(li)));
    const bold = el('span', 'b', text);
    bold.setAttribute('aria-hidden', 'true');
    lbl.append(bold);
    const btn = el('button', 'mainnav-btn', lbl, icon('chevron-down'));
    btn.type = 'button';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', `droplet-${idx}`);
    const item = el('li', 'mainnav-item', btn);
    if (sub) item.append(buildDroplet(sub, idx));
    list.append(item);
  });
  return list;
}

function buildTools(section) {
  const apps = el('div', 'apps apps-bar');
  const top = section ? section.querySelector('ul') : null;
  linksOf(top).forEach((li) => {
    const key = labelText(li).toLowerCase();
    const [cls, glyph] = TOOL_ICONS[key] || ['app-link', 'arrow-right'];
    const nested = li.querySelector(':scope > ul');
    const a = li.querySelector(':scope > a, :scope > p > a');
    if (nested) {
      const btn = el('button', `app ${cls}`, icon(glyph));
      btn.type = 'button';
      btn.setAttribute('aria-haspopup', 'true');
      btn.setAttribute('aria-expanded', 'false');
      btn.dataset.myz = '';
      btn.append(el('span', 'sr-only', 'Open'), el('span', '', labelOf(li)), el('span', 'sr-only', 'menu'));
      const panel = el('ul', 'myz');
      panel.hidden = true;
      linksOf(nested).forEach((item) => {
        const link = item.querySelector('a');
        if (link) panel.append(el('li', '', link));
      });
      apps.append(el('div', 'app-my', btn, panel));
    } else if (a) {
      a.className = `app ${cls}`;
      a.prepend(icon(glyph));
      apps.append(a);
    } else {
      const btn = el('button', `app ${cls}`);
      btn.type = 'button';
      btn.append(el('span', 'app-wrap', icon(glyph), labelOf(li)));
      apps.append(btn);
    }
  });
  return apps;
}

/* drawer-level "Direct naar": presentational copies of every droplet's quick links (mobile) */
function buildDrawerQuick(list) {
  const quick = el('ul', 'drawer-quick');
  list.querySelectorAll('.droplet-quick > li').forEach((li) => {
    quick.append(stripInstrumentation(li.cloneNode(true)));
  });
  return quick;
}

function wire(root) {
  const backdrop = el('div', 'nav-backdrop');
  root.append(backdrop);
  const navbar = root.querySelector('.navbar');
  const menuBtn = root.querySelector('[data-menu-toggle]');
  const drawer = root.querySelector('[data-drawer]');
  const label = root.querySelector('[data-menu-label]');
  const topBtns = [...root.querySelectorAll('.mainnav-btn')];
  const panelOf = (b) => root.querySelector(`#${b.getAttribute('aria-controls')}`);
  const isOpen = (b) => b.getAttribute('aria-expanded') === 'true';

  // page scroll is locked while the drawer (mobile) or a droplet (desktop) is open (source parity)
  let lockedY = null;
  let lastY = window.scrollY;
  const setLock = (on) => {
    const { body, documentElement: html } = document;
    if (on && lockedY === null) {
      lockedY = window.scrollY;
      html.style.scrollbarGutter = 'stable';
      Object.assign(body.style, {
        position: 'fixed', top: `-${lockedY}px`, left: '0', right: '0', overflow: 'hidden',
      });
      const top = Math.max(0, Math.round(navbar.getBoundingClientRect().bottom));
      root.style.setProperty('--drawer-top', `${top}px`);
    } else if (!on && lockedY !== null) {
      const y = lockedY;
      lockedY = null;
      html.style.removeProperty('scrollbar-gutter');
      ['position', 'top', 'left', 'right', 'overflow'].forEach((p) => body.style.removeProperty(p));
      root.style.removeProperty('--drawer-top');
      lastY = y;
      window.scrollTo({ top: y, behavior: 'instant' });
    }
  };
  const syncLock = () => setLock(isOpen(menuBtn) || (DESKTOP.matches && topBtns.some(isOpen)));

  const closeAll = (except) => {
    if (!except) animateLeave(backdrop);
    topBtns.forEach((b) => {
      if (b === except) return;
      b.setAttribute('aria-expanded', 'false');
      animateLeave(panelOf(b));
    });
    syncLock();
  };
  topBtns.forEach((b) => b.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = b.getAttribute('aria-expanded') !== 'true';
    closeAll(b);
    b.setAttribute('aria-expanded', String(open));
    const panel = panelOf(b);
    if (panel && open) {
      panel.classList.remove('is-leaving');
      panel.classList.add('is-open');
    } else animateLeave(panel);
    if (open) backdrop.classList.add('is-open');
    else animateLeave(backdrop);
    syncLock();
  }));
  root.querySelectorAll('[data-droplet]').forEach((d) => {
    d.addEventListener('click', (e) => e.stopPropagation());
  });
  root.querySelectorAll('.droplet-toggle').forEach((b) => b.addEventListener('click', () => {
    b.setAttribute('aria-expanded', String(b.getAttribute('aria-expanded') !== 'true'));
  }));

  root.querySelectorAll('[data-myz]').forEach((b) => {
    const panel = b.nextElementSibling;
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
    });
    document.addEventListener('click', () => {
      b.setAttribute('aria-expanded', 'false');
      panel.hidden = true;
    });
  });

  const setDrawer = (open) => {
    menuBtn.setAttribute('aria-expanded', String(open));
    drawer.classList.toggle('is-open', open);
    backdrop.classList.toggle('is-drawer', open);
    label.textContent = open ? 'Sluiten' : 'Menu';
    const glyph = open ? 'close' : 'menu';
    menuBtn.querySelector('.zi').className = `zi zi-${glyph} icon-${glyph}`;
    // a closed drawer reopens at its top level
    if (!open) closeAll();
    syncLock();
  };
  menuBtn.addEventListener('click', () => setDrawer(!isOpen(menuBtn)));

  document.addEventListener('click', () => closeAll());
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeAll();
    if (isOpen(menuBtn)) {
      setDrawer(false);
      menuBtn.focus();
    }
  });
  DESKTOP.addEventListener('change', () => {
    closeAll();
    setDrawer(false);
  });

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    // locking/unlocking moves the scroll position: not a user scroll
    if (lockedY !== null || y === lastY) return;
    root.classList.toggle('site-header-fixed', y < lastY && y > 600);
    lastY = y;
  }, { passive: true });
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  const sections = fragment ? [...fragment.querySelectorAll(':scope > .section')] : [];
  const [audienceSec, brandSec, navSec, toolsSec] = sections;

  const root = el('div', 'site-header');
  const navbarInner = el('div', 'container navbar-inner');
  const barTools = buildTools(toolsSec);
  const navTools = stripInstrumentation(barTools.cloneNode(true));
  navTools.className = 'apps apps-nav';

  const mainList = buildMainNav(navSec);
  const drawerQuick = buildDrawerQuick(mainList);
  const panel = el('div', 'mainnav-panel', mainList, navTools);
  if (drawerQuick.children.length) panel.prepend(drawerQuick);
  panel.id = 'drawer';
  panel.dataset.drawer = '';
  const mainnav = el('nav', 'mainnav', panel);
  mainnav.setAttribute('aria-label', 'Hoofdnavigatie');

  const label = el('span', '', 'Menu');
  label.dataset.menuLabel = '';
  const menuBtn = el('button', 'app app-menu', icon('menu'), label);
  menuBtn.type = 'button';
  menuBtn.setAttribute('aria-haspopup', 'true');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-controls', 'drawer');
  menuBtn.dataset.menuToggle = '';

  navbarInner.append(buildBrand(brandSec), mainnav, barTools, menuBtn);
  root.append(buildAudience(audienceSec), el('div', 'navbar', navbarInner));
  block.replaceChildren(root);
  wire(root);
}
