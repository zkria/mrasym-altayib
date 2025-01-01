import MobileMenu from 'mmenu-light';
import Swal from 'sweetalert2';
import Anime from './partials/anime';
import initTootTip from './partials/tooltip';
import AppHelpers from "./app-helpers";

class App extends AppHelpers {
  constructor() {
    super();
    window.app = this;
    this.initDarkMode();
  }

  initDarkMode() {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const currentTheme = localStorage.getItem("theme");

    if (currentTheme === "dark" || (currentTheme === null && prefersDarkScheme.matches)) {
      this.applyDarkMode(true);
    } else {
      this.applyDarkMode(false);
    }

    document.getElementById('toggle-dark-mode').addEventListener('click', () => {
      let isDarkMode = document.body.classList.toggle('dark-mode');
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
      this.applyDarkMode(isDarkMode);
    });
  }

  applyDarkMode(isDarkMode) {
    document.body.classList.toggle('dark-mode', isDarkMode);
    this.setDarkMode(isDarkMode);
  }

  loadTheApp() {
    this.commonThings();
    this.initiateNotifier();
    this.initiateMobileMenu();
    if (header_is_sticky) {
      this.initiateStickyMenu();
    }
    this.initAddToCart();
    this.initiateAdAlert();
    this.initiateDropdowns();
    this.initiateModals();
    this.initiateCollapse();
    this.initAttachWishlistListeners();
    this.changeMenuDirection();
    initTootTip();
    this.loadModalImgOnclick();
    this.initiateSideNav();

    salla.comment.event.onAdded(() => window.location.reload());

    this.status = 'ready';
    document.dispatchEvent(new CustomEvent('theme::ready'));
    this.log('تم تحميل الثيم 🎉');
  }

  log(message) {
    salla.log(`ThemeApp(Raed)::${message}`);
    return this;
  }

