import BasePage from './base-page';

class Wishlist extends BasePage {

    onReady() {
        // تهيئة أيقونات قائمة الرغبات في بطاقات المنتجات
        salla.storage.get('salla::wishlist', []).forEach(id => this.toggleFavoriteIcon(id));
        this.applyDarkMode(); // تطبيق الوضع الداكن عند جاهزية الصفحة
    }

    registerEvents() {
        salla.wishlist.event.onAdded((event, id) => this.toggleFavoriteIcon(id));

        salla.wishlist.event.onRemoved((response, id) => {
            this.toggleFavoriteIcon(id, false);

            // مجرد تأثير عند إزالة العنصر من صفحة قائمة الرغبات
            let item = document.querySelector('#wishlist-product-' + id);

            if (!item) {
                return;
            }

            app.anime(item, false)
                .height(0) // -> من 'height' إلى '0'
                .opacity(0)
                .easing('easeInOutQuad')
                .duration(300)
                .complete(() => item.remove() || (document.querySelector('#wishlist>*') || window.location.reload()))
                .play();
        });
    }

    toggleFavoriteIcon(id, isAdded = true) {
        document.querySelectorAll('.btn--wishlist[data-id="' + id + '"]')
            .forEach(btn => {
                app.toggleElementClassIf(btn, 'is-added', 'not-added', () => isAdded);
                // app.toggleElementClassIf(btn, 'pulse', 'un-favorited', () => isAdded);
            });
    }

    applyDarkMode() {
        const wishlistElements = document.querySelectorAll('.wishlist-item, .btn--wishlist');
        wishlistElements.forEach(el => {
            el.classList.toggle('dark-mode', this.darkMode);
        });
    }
}

// بدء الفئة عند جاهزية الصفحة
Wishlist.initiateWhenReady();
