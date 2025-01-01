export default function toolTip(darkMode = false) {
  const tooltipToggleClick = document.querySelectorAll('.tooltip-toggle--clickable'),
    tooltipToggleHover = document.querySelectorAll('.tooltip-toggle--hover'),
    closeTooltip = document.querySelectorAll('.close-tooltip');

  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  const showTooltip = (element) => {
    element.classList.add('visible');
    if (darkMode) {
      element.classList.add('tooltip-dark');
    } else {
      element.classList.remove('tooltip-dark');
    }
  };

  const hideTooltip = (element) => {
    element.classList.remove('visible');
  };

  // إظهار التلميح إذا كان النوع قابل للنقر
  if (tooltipToggleClick.length) {
    tooltipToggleClick.forEach((element) => {
      element.addEventListener('click', (e) => {
        e.stopPropagation();
        showTooltip(element);
      });
    });
  }

  // إظهار التلميح إذا كان النوع هو التحويم أو النقر على الأجهزة التي تعمل باللمس
  if (tooltipToggleHover.length) {
    tooltipToggleHover.forEach((element) => {
      if (isTouchDevice) {
        element.addEventListener('click', (e) => {
          e.stopPropagation();
          showTooltip(element);
        });
      } else {
        element.addEventListener('mouseenter', () => {
          showTooltip(element);
        });

        element.addEventListener('mouseleave', () => {
          hideTooltip(element);
        });
      }
    });
  }

  // إخفاء التلميح عند النقر على زر الإغلاق
  if (closeTooltip.length) {
    closeTooltip.forEach(element => {
      element.addEventListener('click', (e) => {
        e.stopPropagation();
        hideTooltip(element.parentElement.parentElement);
      });
    });
  }

  // إخفاء التلميح عند النقر في أي مكان في النافذة
  window.addEventListener('click', () => {
    tooltipToggleClick.forEach((element) => {
      hideTooltip(element);
    });
    tooltipToggleHover.forEach((element) => {
      hideTooltip(element);
    });
  });
}
