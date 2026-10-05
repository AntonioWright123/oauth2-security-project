// ── Activito Global Config ──────────────────────────────────
// This is the only file you touch when switching to production

// ── PRODUCTION API base ──────────────────────────────────────
// Empty on purpose: in production the frontend calls /api/* on its
// OWN origin, and Netlify proxies those to the Railway backend
// (see netlify.toml). Same-origin keeps the session cookie
// first-party so browsers don't block it as a cross-site cookie.
// Only set this to an absolute backend URL if you are NOT proxying.
const PRODUCTION_API_BASE = "";
// Hosts that mean "this is a dev machine" — everything else is
// treated as production and uses PRODUCTION_API_BASE.
function isLocalHost(hostname) {
	return (
		hostname === "localhost" ||
		hostname === "127.0.0.1" ||
		// Private-LAN ranges so a phone on the same wifi still counts
		// as dev (192.168.x, 10.x, 172.16–31.x).
		/^(?:192\.168|10\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01]))\./.test(hostname)
	);
}

// Dev: the API host follows the page host, because auth cookies only
// survive when the two hostnames match (127.0.0.1 vs localhost vs a
// LAN IP are all "different sites" to the browser). Deriving it from
// the page means the Mac and a phone on wifi both work with nothing
// to edit. Production uses the fixed origin set above.
const API_BASE = isLocalHost(window.location.hostname)
	? `http://${window.location.hostname}:3000`
	: PRODUCTION_API_BASE;

// ── Current user ─────────────────────────────────────────────
// Loaded from localStorage (written at sign-in by authModals.js).
// Falls back to null safely — never hardcoded placeholder values.
function getStoredUser() {
	try {
		return JSON.parse(localStorage.getItem("activito_user")) || null;
	} catch {
		return null;
	}
}

// Use this anywhere you need the logged-in user's display info.
// For auth decisions, always use requireCurrentUser() from authApi.js.
const CURRENT_USER = getStoredUser();

// ── Media URLs ───────────────────────────────────────────────
// Place photos come back as relative proxy paths (/api/photo?...)
// so the Google key never reaches the browser and stored rows stay
// host-independent. Prefix them with the API origin at render time;
// absolute URLs (Unsplash, local assets) pass through untouched.
function mediaUrl(url, cssWidth) {
	if (!url) return "";

	const absolute = url.startsWith("/api/") ? `${API_BASE}${url}` : url;

	// Stored proxy paths bake in w=800 (see backend/utils/formatPlace.js).
	// That's 3-4x the pixels a 2-up card actually shows on a phone, and
	// Place Photo bytes are the single biggest thing this app downloads.
	// Rewriting the width at render time keeps one stored ref while letting
	// each surface ask for what it needs — pass no width to keep 800.
	if (!cssWidth || !absolute.includes("/api/photo")) return absolute;

	// DPR capped at 2: past that the extra bytes buy more than the screen
	// can show, especially on the phones that need the saving most.
	const dpr = Math.min(window.devicePixelRatio || 1, 2);
	const target = Math.round(cssWidth * dpr);

	return absolute.replace(/([?&]w=)\d+/, `$1${target}`);
}

// Rendered width of one activity card, from the grid's own breakpoints
// (grid-cols-2 / md:grid-cols-3 / lg:grid-cols-4 inside a max-w-7xl
// container). Used to size card photos instead of guessing.
function cardPhotoWidth() {
	const vw = Math.min(window.innerWidth || 375, 1280);
	const columns = vw >= 1024 ? 4 : vw >= 768 ? 3 : 2;
	const gutters = 40; // page padding
	const gaps = 16 * (columns - 1);

	return Math.ceil((vw - gutters - gaps) / columns);
}

// ── HTML escaping ────────────────────────────────────────────
// Card and list renderers build markup with template strings and
// assign it via innerHTML. Any value that originated with a user —
// uploaded spot names, descriptions, display names, and the
// notification titles that embed them — must be escaped first, or a
// name like `<img src=x onerror=...>` executes for everyone who sees
// it. Values we control (icon markup, Tailwind classes) are not
// escaped, so they can still carry tags.
function escapeHtml(value) {
	return String(value ?? "")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

// Image sources get their own guard: escaping alone still permits
// javascript: and data: URLs. Only ordinary web images and our own
// photo-proxy paths are allowed through.
function safeImageUrl(url, fallback = "../static/images/no-image.svg") {
	const value = String(url ?? "").trim();

	if (!value) return fallback;

	const isAllowed =
		value.startsWith("/api/") ||
		value.startsWith("../static/") ||
		/^https?:\/\//i.test(value);

	return isAllowed ? escapeHtml(value) : fallback;
}
