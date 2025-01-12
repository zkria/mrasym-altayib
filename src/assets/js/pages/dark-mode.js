function toggleDarkMode() {
    const themeToggle = document.querySelector('.theme-toggle');
    const icon = themeToggle.querySelector('.sun-icon, .moon-icon');
    
    // تبديل الكلاس للأيقونة
    themeToggle.classList.toggle('dark-mode');
    
    if (themeToggle.classList.contains('dark-mode')) {
        icon.classList.remove('sun-icon');
        icon.classList.add('moon-icon');
        document.documentElement.classList.add('dark');
    } else {
        icon.classList.remove('moon-icon');
        icon.classList.add('sun-icon');
        document.documentElement.classList.remove('dark');
    }
    
    // حفظ التفضيل في localStorage
    localStorage.setItem('darkMode', themeToggle.classList.contains('dark-mode'));
}

// تطبيق الوضع المحفوظ عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const themeToggle = document.querySelector('.theme-toggle');

    if (savedDarkMode) {
        themeToggle.classList.add('dark-mode'); // إضافة الكلاس المحفوظ
        document.documentElement.classList.add('dark'); // إضافة الكلاس للعنصر الجذري
        toggleDarkMode(); // تحديث الأيقونة
    } else {
        document.documentElement.classList.remove('dark'); // إزالة الكلاس للعنصر الجذري
    }

    // تفعيل الزر
    const themeButton = document.getElementById('theme-button');
    themeButton.addEventListener('click', toggleDarkMode);
});