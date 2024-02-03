export default class ColumnChart {
  chartHeight = 50;
  element;
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

  createHeaderTemplate() {
    if (!this.value && this.value !== 0) {
      return '';
    }
    return `<div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>`;
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
      <div class="${this.loadingClass()} column-chart" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          ${this.label}
          ${this.createLinkTemplate()}
        </div>
        <div class="column-chart__container">
          ${this.createHeaderTemplate()}
          <div data-element="body" class="column-chart__chart">
            ${this.createChartTemplate(this.data)}
          </div>
        </div>
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

  update(data) {
    this.data = data;
    this.element.querySelector('[data-element="body"]').innerHTML = this.createChartTemplate(this.data);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
