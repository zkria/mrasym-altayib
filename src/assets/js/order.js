import BasePage from './base-page';

class Order extends BasePage {
    onReady() {
        app.onClick('salla-button#btn-reorder', ({ currentTarget: btn }) => {
            btn.load()
                .then(() => salla.order.createCartFromOrder())
                .then(() => btn.stop())
                .then(() => app.element('#reorder-modal').hide());
        });

        app.onClick('salla-button#confirm-cancel', ({ currentTarget: btn }) => {
            btn.load()
                .then(() => salla.order.cancel())
                .then(() => {
                    btn.stop();
                    app.element('#modal-order-cancel').hide();
                    window.location.reload();
                })
                .catch(() => {
                    btn.stop();
                    app.element('#modal-order-cancel').hide();
                });
        });

        this.applyDarkMode();
    }

    applyDarkMode() {
        const modalElements = document.querySelectorAll('#reorder-modal, #modal-order-cancel');
        modalElements.forEach(modal => {
            modal.classList.toggle('dark-mode', this.darkMode);
        });
    }
}

// بدء الفئة عند جاهزية الصفحة
Order.initiateWhenReady(['customer.orders.single']);
