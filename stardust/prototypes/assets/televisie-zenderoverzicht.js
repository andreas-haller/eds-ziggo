// Channel overview: the search narrows the authored channel list client-side (dynamic-features row 7:
// client-only filter over the authored list) and updates the result count; the notification closes.
(() => {
  const form = document.querySelector('.zo-search__form');
  const input = document.getElementById('channel-search');
  const rows = [...document.querySelectorAll('.zo-channel')];
  const count = document.querySelector('.zo-results__title');
  if (form && input) {
    const run = () => {
      const q = input.value.trim().toLowerCase();
      let n = 0;
      rows.forEach((li) => {
        const t = li.querySelector('.zo-channel__title').textContent.toLowerCase();
        const e = li.querySelector('.zo-channel__epg').textContent.trim();
        const hit = !q || t.includes(q) || e.startsWith(q);
        li.hidden = !hit;
        if (hit) n += 1;
      });
      if (count) count.firstChild.textContent = ` Zenders gevonden: ${n} `;
    };
    form.addEventListener('submit', (ev) => { ev.preventDefault(); run(); });
    input.addEventListener('input', run);
  }
  document.querySelectorAll('.note__close-btn').forEach((b) => b.addEventListener('click', () => { b.closest('.note').hidden = true; }));
})();

// Action bar: Filter / Sorteren open their panel (one at a time); the panels filter by package/option
// and sort the authored list client-side.
(() => {
  const list = document.querySelector('.zo-list');
  if (!list) return;
  const rows = [...list.children];
  const count = document.querySelector('.zo-results__title');
  const toggles = [...document.querySelectorAll('.zo-bar__btn[aria-controls]')];
  const close = () => toggles.forEach((t) => { t.setAttribute('aria-expanded', 'false'); t.parentElement.classList.remove('is-active'); document.getElementById(t.getAttribute('aria-controls')).hidden = true; });
  toggles.forEach((t) => t.addEventListener('click', () => {
    const open = t.getAttribute('aria-expanded') === 'true';
    close();
    if (open) return;
    t.setAttribute('aria-expanded', 'true');
    t.parentElement.classList.add('is-active');
    // observed on live: the panel opens with a .3s height slide
    const panel = document.getElementById(t.getAttribute('aria-controls'));
    panel.hidden = false;
    const h = panel.scrollHeight;
    panel.style.height = '0px';
    panel.classList.add('is-sliding');
    requestAnimationFrame(() => { panel.style.height = `${h}px`; });
    panel.addEventListener('transitionend', () => { panel.style.height = ''; panel.classList.remove('is-sliding'); }, { once: true });
  }));
  document.querySelectorAll('.zo-panel__close').forEach((b) => b.addEventListener('click', close));
  const apply = () => {
    const pack = document.querySelector('input[name="channelPackages"]:checked')?.value || 'all';
    const opts = [...document.querySelectorAll('.zo-check__input:checked')].map((i) => i.value);
    let n = 0;
    rows.forEach((li) => {
      const packs = li.dataset.packs.split(' ');
      const have = li.dataset.options.split(' ');
      const hit = (pack === 'all' || packs.includes(pack)) && opts.every((o) => have.includes(o));
      li.hidden = !hit;
      if (hit) n += 1;
    });
    if (count) count.firstChild.textContent = ` Zenders gevonden: ${n} `;
  };
  document.querySelector('.zo-filter__go')?.addEventListener('click', () => { apply(); close(); });
  document.querySelector('.zo-filter__reset')?.addEventListener('click', () => {
    document.getElementById('all').checked = true;
    document.querySelectorAll('.zo-check__input').forEach((i) => { i.checked = false; });
    apply();
  });
  document.querySelectorAll('.zo-sort__list .zo-radio__input').forEach((r) => r.addEventListener('change', () => {
    document.querySelectorAll('.zo-sort__list .zo-radio__input').forEach((o) => { o.checked = o === r; });
    const key = (li) => (r.value.startsWith('number') ? +li.querySelector('.zo-channel__epg').textContent : li.querySelector('.zo-channel__title').textContent.toLowerCase());
    const dir = r.value.endsWith('desc') ? -1 : 1;
    rows.slice().sort((a, b) => (key(a) > key(b) ? dir : key(a) < key(b) ? -dir : 0)).forEach((li) => list.appendChild(li));
    close();
  }));
})();
