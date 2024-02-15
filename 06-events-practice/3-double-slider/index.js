export default class DoubleSlider {
  element;
  subElements = {};
  constructor({
    min,
    max,
    formatValue = value => value,
    selected: {
      from,
      to
    } = {}
  }) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.from = from || this.min;
    this.to = to || this.max;

    this.range = this.max - this.min;

    this.element = this.createElement(this.template());
    this.setSubElements();
    this.createListeners();
  }

  setSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  getSliderRect() {
    return this.subElements.sliderInner.getBoundingClientRect();
  }

  createElement(template) {
    const el = document.createElement('div');
    el.innerHTML = template;
    return el.firstElementChild;
  }

  template() {
    const {left, right} = this.getCoordinates();
    return `
    <div class="range-slider">
      <span data-element="from">${this.formatValue(this.from)}</span>
      <div data-element="sliderInner" class="range-slider__inner">
        <span data-element="progress" class="range-slider__progress" style="left: ${left}%; right: ${right}%"></span>
        <span data-element="thumbLeft" class="range-slider__thumb-left" style="left: ${left}%"></span>
        <span data-element="thumbRight" class="range-slider__thumb-right" style="right: ${right}%"></span>
      </div>
      <span data-element="to">${this.formatValue(this.to)}</span>
    </div>
    `;
  }

  createListeners() {
    this.subElements.thumbLeft.addEventListener('pointerdown', this.onLeftThumbPointerdown);
    this.subElements.thumbRight.addEventListener('pointerdown', this.onRightThumbPointerdown);
  }

  onLeftThumbPointerdown = () => {
    document.removeEventListener('pointermove', this.onRightThumbMove);
    document.addEventListener('pointermove', this.onLeftThumbMove);
    document.addEventListener('pointerup', this.onLeftThumbPointerUp);
  }

  onRightThumbPointerdown = () => {
    document.removeEventListener('pointermove', this.onLeftThumbMove);
    document.addEventListener('pointermove', this.onRightThumbMove);
    document.addEventListener('pointerup', this.onRightThumbPointerUp);
  }

  onLeftThumbPointerUp = () => {
    this.dispatchEvent();
    document.removeEventListener('pointermove', this.onLeftThumbMove);
  }

  onRightThumbPointerUp = () => {
    this.dispatchEvent();
    document.removeEventListener('pointermove', this.onRightThumbMove);
  }

  getRightBoundary() {
    return (this.to - this.min) / this.range * this.getSliderRect().width;
  }

  onLeftThumbMove = ({clientX}) => {
    let left = clientX - this.subElements.thumbLeft.offsetWidth / 2 - this.getSliderRect().left;

    if (left < 0) {
      left = 0;
    }

    if (left > this.getRightBoundary()) {
      left = this.getRightBoundary();
    }

    const leftPercent = Math.round((left / this.getSliderRect().width) * 100);

    this.subElements.thumbLeft.style.left = `${leftPercent}%`;
    this.subElements.progress.style.left = `${leftPercent}%`;
    const newFrom = this.min + this.range / 100 * Math.round(leftPercent);
    this.subElements.from.textContent = this.formatValue(newFrom);
    this.from = newFrom;
  };

  getLeftBoundary() {
    return (this.from - this.min) / this.range * this.getSliderRect().width;
  }

  onRightThumbMove = ({clientX}) => {
    let right = this.getSliderRect().right - clientX - this.subElements.thumbRight.offsetWidth / 2;

    if (right < this.subElements.thumbLeft.offsetWidth / 2) {
      right = 0;
    }

    if (this.getSliderRect().width - right < this.getLeftBoundary()) {
      right = this.getSliderRect().width - this.getLeftBoundary();
    }

    const rightPercent = Math.round((right / this.getSliderRect().width) * 100);

    this.subElements.thumbRight.style.right = `${rightPercent}%`;
    this.subElements.progress.style.right = `${rightPercent}%`;
    const newTo = this.max - this.range / 100 * rightPercent;
    this.subElements.to.textContent = this.formatValue(newTo);
    this.to = newTo;
  };

  dispatchEvent = () => {
    this.element.dispatchEvent(new CustomEvent('range-select', {
      bubles: true,
      detail: {from: this.from, to: this.to},
    }));
  }

  destroyListeners() {
    this.subElements.thumbLeft.removeEventListener('pointerdown', this.onLeftThumbPointerdown);
    this.subElements.thumbRight.removeEventListener('pointerdown', this.onRightThumbPointerdown);
  }

  getCoordinates() {
    const left = (this.from - this.min) / this.range * 100;
    const right = (this.max - this.to) / this.range * 100;
    return {left, right};
  }

  destroy() {
    this.remove();
    this.destroyListeners();
  }

  remove() {
    this.element.remove();
  }
}
