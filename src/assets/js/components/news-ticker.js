salla.onReady(() => {
    // تهيئة الشريط الإخباري
    const initNewsTicker = () => {
        const ticker = document.querySelector('.news-ticker-container');
        if (!ticker) return;

        const speed = ticker.closest('.news-ticker').dataset.speed || 3;
        const duration = ticker.offsetWidth / 50 * speed;

        ticker.style.animationDuration = `${duration}s`;
    };

    // إيقاف الحركة عند تحويم الماوس
    const handleHover = () => {
        const ticker = document.querySelector('.news-ticker-container');
        if (!ticker) return;

        ticker.addEventListener('mouseenter', () => {
            ticker.style.animationPlayState = 'paused';
        });

        ticker.addEventListener('mouseleave', () => {
            ticker.style.animationPlayState = 'running';
        });
    };

    initNewsTicker();
    handleHover();
}); 