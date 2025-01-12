function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    const isDarkMode = document.documentElement.classList.contains('dark');
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
  }
  
  document.getElementById('theme-button').addEventListener('click', toggleDarkMode);
  
  // عند تحميل الصفحة، تحقق من الوضع المخزن في localStorage
  document.addEventListener('DOMContentLoaded', () => {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
      document.documentElement.classList.add('dark');
    }
  });