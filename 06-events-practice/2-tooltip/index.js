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
  }

  onDocumentPointerover = ({target}) => {
    if (!target.dataset.tooltip) {
      return;
    }
    this.render(target.dataset.tooltip);
    target.addEventListener('pointermove', this.onTargetPointermove);
    target.addEventListener('pointerout', this.remove.bind(this));
  }

  onTargetPointermove = ({clientX, clientY}) => {
    this.element.style.top = clientY + 'px';
    this.element.style.left = clientX + 'px';
  }

  destroyListeners() {
    document.removeEventListener('pointerover', this.onDocumentPointerover);
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
