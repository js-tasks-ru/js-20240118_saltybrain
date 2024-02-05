export default class NotificationMessage {
  element;
  timerId;
  static instance;
  constructor(message = '', { duration = 1000, type = 'success' } = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;

    this.element = this.createElement(this.template());
  }

  createElement(template) {
    const divEl = document.createElement('div');
    divEl.innerHTML = template;
    return divEl.firstElementChild;
  }

  createNotificationClasses() {
    return `${this.type}`;
  }

  template() {
    return `
    <div class="notification ${this.createNotificationClasses()}" style="--value:${this.duration / 1000}s">
      <div class="timer"></div>
      <div class="inner-wrapper">
        <div class="notification-header">${this.type}</div>
        <div class="notification-body">
          ${this.message}
        </div>
      </div>
    </div>`;
  }

  show(container = document.body) {
    this.handleInstance();

    container.append(this.element);

    this.timerId = setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  handleInstance() {
    if (NotificationMessage.instance) {
      NotificationMessage.instance.destroy();
    }

    NotificationMessage.instance = this;
  }

  destroy() {
    this.remove();

    if (this.timerId) {
      clearTimeout(this.timerId);
    }
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }
}
