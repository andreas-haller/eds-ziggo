/**
 * channel-overview: searchable, filterable, sortable channel list (source zenderoverzicht).
 *
 * Authoring rows (classified by content, order free):
 *   channel row  = a row whose cells hold a picture: logo picture | number + name paragraphs |
 *                  package list (links) | option pictures (hd, ziggo go, tv gemist, replay tv)
 *   filter row   = a row with two lists: package choices | option choices | reset + apply
 *   sort row     = a row with one list and no link: head paragraph + sort choices
 *   control row  = the remaining row: search placeholder | action list (Filter, Sorteren, Print
 *                  link) | result heading ("Zenders gevonden:")
 * Dynamic surface (dynamic-features row 7): search, filter and sort run client-only over the
 * authored rows; the package / option filter keys come from each row's package link targets and
 * option picture alts. The result count is the number of shown rows.
 * Behaviour (observed on live): Filter / Sorteren open their panel with a .3s height slide.
 *
 * @ew-exempt chrome: the source's visually hidden helper texts (zoek, Zoekopdracht verfijnen of
 *   printen, Sluit filter- / sorteermogelijkheden, Zenderpakketten, Extra's) are block chrome.
 * @ew-exempt metadata: the search placeholder is copied into the input's placeholder attribute
 *   (the authored paragraph stays as the input's visually hidden label); channel names are
 *   copied into the row button's aria-label.
 */
let uid = 0;

function el(tag, className, ...kids) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...kids);
  return e;
}

function sr(text) {
  return el('span', 'zo-sr', text);
}

function glyph(name) {
  // icon-<name>: the source's icon class (not the runtime's span.icon), so audits pair the glyph
  const g = el('span', `zi zi-${name} icon-${name}`);
  g.setAttribute('aria-hidden', 'true');
  return g;
}

/* the pipeline unwraps a lone paragraph to bare cell text; restore it so styles hold */
function ensureP(cell) {
  const inline = [...cell.childNodes].every((n) => n.nodeType === 3
    || (n.nodeType === 1 && !n.matches('p, div, ul, ol, h1, h2, h3, h4, h5, h6, picture, table')));
  if (inline && cell.textContent.trim()) {
    const p = document.createElement('p');
    p.append(...cell.childNodes);
    cell.append(p);
  }
  return cell;
}

const PACK_KEYS = [
  [/\/televisie\/kabel-tv\/?$/, 'kabel-tv'],
  [/\/televisie\/tv-start\/?$/, 'tv-standard'],
];
function packKey(li) {
  const a = li.querySelector('a');
  const href = a ? a.getAttribute('href') : '';
  const hit = PACK_KEYS.find(([re]) => re.test(href));
  return hit ? hit[1] : 'extra';
}

function optionKey(text) {
  const t = text.toLowerCase();
  if (/\bhd\b/.test(t)) return 'ziggo-hd';
  if (/\bgo\b/.test(t)) return 'ziggo-go';
  if (/replay/.test(t)) return 'replay-tv';
  return '';
}

function choiceKey(text) {
  const t = text.toLowerCase();
  if (/alle/.test(t)) return 'all';
  if (/standa/.test(t)) return 'tv-standard';
  if (/kabel/.test(t)) return 'kabel-tv';
  if (/extra/.test(t)) return 'extra';
  return optionKey(t);
}

function sortKey(text) {
  const t = text.toLowerCase();
  const by = /naam/.test(t) ? 'name' : 'number';
  const desc = /aflopend|z-a/.test(t);
  return `${by}-${desc ? 'desc' : 'asc'}`;
}

