async function getUserLocationFromDb() {
	const res = await fetch(`${API_BASE}/api/location`, {
		method: "GET",
		credentials: "include",
	});

	if (res.status === 401) return null;

	if (!res.ok) {
		throw new Error("Failed to load user location");
	}

	return await res.json();
}

async function saveUserLocationToDb(location) {
	const res = await fetch(`${API_BASE}/api/location`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify(location),
	});

	const data = await res.json().catch(() => null);

	if (!res.ok) {
		throw new Error(data?.error || "Failed to save user location");
	}

	return data;
}
