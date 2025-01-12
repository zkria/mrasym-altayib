import MobileMenu from 'mmenu-light';
import { isElementLoaded } from './utils';

export function initiateMobileMenu() {
  isElementLoaded('#mobile-menu').then((menu) => {
    const mobileMenu = new MobileMenu(menu, "(max-width: 1024px)", "( slidingSubmenus: false)");

    salla.lang.onLoaded(() => {
      mobileMenu.navigation({ title: salla.lang.get('blocks.header.main_menu') });
    });
    const drawer = mobileMenu.offcanvas({ position: salla.config.get('theme.is_rtl') ? "right" : 'left' });

    document.querySelectorAll("a[href='#mobile-menu']").forEach(el => {
      el.addEventListener('click', event => {
        document.body.classList.add('menu-opened');
        event.preventDefault();
        drawer.open();
      });
    });

    document.querySelectorAll(".close-mobile-menu").forEach(el => {
      el.addEventListener('click', event => {
        document.body.classList.remove('menu-opened');
        event.preventDefault();
        drawer.close();
      });
    });
  });
}