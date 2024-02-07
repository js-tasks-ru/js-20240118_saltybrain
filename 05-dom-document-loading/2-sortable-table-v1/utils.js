export const sortArrowTemplate = `
<span data-element="arrow" class="sortable-table__sort-arrow">
  <span class="sort-arrow"></span>
</span>`;

const sortStringRule = (a, b) => a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'});
const sortNumberRule = (a, b) => a - b;

export const sortRules = {
  string: sortStringRule,
  number: sortNumberRule
};

const directions = {
  asc: 1,
  desc: -1
};

export const makeSorting = (array, {field, rule, order}) => {
  return [...array].sort((a, b) => directions[order] * rule(a[field], b[field]));
};