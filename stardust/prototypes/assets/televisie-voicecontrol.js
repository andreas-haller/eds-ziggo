// Sticky subnavigation, mobile: the chevron toggles the anchor list open and closed.
document.querySelectorAll('.subnav').forEach((nav) => {
  const btn = nav.querySelector('.subnav__toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
  });
});

// Sticky subnavigation (observed: the bar turns position:fixed at the top once scrolled past; the link of the
// section in view gets the active underline).
document.querySelectorAll('.subnav').forEach((nav) => {
  const bar = nav.querySelector('.subnav__bar');
  const links = [...nav.querySelectorAll('.subnav__list a')];
  const targets = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const update = () => {
    const top = nav.getBoundingClientRect().top;
    if (!nav.classList.contains('is-fixed')) nav.style.setProperty('--subnav-h', `${bar.offsetHeight}px`);
    nav.classList.toggle('is-fixed', top < 0);
    const probe = bar.offsetHeight + 1;
    let active = -1;
    targets.forEach((t, i) => { if (t.getBoundingClientRect().top <= probe) active = i; });
    links.forEach((a, i) => a.parentElement.classList.toggle('is-active', i === active));
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
});
