import BasePage from './base-page';

class Product extends BasePage {
    onReady() {
        this.initProductGallery();
        this.initProductTabs();
        this.weightSelector = {
            toggle: (button) => {
                const optionsList = button.nextElementSibling;
                const isVisible = optionsList.classList.contains('show');

                // إغلاق جميع القوائم المفتوحة
                document.querySelectorAll('.weight-options-list').forEach(list => {
                    list.classList.remove('show');
                    list.previousElementSibling.classList.remove('active');
                });

                // إذا كانت القائمة مغلقة، افتحها
                if (!isVisible) {
                    button.classList.add('active');
                    optionsList.classList.add('show');
                }
            },

            select: (option) => {
                const weight = option.dataset.weight;
                const price = option.dataset.price;
                const button = option.closest('.weight-selector').querySelector('.weight-select-btn');
                
                // تحديث النص المعروض
                button.querySelector('.selected-weight').textContent = option.querySelector('span').textContent;
                
                // إغلاق القائمة
                this.weightSelector.toggle(button);
                
                // إرسال حدث تغيير الوزن
                salla.event.dispatch('product::weightChanged', { weight, price });
            }
        };

        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.weight-selector')) {
                document.querySelectorAll('.weight-options-list').forEach(list => {
                    list.classList.remove('show');
                    list.previousElementSibling.classList.remove('active');
                });
            }
        });

        // إضافة مستمع النقر لخيارات الوزن
        document.querySelectorAll('.weight-option').forEach(option => {
            option.addEventListener('click', () => this.weightSelector.select(option));
        });
    }

    initProductGallery() {
        const mainImage = document.getElementById('main-product-image');
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainWrapper = document.querySelector('.main-image-wrapper');
        const prevButton = document.querySelector('.control-btn.prev');
        const nextButton = document.querySelector('.control-btn.next');
        const zoomButton = document.querySelector('.control-btn.zoom');

        if (!mainImage || !thumbnails.length) return;

        let currentIndex = 0;
        const maxIndex = thumbnails.length - 1;
        let isZoomed = false;

        // تحديث الصورة الرئيسية مع تأثير انتقالي
        const updateMainImage = (index, direction = 'next') => {
            const targetThumbnail = thumbnails[index].querySelector('img');
            
            // إضافة تأثير انتقالي للصورة
            mainImage.style.opacity = '0';
            mainImage.style.transform = `translateX(${direction === 'next' ? '-10px' : '10px'})`;
            
            setTimeout(() => {
                mainImage.src = targetThumbnail.src;
                mainImage.style.opacity = '1';
                mainImage.style.transform = 'translateX(0)';
            }, 200);

            // تحديث حالة المصغرات
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            thumbnails[index].classList.add('active');
            
            currentIndex = index;
        };

        // معالجة التكبير
        const handleZoom = (e) => {
            if (!isZoomed) return;

            const rect = mainImage.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            mainImage.style.transformOrigin = `${x * 100}% ${y * 100}%`;
        };

        // تفعيل/تعطيل التكبير
        const toggleZoom = () => {
            isZoomed = !isZoomed;
            mainWrapper.classList.toggle('zoomed');
            
            if (isZoomed) {
                mainImage.style.transform = 'scale(2.5)';
                zoomButton.querySelector('i').className = 'sicon-zoom-out';
                mainWrapper.addEventListener('mousemove', handleZoom);
            } else {
                mainImage.style.transform = 'scale(1)';
                zoomButton.querySelector('i').className = 'sicon-zoom-in';
                mainWrapper.removeEventListener('mousemove', handleZoom);
            }
        };

        // معالجة النقر على المصغرات
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => {
                if (index === currentIndex) return;
                const direction = index > currentIndex ? 'next' : 'prev';
                updateMainImage(index, direction);
            });
        });

        // معالجة أزرار التنقل
        if (prevButton) {
            prevButton.addEventListener('click', (e) => {
                e.preventDefault();
                const newIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
                updateMainImage(newIndex, 'prev');
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', (e) => {
                e.preventDefault();
                const newIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
                updateMainImage(newIndex, 'next');
            });
        }

        // زر التكبير
        if (zoomButton) {
            zoomButton.addEventListener('click', toggleZoom);
        }

        // معالجة التنقل باللمس للموبايل
        let touchStartX = 0;
        let touchEndX = 0;

        mainWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        mainWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchEndX - touchStartX;
            
            if (Math.abs(diff) > 50) { // تأكد من أن السحب كافٍ
                if (diff > 0) {
                    prevButton?.click();
                } else {
                    nextButton?.click();
                }
            }
        }, { passive: true });

        // معالجة أزرار لوحة المفاتيح
        document.addEventListener('keydown', (e) => {
            if (!mainWrapper.matches(':hover')) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    prevButton?.click();
                    break;
                case 'ArrowRight':
                    nextButton?.click();
                    break;
                case ' ': // مسافة
                    e.preventDefault();
                    zoomButton?.click();
                    break;
            }
        });

        // تحميل مسبق للصور
        thumbnails.forEach(thumbnail => {
            const img = new Image();
            img.src = thumbnail.querySelector('img').src;
        });
    }

    initProductTabs() {
        const tabsContainer = document.querySelector('.product-tabs-container');
        if (!tabsContainer) return;

        const tabButtons = tabsContainer.querySelectorAll('.tab-btn');
        const tabPanels = tabsContainer.querySelectorAll('.tab-panel');

        // إخفاء جميع المحتويات ما عدا المحتوى النشط
        const hideAllPanels = () => {
            tabPanels.forEach(panel => {
                panel.style.display = 'none';
            });
        };

        // إزالة الحالة النشطة من جميع الأزرار
        const deactivateAllTabs = () => {
            tabButtons.forEach(button => {
                button.classList.remove('active');
            });
        };

        // تفعيل التبويب المحدد
        const activateTab = (tabId) => {
            // إخفاء جميع المحتويات
            hideAllPanels();
            
            // إزالة الحالة النشطة من جميع الأزرار
            deactivateAllTabs();

            // تفعيل الزر المحدد
            const selectedButton = tabsContainer.querySelector(`[data-tab="${tabId}"]`);
            selectedButton.classList.add('active');

            // إظهار المحتوى المحدد
            const selectedPanel = tabsContainer.querySelector(`.tab-panel[data-tab="${tabId}"]`);
            selectedPanel.style.display = 'block';

            // حفظ التبويب النشط في localStorage
            localStorage.setItem('activeProductTab', tabId);
        };

        // إضافة مستمع الأحداث لكل زر
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                activateTab(tabId);
            });
        });

        // تفعيل التبويب المحفوظ أو التبويب الافتراضي
        const savedTab = localStorage.getItem('activeProductTab');
        if (savedTab && tabsContainer.querySelector(`[data-tab="${savedTab}"]`)) {
            activateTab(savedTab);
        } else {
            // تفعيل تبويب "تفاصيل المنتج" كافتراضي
            activateTab('details');
        }

        // تحديث التبويب النشط عند تغيير الـ URL
        window.addEventListener('popstate', () => {
            const hash = window.location.hash.replace('#', '');
            if (hash && tabsContainer.querySelector(`[data-tab="${hash}"]`)) {
                activateTab(hash);
            }
        });
    }
}

// تصدير الصفحة
Product.initiateWhenReady(['product.single']);
