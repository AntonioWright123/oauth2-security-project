// ── userProfile.js ───────────────────────────────────────────
// Reads the logged-in user from localStorage and updates
// every element on the page that shows user info.
// LATER: swap localStorage.getItem for a Supabase session call.

function loadUserProfile() {
    const raw  = localStorage.getItem("activito_user");
    const user = raw ? JSON.parse(raw) : {
        name:     "Explorer",
        email:    "",
        initials: "ME",
        avatar:   null,
    };

    // ── Name elements ─────────────────────────────────────
    document.querySelectorAll("[data-user-name]").forEach(el => {
        el.textContent = user.name;
    });

    // ── Email elements ────────────────────────────────────
    document.querySelectorAll("[data-user-email]").forEach(el => {
        el.textContent = user.email;
    });

    // ── Initials / avatar elements ────────────────────────
    document.querySelectorAll("[data-user-avatar]").forEach(el => {
        if (user.avatar) {
            // Only ever renders the signed-in user's own profile today, so
            // this is self-XSS at worst — but escape anyway, because the
            // day a submitter name shows on someone else's screen it stops
            // being self-inflicted.
            el.innerHTML = `<img src="${safeImageUrl(user.avatar)}"
                                 class="w-full h-full object-cover rounded-full"
                                 alt="${escapeHtml(user.name)}">`;
        } else {
            el.textContent = user.initials;
        }
    });

    // ── Greeting (Good morning/afternoon/evening) ─────────
    const greetEl = document.querySelector("[data-user-greeting]");
    if (greetEl) {
        const hour = new Date().getHours();
        const time = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
        greetEl.textContent = `Good ${time} 👋`;
    }

    return user;
}

// Wait for DOM to be ready before running
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadUserProfile);
} else {
    // DOM already loaded (script is at end of body)
    loadUserProfile();
}