  // إصلاح اتجاه القائمة في المستوى الثالث >> كانت القائمة في المستوى الثالث تخرج عن الصفحة
  changeMenuDirection() {
    app.all('.root-level.has-children', item => {
      if (item.classList.contains('change-menu-dir')) return;
      app.on('mouseover', item => {
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
    return new Promise(resolve => {
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

  initiateNotifier() {
    salla.notify.setNotifier((message, type, data) => {
      if (typeof message === 'object') {
        return Swal.fire(message).then(type);
      }

      return Swal.mixin({
        toast: true,
        position: salla.config.get('theme.is_rtl') ? 'top-start' : 'top-end',
        showConfirmButton: false,
        timer: 3500,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
      }).fire({
        icon: type,
        title: message,
        showCloseButton: true,
        timerProgressBar: true
      });
    });
  }

  initiateMobileMenu() {
    this.isElementLoaded('#mobile-menu').then((menu) => {
      const mobileMenu = new MobileMenu(menu, "(max-width: 1024px)", "( slidingSubmenus: false)");

      salla.lang.onLoaded(() => {
        mobileMenu.navigation({ title: salla.lang.get('blocks.header.main_menu') });
      });
      const drawer = mobileMenu.offcanvas({ position: salla.config.get('theme.is_rtl') ? "right" : 'left' });

      this.onClick("a[href='#mobile-menu']", event => {
        document.body.classList.add('menu-opened');
        event.preventDefault() || drawer.close() || drawer.open();
      });
      this.onClick(".close-mobile-menu", event => {
        document.body.classList.remove('menu-opened');
        event.preventDefault() || drawer.close();
      });
    });
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
      isListenerAttached = true; // وضع علامة على أن المستمع تم توصيله
    }
  }

  initiateStickyMenu() {
    let header = this.element('#mainnav'),
      height = this.element('#mainnav .inner')?.clientHeight;
    // عندما تكون الصفحة الرئيسية، لا يوجد رأس
    if (!header) {
      return;
    }

    window.addEventListener('load', () => setTimeout(() => this.setHeaderHeight(), 500));
    window.addEventListener('resize', () => this.setHeaderHeight());

    window.addEventListener('scroll', () => {
      window.scrollY >= header.offsetTop + height ? header.classList.add('fixed-pinned', 'animated') : header.classList.remove('fixed-pinned');
      window.scrollY >= 200 ? header.classList.add('fixed-header') : header.classList.remove('fixed-header', 'animated');
    }, { passive: true });
  }

  setHeaderHeight() {
    let height = this.element('#mainnav .inner').clientHeight,
      header = this.element('#mainnav');
    header.style.height = height + 'px';
  }

  /**
   * نظرًا لأن سلا يخزن استجابة التخزين المؤقت، من المهم إبقاء التنبيه معطلاً إذا أغلقه الزائر.
   * عن طريق تخزين حالة الإعلان في التخزين المحلي `salla.storage.set(...)`
   */
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
      // النقر خارج || النقر على زر الإغلاق
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
      setTimeout(() => this.toggleModal(id, true)); // فترة زمنية صغيرة لتشغيل التبديل بعد إضافة المخفي
    });
    salla.event.document.onClick("[data-close-modal]", e => this.toggleModal('#' + e.target.dataset.closeModal, false));
  }

  toggleModal(id, isOpen) {
    this.toggleClassIf(`${id} .s-salla-modal-overlay`, 'ease-out duration-300 opacity-100', 'opacity-0', () => isOpen)
      .toggleClassIf(`${id} .s-salla-modal-body`,
        'ease-out duration-300 opacity-100 translate-y-0 sm:scale-100', // إضافة هذه الفئات
        'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95', // إزالة هذه الفئات
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

  /**
   * حل لتبسيط وتنظيف، هناك ثلاث طرق لاستخدام هذه الطريقة:
   * 1- استدعاء مباشر: `this.anime('.my-selector')` - سيستخدم القيم الافتراضية
   * 2- استدعاء مباشر مع تجاوز القيم الافتراضية: `this.anime('.my-selector', {duration:3000})`
   * 3- إرجاع كائن لتشغيله لاحقًا: `this.anime('.my-selector', false).duration(3000).play()` - لن يتم تشغيل الرسوم المتحركة إلا عند استدعاء طريقة التشغيل.
   * @param {string|HTMLElement} selector
   * @param {object|undefined|null|null} options - في حالة الحاجة إلى تعيين الخصائص واحدة تلو الأخرى، قم بتعيينها `false`;
   * @return {Anime|*}
   */
  anime(selector, options = null) {
    let anime = new Anime(selector, options);
    return options === false ? anime : anime.play();
  }

  /**
   * هذه الإجراءات مسؤولة عن الضغط على زر "إضافة إلى السلة"،
   * يمكن أن تكون من أي صفحة، خاصة عند تمكين القائمة الضخمة
   */
  initAddToCart() {
    salla.cart.event.onUpdated(summary => {
      document.querySelectorAll('[data-cart-total]').forEach(el => el.innerText = salla.money(summary.total));
      document.querySelectorAll('[data-cart-count]').forEach(el => el.innerText = salla.helpers.number(summary.count));
    });

    salla.cart.event.onItemAdded((response, prodId) => {
      app.element('salla-cart-summary').animateToCart(app.element(`#product-${prodId} img`));
    });
  }

  initiateSideNav() {
    const toggleButton = document.getElementById('toggle-sidenav');
    const sidenav = document.getElementById('sidenav');
    const navbar = document.querySelector('.top-navbar');

    if (toggleButton && sidenav && navbar) {
      toggleButton.addEventListener('click', () => {
        sidenav.classList.toggle('open');
        navbar.classList.toggle('shifted');

        // تحديث موضع الزر عند الفتح والإغلاق
        if (sidenav.classList.contains('open')) {
          toggleButton.style.right = '260px'; // نفس القيمة في CSS
        } else {
          toggleButton.style.right = '0';
        }
      });
    }
  }
}

salla.onReady(() => (new App).loadTheApp());

function toggleSideNav() {
  const sideNav = document.getElementById('sidenav');
  const toggleButton = document.getElementById('toggle-sidenav');
  const topNavbar = document.querySelector('.top-navbar');

  if (!sideNav || !toggleButton || !topNavbar) return;

  const sideNavWidth = sideNav.offsetWidth;

  sideNav.classList.toggle('hidden');
  const isHidden = sideNav.classList.contains('hidden');

  toggleButton.style.right = isHidden ? '0' : `${sideNavWidth}px`;
  topNavbar.style.marginRight = isHidden ? '0' : `${sideNavWidth}px`;
}
