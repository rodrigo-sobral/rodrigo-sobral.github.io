/* -----------------------------------------
  Have focus outline only for keyboard users 
 ---------------------------------------- */

const handleFirstTab = (e) => {
	if (e.key === 'Tab') {
		document.body.classList.add('user-is-tabbing')

		window.removeEventListener('keydown', handleFirstTab)
		window.addEventListener('mousedown', handleMouseDownOnce)
	}
}

const handleMouseDownOnce = () => {
	document.body.classList.remove('user-is-tabbing')

	window.removeEventListener('mousedown', handleMouseDownOnce)
	window.addEventListener('keydown', handleFirstTab)
}

window.addEventListener('keydown', handleFirstTab)

let alterStyles = (isBackToTopRendered) => {
	const backToTopButton = document.querySelector(".back-to-top");
	backToTopButton.style.visibility = isBackToTopRendered ? "visible" : "hidden";
	backToTopButton.style.opacity = isBackToTopRendered ? 1 : 0;
	backToTopButton.style.transform = isBackToTopRendered ? "scale(1)" : "scale(0)";
};

window.addEventListener("scroll", () => alterStyles(window.scrollY > 700));

/* --------------------------------------- */
/* ----- View Image Modal ----- */

const modal = document.getElementById('imgModal');
const modalImg = document.getElementById('imgModalContent');

// Add Zoom In Effect to Zoomable Images
document.querySelectorAll('.work__image#zoomable').forEach(img => {
	img.addEventListener('click', function () {
		modal.style.display = 'flex';
		modalImg.src = this.src;
	});
});

/* --------------------------------------- */
/* ----- Close Modal ----- */

const closeModal = () => {
	const zoomDuration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--zoom-animation-duration').trim()) * 1000;

	modalImg.classList.add('zoom-out');
	setTimeout(() => {
		modal.style.display = 'none';
		modalImg.classList.remove('zoom-out');
	}, zoomDuration);
}

// On clicking anywhere
modal.addEventListener('click', (e) => closeModal());

// On ESC or Enter key press
document.addEventListener('keydown', (e) => e.key === 'Escape' || e.key === 'Enter' ? closeModal() : null);