function buildChannel(row) {
  const cells = [...row.children];
  const imgCells = cells.filter((c) => c.querySelector('picture, img'));
  const logoCell = imgCells[0];
  const optCell = imgCells[1];
  const textCell = cells.find((c) => c !== logoCell && c !== optCell && !c.querySelector('ul, ol')
    && c.textContent.trim());
  const packList = row.querySelector('ul, ol');

  const li = el('li', 'zo-channel');
  const btn = el('button', 'zo-channel-btn');
  btn.type = 'button';
  li.append(btn);

  const meta = el('div', 'zo-channel-meta');
  const epg = el('div', 'zo-channel-epg');
  const title = el('div', 'zo-channel-title');
  if (textCell) {
    ensureP(textCell);
    const ps = [...textCell.querySelectorAll('p')];
    const num = ps.find((p) => /^\s*\d+\s*$/.test(p.textContent));
    const name = ps.find((p) => p !== num);
    if (num) epg.append(num);
    if (name) title.append(name);
    ps.filter((p) => p !== num && p !== name).forEach((p) => title.append(p));
  }
  meta.append(epg, title);
  btn.id = `kanaal${epg.textContent.trim()}`;
  btn.setAttribute('aria-label', `${title.textContent.trim()}, druk enter voor meer informatie`);

  const dd = el('div', 'zo-channel-dd');
  const logo = el('div', 'zo-channel-logo');
  if (logoCell) logo.append(...logoCell.querySelectorAll('picture, img:not(picture img)'));
  dd.append(logo);

  const packs = [];
  if (packList) {
    dd.append(sr('Zenderpakketten'));
    const wrap = el('div', 'zo-packs', packList);
    [...packList.children].forEach((item, i, all) => {
      packs.push(packKey(item));
      // a link-less package (source: a paragraph in the item) keeps its paragraph box
      if (!item.querySelector('a, p')) item.append(el('p', '', ...item.childNodes));
      if (i < all.length - 1) {
        const sep = el('span', 'zo-packs-sep', ', ');
        item.append(sep);
      }
    });
    dd.append(wrap);
  }

  const options = [];
  if (optCell) {
    dd.append(sr("Extra's"));
    const wrap = el('div', 'zo-opts');
    optCell.querySelectorAll('picture, img:not(picture img)').forEach((pic) => {
      const img = pic.tagName === 'IMG' ? pic : pic.querySelector('img');
      const key = optionKey(img ? img.alt : '');
      if (key) options.push(key);
      wrap.append(el('span', 'zo-opts-item', pic));
    });
    dd.append(wrap);
  }

  li.dataset.packs = [...new Set(packs)].join(' ');
  li.dataset.options = options.join(' ');
  li.append(el('div', 'zo-channel-label', el('div', 'zo-channel-info', el('div', 'zo-channel-dt', meta), dd)));
  return li;
}

function choiceList(list, type, name) {
  [...list.children].forEach((item, i) => {
    uid += 1;
    const id = `zo-${name}-${uid}`;
    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    input.name = type === 'radio' ? name : id;
    input.value = name === 'sort' ? sortKey(item.textContent) : choiceKey(item.textContent);
    if (type === 'radio' && name === 'pack' && i === 0) input.checked = true;
    const label = el('label', 'zo-choice-label', ...item.childNodes);
    label.htmlFor = id;
    item.append(input, label);
  });
  return list;
}

function roleButton(node, className) {
  const b = el('div', className, node);
  b.setAttribute('role', 'button');
  b.tabIndex = 0;
  b.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      b.click();
    }
  });
  return b;
}

function closeButton(label) {
  const b = el('button', 'zo-panel-close zi zi-close icon-close', sr(label));
  b.type = 'button';
  return b;
}

function slideOpen(panel) {
  panel.hidden = false;
  const h = panel.scrollHeight;
  panel.style.height = '0px';
  panel.classList.add('is-sliding');
  requestAnimationFrame(() => {
    panel.style.height = `${h}px`;
  });
  panel.addEventListener('transitionend', () => {
    panel.style.height = '';
    panel.classList.remove('is-sliding');
  }, { once: true });
}

