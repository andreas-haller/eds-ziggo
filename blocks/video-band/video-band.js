/**
 * video-band: centred 16:9 video player on a photo-cover band (source streaming-page showreel).
 *
 * Authoring (content-classified):
 *   pictures: first = band background below 768px, second = band background from 768px
 *     (one picture serves both)
 *   a paragraph with a link = the video player URL; the link text is the player title
 *   optional head above the player: a heading (white, centred) and paragraphs — a paragraph
 *     before the heading paints as its eyebrow line
 *
 * @ew-exempt embed: the link becomes the player <iframe>; its text is kept as the iframe title
 */

function el(tag, className, ...kids) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...kids);
  return e;
}

const isMedia = (n) => n.matches('picture, img') || !!n.querySelector('picture, img');

export default function decorate(block) {
  if (block.querySelector(':scope > .vb-inner')) return;
  const nodes = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => nodes.push(...cell.children));
  const media = nodes.filter(isMedia);
  const link = nodes.map((n) => n.querySelector('a[href]')).find(Boolean);
  const headNodes = nodes.filter((n) => !isMedia(n) && !(link && n.contains(link))
    && n.textContent.trim());
  const heading = headNodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const headIdx = headNodes.indexOf(heading);
  headNodes.forEach((n, i) => {
    if (n.tagName === 'P' && i < headIdx) n.classList.add('vb-eyebrow');
  });

  const bg = el('div', 'vb-bg');
  media.forEach((m, i) => bg.append(el('div', i ? 'vb-bg-wide' : 'vb-bg-small', m)));
  if (media.length === 1) bg.firstElementChild.classList.add('vb-bg-wide');

  const player = el('div', 'vb-player');
  if (link) {
    const iframe = document.createElement('iframe');
    iframe.src = link.href;
    iframe.title = link.textContent.trim();
    iframe.loading = 'lazy';
    iframe.allowFullscreen = true;
    iframe.setAttribute('allow', 'autoplay; fullscreen');
    player.append(iframe);
  }
  const col = el('div', 'vb-col');
  if (headNodes.length) col.append(el('div', 'vb-head', ...headNodes));
  col.append(player);
  block.replaceChildren(bg, el('div', 'vb-inner', col));
}
