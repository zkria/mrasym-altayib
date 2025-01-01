/**
 * Create a magnifier glass for images zooming.
 *
 * @param imgID the id of the image to be zoomed
 * @param zoom the zoom strength
 * @param darkMode optional parameter to enable dark mode styles
 * @returns void
 */
export function zoom(imgID, zoom = 2, darkMode = false) {
	if (!imgID) return;

	const img = document.getElementById(imgID);
	if (!img) return;

	const glass = document.createElement('DIV');
	glass.className = 'img-magnifier-glass';
	img.parentElement.insertBefore(glass, img);

	// Apply dark mode styles if enabled
	if (darkMode) {
		glass.style.backgroundColor = 'rgba(0,0,0,0.5)'; // Dark background for the glass
		glass.style.borderColor = '#fff'; // Light border for the glass
	} else {
		glass.style.backgroundColor = 'rgba(255,255,255,0.8)'; // Light background for the glass
		glass.style.borderColor = '#000'; // Dark border for the glass
	}

	glass.style.backgroundImage = `url('${img.src}')`;
	glass.style.backgroundRepeat = 'no-repeat';
	glass.style.backgroundSize = `${img.width * zoom}px ${img.height * zoom}px`;

	const bw = 3;
	const w = glass.offsetWidth / 2;
	const h = glass.offsetHeight / 2;

	glass.addEventListener('mousemove', (e) => moveMagnifier(e, img, glass, w, h, bw, zoom));
	img.addEventListener('mousemove', (e) => moveMagnifier(e, img, glass, w, h, bw, zoom));
	glass.addEventListener('touchmove', (e) => moveMagnifier(e, img, glass, w, h, bw, zoom));
	img.addEventListener('touchmove', (e) => moveMagnifier(e, img, glass, w, h, bw, zoom));
}

function moveMagnifier(e, img, glass, w, h, bw, zoom) {
	e.preventDefault();
	const pos = getCursorPos(e, img);
	let x = pos.x;
	let y = pos.y;

	x = Math.max(w / zoom, Math.min(x, img.width - w / zoom));
	y = Math.max(h / zoom, Math.min(y, img.height - h / zoom));

	glass.style.left = `${x - w}px`;
	glass.style.top = `${y - h}px`;
	glass.style.backgroundPosition = `-${(x * zoom - w + bw)}px -${(y * zoom - h + bw)}px`;
}

function getCursorPos(e, img) {
	const a = img.getBoundingClientRect();
	const x = e.pageX - a.left - window.pageXOffset;
	const y = e.pageY - a.top - window.pageYOffset;
	return { x, y };
}
