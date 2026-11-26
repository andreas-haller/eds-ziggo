/* Ziggo replica — minimal interaction layer (header droplets + drawer drill-down,
   carousel prev/next, swimming-lane pause toggle). No framework. */
(() => {
  const header = document.getElementById('site-header');

  /* desktop droplets: one open at a time; click outside / Escape closes */
  const backdrop = document.createElement('div');
  backdrop.className = 'nav-backdrop';
  header.append(backdrop);
  const topBtns = [...header.querySelectorAll('.mainnav__btn')];
  const leave = (el) => {
    if (!el.classList.contains('is-open')) return;
    el.classList.remove('is-open');
    if (!window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)').matches) return;
    el.classList.add('is-leaving');
    el.addEventListener('animationend', () => el.classList.remove('is-leaving'), { once: true });
  };
  const closeAll = (except) => {
    if (!except) leave(backdrop);
    topBtns.forEach((b) => {
      if (b === except) return;
      b.setAttribute('aria-expanded', 'false');
      leave(document.getElementById(b.getAttribute('aria-controls')));
    });
  };
  topBtns.forEach((b) => b.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = b.getAttribute('aria-expanded') !== 'true';
    closeAll(b);
    b.setAttribute('aria-expanded', String(open));
    const panel = document.getElementById(b.getAttribute('aria-controls'));
    if (open) { panel.classList.remove('is-leaving'); panel.classList.add('is-open'); } else leave(panel);
    if (open) backdrop.classList.add('is-open'); else leave(backdrop);
  }));
  header.querySelectorAll('[data-droplet]').forEach((d) => d.addEventListener('click', (e) => e.stopPropagation()));
  document.addEventListener('click', () => closeAll());
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeAll(); setDrawer(false); } });

  /* accordions inside droplets and the drawer (groups, drawer sections) */
  header.querySelectorAll('.droplet__toggle, .drawer__sec-btn').forEach((b) => b.addEventListener('click', () => {
    b.setAttribute('aria-expanded', String(b.getAttribute('aria-expanded') !== 'true'));
  }));

  /* scroll-up fixed navbar (same class toggle as live: fixed while scrolling up past the fold) */
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.toggle('site-header--fixed', y < lastY && y > 600);
    lastY = y;
  }, { passive: true });

  /* Mijn Ziggo panel (one per app bar) */
  header.querySelectorAll('[data-myz]').forEach((b) => {
    const panel = b.nextElementSibling;
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
    });
    document.addEventListener('click', () => { b.setAttribute('aria-expanded', 'false'); panel.hidden = true; });
  });

  /* mobile drawer */
  const menuBtn = header.querySelector('[data-menu-toggle]');
  const drawer = document.getElementById('drawer');
  const label = header.querySelector('[data-menu-label]');
  function setDrawer(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    drawer.classList.toggle('is-open', open);
    label.textContent = open ? 'Sluiten' : 'Menu';
    menuBtn.querySelector('.icon').className = `icon icon-${open ? 'close' : 'menu'}`;
  }
  menuBtn.addEventListener('click', () => setDrawer(menuBtn.getAttribute('aria-expanded') !== 'true'));

  /* card carousel (scrolling track) */
  document.querySelectorAll('[data-ccar], [data-acar]').forEach((c) => {
    const track = c.querySelector('ul');
    const prev = c.querySelector('[data-prev]');
    const next = c.querySelector('[data-next]');
    const step = () => (track.firstElementChild.getBoundingClientRect().width + 16);
    const sync = () => {
      prev.disabled = track.scrollLeft <= 1 && !c.dataset.offset;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
    };
    if (c.matches('[data-acar]')) {
      let i = 0;
      const n = track.children.length;
      const move = () => {
        track.style.transform = `translateX(${-i * step()}px)`;
        track.style.transition = 'transform .4s ease';
        prev.disabled = i === 0; next.disabled = i >= n - 1;
      };
      prev.addEventListener('click', () => { i = Math.max(0, i - 1); move(); });
      next.addEventListener('click', () => { i = Math.min(n - 1, i + 1); move(); });
      return;
    }
    prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    track.addEventListener('scroll', sync, { passive: true });
  });

  /* media carousel (centred slide) */
  document.querySelectorAll('[data-mcar]').forEach((c) => {
    const track = c.querySelector('.mcar__track');
    const n = track.children.length;
    let i = 1;
    const go = (d) => { i = (i + d + n) % n; track.style.setProperty('--i', i); };
    c.querySelector('[data-prev]').addEventListener('click', () => go(-1));
    c.querySelector('[data-next]').addEventListener('click', () => go(1));
  });

  /* swimming lane pause / resume */
  document.querySelectorAll('[data-lane]').forEach((lane) => {
    const t = lane.querySelector('[data-lane-toggle]');
    t.addEventListener('click', () => {
      const paused = lane.dataset.paused !== 'true';
      lane.dataset.paused = String(paused);
      t.setAttribute('aria-pressed', String(paused));
      t.querySelector('.icon').className = `icon icon-${paused ? 'play' : 'pause'}`;
      t.querySelector('.sr-only').textContent = paused ? 'Afspelen hervatten' : 'Pauzeren';
    });
  });
})();
