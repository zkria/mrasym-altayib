/**
 * Create a magnifier glass for images zooming.
 *
 * @param imgID the id of the image to be zoomed
 * @returns void
 */
export function zoom(imgID) {
	const img = document.getElementById(imgID);
	if (!img) return;

	// إنشاء العدسة
	const glass = document.createElement('div');
	glass.className = 'magnifier-glass';
	document.body.appendChild(glass);

	// تعيين حجم العدسة
	const GLASS_SIZE = 250;
	glass.style.width = GLASS_SIZE + 'px';
	glass.style.height = GLASS_SIZE + 'px';

	function updateMagnifier(e) {
		// الحصول على إحداثيات الصورة
		const rect = img.getBoundingClientRect();
		
		// تحديث موقع العدسة
		glass.style.left = (e.pageX - GLASS_SIZE/2) + 'px';
		glass.style.top = (e.pageY - GLASS_SIZE/2) + 'px';

		// حساب موقع المؤشر نسبة للصورة
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		// تحديث الصورة المكبرة
		 glass.style.backgroundImage = `url(${img.src})`;
		glass.style.backgroundSize = (rect.width * 2) + 'px ' + (rect.height * 2) + 'px';
		glass.style.backgroundPosition = `-${x * 2 - GLASS_SIZE/2}px -${y * 2 - GLASS_SIZE/2}px`;
	}

	// إضافة مستمعات الأحداث للصورة وحاويتها
	const wrapper = img.closest('.magnify-wrapper');
	if (wrapper) {
		wrapper.addEventListener('mousemove', (e) => {
			e.preventDefault();
			glass.style.display = 'block';
			updateMagnifier(e);
		});

		wrapper.addEventListener('mouseleave', () => {
			glass.style.display = 'none';
		});

		// تعطيل الرابط عند التكبير
		wrapper.addEventListener('click', (e) => {
			if (window.innerWidth >= 1024) {
				e.preventDefault();
			}
		});
	}

	// تنظيف عند إزالة الصورة
	return () => glass.remove();
}
