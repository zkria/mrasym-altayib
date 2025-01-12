function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');

    // حفظ الحالة في التخزين المحلي
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('dark-mode', 'enabled');
    } else {
        localStorage.setItem('dark-mode', 'disabled');
    }
}

// استعادة الحالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const darkModeEnabled = localStorage.getItem('dark-mode') === 'enabled';
    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
    }
});