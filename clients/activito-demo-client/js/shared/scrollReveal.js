// frontend/static/js/shared/scrollReveal.js
// Reveal-on-scroll utility.
//   data-reveal="up|left|right|scale"  — single element reveal
//   data-reveal-delay="120"            — optional per-element delay (ms)
//   data-reveal-children               — staggers direct children instead
// Dynamic content: call observeReveals(root) after injecting nodes.
//
// These elements sit at opacity 0 in CSS until revealed, so anything
// that stops the observer firing leaves the page looking blank. Three
// guards against that:
//   1. content already on screen at load is revealed immediately
//   2. a failsafe timer reveals anything still hidden but visible
//   3. reduced-motion, or no IntersectionObserver, reveals instantly
//===================================

(function () {
	// If the observer hasn't revealed an element by now, show it anyway.
	// Long enough that a normal reveal wins the race, short enough that
	// nobody sits looking at an empty screen.
	const FAILSAFE_MS = 1200;

	const REVEAL_SELECTOR =
		"[data-reveal]:not(.in-view), [data-reveal-children]:not(.in-view)";

	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;

	function reveal(el) {
		el.classList.add("in-view");
	}

	// No observer support, or the user asked for less motion — skip the
	// animation rather than risk hiding content behind it.
	if (prefersReducedMotion || !("IntersectionObserver" in window)) {
		const showEverything = (root = document) => {
			root.querySelectorAll(REVEAL_SELECTOR).forEach(reveal);
		};

		window.observeReveals = showEverything;
		document.addEventListener("DOMContentLoaded", () => showEverything());
		showEverything();

		return;
	}

	const revealObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					reveal(entry.target);
					revealObserver.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
	);

	function isOnScreen(el) {
		const rect = el.getBoundingClientRect();
		const viewportHeight =
			window.innerHeight || document.documentElement.clientHeight;

		return rect.top < viewportHeight && rect.bottom > 0;
	}

	function observeReveals(root = document) {
		root.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
			const delay = el.dataset.revealDelay;

			if (delay) el.style.transitionDelay = `${delay}ms`;

			// Already visible: reveal now instead of waiting on a callback.
			// That wait is what made hero content appear seconds late, or
			// only once the page was scrolled.
			if (isOnScreen(el)) {
				reveal(el);
				return;
			}

			revealObserver.observe(el);

			// Per-element failsafe. Covers elements that had no height when
			// they were registered — images still loading, fonts not yet
			// swapped — which the observer may never report as intersecting.
			setTimeout(() => {
				if (!el.classList.contains("in-view") && isOnScreen(el)) {
					reveal(el);
					revealObserver.unobserve(el);
				}
			}, FAILSAFE_MS);
		});
	}

	window.observeReveals = observeReveals;

	document.addEventListener("DOMContentLoaded", () => observeReveals());

	// Fonts and images landing can shift elements that were off-screen at
	// registration into view; re-scan so they aren't left hidden.
	window.addEventListener("load", () => observeReveals());
})();
