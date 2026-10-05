// frontend/static/js/shared/points.js
// Points balance chip in the header. Elements opt in with
// data-points-chip (container, unhidden once loaded) and
// data-points-balance (the number itself).
//===================================

function updatePointsChip(balance) {
	if (balance == null) return;

	document.querySelectorAll("[data-points-balance]").forEach((el) => {
		el.textContent = balance;
	});

	document.querySelectorAll("[data-points-chip]").forEach((el) => {
		el.classList.remove("hidden");
		el.classList.add("flex");
	});
}

async function loadPointsBalance() {
	try {
		const res = await fetch(`${API_BASE}/api/points`, {
			credentials: "include",
		});

		if (!res.ok) return;

		const data = await res.json();

		updatePointsChip(data.balance);
	} catch {
		// Chip simply stays hidden if points can't load.
	}
}

document.addEventListener("DOMContentLoaded", loadPointsBalance);
