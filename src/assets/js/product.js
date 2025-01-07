import 'lite-youtube-embed';
import BasePage from './base-page';
import Fslightbox from 'fslightbox';
import { zoom } from './partials/image-zoom';

window.fslightbox = Fslightbox;

class Product extends BasePage {
    onReady() {
        // تعريف العناصر المراقبة
        app.watchElements({
            totalPrice: '.total-price',
            beforePrice: '.before-price',
            startingPriceTitle: '.starting-price-title',
        });

        // تهيئة التحقق من خيارات المنتج
        this.initProductOptionValidations();

        // تهيئة تكبير الصور إذا كان مفعلاً
        if (imageZoom) {
            this.initImagesZooming();
            window.addEventListener('resize', () => this.initImagesZooming());
        }

        // تهيئة الخيارات والأحداث
        this.initOptions();

        // إضافة تأثير Sticky للتنقل
        document.addEventListener('DOMContentLoaded', function() {
            const breadcrumbs = document.querySelector('.breadcrumbs-wrapper');
            if (!breadcrumbs) return;

            const observer = new IntersectionObserver(
                ([e]) => {
                    if (e.intersectionRatio < 1) {
                        breadcrumbs.classList.add('is-sticky');
                    } else {
                        breadcrumbs.classList.remove('is-sticky');
                    }
                },
                { threshold: [1] }
            );

            observer.observe(breadcrumbs);
        });
    }

    initProductOptionValidations() {
        document.querySelector('.product-form')?.addEventListener('change', function() {
            this.reportValidity() && salla.product.getPrice(new FormData(this));
        });
    }

    initImagesZooming() {
        // تخطي إذا كانت الشاشة صغيرة أو تم تهيئة التكبير مسبقاً
        const imageZoom = document.querySelector('.image-slider .magnify-wrapper.swiper-slide-active .img-magnifier-glass');
        if (window.innerWidth < 1024 || imageZoom) return;

        setTimeout(() => {
            const image = document.querySelector('.image-slider .swiper-slide-active img');
            zoom(image?.id, 2);
        }, 250);

        // معالجة تغيير الشرائح
        document.querySelector('salla-slider.details-slider')?.addEventListener('slideChange', () => {
            setTimeout(() => {
                const imageZoom = document.querySelector('.image-slider .swiper-slide-active .img-magnifier-glass');
                if (window.innerWidth < 1024 || imageZoom) return;
                
                const image = document.querySelector('.image-slider .magnify-wrapper.swiper-slide-active img');
                zoom(image?.id, 2);
            }, 250);
        });
    }

    initOptions() {
        const form = document.querySelector('.product-form');
        if (!form) return;

        // تحديث السعر عند تغيير الخيارات
        form.querySelectorAll('select, input[type="radio"]').forEach(input => {
            input.addEventListener('change', () => {
                const formData = new FormData(form);
                salla.product.getPrice(formData);
            });
        });
    }

    registerEvents() {
        // معالجة فشل تحديث السعر
        salla.event.on('product::price.updated.failed', () => {
            app.element('.price-wrapper').classList.add('hidden');
            app.element('.out-of-stock').classList.remove('hidden');
            app.anime('.out-of-stock', { scale: [0.88, 1] });
        });

        // معالجة نجاح تحديث السعر
        salla.product.event.onPriceUpdated((res) => {
            app.element('.out-of-stock').classList.add('hidden');
            app.element('.price-wrapper').classList.remove('hidden');

            let data = res.data,
                is_on_sale = data.has_sale_price && data.regular_price > data.price;

            app.startingPriceTitle?.classList.add('hidden');

            app.totalPrice.forEach((el) => { el.innerText = salla.money(data.price) });
            app.beforePrice.forEach((el) => { el.innerText = salla.money(data.regular_price) });

            app.toggleClassIf('.price_is_on_sale', 'showed', 'hidden', () => is_on_sale);
            app.toggleClassIf('.starting-or-normal-price', 'hidden', 'showed', () => is_on_sale);

            app.anime('.total-price', { scale: [0.88, 1] });
        });

        // معالجة زر "اقرأ المزيد"
        app.onClick('#btn-show-more', e => app.all('#more-content', div => {
            e.target.classList.add('is-expanded');
            div.style = `max-height:${div.scrollHeight}px`;
        }) || e.target.remove());
    }
}

Product.initiateWhenReady(['product.single']);
