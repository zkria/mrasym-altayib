import Anime from '../partials/anime'; // تحديث المسار
import initTootTip from '../partials/tooltip'; // تحديث المسار
import AppHelpers from "./app-helpers";
import '../pages/dark-mode'; // تأكد من استخدام المسار الصحيح

class App extends AppHelpers {
  constructor() {
    super();
    window.app = this;
    this.initDarkMode();
  }

  loadTheApp() {
    this.commonThings();
    this.initAddToCart();
    this.initiateAdAlert();
    this.initiateDropdowns();
    this.initiateModals();
    this.initiateCollapse();
    this.initAttachWishlistListeners();
    this.changeMenuDirection();
    initTootTip();
    this.loadModalImgOnclick();

    salla.comment.event.onAdded(() => window.location.reload());

    this.status = 'ready';
    document.dispatchEvent(new CustomEvent('theme::ready'));
    this.log('Theme Loaded 🎉');
  }

  log(message) {
    salla.log(`ThemeApp(Raed)::${message}`);
    return this;
  }

  changeMenuDirection() {
    app.all('.root-level.has-children', item => {
      if (item.classList.contains('change-menu-dir')) return;
      app.on('mouseover', item, () => {
        let submenu = item.querySelector('.sub-menu .sub-menu');
        if (submenu) {
          let rect = submenu.getBoundingClientRect();
          (rect.left < 10 || rect.right > window.innerWidth - 10) && app.addClass(item, 'change-menu-dir');
        }
      });
    });
  }

  loadModalImgOnclick() {
    document.querySelectorAll('.load-img-onclick').forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        let modal = document.querySelector('#' + link.dataset.modalId),
          img = modal.querySelector('img'),
          imgSrc = img.dataset.src;
        modal.open();

        if (img.classList.contains('loaded')) return;

        img.src = imgSrc;
        img.classList.add('loaded');
      });
    });
  }

  commonThings() {
    this.cleanContentArticles('.content-entry');
  }

  cleanContentArticles(elementsSelector) {
    let articleElements = document.querySelectorAll(elementsSelector);
    if (articleElements.length) {
      articleElements.forEach(article => {
        article.innerHTML = article.innerHTML.replace(/\&nbsp;/g, ' ');
      });
    }
  }

  isElementLoaded(selector) {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (document.querySelector(selector)) {
          clearInterval(interval);
          return resolve(document.querySelector(selector));
        }
      }, 160);
    });
  }

  copyToClipboard(event) {
    event.preventDefault();
    let aux = document.createElement("input"),
      btn = event.currentTarget;
    aux.setAttribute("value", btn.dataset.content);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    this.toggleElementClassIf(btn, 'copied', 'code-to-copy', () => true);
    setTimeout(() => {
      this.toggleElementClassIf(btn, 'code-to-copy', 'copied', () => true);
    }, 1000);
  }

  initAttachWishlistListeners() {
    let isListenerAttached = false;

    function toggleFavoriteIcon(id, isAdded = true) {
      document.querySelectorAll('.s-product-card-wishlist-btn[data-id="' + id + '"]').forEach(btn => {
        app.toggleElementClassIf(btn, 's-product-card-wishlist-added', 'not-added', () => isAdded);
        app.toggleElementClassIf(btn, 'pulse-anime', 'un-favorited', () => isAdded);
      });
    }

    if (!isListenerAttached) {
      salla.wishlist.event.onAdded((event, id) => toggleFavoriteIcon(id));
      salla.wishlist.event.onRemoved((event, id) => toggleFavoriteIcon(id, false));
      isListenerAttached = true; // Mark the listener as attached
    }
  }

  initiateAdAlert() {
    let ad = this.element(".salla-advertisement");

    if (!ad) {
      return;
    }

    if (!salla.storage.get('statusAd-' + ad.dataset.id)) {
      ad.classList.remove('hidden');
    }

    this.onClick('.ad-close', function (event) {
      event.preventDefault();
      salla.storage.set('statusAd-' + ad.dataset.id, 'dismissed');

      anime({
        targets: '.salla-advertisement',
        opacity: [1, 0],
        duration: 300,
        height: [ad.clientHeight, 0],
        easing: 'easeInOutQuad',
      });
    });
  }

  initiateDropdowns() {
    this.onClick('.dropdown__trigger', ({ target: btn }) => {
      btn.parentElement.classList.toggle('is-opened');
      document.body.classList.toggle('dropdown--is-opened');
      // Click Outside || Click on close btn
      window.addEventListener('click', ({ target: element }) => {
        if (!element.closest('.dropdown__menu') && element !== btn || element.classList.contains('dropdown__close')) {
          btn.parentElement.classList.remove('is-opened');
          document.body.classList.remove('dropdown--is-opened');
        }
      });
    });
  }

  initiateModals() {
    this.onClick('[data-modal-trigger]', e => {
      let id = '#' + e.target.dataset.modalTrigger;
      this.removeClass(id, 'hidden');
      setTimeout(() => this.toggleModal(id, true)); //small amount of time to running toggle After adding hidden
    });
    salla.event.document.onClick("[data-close-modal]", e => this.toggleModal('#' + e.target.dataset.closeModal, false));
  }

  toggleModal(id, isOpen) {
    this.toggleClassIf(`${id} .s-salla-modal-overlay`, 'ease-out duration-300 opacity-100', 'opacity-0', () => isOpen)
      .toggleClassIf(`${id} .s-salla-modal-body`,
        'ease-out duration-300 opacity-100 translate-y-0 sm:scale-100', //add these classes
        'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95', //remove these classes
        () => isOpen)
      .toggleElementClassIf(document.body, 'modal-is-open', 'modal-is-closed', () => isOpen);
    if (!isOpen) {
      setTimeout(() => this.addClass(id, 'hidden'), 350);
    }
  }

  initiateCollapse() {
    document.querySelectorAll('.btn--collapse')
      .forEach((trigger) => {
        const content = document.querySelector('#' + trigger.dataset.show);
        const state = { isOpen: false };

        const onOpen = () => anime({
          targets: content,
          duration: 225,
          height: content.scrollHeight,
          opacity: [0, 1],
          easing: 'easeOutQuart',
        });

        const onClose = () => anime({
          targets: content,
          duration: 225,
          height: 0,
          opacity: [1, 0],
          easing: 'easeOutQuart',
        });

        const toggleState = (isOpen) => {
          state.isOpen = !isOpen;
          this.toggleElementClassIf(content, 'is-closed', 'is-opened', () => isOpen);
        };

        trigger.addEventListener('click', () => {
          const { isOpen } = state;
          toggleState(isOpen);
          isOpen ? onClose() : onOpen();
        });
      });
  }

  anime(selector, options = null) {
    let anime = new Anime(selector, options);
    return options === false ? anime : anime.play();
  }

  initAddToCart() {
    salla.cart.event.onUpdated(summary => {
      document.querySelectorAll('[data-cart-total]').forEach(el => el.innerText = salla.money(summary.total));
      document.querySelectorAll('[data-cart-count]').forEach(el => el.innerText = salla.helpers.number(summary.count));
    });

    salla.cart.event.onItemAdded((response, prodId) => {
      app.element('salla-cart-summary').animateToCart(app.element(`#product-${prodId} img`));
    });
  }

  initDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    darkModeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      this.saveDarkModePreference();
    });

    this.restoreDarkModePreference();
  }

  saveDarkModePreference() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
  }

  restoreDarkModePreference() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }
}

