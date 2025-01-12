export function element(selector) {
  return document.querySelector(selector);
}

export function isElementLoaded(selector) {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (document.querySelector(selector)) {
        clearInterval(interval);
        return resolve(document.querySelector(selector));
      }
    }, 160);
  });
}