import { sortArrowTemplate, makeSorting, sortRules } from '../../utils/utils.js';

export default class SortableTable {
  element;
  subElements = {};
  sortLocally;
  constructor(
    headerConfig = [], {
      data = [],
      sorted = {}
    } = {},
    sortLocally = true) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.sorted = sorted;
    this.sortLocally = sortLocally;

    const sortedData = this.getSortedData(this.sorted.id, this.sorted.order);

    this.element = this.createElement(this.template(sortedData, {
      id: this.sorted.id,
      order: this.sorted.order
    }));
    this.selectSubElements();
    this.createListeners();
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  createElement(template) {
    const el = document.createElement('div');
    el.innerHTML = template;
    return el.firstElementChild;
  }

  createHeaderTemplate(orderedField = '', order = '') {
    return this.headerConfig.map((data) => {
      return this.headerCellTemplate(data, orderedField, order);
    }).join('');
  }

  headerCellTemplate({id, title, sortable}, orderedField = '', order = '') {
    return `
      <div class="sortable-table__cell"
        data-id="${id}" data-sortable="${sortable}"
        ${id === orderedField ? `data-order=${order}` : ''}>
          <span>${title}</span>
          ${sortable ? sortArrowTemplate : ''}
      </div>`;
  }

  createBodyTemplate(data) {
    return data.map((item) => {
      return `<a href="/products/${item.id}" class="sortable-table__row">${this.rowTemplate(item)}</a>`;
    }).join('');
  }

  rowTemplate(data) {
    return this.headerConfig.map(({id, template = this.defaultCellTemplate}) => template(data[id])).join('');
  }

  defaultCellTemplate(content) {
    return `<div class="sortable-table__cell">${content}</div>`;
  }

  template(data, {id, order}) {
    return `
    <div data-element="productsContainer" class="products-list__container">
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.createHeaderTemplate(id, order)}
        </div>
        <div data-element="body" class="sortable-table__body">
          ${this.createBodyTemplate(data)}
        </div>
      </div>
    </div>
    `;
  }

  getSortedData(field, order) {
    const rule = this.getSortRule(field);
    return makeSorting(this.data, {field, rule, order});
  }

  getSortRule(field) {
    const {sortType} = this.headerConfig.find(({id}) => id === field);
    return sortRules[sortType];
  }

  createListeners() {
    this.subElements.header.addEventListener('pointerdown', this.onDocumentPointerdown);
  }

  destroyListeners() {
    this.subElements.header.removeEventListener('pointerover', this.onDocumentPointerover);
  }

  onDocumentPointerdown = ({target}) => {
    const cellNode = target.closest('.sortable-table__cell');
    if (!cellNode) {
      return;
    }

    const {id, sortable, order} = cellNode.dataset;

    if (sortable === 'false') {
      return;
    }

    const sortOrder = this.toggleOrder(order);
    this.sort(id, sortOrder);
  }

  toggleOrder(order) {
    return order === 'desc' ? 'asc' : 'desc';
  }

  sort(field, order) {
    if (this.sortLocally) {
      this.sortOnClient(field, order);
    } else {
      this.sortOnServer();
    }
  }

  renderHeader(field, order) {
    this.subElements.header.innerHTML = this.createHeaderTemplate(field, order);
  }

  renderBody(data) {
    this.subElements.body.innerHTML = this.createBodyTemplate(data);
  }

  sortOnClient(field, order) {
    const {sortType} = this.headerConfig.find(({id}) => id === field);
    const rule = sortRules[sortType];
    const sortedData = makeSorting(this.data, {field, rule, order});

    this.renderHeader(field, order);
    this.renderBody(sortedData);

    const { body } = this.subElements;
    const firstRow = body.firstElementChild;
    const lastRow = body.lastElementChild;
    debugger
  }

  destroy() {
    this.remove();
    this.destroyListeners();
  }

  remove() {
    this.element.remove();
  }
}
