import SortableTableV1 from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

export default class SortableTable extends SortableTableV1 {
  element;
  subElements = {};
  constructor(
    headerConfig = [], {
      data = [],
      sorted = {}
    } = {},
    sortLocally = true) {
    super(headerConfig);
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

  createListeners() {
    this.subElements.header.addEventListener('pointerdown', this.onDocumentPointerdown);
  }

  destroyListeners() {
    this.subElements.header.removeEventListener('pointerdown', this.onDocumentPointerdown);
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
      return;
    }
    this.sortOnServer();
  }

  sortOnClient(field, order) {
    super.sort(field, order);
  }

  destroy() {
    super.destroy();
    this.destroyListeners();
  }
}