// New MenuHandler class implementation
class MenuHandler {
  constructor() {
    this.isRTL = document.dir === 'rtl';
    this.menuTrigger = document.querySelector('.menu-trigger');
    this.closeButton = document.querySelector('.close-menu');
    this.sidebar = document.querySelector('.sidebar-menu');
    this.overlay = document.querySelector('.sidebar-overlay');
    this.submenuTriggers = document.querySelectorAll('.menu-item.has-children');
    
    this.init();
  }

  init() {
    // Toggle menu
    this.menuTrigger?.addEventListener('click', () => this.toggleMenu(true));
    this.closeButton?.addEventListener('click', () => this.toggleMenu(false));
    this.overlay?.addEventListener('click', () => this.toggleMenu(false));

    // Handle submenus
    this.submenuTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        if (e.target === trigger || e.target.parentElement === trigger) {
          e.preventDefault();
          this.toggleSubmenu(trigger);
        }
      });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.toggleMenu(false);
    });
  }

  toggleMenu(show) {
    document.body.classList.toggle('menu-opened', show);
  }

  toggleSubmenu(trigger) {
    const submenu = trigger.querySelector('.sub-menu');
    const isOpened = trigger.classList.contains('is-opened');
    
    // Close other submenus
    this.submenuTriggers.forEach(item => {
      if (item !== trigger) {
        item.classList.remove('is-opened');
        item.querySelector('.sub-menu')?.classList.remove('is-opened');
      }
    });

    // Toggle current submenu
    trigger.classList.toggle('is-opened', !isOpened);
    submenu?.classList.toggle('is-opened', !isOpened);
  }
}

// Initialize menu handler
document.addEventListener('DOMContentLoaded', () => {
  new MenuHandler();
  const sidebar = document.querySelector('.sidebar-menu');
  const overlay = document.querySelector('.sidebar-overlay');
  const toggleBtn = document.querySelector('.menu-trigger'); // تأكد من وجود زر التبديل

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open'); // تبديل حالة القائمة
    overlay.classList.toggle('visible'); // إظهار التراكب
  });

  // إغلاق القائمة عند النقر على التراكب
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
  });
});

salla.onReady(() => (new App).loadTheApp());
