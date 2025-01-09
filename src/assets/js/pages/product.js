import 'lite-youtube-embed';
import BasePage from '../core/base-page';
import Fslightbox from 'fslightbox';
import { zoom } from '../partials/image-zoom';

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

        if (!mainImage.id) {
            mainImage.id = 'product-main-image';
        }

        zoom(mainImage.id);

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
        const activeSlide = document.querySelector('.swiper-slide-active');
        if (!activeSlide) return;

        const image = activeSlide.querySelector('img');
        if (!image || activeSlide.classList.contains('video-entry')) return;

        zoom(image.id);

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

        function updateMainImage(index) {
            const thumb = thumbs[index];
            if (!thumb) return;

            thumbs.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');

            const newSrc = thumb.querySelector('img').src;
            mainImage.src = newSrc;

            currentIndex = index;
        }

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
        this.tabsContainer = document.querySelector('.product-tabs-container');
        if (!this.tabsContainer) return;

        this.tabs = this.tabsContainer.querySelectorAll('.tab-btn');
        this.panels = this.tabsContainer.querySelectorAll('.tab-panel');

        this.init();
    }

    init() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetId = tab.getAttribute('data-tab');
                this.switchTab(targetId);
            });
        });
    }

    switchTab(targetId) {
        this.tabs.forEach(tab => {
            if (tab.getAttribute('data-tab') === targetId) {
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
            } else {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
            }
        });

        this.panels.forEach(panel => {
            if (panel.getAttribute('data-tab') === targetId) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ProductTabs();
});

Product.initiateWhenReady(['product.single']);

export default function initProductTabs() {
    const tabsContainer = document.querySelector('.product-tabs');
    if (!tabsContainer) return;

    const tabButtons = tabsContainer.querySelectorAll('.tab-btn');
    const tabPanels = tabsContainer.querySelectorAll('.tab-panel');

    function activateTab(tabId) {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));

        const selectedButton = tabsContainer.querySelector(`[data-tab="${tabId}"]`);
        const selectedPanel = tabsContainer.querySelector(`#${tabId}`);

        if (selectedButton && selectedPanel) {
            selectedButton.classList.add('active');
            selectedPanel.classList.add('active');

            selectedButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            activateTab(tabId);

            history.replaceState({}, '', `#${tabId}`);
        });
    });

    const hashTab = window.location.hash.slice(1);
    if (hashTab) {
        activateTab(hashTab);
    } else {
        const firstTab = tabButtons[0]?.getAttribute('data-tab');
        if (firstTab) activateTab(firstTab);
    }
}
