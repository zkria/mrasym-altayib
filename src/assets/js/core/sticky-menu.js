import { element } from './utils';

export function initiateStickyMenu() {
  let header = element('#mainnav'),
    height = element('#mainnav .inner')?.clientHeight;

  if (!header) {
    return;
  }

  window.addEventListener('load', () => setTimeout(() => setHeaderHeight(), 500));
  window.addEventListener('resize', () => setHeaderHeight());

  window.addEventListener('scroll', () => {
    window.scrollY >= header.offsetTop + height ? header.classList.add('fixed-pinned', 'animated') : header.classList.remove('fixed-pinned');
    window.scrollY >= 200 ? header.classList.add('fixed-header') : header.classList.remove('fixed-header', 'animated');
  }, { passive: true });
}

function setHeaderHeight() {
  let height = element('#mainnav .inner').clientHeight,
    header = element('#mainnav');
  header.style.height = height + 'px';
}