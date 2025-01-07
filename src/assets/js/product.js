import 'lite-youtube-embed';
import BasePage from './base-page';
import Fslightbox from 'fslightbox';
import { zoom } from './partials/image-zoom';

window.fslightbox = Fslightbox;

class Product extends BasePage {
    constructor() {
        super();
        this.gallery = null;
        this.tabs = null;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.gallery = new ProductGallery();
            this.tabs = new ProductTabs();
        });
    }

    onReady() {
        app.watchElements({
            totalPrice: '.total-price',
            beforePrice: '.before-price',
            startingPriceTitle: '.starting-price-title',
        });

        this.initProductOptionValidations();
        this.initImagesZooming();
        this.registerEvents();

        if (window.innerWidth >= 1024) {
            this.initZoom();
        }

        // مراقبة تغيير حجم النافذة
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024) {
                this.initZoom();
            }
        });
    }

    initProductOptionValidations() {
        document.querySelector('.product-form')?.addEventListener('change', function() {
            this.reportValidity() && salla.product.getPrice(new FormData(this));
        });
    }

    initImagesZooming() {
        if (window.innerWidth < 1024) return;

        const mainImage = document.querySelector('.image-slider .swiper-slide-active img');
        if (!mainImage) return;
        
        // تأكد من وجود معرف للصورة
        if (!mainImage.id) {
            mainImage.id = 'product-main-image';
        }

        zoom(mainImage.id);

        // تحديث عند تغيير الصورة
        document.querySelector('salla-slider.details-slider')?.addEventListener('slideChange', () => {
            setTimeout(() => {
                const newImage = document.querySelector('.image-slider .swiper-slide-active img');
                if (newImage) {
                    newImage.id = 'product-main-image';
                    zoom(newImage.id);
                }
            }, 100);
        });
    }

    registerEvents() {
        salla.product.event.onPriceUpdated(res => {
            const data = res.data;
            const isOnSale = data.has_sale_price && data.regular_price > data.price;

            app.element('.out-of-stock').classList.add('hidden');
            app.element('.price-wrapper').classList.remove('hidden');
            app.startingPriceTitle?.classList.add('hidden');

            app.totalPrice.forEach(el => el.innerText = salla.money(data.price));
            app.beforePrice.forEach(el => el.innerText = salla.money(data.regular_price));

            app.toggleClassIf('.price_is_on_sale', 'showed', 'hidden', () => isOnSale);
            app.toggleClassIf('.starting-or-normal-price', 'hidden', 'showed', () => isOnSale);

            app.anime('.total-price', { scale: [0.88, 1] });
        });

        salla.event.on('product::price.updated.failed', () => {
            app.element('.price-wrapper').classList.add('hidden');
            app.element('.out-of-stock').classList.remove('hidden');
            app.anime('.out-of-stock', { scale: [0.88, 1] });
        });

        app.onClick('#btn-show-more', e => {
            app.all('#more-content', div => {
                e.target.classList.add('is-expanded');
                div.style.maxHeight = `${div.scrollHeight}px`;
            });
            e.target.remove();
        });
    }

    initZoom() {
        // تطبيق التكبير على الصورة النشطة
        const activeSlide = document.querySelector('.swiper-slide-active');
        if (!activeSlide) return;

        const image = activeSlide.querySelector('img');
        if (!image || activeSlide.classList.contains('video-entry')) return;

        zoom(image.id);

        // تحديث عند تغيير الصورة
        document.querySelector('salla-slider.details-slider')?.addEventListener('slideChange', () => {
            setTimeout(() => {
                const newSlide = document.querySelector('.swiper-slide-active');
                const newImage = newSlide?.querySelector('img');
                if (newImage && !newSlide.classList.contains('video-entry')) {
                    zoom(newImage.id);
                }
            }, 100);
        });
    }
}

class ProductGallery {
    constructor() {
        this.mainImage = document.getElementById('main-product-image');
        this.thumbs = document.querySelectorAll('.thumb');
        this.currentIndex = 0;
        this.isAnimating = false;
        
        this.init();
    }

