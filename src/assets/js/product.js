import 'lite-youtube-embed';
import BasePage from './base-page';
import Fslightbox from 'fslightbox';
window.fslightbox = Fslightbox;
import { zoom } from './partials/image-zoom';

class Product extends BasePage {
    onReady() {
        app.watchElements({
            totalPrice: '.total-price',
            beforePrice: '.before-price',
            startingPriceTitle: '.starting-price-title',
        });

        this.initProductOptionValidations();
        this.applyDarkMode();

        if (imageZoom) {
            // استدعاء الدالة عند جاهزية الصفحة
            this.initImagesZooming();
            // الاستماع لتغيير حجم الشاشة
            window.addEventListener('resize', () => this.initImagesZooming());
        }
    }

    initProductOptionValidations() {
        document.querySelector('.product-form')?.addEventListener('change', function() {
            this.reportValidity() && salla.product.getPrice(new FormData(this));
        });
    }

    initImagesZooming() {
        // تخطي إذا كانت الشاشة ليست بحجم سطح المكتب أو إذا تم إنشاء مكبر الزجاج بالفعل للصورة
        const imageZoom = document.querySelector('.image-slider .magnify-wrapper.swiper-slide-active .img-magnifier-glass');
        if (window.innerWidth < 1024 || imageZoom) return;

        setTimeout(() => {
            // تعيين تأخير بعد الانتهاء من تغيير الحجم، بدء إنشاء الزجاج
            const image = document.querySelector('.image-slider .swiper-slide-active img');
            zoom(image?.id, 2);
        }, 250);

        document.querySelector('salla-slider.details-slider').addEventListener('slideChange', (e) => {
            // تعيين تأخير حتى تصبح الفئة النشطة جاهزة
            setTimeout(() => {
                const imageZoom = document.querySelector('.image-slider .swiper-slide-active .img-magnifier-glass');

                // إذا تم إنشاء الزجاج بالفعل، تخطي
                if (window.innerWidth < 1024 || imageZoom) return;
                const image = document.querySelector('.image-slider .magnify-wrapper.swiper-slide-active img');
                zoom(image?.id, 2);
            }, 250);
        });
    }

    applyDarkMode() {
        const productElements = document.querySelectorAll('.product-details, .price-wrapper, .product-form');
        productElements.forEach(el => {
            el.classList.toggle('dark-mode', this.darkMode);
        });
    }

    registerEvents() {
        salla.event.on('product::price.updated.failed', () => {
            app.element('.price-wrapper').classList.add('hidden');
            app.element('.out-of-stock').classList.remove('hidden');
            app.anime('.out-of-stock', { scale: [0.88, 1] });
        });

        salla.product.event.onPriceUpdated((res) => {
            app.element('.out-of-stock').classList.add('hidden');
            app.element('.price-wrapper').classList.remove('hidden');

            let data = res.data,
                is_on_sale = data.has_sale_price && data.regular_price > data.price;

            app.startingPriceTitle?.classList.add('hidden');

            app.totalPrice.forEach((el) => { el.innerText = salla.money(data.price); });
            app.beforePrice.forEach((el) => { el.innerText = salla.money(data.regular_price); });

            app.toggleClassIf('.price_is_on_sale', 'showed', 'hidden', () => is_on_sale);
            app.toggleClassIf('.starting-or-normal-price', 'hidden', 'showed', () => is_on_sale);

            app.anime('.total-price', { scale: [0.88, 1] });
        });

        app.onClick('#btn-show-more', e => app.all('#more-content', div => {
            e.target.classList.add('is-expanded');
            div.style = `max-height:${div.scrollHeight}px`;
        }) || e.target.remove());
    }
}

// بدء الفئة عند جاهزية الصفحة
Product.initiateWhenReady(['product.single']);