export default function decorate(block) {
  if (block.querySelector('.zo-list')) return;
  const rows = [...block.children];
  const channelRows = rows.filter((r) => r.querySelector('picture, img'));
  const rest = rows.filter((r) => !channelRows.includes(r));
  const filterRow = rest.find((r) => r.querySelectorAll('ul, ol').length >= 2);
  const sortRow = rest.find((r) => r !== filterRow && r.querySelectorAll('ul, ol').length === 1
    && !r.querySelector('a'));
  const controlRow = rest.find((r) => r !== filterRow && r !== sortRow);

  /* search */
  const search = el('div', 'zo-search');
  const form = el('form', 'zo-search-form');
  form.setAttribute('role', 'search');
  const input = document.createElement('input');
  input.className = 'zo-search-input';
  input.type = 'search';
  uid += 1;
  input.id = `channel-search-${uid}`;
  const label = el('label', 'zo-search-label');
  label.htmlFor = input.id;
  const searchBtn = el('button', 'zo-search-btn', glyph('search'), ' ', sr('zoek'));
  searchBtn.type = 'submit';
  form.append(label, input, searchBtn);
  search.append(form);

  /* action bar + result heading */
  const bar = el('div', 'zo-bar');
  uid += 1;
  const barLabel = el('p', 'zo-sr', 'Zoekopdracht verfijnen of printen');
  barLabel.id = `zo-bar-label-${uid}`;
  bar.append(barLabel);
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-labelledby', barLabel.id);
  const results = el('div', 'zo-results-title');
  const count = document.createTextNode('');
  const toggles = [];
  if (controlRow) {
    const cells = [...controlRow.children];
    const barList = controlRow.querySelector('ul, ol');
    const heading = controlRow.querySelector('h1, h2, h3, h4, h5, h6');
    const textCell = cells.find((c) => !c.contains(barList) && !(heading && c.contains(heading)));
    if (textCell) {
      ensureP(textCell);
      label.append(...textCell.childNodes);
      input.placeholder = label.textContent.trim();
    }
    if (barList) {
      const icons = ['sliders', 'playlist'];
      [...barList.children].forEach((item) => {
        const a = item.querySelector('a');
        if (a) {
          a.prepend(glyph('file'), ' ');
          return;
        }
        const t = roleButton(document.createDocumentFragment(), 'zo-bar-btn');
        t.append(glyph(icons[toggles.length] || 'sliders'), ' ', ...item.childNodes);
        t.setAttribute('aria-expanded', 'false');
        item.append(t);
        toggles.push(t);
      });
      bar.append(barList);
    }
    if (heading) {
      results.append(heading);
      heading.append(count, sr(' gevonden'));
    }
  }
  if (!count.parentNode) results.append(count);

  /* panels */
  const panels = el('div', 'zo-panels');
  const filterPanel = el('div', 'zo-panel zo-panel-filter');
  const sortPanel = el('div', 'zo-panel zo-panel-sort');
  let applyBtn;
  let resetBtn;
  if (filterRow) {
    const section = el('div', 'zo-filter-section');
    const submit = el('div', 'zo-filter-submit');
    [...filterRow.children].forEach((cell) => {
      const list = cell.querySelector('ul, ol');
      if (list) {
        const opts = list.children.length && choiceKey(list.children[0].textContent) !== 'all';
        const group = el('div', 'zo-filter-group');
        group.append(...[...cell.childNodes].filter((n) => n !== list));
        group.append(choiceList(list, opts ? 'checkbox' : 'radio', opts ? 'opt' : 'pack'));
        section.append(el('div', `zo-filter-row${opts ? ' zo-filter-row-check' : ''}`, group));
      } else {
        ensureP(cell);
        const ps = [...cell.querySelectorAll('p')];
        const go = ps.find((p) => p.querySelector('strong, b')) || ps[ps.length - 1];
        const reset = ps.find((p) => p !== go);
        if (reset) {
          resetBtn = roleButton(reset, 'zo-filter-reset');
          submit.append(el('div', 'zo-filter-clear', resetBtn));
        }
        if (go) {
          applyBtn = roleButton(go, 'zo-filter-go');
          submit.append(el('div', 'zo-filter-apply', applyBtn));
        }
      }
    });
    filterPanel.append(closeButton('Sluit filtermogelijkheden'), section, submit);
  }
  if (sortRow) {
    const list = sortRow.querySelector('ul, ol');
    const head = el('div', 'zo-sort-head', ...[...sortRow.querySelectorAll(':scope > div > *')].filter((n) => n !== list));
    sortPanel.append(closeButton('Sluit sorteermogelijkheden'), el('div', 'zo-sort-section', head, choiceList(list, 'radio', 'sort')));
  }
  [filterPanel, sortPanel].forEach((p, i) => {
    uid += 1;
    p.id = `zo-panel-${uid}`;
    p.hidden = true;
    if (toggles[i]) toggles[i].setAttribute('aria-controls', p.id);
  });
  panels.append(filterPanel, sortPanel);
  bar.append(panels);

  /* channel list */
  const list = el('ul', 'zo-list');
  channelRows.forEach((r) => list.append(buildChannel(r)));
  const items = [...list.children];

  const overview = el('div', 'zo', el('div', 'zo-col', search, bar, el('div', 'zo-results', results, list)));
  block.replaceChildren(overview);

  /* behaviour: search, filter, sort over the authored rows */
  let query = '';
  const shown = () => {
    const pack = filterPanel.querySelector('input[type="radio"]:checked')?.value || 'all';
    const opts = [...filterPanel.querySelectorAll('input[type="checkbox"]:checked')].map((i) => i.value);
    let n = 0;
    items.forEach((li) => {
      const t = li.querySelector('.zo-channel-title').textContent.toLowerCase();
      const e = li.querySelector('.zo-channel-epg').textContent.trim();
      const packs = li.dataset.packs.split(' ');
      const have = li.dataset.options.split(' ');
      const hit = (!query || t.includes(query) || e.startsWith(query))
        && (pack === 'all' || packs.includes(pack))
        && opts.every((o) => have.includes(o));
      li.hidden = !hit;
      if (hit) n += 1;
    });
    count.textContent = ` ${n} `;
  };
  shown();
  const runSearch = () => {
    query = input.value.trim().toLowerCase();
    shown();
  };
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    runSearch();
  });
  input.addEventListener('input', runSearch);

  const close = () => toggles.forEach((t) => {
    t.setAttribute('aria-expanded', 'false');
    t.closest('li')?.classList.remove('is-active');
    const p = document.getElementById(t.getAttribute('aria-controls'));
    if (p) p.hidden = true;
  });
  toggles.forEach((t) => t.addEventListener('click', () => {
    const open = t.getAttribute('aria-expanded') === 'true';
    close();
    if (open) return;
    t.setAttribute('aria-expanded', 'true');
    t.closest('li')?.classList.add('is-active');
    const p = document.getElementById(t.getAttribute('aria-controls'));
    if (p) slideOpen(p);
  }));
  block.querySelectorAll('.zo-panel-close').forEach((b) => b.addEventListener('click', close));
  applyBtn?.addEventListener('click', () => {
    shown();
    close();
  });
  resetBtn?.addEventListener('click', () => {
    const first = filterPanel.querySelector('input[type="radio"]');
    if (first) first.checked = true;
    filterPanel.querySelectorAll('input[type="checkbox"]').forEach((i) => {
      i.checked = false;
    });
    shown();
  });
  sortPanel.querySelectorAll('input[type="radio"]').forEach((r) => r.addEventListener('change', () => {
    const byNumber = r.value.startsWith('number');
    const key = (li) => (byNumber
      ? Number(li.querySelector('.zo-channel-epg').textContent)
      : li.querySelector('.zo-channel-title').textContent.toLowerCase());
    const dir = r.value.endsWith('desc') ? -1 : 1;
    items.slice().sort((a, b) => {
      const ka = key(a);
      const kb = key(b);
      if (ka > kb) return dir;
      if (ka < kb) return -dir;
      return 0;
    }).forEach((li) => list.append(li));
    close();
  }));
}
