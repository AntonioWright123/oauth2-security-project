// frontend/static/js/shared/savedSpots.js

let savedSpotsCache = [];
let savedIdsCache = new Set();

async function loadSavedSpots() {
	const res = await fetch(`${API_BASE}/api/saved`, {
		method: "GET",
		credentials: "include",
	});

	if (res.status === 401) {
		savedSpotsCache = [];
		savedIdsCache = new Set();
		return savedSpotsCache;
	}

	if (!res.ok) {
		throw new Error("Failed to load saved spots");
	}

	savedSpotsCache = await res.json();
	// Ids are stored as strings so lookups work no matter whether the
	// caller has a numeric or string id (API and DOM datasets differ).
	savedIdsCache = new Set(savedSpotsCache.map((spot) => String(spot.id)));

	return savedSpotsCache;
}

function getSavedSpots() {
	return savedSpotsCache;
}

function getSavedIds() {
	return new Set(savedIdsCache);
}

function isSaved(id) {
	return savedIdsCache.has(String(id));
}

async function saveSpotToDb(spot) {
	const res = await fetch(`${API_BASE}/api/saved`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify(spot),
	});

	const data = await res.json().catch(() => null);

	if (!res.ok) {
		throw new Error(data?.error || "Failed to save spot");
	}

	return data;
}

async function deleteSavedSpotFromDb(placeId) {
	const res = await fetch(
		`${API_BASE}/api/saved/${encodeURIComponent(placeId)}`,
		{
			method: "DELETE",
			credentials: "include",
		},
	);

	const data = await res.json().catch(() => null);

	if (!res.ok) {
		throw new Error(data?.error || "Failed to delete saved spot");
	}

	return data;
}

// Flip the local caches immediately so the UI can react before the
// network round-trip. Returns whether the spot was saved before the flip
// (calling it again with the same spot rolls the flip back).
function applyLocalSavedToggle(spot) {
	const key = String(spot.id);
	const wasSaved = savedIdsCache.has(key);

	if (wasSaved) {
		savedIdsCache.delete(key);
		savedSpotsCache = savedSpotsCache.filter((s) => String(s.id) !== key);
	} else {
		savedIdsCache.add(key);
		savedSpotsCache = [...savedSpotsCache, spot];
	}

	return wasSaved;
}

// Optimistic toggle: flips the caches and calls onLocalUpdate right away,
// persists in the background, and rolls back (calling onLocalUpdate again)
// if the request fails.
async function toggleSavedSpot(spot, onLocalUpdate) {
	if (!spot?.id) {
		throw new Error("Spot must have an id");
	}

	const wasSaved = applyLocalSavedToggle(spot);

	if (onLocalUpdate) onLocalUpdate(getSavedIds());

	try {
		if (wasSaved) {
			await deleteSavedSpotFromDb(spot.id);
		} else {
			await saveSpotToDb(spot);
		}
	} catch (err) {
		// Roll back the flip and repaint so the UI matches reality.
		applyLocalSavedToggle(spot);

		if (onLocalUpdate) onLocalUpdate(getSavedIds());

		throw err;
	}

	// Revalidate in the background — the UI is already correct.
	loadSavedSpots().catch(() => {});

	return getSavedIds();
}
