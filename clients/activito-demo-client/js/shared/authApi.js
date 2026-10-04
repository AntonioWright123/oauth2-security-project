// frontend/static/js/shared/authApi.js
// sign in sign out,
//===================================

async function signUpUser({ name, email, password, dateOfBirth }) {
	const res = await fetch(`${API_BASE}/api/auth/sign-up/email`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify({
			name,
			email,
			password,
			dateOfBirth,
		}),
	});

	const data = await res.json().catch(() => null);

	if (!res.ok) {
		throw new Error(data?.message || data?.error || "Sign up failed");
	}

	return data;
}

async function signInUser({ email, password }) {
	const res = await fetch(`${API_BASE}/api/auth/sign-in/email`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify({
			email,
			password,
		}),
	});

	const data = await res.json().catch(() => null);

	if (!res.ok) {
		throw new Error(data?.message || data?.error || "Sign in failed");
	}

	return data;
}

async function getCurrentUser() {
	const res = await fetch(`${API_BASE}/api/me`, {
		method: "GET",
		credentials: "include",
	});

	if (!res.ok) return null;

	return await res.json().catch(() => null);
}

async function requireCurrentUser() {
	const session = await getCurrentUser();

	if (!session?.user) {
		window.location.href = "../templates/index.html";
		return null;
	}

	// After an OAuth redirect the session is valid but the cached
	// profile is missing, because the sign-in form never ran.
	if (!localStorage.getItem("activito_user")) {
		cacheUserProfile(session.user);
	}

	return session.user;
}

// Mirrors what the sign-in/sign-up forms store, so every entry path
// leaves the same shape in localStorage.
function cacheUserProfile(user) {
	const displayName = user?.name || user?.email?.split("@")[0] || "User";

	localStorage.setItem(
		"activito_user",
		JSON.stringify({
			id: user?.id || null,
			name: displayName,
			email: user?.email || "",
			initials: displayName.slice(0, 2).toUpperCase(),
			avatar: user?.image || null,
		}),
	);
}

// Which social providers the backend actually has credentials for.
async function fetchAuthConfig() {
	try {
		const res = await fetch(`${API_BASE}/api/auth-config`);

		return res.ok ? await res.json() : { google: false };
	} catch {
		return { google: false };
	}
}

// Kicks off the OAuth redirect. Google bounces the user back to
// callbackURL once they approve, with the session cookie already set.
//
// The whole flow has to happen on one hostname: better-auth sets a
// signed `state` cookie on the API origin, and Google returns to the
// origin baked into BETTER_AUTH_URL. Browsing 127.0.0.1 while the auth
// origin says localhost puts that cookie in a jar the callback can't
// read, which surfaces as "State not persisted correctly". So if the
// hostnames disagree, move the page onto the canonical one first and
// resume automatically.
async function signInWithGoogle(callbackPath = "dashboard.html") {
	const config = await fetchAuthConfig();
	const authHost = config.authOrigin
		? new URL(config.authOrigin).hostname
		: window.location.hostname;

	if (authHost !== window.location.hostname) {
		const target = new URL(window.location.href);

		target.hostname = authHost;
		target.searchParams.set("continue", "google");

		window.location.href = target.href;
		return;
	}

	const callbackURL = new URL(callbackPath, window.location.href).href;

	const res = await fetch(`${API_BASE}/api/auth/sign-in/social`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify({ provider: "google", callbackURL }),
	});

	const data = await res.json().catch(() => null);

	if (!res.ok || !data?.url) {
		throw new Error(
			data?.message || "Google sign-in isn't available right now.",
		);
	}

	window.location.href = data.url;
}
// Kicks off the OAuth redirect for the demo OAuth server. The flow is
// similar to Google, but the demo server is a separate origin and doesn't
// require the canonical-host hop.	
async function signInWithOAuthDemo(callbackPath = "dashboard.html") {
	const callbackURL = new URL(callbackPath, window.location.href).href;

	const res = await fetch(`${API_BASE}/api/auth/sign-in/oauth-demo`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify({ callbackURL }),
	});

	const data = await res.json().catch(() => null);

	if (!res.ok || !data?.url) {
		throw new Error(
			data?.message || "OAuth demo sign-in isn't available right now.",
		);
	}

	window.location.href = data.url;
}

async function signOutUser() {
	const res = await fetch(`${API_BASE}/api/auth/sign-out`, {
		method: "POST",
		credentials: "include",
	});

	if (!res.ok) {
		throw new Error("Sign out failed");
	}

	clearUserLocalState();

	window.location.href = "../templates/index.html";
}

function clearUserLocalState() {
	localStorage.removeItem("activito_user");
	localStorage.removeItem("activito_token");

	localStorage.removeItem("activito_coords");
	localStorage.removeItem("activito_manual_coords");
	localStorage.removeItem("activito_location_label");
	localStorage.removeItem("activito_location_source");
	//saved  might throw of saved spots
	localStorage.removeItem("activito_saved");
	localStorage.removeItem("activito_vibe");
	localStorage.removeItem("activito_vibes_taken");
	localStorage.removeItem("activito_gps_coords");
	localStorage.removeItem("activito_daily_spins");
}

// ── Declarative trigger ──────────────────────────────────────
// Replaces onclick="signOutUser()" / onclick="event.preventDefault();
// signOutUser();". Inline handlers resolve against the global object and
// would break once this file is a module — see docs/module-migration.md.
document.addEventListener("click", (event) => {
	const trigger = event.target.closest("[data-signout]");

	if (!trigger) return;

	// Several of these are <a href="#">, which would jump the page.
	event.preventDefault();
	signOutUser();
});
