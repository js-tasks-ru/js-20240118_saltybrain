import { sortArrowTemplate, makeSorting, sortRules } from './utils.js';

export default class SortableTable {
  element;
  subElements;
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.element = this.createElement(this.template());

    this.subElements = {
      header: this.element.querySelector('[data-element="header"]'),
      body: this.element.querySelector('[data-element="body"]')
    };
  }

  createElement(template) {
    const divEl = document.createElement('div');
    divEl.innerHTML = template;
    return divEl.firstElementChild;
  }

  createHeaderTemplate(orderedField = '', order = '') {
    const result = this.headerConfig.reduce((template, item) => {
      const {id, title, sortable} = item;
      const headerCellTemplate =
        `<div class="sortable-table__cell"
          data-id="${id}" data-sortable="${sortable}"
          ${id === orderedField ? `data-order=${order}` : ''}>
            <span>${title}</span>
            ${sortable ? sortArrowTemplate : ''}
          </div>`;
      return template += headerCellTemplate;
    }, '');
    return result;
  }

  createBodyTemplate() {
    const result = this.data.reduce((temp, item) => {
      const rowTemplate = `
      <a href="/products/${item.id}" class="sortable-table__row">${this.createRowTemplate(item)}</a>
      `;
      return temp += rowTemplate;
    }, '');
    return result;
  }

  createRowTemplate(data) {
    const headerFields = this.headerConfig.map(({id, template}) =>
      ({field: id, template: template ? template : this.defaultCellTemplate }));
    const result = headerFields.reduce((temp, {field, template}) => {
      const content = data[field];
      const cellTemplate = template(content);
      return temp += cellTemplate;
    }, '');
    return result;
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
          ${this.createBodyTemplate()}
        </div>
      </div>
    </div>
    `;
  }

  sort(field, order) {
    const {sortType} = this.headerConfig.find(({id}) => id === field);
    const rule = sortRules[sortType];
    this.data = makeSorting(this.data, {field, rule, order});

    this.rerenderHeader(field, order);
    this.rerenderBody();
  }

  rerenderHeader(field, order) {
    const {header} = this.subElements;
    header.innerHTML = this.createHeaderTemplate(field, order);
  }

  rerenderBody() {
    const {body} = this.subElements;
    body.innerHTML = this.createBodyTemplate();
  }

  destroy() {
    this.remove();
  }

  remove() {
    this.element.remove();
  }
}

