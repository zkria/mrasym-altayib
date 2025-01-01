import BasePage from './base-page';

class ThankYou extends BasePage {
    onReady() {
        // تطبيق تأثير الرسوم المتحركة على عنصر الشكر
        app.anime('.thanks-item', { translateX: [20, 0] });

        let form = document.querySelector('#invoice-form');
        // الاستماع لحدث إرسال الفاتورة
        salla.order.event.onInvoiceSent(res => {
            form.innerHTML = res.data.message; // تحديث محتوى النموذج برسالة الفاتورة
            form.classList.add('sent'); // إضافة فئة "sent" للنموذج
        });

        this.applyDarkMode(); // تطبيق الوضع الداكن عند جاهزية الصفحة
    }

    applyDarkMode() {
        const thankYouElements = document.querySelectorAll('.thanks-item, #invoice-form');
        thankYouElements.forEach(el => {
            el.classList.toggle('dark-mode', this.darkMode);
        });
    }
}

// بدء الفئة عند جاهزية الصفحة
ThankYou.initiateWhenReady(['thank-you']);
