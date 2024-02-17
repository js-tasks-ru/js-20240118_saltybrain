class Tooltip {
  static instance;
  element;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;

    this.element = this.createElement(this.template());
  }

  initialize () {
    this.createListeners();
  }

  createElement(template) {
    const el = document.createElement('div');
    el.innerHTML = template;
    return el.firstElementChild;
  }

  template() {
    return `<div class="tooltip">This is tooltip</div>`;
  }

  render(data) {
    this.element.textContent = data;
    document.body.append(this.element);
  }

  createListeners() {
    document.addEventListener('pointerover', this.onDocumentPointerover);
    document.addEventListener('pointerout', this.onDocumentPointerout);
  }

  onDocumentPointerover = ({target}) => {
    if (!target.dataset.tooltip) {
      return;
    }
    this.render(target.dataset.tooltip);
    document.addEventListener('pointermove', this.onDocumentPointermove);
  }

  onDocumentPointerout = () => {
    this.remove();
    document.removeEventListener('pointermove', this.onDocumentPointermove);
  }

  onDocumentPointermove = ({clientX, clientY}) => {
    const shift = 10;
    this.element.style.top = clientY + shift + 'px';
    this.element.style.left = clientX + shift + 'px';
  }

  destroyListeners() {
    document.removeEventListener('pointerover', this.onDocumentPointerover);
    document.removeEventListener('pointerout', this.onDocumentPointerout);
  }

  destroy() {
    this.remove();
    this.destroyListeners();
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }
}

export default Tooltip;
