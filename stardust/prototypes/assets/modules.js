// FAQ accordion (observed on live: header toggles its body; the body opens with a .3s height slide, the chevron flips at once)
document.querySelectorAll('.acc__header').forEach((btn) => {
  btn.addEventListener('click', () => {
    const body = document.getElementById(btn.getAttribute('aria-controls'));
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    if (open) { body.hidden = true; return; }
    body.hidden = false;
    const h = body.scrollHeight;
    body.style.height = '0px';
    body.classList.add('is-sliding');
    requestAnimationFrame(() => { body.style.height = `${h}px`; });
    body.addEventListener('transitionend', () => { body.style.height = ''; body.classList.remove('is-sliding'); }, { once: true });
  });
});
