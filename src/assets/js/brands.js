import BasePage from './base-page';

class Brands extends BasePage {
    onReady() {
        // تعيين الارتفاع الابتدائي
        const nav = document.querySelector('#brands-nav'),
              navWrap = document.querySelector('.brands-nav-wrap');
        navWrap.style.height = nav.clientHeight + 'px';

        app.onClick('.brands-nav__item', ({ target: btn }) => {
            app.all('.brands-nav__item', el => app.toggleElementClassIf(el, 'is-selected', 'unselected', () => el === btn));
        });

        window.addEventListener('scroll', () => {
            let scrolAtTop = window.pageYOffset <= 200;
            app.toggleClassIf('#brands-nav', 'is-not-sticky', 'is-sticky', () => scrolAtTop);
        });
    }
}

// بدء الفئة عند جاهزية الصفحة
Brands.initiateWhenReady(['brands.index']);
