class BasePage {
  constructor() {
    // يمكن إضافة أي إعدادات أولية هنا
    this.darkMode = localStorage.getItem('theme') === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  onReady() {
    // يتم استدعاء هذا عند جاهزية الصفحة
    this.applyDarkMode();
  }

  registerEvents() {
    // يتم استدعاء هذا لتسجيل الأحداث
  }

  /**
   * تطبيق الوضع الداكن على الصفحة
   */
  applyDarkMode() {
    document.body.classList.toggle('dark-mode', this.darkMode);
  }

  /**
   * لتجنب تحميل الفئات غير المرغوب فيها، ما لم تكن الصفحة المطلوبة
   * @param {null|string[]} allowedPages
   * @return {*}
   */
  initiate(allowedPages) {
    if (allowedPages && !allowedPages.includes(salla.config.get('page.slug'))) {
      return app.log(`تم تخطي الفئة (${allowedPages.join(',')})`);
    }

    this.onReady();
    this.registerEvents();
    app.log(`تم تحميل الفئة (${allowedPages?.join(',') || '*'}) 🎉`);
  }
}

/**
 * نظرًا لأننا دمجنا عدة فئات في ملف واحد، فلا حاجة لبدء تشغيل جميعها
 */
BasePage.initiateWhenReady = function (allowedPages = null) {
  if (window.app?.status === 'ready') {
    (new this).initiate(allowedPages);
  } else {
    document.addEventListener('theme::ready', () => (new this).initiate(allowedPages));
  }
}

export default BasePage;
