// ════════════════════════════════════════════════════════════
//  DETAIL MODAL
// ════════════════════════════════════════════════════════════
const detailModal = document.getElementById("detailModal");
const closeDetails = document.getElementById("closeModalDetail");
const leftArrow = document.getElementById("leftArrow");
const rightArrow = document.getElementById("rightArrow");
const modalSaveBtn = document.getElementById("modalSaveBtn");

let openActivityId = null;

let modalList = [];
let detailModalIndex = 0;
let modalRefresh = null;

function openDetailModal(
	activity,
	list = [],
	index = 0,
	refreshCallback = null,
) {
	if (!activity) return;

	modalList = list;
	detailModalIndex = index;
	modalRefresh = refreshCallback;
	openActivityId = activity.id;

	detailModal.querySelector("h1").textContent = activity.name;

	// Quick stat bubbles
	detailModal.querySelector(".modal-rating").textContent =
		activity.rating ?? "—";
	detailModal.querySelector(".modal-price").textContent =
		activity.price || "—";
	detailModal.querySelector(".modal-distance").textContent =
		activity.distance || "—";

	detailModal.querySelector(".modal-rawTypes").textContent = activity.rawTypes
		? `${activity.rawTypes}`
		: "";

	// Detail rows — hide a row entirely when the data is missing
	// instead of printing "unavailable" filler.
	function setModalRow(rowClass, textClass, value) {
		const row = detailModal.querySelector(rowClass);

		if (!row) return;

		row.classList.toggle("hidden", !value);

		if (value) {
			row.querySelector(textClass).textContent = value;
		}
	}

	setModalRow(".modal-row-address", ".modal-address", activity.address);
	setModalRow(".modal-row-hours", ".modal-hours", activity.hours);
	setModalRow(".modal-row-phone", ".modal-phone", activity.phone);
	setModalRow(".modal-row-website", ".modal-website", activity.website);

	detailModal.querySelector(".modal-description").textContent =
		`${activity.whyActivito || "Why Activito picked this"}: ${activity.description || ""}`;

	detailModal.querySelector(".modal-tags").innerHTML = activity.tags
		.map(
			(t, i) =>
				`<span class="px-4 py-1 rounded-full text-white ${activity.tagColors[i] || "bg-purple-500"}">${t}</span>`,
		)
		.join("");

	detailModal.querySelectorAll(".modal-img").forEach((el, i) => {
		el.classList.remove("loaded");
		el.onload = () => el.classList.add("loaded");
		el.onerror = () => {
			el.onerror = null;
			el.src = "../static/images/no-image.svg";
		};
		el.src = mediaUrl(activity.images[i] || activity.image);

		// Cached images may not fire load after a same-src assignment.
		if (el.complete && el.naturalWidth > 0) {
			el.classList.add("loaded");
		}
	});

	detailModal.querySelector(".modal-directions-btn").onclick = () =>
		window.open(
			`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activity.address || "")}`,
			"_blank",
		);

	detailModal.querySelector(".modal-website-btn").onclick = () => {
		if (!activity.website) return;

		const url = activity.website.startsWith("http")
			? activity.website
			: `https://${activity.website}`;

		window.open(url, "_blank");
	};

	// Save button state
	const saved = getSavedIds().has(String(activity.id));

	modalSaveBtn.innerHTML = `${iconSvg("heart", "w-4 h-4")} ${saved ? "Saved!" : "Save this spot"}`;
	modalSaveBtn.className = `heart-btn w-full py-4 rounded-2xl font-bold transition
		inline-flex items-center justify-center gap-2 ${
			saved
				? "saved bg-red-50 text-red-500 hover:bg-red-100"
				: "bg-white text-purple-700 hover:bg-purple-50"
		}`;

	modalSaveBtn.onclick = async () => {
		try {
			// Runs on the optimistic flip AND again on rollback, so the
			// modal button and page behind it always match the cache.
			await toggleSavedSpot(activity, () => {
				if (typeof savedIds !== "undefined") {
					savedIds = getSavedIds();
				}

				if (typeof updateExploreSavedBadge === "function") {
					updateExploreSavedBadge();
				}

				if (typeof updateSavedBadge === "function") {
					updateSavedBadge();
				}

				if (modalRefresh) {
					modalRefresh();
				}

				openDetailModal(activity, modalList, detailModalIndex, modalRefresh);
			});
		} catch (err) {
			console.error("Failed to toggle saved spot from modal:", err);
			showToast(err.message || "Couldn't update that spot — try again.", "error");
		}
	};
	// Arrow states
	leftArrow.classList.toggle("opacity-30", detailModalIndex === 0);
	rightArrow.classList.toggle(
		"opacity-30",
		detailModalIndex === modalList.length - 1,
	);

	leftArrow.disabled = detailModalIndex === 0;
	rightArrow.disabled = detailModalIndex === modalList.length - 1;

	detailModal.classList.remove("hidden");
	detailModal.classList.add("flex");

	// Lock the page behind the modal — on mobile the background
	// scrolling under the sheet made the buttons feel unresponsive.
	document.body.style.overflow = "hidden";
}

