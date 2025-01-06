import BasePage from './base-page';

class Product extends BasePage {
    onReady() {
        this.initProductGallery();
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
}

Product.initiateWhenReady(['product.single']);
