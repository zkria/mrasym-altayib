export default class AppHelpers {

  constructor() {
    this.darkMode = false;
  }

  /**
   * تفعيل أو تعطيل الوضع الداكن
   * @param {boolean} mode
   */
  setDarkMode(mode) {
    this.darkMode = mode;
    return this;
  }

  /**
   * تطبيق الوضع الداكن على عناصر محددة
   * @param {string} selector
   * @param {string} darkClass
   * @param {string} lightClass
   */
  applyDarkMode(selector, darkClass = 'dark-mode', lightClass = 'light-mode') {
    document.querySelectorAll(selector).forEach(element => {
      if (this.darkMode) {
        element.classList.remove(lightClass);
        element.classList.add(darkClass);
      } else {
        element.classList.remove(darkClass);
        element.classList.add(lightClass);
      }
    });
    return this;
  }

  /**
   * @param {string} selector
   * @param {array<string>} classes1
   * @param {array<string>} classes2
   * @param callback
   */
  toggleClassIf(selector, classes1, classes2, callback) {
    document.querySelectorAll(selector).forEach(element => this.toggleElementClassIf(element, classes1, classes2, callback));
    return this;
  }

  toggleElementClassIf(element, classes1, classes2, callback) {
    classes1 = Array.isArray(classes1) ? classes1 : classes1.split(' ');
    classes2 = Array.isArray(classes2) ? classes2 : classes2.split(' ');
    let isClasses1 = callback(element);
    element?.classList.remove(...(isClasses1 ? classes2 : classes1));
    element?.classList.add(...(isClasses1 ? classes1 : classes2));
    return this;
  }

  /**
   * @param {string|HTMLElement} selector
   * @return {null|HTMLElement}
   */
  element(selector) {
    if (typeof selector == 'object') {
      return selector;
    }
    if (selector === '.total-price' || selector === '.before-price') {
      return document.querySelectorAll(selector);
    }
    return document.querySelector(selector);
  }

  /**
   * @param {string} name
   * @param {string} selector
   * @return {Helpers}
   */
  watchElement(name, selector) {
    this[name] = this.element(selector);
    return this;
  }

  /**
   * @param {Object.<string, string>} elements
   */
  watchElements(elements) {
    Object.entries(elements).forEach(element => this.watchElement(element[0], element[1]));
    return this;
  }

  /**
   * @param {string} action
   * @param {string|HTMLElement} element
   * @param {function} callback
   * @param {object|undefined} options
   * @return {AppHelpers}
   */
  on(action, element, callback, options = {}) {
    if (typeof element == 'object') {
      this.element(element).addEventListener(action, callback, options);
      return this;
    }

    //if it's selector loop through all of the elements
    document.querySelectorAll(element).forEach(el => el.addEventListener(action, callback, options));
    return this;
  }

  /**
   * @param {string|HTMLElement} element
   * @param {function} callback
   * @return {AppHelpers}
   */
  onClick(element, callback) {
    return this.on('click', element, callback);
  }

  /**
   * @param {string|HTMLElement} element
   * @param {function} callback
   * @return {AppHelpers}
   */
  onKeyUp(element, callback) {
    return this.on('keyup', element, callback);
  }

  /**
   * @param {string|HTMLElement} element
   * @param {function} callback
   * @return {AppHelpers}
   */
  all(element, callback) {
    document.querySelectorAll(element).forEach(callback);
    return this;
  }

  /**
   * @param {string|HTMLElement} element
   * @return {AppHelpers}
   */
  hideElement(element) {
    this.element(element).style.display = 'none';
    return this;
  }

  /**
   * @param {string|HTMLElement} element
   * @return {AppHelpers}
   */
  showElement(element, display = 'block') {
    this.element(element).style.display = display;
    return this;
  }

  /**
   * 💡 يمكنك تمرير عدة فئات: this.removeClass(element, 'class_1', 'class_2', ...)
   * @param {string|HTMLElement} element
   * @param {string} className
   * @return {AppHelpers}
   */
  removeClass(element, className) {
    this.element(element).classList.remove(...Array.from(arguments).slice(1));
    return this;
  }

  /**
   * 💡 يمكنك تمرير عدة فئات: this.addClass(element, 'class_1', 'class_2', ...)
   * @param {string|HTMLElement} element
   * @param {string} className
   * @return {AppHelpers}
   */
  addClass(element, className) {
    this.element(element).classList.add(...Array.from(arguments).slice(1));
    return this;
  }
}