function closeDetailModal() {
	detailModal.classList.replace("flex", "hidden");
	document.body.style.overflow = "";
}

// ════════════════════════════════════════════════════════════
//  EVENT LISTENERS CLOSE, DETAIL MODAL, LEFT and RIGHT ARROWS
// ════════════════════════════════════════════════════════════

closeDetails.addEventListener("click", closeDetailModal);

detailModal.addEventListener("click", (e) => {
	if (e.target === detailModal) {
		closeDetailModal();
	}
});

// Shared prev/next used by the arrows and by swipe gestures.
function navigateDetailModal(delta) {
	const nextIndex = detailModalIndex + delta;

	if (nextIndex < 0 || nextIndex >= modalList.length) return;

	detailModalIndex = nextIndex;

	openDetailModal(
		modalList[detailModalIndex],
		modalList,
		detailModalIndex,
		modalRefresh,
	);

	// Quick slide-in from the direction of travel for feedback.
	const panel = detailModal.querySelector(".modal-scroll");

	if (panel) {
		panel.classList.remove("modal-slide-next", "modal-slide-prev");
		void panel.offsetWidth; // restart the animation
		panel.classList.add(delta > 0 ? "modal-slide-next" : "modal-slide-prev");
	}
}

leftArrow.addEventListener("click", (e) => {
	e.stopPropagation();
	navigateDetailModal(-1);
});

rightArrow.addEventListener("click", (e) => {
	e.stopPropagation();
	navigateDetailModal(1);
});

// ── Swipe left/right to change spots (mobile) ────────────────
// Listeners are passive and only act on a mostly-horizontal gesture,
// so vertical scrolling inside the panel keeps working normally.
const SWIPE_MIN_PX = 60;
const SWIPE_H_DOMINANCE = 1.5;

let swipeStartX = 0;
let swipeStartY = 0;
let swipeTracking = false;

const modalPanel = detailModal.querySelector(".modal-scroll");

modalPanel?.addEventListener(
	"touchstart",
	(e) => {
		if (e.touches.length !== 1) return;

		swipeTracking = true;
		swipeStartX = e.touches[0].clientX;
		swipeStartY = e.touches[0].clientY;
	},
	{ passive: true },
);

modalPanel?.addEventListener(
	"touchend",
	(e) => {
		if (!swipeTracking) return;

		swipeTracking = false;

		const dx = e.changedTouches[0].clientX - swipeStartX;
		const dy = e.changedTouches[0].clientY - swipeStartY;

		if (
			Math.abs(dx) >= SWIPE_MIN_PX &&
			Math.abs(dx) > Math.abs(dy) * SWIPE_H_DOMINANCE
		) {
			// Swipe left = next spot, swipe right = previous.
			navigateDetailModal(dx < 0 ? 1 : -1);
		}
	},
	{ passive: true },
);
