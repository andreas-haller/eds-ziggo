/**
 * identification-bar: "Heb je al internet van Ziggo?" with Ja / Nee answers.
 * The source renders the bar hidden (it is revealed per visitor by the live personalisation,
 * which does not run on this host), so the block keeps the authored content in the DOM, hidden.
 *
 * Authoring rows (positional):
 *   1. the question (<p>)
 *   2..N. one answer per row (<p>)
 */
export default function decorate(block) {
  const ps = [...block.querySelectorAll('p')];
  if (!ps.length) return;
  const bar = document.createElement('div');
  bar.className = 'idbar';
  const question = document.createElement('div');
  question.className = 'question';
  question.append(ps[0]);
  const answers = document.createElement('div');
  answers.className = 'answers';
  ps.slice(1).forEach((p) => {
    const answer = document.createElement('div');
    answer.className = 'answer';
    answer.append(p);
    answers.append(answer);
  });
  bar.append(question, answers);
  block.replaceChildren(bar);
  // source buttons carry their label twice (.btn-title / .btn-title--large, one shown per
  // breakpoint); mirror that so the delivered link text matches the source
  block.querySelectorAll('a.button').forEach((a) => {
    if (a.querySelector('.btn-title')) return;
    const label = a.textContent.trim();
    if (!label) return;
    const title = document.createElement('span');
    title.className = 'btn-title';
    title.append(...a.childNodes);
    const large = document.createElement('span');
    large.className = 'btn-title-large';
    large.textContent = label;
    a.append(title, ' ', large);
  });
}
