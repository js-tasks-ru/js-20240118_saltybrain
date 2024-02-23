import fetchJson from './utils/fetch-json.js';
import SortableTableV2 from '../../06-events-practice/1-sortable-table-v2/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable extends SortableTableV2 {
  constructor(headerConfig = [], {
    data = [],
    isSortLocally = false,
    url = '',
    sorted: {id, order} = {
      id: headerConfig.find(({sortable}) => sortable).id,
      order: 'asc'
    }
  } = {}) {
    super(headerConfig, {data, isSortLocally});
    this.url = url;
    this.id = id;
    this.order = order;
    this.start = 0;
    this.end = 10;
    this.createListeners();
    this.render();
  }

  getUrl(searchParams = {}) {
    const url = new URL(`${BACKEND_URL}/${this.url}`);
    Object.entries(searchParams).map(([key, value]) => {
      if (value || !isNaN(value)) {
        url.searchParams.set(key, value);
      }
    });
    return url;
  }

  async render() {
    this.addLoadingClass();
    try {
      const url = this.getUrl({_sort: this.id, _order: this.order, _start: this.start, _end: this.end});
      this.data = await fetchJson(url);
      if (!this.data.length) {
        this.showPlaceholder();
      } else {
        this.renderHeader(this.id, this.order);
        this.renderBody(this.data);
      }
      return this.data;
    } catch (e) {
      console.log(e);
    } finally {
      this.removeLoadingClass();
    }
  }

  async sortOnServer(field, order) {
    this.id = field;
    this.order = order;
    await this.render();
  }

  createListeners() {
    super.createListeners();
    window.addEventListener('scroll', this.onWindowScrollHandler);
  }

  removeEventListeners() {
    super.removeEventListeners();
    window.removeEventListener('scroll', this.onWindowScrollHandler);
  }

  onWindowScrollHandler = () => {
    const {scrollHeight, clientHeight} = document.documentElement;
    const {scrollY} = window;
    const bottomReached = scrollHeight - (scrollY + clientHeight) === 0;
    if (bottomReached) {
      this.end += 10;
      this.render();
    }
  };
}
