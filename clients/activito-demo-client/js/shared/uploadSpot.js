// frontend/static/js/shared/uploadSpot.js
// "Upload your Activito" — floating + button opens a submission form.
// Approved submissions land in Hidden Gems; submitting earns points.
// Requires config.js (API_BASE), icons.js, toast.js.
//===================================

const UPLOAD_CATEGORIES = [
	"Adventure",
	"Social",
	"Relax",
	"Explore",
	"Wellness",
];

let uploadModalBuilt = false;
let uploadSelectedCategory = null;
let uploadSubmitting = false;

function buildUploadModal() {
	if (uploadModalBuilt) return;

	uploadModalBuilt = true;

	const overlay = document.createElement("div");

	overlay.id = "uploadSpotModal";
	overlay.className =
		"hidden fixed inset-0 z-[998] items-center justify-center bg-black/70 backdrop-blur-md px-4";
	overlay.innerHTML = `
		<div class="relative w-full max-w-lg max-h-[90vh] overflow-y-auto modal-scroll
					rounded-[2rem] bg-[#131318] border border-white/10 shadow-2xl">

			<!-- Header -->
			<div class="relative overflow-hidden rounded-t-[2rem] bg-gradient-to-br from-purple-600/30 via-fuchsia-600/15 to-blue-600/20 px-6 pt-6 pb-5 border-b border-white/10">
				<div class="absolute -top-10 -right-8 w-40 h-40 rounded-full bg-purple-600/30 blur-[60px] pointer-events-none"></div>

				<button id="uploadCloseBtn" type="button"
					class="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/10 text-white
						   flex items-center justify-center hover:bg-white/20 transition">✕</button>

				<p class="text-xs font-semibold text-purple-300 uppercase tracking-widest mb-1">Upload your Activito</p>
				<h2 class="text-2xl font-display font-black text-white">Share a spot you love</h2>
				<p class="text-sm text-white/50 mt-1">Approved spots go live in Hidden Gems for everyone nearby.</p>

				<span class="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full
							 bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs font-bold">
					${iconSvg("bolt", "w-3.5 h-3.5")} +10 pts on submit · +50 when approved
				</span>
			</div>

			<!-- Form -->
			<div class="px-6 py-5 space-y-4">
				<div>
					<label class="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5" for="uploadName">Spot name *</label>
					<input id="uploadName" type="text" maxlength="80" placeholder="Colonial Grille"
						class="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white text-sm
							   outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40 transition">
				</div>

				<div>
					<p class="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Vibe *</p>
					<div id="uploadCategoryPills" class="flex flex-wrap gap-2"></div>
				</div>

				<div>
					<label class="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5" for="uploadAddress">Address *</label>
					<input id="uploadAddress" type="text" maxlength="160" placeholder="3365 Richmond Rd, Beachwood, OH"
						class="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white text-sm
							   outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40 transition">
					<p class="text-[11px] text-white/30 mt-1">Used for directions — be as exact as you can.</p>
				</div>

				<div>
					<label class="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5" for="uploadWebsite">Website <span class="text-white/25 normal-case">(optional)</span></label>
					<input id="uploadWebsite" type="text" maxlength="200" placeholder="colonialgrille.com"
						class="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white text-sm
							   outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40 transition">
				</div>

				<div>
					<label class="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5" for="uploadImage">Photo link <span class="text-white/25 normal-case">(optional)</span></label>
					<input id="uploadImage" type="text" maxlength="300" placeholder="https://…/photo.jpg"
						class="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white text-sm
							   outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40 transition">
				</div>

				<div>
					<label class="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5" for="uploadDescription">Why do you love it? <span class="text-white/25 normal-case">(optional)</span></label>
					<textarea id="uploadDescription" rows="3" maxlength="500"
						placeholder="Hidden patio in the back, best wings in the city…"
						class="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white text-sm
							   outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40 transition resize-none"></textarea>
				</div>

				<button id="uploadSubmitBtn" type="button"
					class="w-full py-3.5 rounded-xl font-bold text-white text-sm
						   bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500
						   hover:opacity-90 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed">
					Submit for review
				</button>
			</div>
		</div>
	`;

	document.body.appendChild(overlay);

	// Category pills
	const pillsWrap = overlay.querySelector("#uploadCategoryPills");

	pillsWrap.innerHTML = UPLOAD_CATEGORIES.map(
		(cat) => `
		<button type="button" data-upload-cat="${cat}"
			class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/15
				   bg-white/10 text-white/60 text-sm font-semibold hover:text-white transition">
			${vibeIconSvg(cat, "w-4 h-4")} ${cat}
		</button>
	`,
	).join("");

	pillsWrap.querySelectorAll("[data-upload-cat]").forEach((btn) => {
		btn.addEventListener("click", () => {
			uploadSelectedCategory = btn.dataset.uploadCat;

			pillsWrap.querySelectorAll("[data-upload-cat]").forEach((pill) => {
				const active = pill === btn;

				pill.classList.toggle("bg-purple-600", active);
				pill.classList.toggle("text-white", active);
				pill.classList.toggle("border-purple-400", active);
				pill.classList.toggle("bg-white/10", !active);
				pill.classList.toggle("text-white/60", !active);
				pill.classList.toggle("border-white/15", !active);
			});
		});
	});

	overlay
		.querySelector("#uploadCloseBtn")
		.addEventListener("click", closeUploadSpotModal);

	overlay.addEventListener("click", (e) => {
		if (e.target === overlay) closeUploadSpotModal();
	});

	overlay
		.querySelector("#uploadSubmitBtn")
		.addEventListener("click", submitUploadSpot);
}

