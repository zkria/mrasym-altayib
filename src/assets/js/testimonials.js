import BasePage from './base-page';

class Testimonials extends BasePage {
    onReady() {
        let commentsList = app.element('salla-comments');

        let urlParams = new URLSearchParams(window.location.search);
        // تعيين الترتيب من معلمات URL
        if (urlParams.has('sort')) {
            app.element('#testimonials-filter').value = urlParams.get('sort');
        }

        // فرز التعليقات عند تغيير الفلتر
        app.on('change', '#testimonials-filter', async (event) => {
            window.history.replaceState(null, null, salla.helpers.addParamToUrl('sort', event.currentTarget.value));
            commentsList.sort = event.currentTarget.value;
            await commentsList.reload();
            commentsList.setAttribute('sort', event.currentTarget.value);
        });

        this.applyDarkMode(); // تطبيق الوضع الداكن عند جاهزية الصفحة
    }

    applyDarkMode() {
        const testimonialElements = document.querySelectorAll('#testimonials-filter, .testimonial-item');
        testimonialElements.forEach(el => {
            el.classList.toggle('dark-mode', this.darkMode);
        });
    }
}

// بدء الفئة عند جاهزية الصفحة
Testimonials.initiateWhenReady(['testimonials']);
