// frontend/static/js/shared/sessionGuard.js
//
// Idle-timeout enforcement on the client. The server is the real
// boundary (better-auth expires the session after 30 min of
// inactivity), but a tab left open won't notice until its next
// request. This guard makes an idle return force a fresh sign-in:
//   • tracks real user interaction (not background requests)
//   • when the idle limit passes, ends the session and redirects
//   • re-checks the instant you come back to a hidden/blurred tab
//
// Depends on API_BASE (config.js) and clearUserLocalState (authApi.js),
// so it must load after both. Include only on authenticated pages.

(() => {
	// Keep in step with session.expiresIn in backend/auth.js.
	const IDLE_LIMIT_MS = 30 * 60 * 1000;
	const SIGN_IN_URL = "../templates/index.html";

	let lastActivity = Date.now();
	let signingOut = false;

	const markActive = () => {
		lastActivity = Date.now();
	};

	// Genuine interaction only — deliberately NOT tied to API calls, so
	// background fetches can't keep an unattended session alive.
	["mousemove", "keydown", "pointerdown", "scroll", "touchstart"].forEach(
		(evt) => window.addEventListener(evt, markActive, { passive: true }),
	);

	async function forceReauth() {
		if (signingOut) return;
		signingOut = true;

		// Kill the server session too, so navigating back can't slip in on a
		// still-valid cookie. Awaited (best-effort) before the redirect.
		try {
			await fetch(`${API_BASE}/api/auth/sign-out`, {
				method: "POST",
				credentials: "include",
			});
		} catch {
			// Offline or already gone — the redirect still applies.
		}

		if (typeof clearUserLocalState === "function") clearUserLocalState();

		window.location.href = SIGN_IN_URL;
	}

	function checkIdle() {
		if (Date.now() - lastActivity >= IDLE_LIMIT_MS) forceReauth();
	}

	// Catch an idle return the moment the tab is focused again.
	document.addEventListener("visibilitychange", () => {
		if (!document.hidden) checkIdle();
	});
	window.addEventListener("focus", checkIdle);

	// While the tab is open, sweep once a minute. Pure local-time check —
	// no request — so it never refreshes the session it's meant to expire.
	setInterval(checkIdle, 60 * 1000);
})();
