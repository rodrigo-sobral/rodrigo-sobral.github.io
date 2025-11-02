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

/* --------------------------------------- */
/* ----- Mobile Navigation (Hamburger) ---- */

(() => {
	const nav = document.querySelector('.nav');
	const toggle = document.querySelector('.nav__toggle');
	const navList = document.getElementById('primary-navigation');

	if (!nav || !toggle || !navList) return;

	const closeNav = () => {
		nav.classList.remove('is-open');
		toggle.setAttribute('aria-expanded', 'false');
		navList.setAttribute('aria-hidden', 'true');
		document.body.classList.remove('menu-open');
	};

	const openNav = () => {
		nav.classList.add('is-open');
		toggle.setAttribute('aria-expanded', 'true');
		navList.setAttribute('aria-hidden', 'false');
		document.body.classList.add('menu-open');
	};

	const toggleNav = () => {
		if (nav.classList.contains('is-open')) {
			closeNav();
		} else {
			openNav();
		}
	};

	toggle.addEventListener('click', (e) => {
		e.stopPropagation();
		toggleNav();
	});

	// Close when clicking a link inside the menu
	navList.querySelectorAll('.nav__link').forEach(link => {
		link.addEventListener('click', () => closeNav());
	});

	// Close on Escape
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') closeNav();
	});

	// Close on outside click
	document.addEventListener('click', (e) => {
		if (!nav.contains(e.target)) closeNav();
	});

	// Initialize hidden state for a11y
	navList.setAttribute('aria-hidden', 'true');
})();

/* --------------------------------------- */
/* ----- Smooth Scroll (fallback) -------- */

(() => {
	// Native CSS smooth scroll is already enabled via CSS.
	// Provide a JS fallback for older browsers and respect reduced motion.
	const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const supportsNative = 'scrollBehavior' in document.documentElement.style;
	if (prefersReduced || supportsNative) return;

	const duration = 500; // ms

	document.addEventListener('click', (e) => {
		const link = e.target.closest('a[href^="#"]');
		if (!link) return;

		const href = link.getAttribute('href');
		// Allow just '#' to do nothing
		if (href === '#') return;

		const targetEl = (href === '#top') ? document.body : document.querySelector(href);
		if (!targetEl) return;

		e.preventDefault();
		smoothScrollTo(targetEl, duration);
	});

	function smoothScrollTo(el, dur) {
		const start = window.pageYOffset;
		const targetY = (el === document.body) ? 0 : el.getBoundingClientRect().top + window.pageYOffset;
		const distance = targetY - start;
		let startTime = null;

		const easeInOut = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

		function step(timestamp) {
			if (!startTime) startTime = timestamp;
			const elapsed = timestamp - startTime;
			const progress = Math.min(elapsed / dur, 1);
			const eased = easeInOut(progress);
			window.scrollTo(0, start + distance * eased);
			if (progress < 1) requestAnimationFrame(step);
		}

		requestAnimationFrame(step);
	}
})();