    init() {
        if (!this.mainImage || !this.thumbs.length) return;
        
        this.initGallery();
        this.initVideoThumbs();
    }

    initGallery() {
        const mainImage = document.querySelector('.main-image img');
        const thumbs = document.querySelectorAll('.thumb');
        const prevBtn = document.querySelector('.nav-button.prev');
        const nextBtn = document.querySelector('.nav-button.next');
        
        let currentIndex = 0;

        // تحديث الصورة الرئيسية
        function updateMainImage(index) {
            const thumb = thumbs[index];
            if (!thumb) return;

            // إزالة الفئة النشطة من جميع الصور المصغرة
            thumbs.forEach(t => t.classList.remove('active'));
            
            // إضافة الفئة النشطة للصورة الحالية
            thumb.classList.add('active');
            
            // تحديث الصورة الرئيسية
            const newSrc = thumb.querySelector('img').src;
            mainImage.src = newSrc;
            
            currentIndex = index;
        }

        // التنقل بين الصور
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const newIndex = currentIndex - 1;
                if (newIndex >= 0) {
                    updateMainImage(newIndex);
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const newIndex = currentIndex + 1;
                if (newIndex < thumbs.length) {
                    updateMainImage(newIndex);
                }
            });
        }

        // تحديث الصورة عند النقر على الصور المصغرة
        thumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                updateMainImage(index);
            });
        });
    }

    initVideoThumbs() {
        this.thumbs.forEach(thumb => {
            if (thumb.dataset.type === 'video') {
                thumb.addEventListener('click', () => {
                    const videoUrl = thumb.dataset.video;
                    this.switchToVideo(videoUrl);
                });
            }
        });
    }

    switchImage(index) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        index = this.normalizeIndex(index);
        this.currentIndex = index;

        this.updateThumbs();
        this.loadNewImage();
    }

    normalizeIndex(index) {
        if (index < 0) return this.thumbs.length - 1;
        if (index >= this.thumbs.length) return 0;
        return index;
    }

    updateThumbs() {
        this.thumbs.forEach(thumb => thumb.classList.remove('active'));
        this.thumbs[this.currentIndex].classList.add('active');
    }

    loadNewImage() {
        const currentThumb = this.thumbs[this.currentIndex];
        const newImage = new Image();
        newImage.src = currentThumb.dataset.image;

        this.mainImage.style.opacity = '0';
        
        newImage.onload = () => {
            setTimeout(() => {
                this.mainImage.src = newImage.src;
                this.mainImage.style.opacity = '1';
                this.isAnimating = false;
            }, 200);
        };
    }

    switchToVideo(videoUrl) {
        const container = this.mainImage.parentElement;
        this.mainImage.style.display = 'none';

        let video = container.querySelector('video');
        if (!video) {
            video = document.createElement('video');
            video.className = 'w-full h-full object-cover';
            video.controls = true;
            video.playsInline = true;
            container.appendChild(video);
        }

        video.src = videoUrl;
        video.style.display = 'block';
    }

    prev() {
        this.switchImage(this.currentIndex - 1);
    }

    next() {
        this.switchImage(this.currentIndex + 1);
    }
}

class ProductTabs {
    constructor() {
        this.tabs = document.querySelectorAll('.tab-btn');
        this.panels = document.querySelectorAll('.tab-panel');
        this.init();
    }

    init() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.tab;
                this.switchTab(target);
            });
        });
    }

    switchTab(target) {
        this.tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === target);
        });

        this.panels.forEach(panel => {
            panel.classList.toggle('active', panel.dataset.tab === target);
        });
    }
}

Product.initiateWhenReady(['product.single']);

function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            
            // تحديث الأزرار النشطة
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // تحديث المحتوى النشط
            tabPanels.forEach(panel => {
                panel.classList.toggle('active', panel.dataset.tab === target);
            });
        });
    });
}

// تهيئة التبويبات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initTabs);
