/**
 * table — an authored grid rendered as a real <table> (source vfz-table: striped, bordered).
 * Each block row is a table row, each cell a <td>; the authored cell content is MOVED (EW1).
 * Variants: apps (the 2-col App | Informatie table on tv-apps: narrow first column).
 * @param {Element} block
 */
export default function decorate(block) {
  const table = document.createElement('table');
  const tbody = document.createElement('tbody');
  [...block.children].forEach((row) => {
    const tr = document.createElement('tr');
    [...row.children].forEach((cell) => {
      const td = document.createElement('td');
      td.append(...cell.childNodes);
      tr.append(td);
    });
    tbody.append(tr);
  });
  table.append(tbody);
  block.replaceChildren(table);
}
