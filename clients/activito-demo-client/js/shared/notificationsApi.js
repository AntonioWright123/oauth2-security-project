// frontend/static/js/shared/notificationsApi.js
// Fetch + mark-read helpers for the notifications feed.
//===================================

async function fetchNotifications() {
	const res = await fetch(`${API_BASE}/api/notifications`, {
		method: "GET",
		credentials: "include",
	});

	if (!res.ok) {
		throw new Error("Failed to load notifications");
	}

	return res.json();
}

async function markNotificationsRead() {
	const res = await fetch(`${API_BASE}/api/notifications/read`, {
		method: "POST",
		credentials: "include",
	});

	if (!res.ok) {
		throw new Error("Failed to mark notifications read");
	}

	return res.json();
}

async function clearNotifications() {
	const res = await fetch(`${API_BASE}/api/notifications`, {
		method: "DELETE",
		credentials: "include",
	});

	if (!res.ok) {
		throw new Error("Failed to clear notifications");
	}

	return res.json();
}