function openUploadSpotModal() {
	buildUploadModal();

	const overlay = document.getElementById("uploadSpotModal");

	overlay.classList.remove("hidden");
	overlay.classList.add("flex");
	overlay.querySelector("#uploadName")?.focus();
}

function closeUploadSpotModal() {
	const overlay = document.getElementById("uploadSpotModal");

	overlay?.classList.add("hidden");
	overlay?.classList.remove("flex");
}

function resetUploadForm() {
	for (const id of [
		"uploadName",
		"uploadAddress",
		"uploadWebsite",
		"uploadImage",
		"uploadDescription",
	]) {
		const el = document.getElementById(id);
		if (el) el.value = "";
	}

	uploadSelectedCategory = null;

	document.querySelectorAll("[data-upload-cat]").forEach((pill) => {
		pill.classList.remove("bg-purple-600", "border-purple-400");
		pill.classList.add("bg-white/10", "text-white/60", "border-white/15");
	});
}

async function submitUploadSpot() {
	if (uploadSubmitting) return;

	const name = document.getElementById("uploadName").value.trim();
	const address = document.getElementById("uploadAddress").value.trim();

	if (!name) return showToast("Give your spot a name.", "error");
	if (!uploadSelectedCategory)
		return showToast("Pick a vibe for your spot.", "error");
	if (!address)
		return showToast("Add the address so people can find it.", "error");

	const submitBtn = document.getElementById("uploadSubmitBtn");

	uploadSubmitting = true;
	submitBtn.disabled = true;
	submitBtn.textContent = "Submitting…";

	try {
		const res = await fetch(`${API_BASE}/api/uploads`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({
				name,
				category: uploadSelectedCategory,
				address,
				website: document.getElementById("uploadWebsite").value.trim(),
				image: document.getElementById("uploadImage").value.trim(),
				description: document.getElementById("uploadDescription").value.trim(),
			}),
		});

		const data = await res.json().catch(() => null);

		if (!res.ok) {
			throw new Error(data?.error || "Couldn't submit your spot — try again.");
		}

		showToast(
			`${name} submitted for review — +${data.pointsAwarded} pts!`,
			"success",
		);

		resetUploadForm();
		closeUploadSpotModal();

		// Pull in the spot_submitted / points_earned notifications.
		if (typeof loadNotifications === "function") {
			loadNotifications();
		}

		if (typeof updatePointsChip === "function") {
			updatePointsChip(data.balance);
		}
	} catch (err) {
		console.error("Upload submit failed:", err);
		showToast(err.message || "Couldn't submit your spot — try again.", "error");
	} finally {
		uploadSubmitting = false;
		submitBtn.disabled = false;
		submitBtn.textContent = "Submit for review";
	}
}

// ── Declarative trigger ──────────────────────────────────────
// Replaces onclick="openUploadSpotModal()". See docs/module-migration.md.
document.addEventListener("click", (event) => {
	if (event.target.closest("[data-open-upload]")) openUploadSpotModal();
});
