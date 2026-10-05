// frontend/static/js/shared/icons.js
// Inline SVG icon set — replaces platform-dependent emoji in UI chrome
// so icons render identically everywhere and inherit color from text.
//===================================

const ACTIVITO_ICON_PATHS = {
	// Vibe categories
	mountain:
		'<path stroke-linecap="round" stroke-linejoin="round" d="m3 20 6.5-13 4 7.5L16 11l5 9H3z"/>',
	users:
		'<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 1 1 0 5.292M15 21H3v-1a6 6 0 0 1 12 0v1zm0 0h6v-1a6 6 0 0 0-9-5.197M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/>',
	waves:
		'<path stroke-linecap="round" d="M2 8.5c1.7-1.7 3.3-1.7 5 0s3.3 1.7 5 0 3.3-1.7 5 0 3.3 1.7 5 0M2 15.5c1.7-1.7 3.3-1.7 5 0s3.3 1.7 5 0 3.3-1.7 5 0 3.3 1.7 5 0"/>',
	compass:
		'<circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="m15.5 8.5-2.3 5.7-5.7 2.3 2.3-5.7 5.7-2.3z"/>',
	leaf:
		'<path stroke-linecap="round" stroke-linejoin="round" d="M5 21C5 12 11 6 21 6c0 9-6 15-16 15zm0 0c3.5-3.5 6.5-6.5 10-10"/>',

	// UI chrome
	sparkles:
		'<path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16 2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>',
	star:
		'<path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 0 0 .95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 0 0-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 0 0-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 0 0-.363-1.118L2.98 10.1c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 0 0 .951-.69l1.519-4.674z"/>',
	pin:
		'<path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657 13.414 20.9a2 2 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>',
	tag:
		'<path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 0 1 0 2.828l-5 5a2 2 0 0 1-2.828 0l-7-7A1.994 1.994 0 0 1 3 12V7a4 4 0 0 1 4-4z"/>',
	search:
		'<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"/>',
	signalSlash:
		'<path stroke-linecap="round" stroke-linejoin="round" d="M18.364 5.636a9 9 0 0 1 0 12.728m0 0-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 0 1 0 7.072m0 0-2.829-2.829m-4.243 2.829a4.978 4.978 0 0 1-1.414-2.83m-1.414 5.658a9 9 0 0 1-2.167-9.238m7.824 2.167a1 1 0 1 1 1.414 1.414m-1.414-1.414L3 3"/>',
	heart:
		'<path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0z"/>',
	check:
		'<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>',
	alertCircle:
		'<circle cx="12" cy="12" r="9"/><path stroke-linecap="round" d="M12 8v4m0 4h.01"/>',
	infoCircle:
		'<circle cx="12" cy="12" r="9"/><path stroke-linecap="round" d="M12 16v-4m0-4h.01"/>',
	utensils:
		'<path stroke-linecap="round" stroke-linejoin="round" d="M4 3v7a3 3 0 0 0 6 0V3M7 10v11M17 3c-1.5 1.5-2 3.5-2 6v4h4V3z"/>',
	sun:
		'<circle cx="12" cy="12" r="4.5"/><path stroke-linecap="round" d="M12 2v2m0 16v2M4.2 4.2l1.4 1.4m12.8 12.8 1.4 1.4M2 12h2m16 0h2M4.2 19.8l1.4-1.4M17.4 5.6l1.4-1.4"/>',
	cloud:
		'<path stroke-linecap="round" stroke-linejoin="round" d="M7 18h10a4 4 0 0 0 .6-7.96A6 6 0 0 0 6.1 11.1 3.5 3.5 0 0 0 7 18z"/>',
	cloudRain:
		'<path stroke-linecap="round" stroke-linejoin="round" d="M7 15h10a4 4 0 0 0 .6-7.96A6 6 0 0 0 6.1 8.1 3.5 3.5 0 0 0 7 15z"/><path stroke-linecap="round" d="M9 18l-1 3m5-3l-1 3m5-3l-1 3"/>',
	cloudSnow:
		'<path stroke-linecap="round" stroke-linejoin="round" d="M7 15h10a4 4 0 0 0 .6-7.96A6 6 0 0 0 6.1 8.1 3.5 3.5 0 0 0 7 15z"/><path stroke-linecap="round" d="M9 19h.01M13 19h.01M17 19h.01M11 21h.01M15 21h.01"/>',
	bolt2:
		'<path stroke-linecap="round" stroke-linejoin="round" d="M7 15h10a4 4 0 0 0 .6-7.96A6 6 0 0 0 6.1 8.1 3.5 3.5 0 0 0 7 15z"/><path stroke-linecap="round" stroke-linejoin="round" d="M13 16l-3 5h4l-1 3"/>',
	sunset:
		'<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v6m-4.5-1.5L9 9m6 0 1.5-1.5M3 17h18M6 21h12"/><path stroke-linecap="round" stroke-linejoin="round" d="M7 17a5 5 0 0 1 10 0"/>',
	clock:
		'<path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>',
	bolt:
		'<path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>',
	home:
		'<path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6"/>',
	close:
		'<path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18"/>',

	// Auth form affordances
	mail:
		'<rect x="3" y="5" width="18" height="14" rx="2"/><path stroke-linecap="round" stroke-linejoin="round" d="m3.5 6.5 8.5 6 8.5-6"/>',
	lock:
		'<rect x="4" y="10" width="16" height="11" rx="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M8 10V7a4 4 0 1 1 8 0v3"/>',
	eye:
		'<path stroke-linecap="round" stroke-linejoin="round" d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
	eyeOff:
		'<path stroke-linecap="round" stroke-linejoin="round" d="M9.9 5.8A9.8 9.8 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3.2 4M6.2 7.9A17 17 0 0 0 2.5 12S6 18.5 12 18.5c1.5 0 2.8-.4 4-1M3 3l18 18"/><path stroke-linecap="round" stroke-linejoin="round" d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
	cake:
		'<path stroke-linecap="round" stroke-linejoin="round" d="M4 21h16v-6a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v6zm0-4c1.5 0 1.5 1.5 3 1.5S8.5 17 10 17s1.5 1.5 3 1.5S14.5 17 16 17s1.5 1.5 3 1.5"/><path stroke-linecap="round" d="M12 8V5m0 0 1.2-1.5M12 5l-1.2-1.5M8 8V6m8 2V6"/>',
	userOutline:
		'<circle cx="12" cy="8" r="4"/><path stroke-linecap="round" stroke-linejoin="round" d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
};

const ACTIVITO_VIBE_ICONS = {
	Adventure: "mountain",
	Social: "users",
	Relax: "waves",
	Explore: "compass",
	Wellness: "leaf",
	// Browse-only category on Explore — not a quiz vibe.
	Food: "utensils",
};

function iconSvg(name, cls = "w-4 h-4") {
	const path = ACTIVITO_ICON_PATHS[name];

	if (!path) return "";

	return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${path}</svg>`;
}

function vibeIconSvg(category, cls = "w-4 h-4") {
	return iconSvg(ACTIVITO_VIBE_ICONS[category], cls);
}

// Restartable scale-pop on a heart button (see .heart-btn.pop in shared.css).
function popHeart(btn) {
	if (!btn) return;

	btn.classList.remove("pop");
	// Force a reflow so re-adding the class restarts the animation.
	void btn.offsetWidth;
	btn.classList.add("pop");
}
