// ── Activito Global Config ──────────────────────────────────
// This is the only file you touch when switching to production.

// ── PRODUCTION API base ──────────────────────────────────────
// Empty on purpose: in production the frontend calls /api/* on its
// own origin, and Netlify proxies those to the Railway backend.
const PRODUCTION_API_BASE = "";

// Hosts that mean "this is a dev machine".
function isLocalHost(hostname) {
    return (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        // Private-LAN ranges so a phone on the same wifi still counts as dev.
        /^(?:192\.168|10\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01]))\./.test(hostname)
    );
}

// ── Main Activito API ────────────────────────────────────────
// Original Activito backend runs on port 3000 during local development.
const API_BASE = isLocalHost(window.location.hostname)
    ? `http://${window.location.hostname}:3000`
    : PRODUCTION_API_BASE;

// ── OAuth Demo Authorization Server ──────────────────────────
// Class OAuth project backend runs separately on port 4000.
const OAUTH_DEMO_BASE = isLocalHost(window.location.hostname)
    ? `http://${window.location.hostname}:4000`
    : "";

// ── Current user ─────────────────────────────────────────────
function getStoredUser() {
    try {
        return JSON.parse(localStorage.getItem("activito_user")) || null;
    } catch {
        return null;
    }
}

// Use this anywhere you need the logged-in user's display info.
// For auth decisions, use requireCurrentUser() from authApi.js.
const CURRENT_USER = getStoredUser();

// ── Media URLs ───────────────────────────────────────────────
function mediaUrl(url, cssWidth) {
    if (!url) return "";

    const absolute = url.startsWith("/api/")
        ? `${API_BASE}${url}`
        : url;

    if (!cssWidth || !absolute.includes("/api/photo")) {
        return absolute;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const target = Math.round(cssWidth * dpr);

    return absolute.replace(/([?&]w=)\d+/, `$1${target}`);
}

// Rendered width of one activity card.
function cardPhotoWidth() {
    const vw = Math.min(window.innerWidth || 375, 1280);
    const columns = vw >= 1024 ? 4 : vw >= 768 ? 3 : 2;
    const gutters = 40;
    const gaps = 16 * (columns - 1);

    return Math.ceil((vw - gutters - gaps) / columns);
}

// ── HTML escaping ────────────────────────────────────────────
function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// Only allow safe image URLs.
function safeImageUrl(url, fallback = "./images/no-image.svg") {
    const value = String(url ?? "").trim();

    if (!value) return fallback;

    const isAllowed =
        value.startsWith("/api/") ||
        value.startsWith("./images/") ||
        /^https?:\/\//i.test(value);

    return isAllowed ? escapeHtml(value) : fallback;
}