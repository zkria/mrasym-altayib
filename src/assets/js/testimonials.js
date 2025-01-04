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
    }
}

// بدء الفئة عند جاهزية الصفحة
Testimonials.initiateWhenReady(['testimonials']);
