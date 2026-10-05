// frontend/static/js/shared/toast.js
// Non-blocking toast notifications replacing alert() calls.
// Auto-dismisses after a few seconds; tap to dismiss early.
// Requires icons.js (iconSvg) and the .toast styles in shared.css.
//===================================

const TOAST_DURATION_MS = 4000;
const TOAST_EXIT_MS = 350;

const TOAST_TYPE_ICONS = {
	error: "alertCircle",
	success: "check",
	info: "infoCircle",
};

function getToastContainer() {
	let container = document.getElementById("toastContainer");

	if (!container) {
		container = document.createElement("div");
		container.id = "toastContainer";
		container.className = "toast-container";
		document.body.appendChild(container);
	}

	return container;
}

function dismissToast(toast) {
	if (toast.classList.contains("toast-out")) return;

	toast.classList.add("toast-out");

	// Timed removal instead of animationend so toasts still clean up
	// when animations are disabled (prefers-reduced-motion).
	setTimeout(() => toast.remove(), TOAST_EXIT_MS);
}

function showToast(message, type = "info") {
	const toast = document.createElement("div");

	toast.className = `toast toast-${type}`;
	toast.setAttribute("role", type === "error" ? "alert" : "status");
	toast.innerHTML = iconSvg(TOAST_TYPE_ICONS[type] || "infoCircle", "w-4 h-4 shrink-0");

	// textContent for the message — never trust err.message as HTML.
	const text = document.createElement("span");
	text.textContent = message;
	toast.appendChild(text);

	toast.addEventListener("click", () => dismissToast(toast));

	getToastContainer().appendChild(toast);

	setTimeout(() => dismissToast(toast), TOAST_DURATION_MS);

	return toast;
}
