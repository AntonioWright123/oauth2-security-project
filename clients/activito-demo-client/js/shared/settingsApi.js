// frontend/static/js/shared/settingsApi.js
// Load and save user settings (user_settings table).
//===================================

async function getUserSettingsFromDb() {
	const res = await fetch(`${API_BASE}/api/settings`, {
		method: "GET",
		credentials: "include",
	});

	if (res.status === 401) return null;

	if (!res.ok) {
		throw new Error("Failed to load settings");
	}

	return await res.json();
}

async function saveUserSettingsToDb(partialSettings) {
	const res = await fetch(`${API_BASE}/api/settings`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify(partialSettings),
	});

	const data = await res.json().catch(() => null);

	if (!res.ok) {
		throw new Error(data?.error || "Failed to save settings");
	}

	return data;
}

// ── Better Auth account endpoints ─────────────────────────────

async function updateUserName(name) {
	const res = await fetch(`${API_BASE}/api/auth/update-user`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify({ name }),
	});

	const data = await res.json().catch(() => null);

	if (!res.ok) {
		throw new Error(data?.message || data?.error || "Failed to update name");
	}

	return data;
}

async function changeUserPassword({ currentPassword, newPassword }) {
	const res = await fetch(`${API_BASE}/api/auth/change-password`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify({
			currentPassword,
			newPassword,
			revokeOtherSessions: true,
		}),
	});

	const data = await res.json().catch(() => null);

	if (!res.ok) {
		throw new Error(
			data?.message || data?.error || "Failed to change password",
		);
	}

	return data;
}
