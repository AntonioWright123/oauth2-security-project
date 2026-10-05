// ════════════════════════════════════════════════════════════
//   SIDEBAR
// ════════════════════════════════════════════════════════════
function toggleSidebar() {
	const sidebar = document.getElementById("sidebar");
	const backdrop = document.getElementById("sidebarBackdrop");
	const isOpen = !sidebar.classList.contains("-translate-x-full");
	isOpen ? closeSidebar() : openSidebar();
}

function openSidebar() {
	document.getElementById("sidebar").classList.remove("-translate-x-full");
	document.getElementById("sidebarBackdrop").classList.remove("hidden");
}

function closeSidebar() {
	document.getElementById("sidebar").classList.add("-translate-x-full");
	document.getElementById("sidebarBackdrop").classList.add("hidden");
}
// side-bar moblieMenuBtn
document.getElementById("mobileMenuBtn")?.addEventListener("click", () => {
	document.getElementById("sidebar").classList.toggle("-translate-x-full");
	document.getElementById("sidebarBackdrop").classList.toggle("hidden");
});

// ── Declarative triggers ─────────────────────────────────────
// These used to be onclick="closeSidebar()" attributes, 21 of them across
// three pages. Inline handlers resolve against the global object, so every
// one would break the moment this file becomes a module — silently, at
// click time, where no test would catch it. See docs/module-migration.md.
//
// Delegated from the document so it also covers markup built later in JS,
// and so adding a nav link needs no new wiring.
document.addEventListener("click", (event) => {
	if (event.target.closest("[data-toggle-sidebar]")) {
		toggleSidebar();
		return;
	}

	if (event.target.closest("[data-close-sidebar]")) {
		closeSidebar();
	}
});
