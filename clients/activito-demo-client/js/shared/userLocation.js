// ════════════════════════════════════════════════════════════
//  USER LOCATION
//  Browser location is only used as the first default.
//  After activito_coords exists, never overwrite it automatically.
// ════════════════════════════════════════════════════════════

// Update every location label currently visible on the page
function updateLocationLabels(label) {
    document.querySelectorAll("[data-location-label]").forEach(el => {
        el.textContent = label;
    });

    const landingLocationText = document.getElementById("userLocation");

    if (landingLocationText) {
        landingLocationText.textContent = label;
    }
}

// Use stored label immediately when returning to a page
function showStoredLocationLabel() {
    const savedLabel =
        localStorage.getItem("activito_location_label") ||
        "Location";

    updateLocationLabels(savedLabel);
}

// Ask browser for location only if app does not already have active coords
function initializeBrowserLocation() {
    const existingCoords = localStorage.getItem("activito_coords");

    // Important:
    // If coords already exist, keep them.
    // This protects both browser-selected and manually-selected locations.
    if (existingCoords) {
        showStoredLocationLabel();
        return;
    }

    if (!("geolocation" in navigator)) {
        localStorage.setItem(
            "activito_location_label",
            "Location not supported"
        );

        updateLocationLabels("Location not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const coords = { lat, lon };

            // GPS coords may be useful later if user wants to return to nearby mode
            localStorage.setItem(
                "activito_gps_coords",
                JSON.stringify(coords)
            );

            // Browser location becomes active location only on first load
            localStorage.setItem(
                "activito_coords",
                JSON.stringify(coords)
            );

            localStorage.setItem(
                "activito_location_source",
                "browser"
            );

            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
                );

                const data = await response.json();

                const city =
                    data.address.city ||
                    data.address.town ||
                    data.address.village ||
                    "Unknown City";

                const state = data.address.state || "";

                const label = state
                    ? `${city}, ${state}`
                    : city;

                localStorage.setItem(
                    "activito_location_label",
                    label
                );

                updateLocationLabels(label);

            } catch {
                localStorage.setItem(
                    "activito_location_label",
                    "Current location"
                );

                updateLocationLabels("Current location");
            }
        },

        () => {
            // If a saved location arrived while the permission prompt was
            // open (e.g. fetched from the account), keep it — don't let a
            // denial overwrite a real city with "Choose location".
            if (localStorage.getItem("activito_coords")) {
                showStoredLocationLabel();
                return;
            }

            localStorage.setItem(
                "activito_location_label",
                "Choose location"
            );

            updateLocationLabels("Choose location");
        }
    );
}

// The script loads in the page <head>, before the dashboard HTML exists.
// Wait until HTML is ready before updating the UI.
document.addEventListener("DOMContentLoaded", () => {
    showStoredLocationLabel();
    initializeBrowserLocation();
});