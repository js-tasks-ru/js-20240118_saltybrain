export default class ColumnChart {
  chartHeight = 50;
  element;
  subElements = {};
  constructor({
    label = '',
    link = '',
    value = 0,
    data = [],
    formatHeading = value => value
  } = {}) {
    this.label = label;
    this.link = link;
    this.value = value;
    this.data = data;
    this.formatHeading = formatHeading;

    this.element = this.createElement(this.template());
    this.setSubElements();
  }

  setSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  createElement(template) {
    const divEl = document.createElement('div');
    divEl.innerHTML = template;
    return divEl.firstElementChild;
  }

  createLinkTemplate() {
    if (!this.link) {
      return '';
    }
    return `<a href="${this.link}" class="column-chart__link">View all</a>`;
  }

  createHeaderTemplate(value = 0) {
    if (!value && value !== 0) {
      return '';
    }
    return `<div data-element="header" class="column-chart__header">${this.formatHeading(value)}</div>`;
  }

  createChartTemplate(data) {
    return this.getColumnProps(data)
        .reduce(
          (temp, {percent, value}) => temp += `<div style="--value: ${value}" data-tooltip="${percent}"></div>`, '');
  }

  loadingClass() {
    return this.data.length ? '' : 'column-chart_loading';
  }

  template() {
    return `
      <div class="column-chart ${this.loadingClass()}" style="--chart-height: ${this.chartHeight}">
        ${this.createTitleTemplate()}
        <div class="column-chart__container">
          ${this.createHeaderTemplate(this.value)}
          <div data-element="body" class="column-chart__chart">
            ${this.createChartTemplate(this.data)}
          </div>
        </div>
      </div>`;
  }

  createTitleTemplate() {
    return `<div data-element="title" class="column-chart__title">
      ${this.label}
      ${this.createLinkTemplate()}
    </div>`;
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data.map(item => ({
      percent: (item / maxValue * 100).toFixed(0) + '%',
      value: String(Math.floor(item * scale))
    }));
  }

  removeLoadingClass() {
    this.element.classList.remove('column-chart_loading');
  }

  getValue(data) {
    return data.reduce((acc, item) => acc += item, 0).toLocaleString('en-US');
  }

  update(data) {
    this.data = data;
    this.value = this.getValue(this.data);
    this.removeLoadingClass();
    this.renderBody(this.data);
    this.renderHeader(this.value);
  }

  renderBody(data) {
    this.subElements.body.innerHTML = this.createChartTemplate(data);
  }

  renderHeader(value) {
    this.subElements.header.innerHTML = this.createHeaderTemplate(value);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
