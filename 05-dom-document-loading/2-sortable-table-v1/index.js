import { sortArrowTemplate, makeSorting, sortRules } from './utils.js';

export default class SortableTable {
  element;
  subElements = {};
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.element = this.createElement(this.template());
    this.selectSubElements();
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

  template() {
    return `
    <div data-element="productsContainer" class="products-list__container">
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.createHeaderTemplate()}
        </div>
        <div data-element="body" class="sortable-table__body">
          ${this.createBodyTemplate(this.data)}
        </div>
      </div>
    </div>
    `;
  }

  sort(field, order) {
    const {sortType} = this.headerConfig.find(({id}) => id === field);
    const rule = sortRules[sortType];
    const sortedData = makeSorting(this.data, {field, rule, order});

    this.rerenderHeader(field, order);
    this.rerenderBody(sortedData);
  }

  rerenderHeader(field, order) {
    this.subElements.header.innerHTML = this.createHeaderTemplate(field, order);
  }

  rerenderBody(data) {
    this.subElements.body.innerHTML = this.createBodyTemplate(data);
  }

  destroy() {
    this.remove();
  }

  remove() {
    this.element.remove();
  }
}

