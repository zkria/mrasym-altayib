import { initiateNotifier } from './notifier'; // استيراد وظيفة لإشعارات التطبيق
import Anime from '../partials/anime'; // استيراد مكتبة الرسوم المتحركة
import initTootTip from '../partials/tooltip'; // استيراد وظيفة لتفعيل التلميحات
import AppHelpers from "./app-helpers"; // استيراد المساعدات العامة للتطبيق
import '../pages/dark-mode';

class App extends AppHelpers {
  constructor() {
    super(); // استدعاء المُنشئ من الفئة الأساسية
    window.app = this; // تعيين التطبيق في نافذة المتصفح
    this.checkSystemTheme(); // التحقق من إعدادات النظام عند التحميل
  }

  loadTheApp() {
    this.commonThings(); // تنفيذ الوظائف العامة
    initiateNotifier(); // تفعيل الإشعارات
    this.initAppFeatures(); // دمج الوظائف المتكررة
    this.log('Theme Loaded 🎉'); // تسجيل رسالة في وحدة التحكم
  }

  checkSystemTheme() {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDarkScheme) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }

  initAppFeatures() {
    const features = [
      this.initiateSidebar,
      this.initAddToCart,
      this.initiateAdAlert,
      this.initiateDropdowns,
      this.initiateModals,
      this.initiateCollapse,
      initTootTip,
      this.loadModalImgOnclick
    ];
    
    features.forEach(feature => feature.call(this)); // استدعاء كل وظيفة
  }

  log(message) {
    salla.log(`ThemeApp(Raed)::${message}`); // تسجيل الرسالة في وحدة التحكم
    return this; // إرجاع الكائن الحالي
  }

  // تنفيذ القائمة الجانبية الجديدة
  initiateSidebar() {
    const sidebar = document.getElementById('sidebar-menu'); // الحصول على عنصر القائمة الجانبية
    if (!sidebar) return; // إذا لم يكن هناك قائمة جانبية، الخروج من الدالة

    const overlay = this.createOverlay(); // إنشاء تراكب
    document.body.appendChild(overlay); // إضافة التراكب إلى الجسم

    const toggleSidebar = (show = true) => {
      sidebar.classList.toggle('open', show);
    };

    this.setupToggleButtons(toggleSidebar);
    overlay.addEventListener('click', () => toggleSidebar(false));
    this.setupEscapeKey(toggleSidebar);
    this.initiateSidebarSubmenus(sidebar);
    this.setupCloseButton(toggleSidebar);
  }

  setupToggleButtons(toggleSidebar) {
    const toggleBtns = document.querySelectorAll('.menu-trigger'); // الحصول على أزرار التبديل
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = document.querySelector('.sidebar-menu').classList.contains('open'); // التحقق مما إذا كانت القائمة مفتوحة
        toggleSidebar(!isOpen); // تبديل حالة القائمة
      });
    });
  }

  setupEscapeKey(toggleSidebar) {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('sidebar-open')) {
        toggleSidebar(false); // إغلاق القائمة عند الضغط على مفتاح الهروب
      }
    });
  }

  setupCloseButton(toggleSidebar) {
    const closeButton = document.querySelector('.close-menu'); // تأكد من أن الزر موجود
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        console.log('Close button clicked'); // سجل عند النقر على الزر
        toggleSidebar(false); // إغلاق القائمة عند النقر على زر الإغلاق
      });
    }
  }

  // إنشاء عنصر التراكب
  createOverlay() {
    const overlay = document.createElement('div'); // إنشاء عنصر div جديد
    overlay.id = 'sidebar-overlay'; // تعيين معرف التراكب
    overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 opacity-0 invisible'; // تعيين أنماط التراكب
    return overlay; // إرجاع التراكب
  }

  // التعامل مع القوائم الفرعية في القائمة الجانبية
  initiateSidebarSubmenus(sidebar) {
    const subMenuTriggers = sidebar.querySelectorAll('.menu-item.has-children'); // الحصول على عناصر القائمة الفرعية
    
    subMenuTriggers.forEach(trigger => {
      const subMenu = trigger.querySelector('.sub-menu'); // الحصول على القائمة الفرعية
      if (!subMenu) return; // إذا لم يكن هناك قائمة فرعية، الخروج

      // إضافة زر التبديل
      const toggleBtn = document.createElement('button'); // إنشاء زر جديد
      toggleBtn.className = 'submenu-toggle w-8 h-8 flex items-center justify-center'; // تعيين أنماط الزر
      toggleBtn.innerHTML = '<i class="sicon-keyboard_arrow_down text-sm transition-transform duration-200"></i>'; // إضافة أيقونة الزر
      trigger.appendChild(toggleBtn); // إضافة الزر إلى عنصر القائمة

      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault(); // منع السلوك الافتراضي
        e.stopPropagation(); // منع الحدث من الانتقال إلى العناصر الأبوية

        const isOpen = subMenu.classList.contains('is-open'); // التحقق مما إذا كانت القائمة الفرعية مفتوحة
        
        // تبديل القائمة الفرعية
        if (isOpen) {
          this.anime(subMenu, {
            height: [subMenu.scrollHeight, 0], // تعيين ارتفاع الرسوم المتحركة
            duration: 300, // مدة الرسوم المتحركة
            easing: 'easeOutQuad', // نوع التسهيل
          }).then(() => {
            subMenu.classList.remove('is-open'); // إزالة فئة الفتح
            toggleBtn.querySelector('i').classList.remove('rotate-180'); // إعادة تعيين دوران الأيقونة
          });
        } else {
          subMenu.classList.add('is-open'); // إضافة فئة الفتح
          toggleBtn.querySelector('i').classList.add('rotate-180'); // تدوير الأيقونة
          this.anime(subMenu, {
            height: [0, subMenu.scrollHeight], // تعيين ارتفاع الرسوم المتحركة
            duration: 300, // مدة الرسوم المتحركة
            easing: 'easeOutQuad', // نوع التسهيل
          });
        }
      });

      // تعيين الارتفاع الأولي إلى 0
      subMenu.style.height = '0'; // تعيين ارتفاع القائمة الفرعية إلى 0
      subMenu.style.overflow = 'hidden'; // إخفاء المحتوى الزائد
    });
  }

  // بقية الطرق الأصلية...
  commonThings() {
    this.cleanContentArticles('.content-entry'); // تنظيف محتوى المقالات
  }

  cleanContentArticles(elementsSelector) {
    let articleElements = document.querySelectorAll(elementsSelector); // الحصول على عناصر المقالات
    if (articleElements.length) {
      articleElements.forEach(article => {
        article.innerHTML = article.innerHTML.replace(/\&nbsp;/g, ' '); // استبدال المسافات الفارغة
      });
    }
  }

  // ... (احتفظ ببقية الطرق الأصلية)

  // طرق تعديل السلة لتعمل مع الهيدر الجديد
  initAddToCart() {
    salla.cart.event.onUpdated(summary => {
      // تحديث إجمالي السلة وعدد العناصر
      document.querySelectorAll('[data-cart-total]').forEach(el => el.innerText = salla.money(summary.total));
      document.querySelectorAll('[data-cart-count]').forEach(el => el.innerText = salla.helpers.number(summary.count));
    });

    salla.cart.event.onItemAdded((response, prodId) => {
      const cartIcon = document.querySelector('salla-cart-summary'); // الحصول على أيقونة السلة
      const productImage = document.querySelector(`#product-${prodId} img`); // الحصول على صورة المنتج
      if (cartIcon && productImage) {
        cartIcon.animateToCart(productImage); // تنفيذ الرسوم المتحركة عند إضافة المنتج إلى السلة
      }
    });
  }

  initThemeToggle() {
    const themeButton = document.getElementById('theme-button');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    themeButton.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      document.body.classList.toggle('light-mode');
      sunIcon.style.display = sunIcon.style.display === 'none' ? 'inline' : 'none';
      moonIcon.style.display = moonIcon.style.display === 'none' ? 'inline' : 'none';
    });
  }
}

