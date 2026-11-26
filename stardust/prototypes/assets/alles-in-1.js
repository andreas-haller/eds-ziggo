// Product cards (observed: a click selects the card in its group, draws the outline .8s, pulses, shines; the radio pops)
document.querySelectorAll('.pgroup').forEach((group) => {
  group.addEventListener('change', (e) => {
    const card = e.target.closest('.pcard');
    if (!card) return;
    group.querySelectorAll('.pcard').forEach((c) => c.classList.toggle('is-selected', c === card));
    card.classList.add('is-animating');
    setTimeout(() => card.classList.remove('is-animating'), 1800);
  });
});
