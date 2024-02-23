import { sortArrowTemplate, makeSorting, sortRules } from '../../utils/utils.js';

export default class SortableTable {
  element;
  subElements = {};
  loadingClass = 'sortable-table_loading';
  placeholderClass = 'sortable-table__empty-placeholder';
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.element = this.createElement(this.template(this.data));
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

  createLoadingTemplate() {
    return `<div data-element="loading" class="loading-line sortable-table__loading-line"></div>`;
  }

  createPlaceholderTemplate() {
    return `<div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
      <div>
        <p>No products satisfies your filter criteria</p>
        <button type="button" class="button-primary-outline">Reset all filters</button>
      </div>
    </div>`;
  }

  rowTemplate(data) {
    return this.headerConfig.map(({id, template = this.defaultCellTemplate}) => template(data[id])).join('');
  }

  defaultCellTemplate(content) {
    return `<div class="sortable-table__cell">${content}</div>`;
  }

  template(data, {id, order} = {}) {
    return `
    <div data-element="productsContainer" class="products-list__container">
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.createHeaderTemplate(id, order)}
        </div>
        <div data-element="body" class="sortable-table__body">
          ${this.createBodyTemplate(data)}
        </div>

        ${this.createLoadingTemplate()}

        ${this.createPlaceholderTemplate()}
      </div>
    </div>
    `;
  }

  sort(field, order) {
    const sortedData = this.getSortedData(field, order);

    this.renderHeader(field, order);
    this.renderBody(sortedData);
  }

  addLoadingClass() {
    this.element.querySelector('.sortable-table').classList.add(this.loadingClass);
  }

  removeLoadingClass() {
    this.element.querySelector('.sortable-table').classList.remove(this.loadingClass);
  }

  showPlaceholder() {
    this.subElements.emptyPlaceholder.classList.remove(this.placeholderClass);
  }

  getSortedData(field, order) {
    const rule = this.getSortRule(field);
    return makeSorting(this.data, {field, rule, order});
  }

  getSortRule(field) {
    const {sortType} = this.headerConfig.find(({id}) => id === field);
    return sortRules[sortType];
  }

  renderHeader(field, order) {
    this.subElements.header.innerHTML = this.createHeaderTemplate(field, order);
  }

  renderBody(data) {
    this.subElements.body.innerHTML = this.createBodyTemplate(data);
  }

  destroy() {
    this.remove();
  }

  remove() {
    this.element.remove();
  }
}