// تهيئة التطبيق
salla.onReady(() => {
  const appInstance = new App();
  appInstance.loadTheApp();
  appInstance.initThemeToggle(); // تفعيل زر الوضع الداكن
});

// إضافة أنماط مخصصة لرسوم القائمة الجانبية
const style = document.createElement('style'); // إنشاء عنصر style جديد
style.textContent = `
  .sidebar-open {
    overflow: hidden; // منع التمرير عند فتح القائمة الجانبية
  }
  
  .submenu-toggle i {
    transition: transform 0.3s ease; // إضافة تأثير انتقال لتدوير الأيقونة
  }
  
  .submenu-toggle i.rotate-180 {
    transform: rotate(180deg); // تدوير الأيقونة عند فتح القائمة الفرعية
  }
`;
document.head.appendChild(style); // إضافة الأنماط إلى رأس الصفحة

// تنفيذ فئة MenuHandler الجديدة
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
});

document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.getElementById('mainnav');
  const openBtn = document.getElementById('openSidebarBtn');
  const closeBtn = document.getElementById('closeSidebarBtn');
  
  // فتح القائمة
  openBtn.addEventListener('click', () => {
      sidebar.classList.remove('translate-x-full');
      sidebar.classList.add('translate-x-0');
      document.body.style.overflow = 'hidden'; // منع التمرير في الخلفية
  });
  
  // إغلاق القائمة
  closeBtn.addEventListener('click', () => {
      sidebar.classList.add('translate-x-full');
      sidebar.classList.remove('translate-x-0');
      document.body.style.overflow = ''; // إعادة تفعيل التمرير
  });
  
  // إغلاق القائمة عند النقر خارجها
  document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !openBtn.contains(e.target) && !sidebar.classList.contains('translate-x-full')) {
          sidebar.classList.add('translate-x-full');
          sidebar.classList.remove('translate-x-0');
          document.body.style.overflow = '';
      }
  });
});

// إضافة خلفية معتمة عند فتح القائمة
const overlay = document.createElement('div');
overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-40 hidden';
overlay.id = 'sidebarOverlay';
document.body.appendChild(overlay);

// تحديث الخلفية المعتمة
document.getElementById('openSidebarBtn').addEventListener('click', () => {
  document.getElementById('sidebarOverlay').classList.remove('hidden');
});

document.getElementById('closeSidebarBtn').addEventListener('click', () => {
  document.getElementById('sidebarOverlay').classList.add('hidden');
});

const themeButton = document.getElementById('theme-button');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');

themeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    sunIcon.style.display = sunIcon.style.display === 'none' ? 'inline' : 'none';
    moonIcon.style.display = moonIcon.style.display === 'none' ? 'inline' : 'none';
});