// frontend/static/js/shared/features.js
// Feature flags for work-in-progress surfaces.
//
// Toggle from the repo root:
//   node scripts/toggle-feature.mjs hiddenGems on
//   node scripts/toggle-feature.mjs hiddenGems off
//   node scripts/toggle-feature.mjs            (list current flags)
//===================================

const FEATURES = {
	// Hidden Gems carousel on the dashboard. Off while the concept
	// is still being figured out — the upload + button stays visible
	// either way so people can still submit spots.
	hiddenGems: false,
};
