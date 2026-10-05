// ════════════════════════════════════════════════════════════
//  VIBE EXPERIENCE — full-screen vibe quiz
//
//  The quiz is what the whole app is built around, so it takes
//  over the viewport rather than sitting in a small dialog. The
//  colour field behind it flows toward whichever vibe is winning
//  as answers come in.
//
//  Mounts itself on demand — pages only need to load this file
//  (plus vibeData.js) and call openVibeQuiz().
//
//  On apply it dispatches `vibe:applied` on window with
//  { topCat, scores } so each page can refresh however it likes.
// ════════════════════════════════════════════════════════════

const VIBE_XP_STORAGE_SCORES = "activito_vibe";
const VIBE_XP_STORAGE_TAKEN = "activito_vibes_taken";
// Energy, group size and indoor/outdoor leaning are already asked by the
// quiz ("What energy level?", "Who are you going with?"). They used to be
// collapsed into vibe scores and thrown away; the ranker can use them
// directly, so keep them.
const VIBE_XP_STORAGE_TRAITS = "activito_vibe_traits";

// Each path is drawn across 2880 units inside a 1440-wide viewBox,
// so sliding it exactly 1440 lands on an identical crest and loops
// without a visible seam.
const VIBE_WAVE_PATHS = [
	"M0,170 c180,-70 540,70 720,0 c180,-70 540,70 720,0 c180,-70 540,70 720,0 c180,-70 540,70 720,0 L2880,320 L0,320 Z",
	"M0,205 c200,60 520,-80 720,0 c200,60 520,-80 720,0 c200,60 520,-80 720,0 c200,60 520,-80 720,0 L2880,320 L0,320 Z",
	"M0,240 c160,-50 560,60 720,0 c160,-50 560,60 720,0 c160,-50 560,60 720,0 c160,-50 560,60 720,0 L2880,320 L0,320 Z",
];

let vibeXpRoot = null;
let vibeXpIndex = 0;
let vibeXpScores = {};
let vibeXpTraits = {};
let vibeXpLastFocus = null;

// ── Helpers ─────────────────────────────────────────────────

function emptyVibeXpScores() {
	return { Adventure: 0, Social: 0, Relax: 0, Explore: 0, Wellness: 0 };
}

// Option copy still carries trailing emoji from the original data;
// the UI shows a vibe icon instead, so strip them at render time.
function stripTrailingEmoji(text) {
	return text.replace(/[\p{Extended_Pictographic}️‍\s]+$/u, "");
}

function dominantVibeOf(scores) {
	return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
}

// Whichever vibe is ahead right now — drives the colour field.
function leadingVibeSoFar() {
	const ranked = Object.entries(vibeXpScores).sort((a, b) => b[1] - a[1]);

	return ranked[0][1] > 0 ? ranked[0][0] : "Social";
}

function paintField(category) {
	const meta = VIBE_META[category];

	if (!meta || !vibeXpRoot) return;

	vibeXpRoot.style.setProperty("--vibe-a", meta.barTop);
	vibeXpRoot.style.setProperty("--vibe-b", meta.barBot);
}

function vibeXpPercentages() {
	const total = Object.values(vibeXpScores).reduce((a, b) => a + b, 0) || 1;

	return Object.fromEntries(
		Object.entries(vibeXpScores).map(([cat, score]) => [
			cat,
			Math.round((score / total) * 100),
		]),
	);
}

// ── Shell ───────────────────────────────────────────────────

function buildVibeXpShell() {
	const root = document.createElement("div");

	root.className = "vibe-xp";
	root.setAttribute("role", "dialog");
	root.setAttribute("aria-modal", "true");
	root.setAttribute("aria-label", "Vibe check");

	root.innerHTML = `
		<div class="vibe-field" aria-hidden="true">
			<div class="vibe-orb vibe-orb--a"></div>
			<div class="vibe-orb vibe-orb--b"></div>
			<svg class="vibe-waves" viewBox="0 0 1440 320" preserveAspectRatio="none">
				${VIBE_WAVE_PATHS.map(
					(d, i) => `<path class="vibe-wave vibe-wave--${i + 1}" d="${d}" />`,
				).join("")}
			</svg>
		</div>

		<header class="vibe-xp__bar">
			<div class="vibe-progress" id="vibeXpProgress"></div>
			<button type="button" class="vibe-close" id="vibeXpClose" aria-label="Close vibe check">
				${iconSvg("close", "w-5 h-5") || "&times;"}
			</button>
		</header>

		<main class="vibe-stage" id="vibeXpStage"></main>
	`;

	root.querySelector("#vibeXpClose").addEventListener("click", closeVibeQuiz);

	return root;
}

function renderProgress() {
	const bar = vibeXpRoot?.querySelector("#vibeXpProgress");

	if (!bar) return;

	bar.innerHTML = VIBE_QUESTIONS.map(
		(_, i) =>
			`<div class="vibe-progress__seg${i < vibeXpIndex ? " is-done" : ""}"></div>`,
	).join("");
}

// ── Question ────────────────────────────────────────────────

function renderVibeXpQuestion() {
	const stage = vibeXpRoot?.querySelector("#vibeXpStage");
	const question = VIBE_QUESTIONS[vibeXpIndex];

	if (!stage || !question) return;

	stage.classList.remove("is-advancing");

	stage.innerHTML = `
		<p class="vibe-step vibe-enter" style="--i:0">
			Question ${vibeXpIndex + 1} of ${VIBE_QUESTIONS.length}
		</p>
		<h1 class="vibe-q vibe-enter" style="--i:1">${escapeHtml(question.q)}</h1>
		<div class="vibe-options">
			${question.options
				.map((option, i) => {
					const tint =
						VIBE_META[dominantVibeOf(option.scores)]?.barTop || "#fff";

					return `
						<button type="button" class="vibe-option vibe-enter"
							style="--i:${i + 2}; --opt-tint:${tint}" data-option="${i}">
							<span class="vibe-option__icon">
								${vibeIconSvg(dominantVibeOf(option.scores), "w-5 h-5")}
							</span>
							<span>${escapeHtml(stripTrailingEmoji(option.text))}</span>
						</button>`;
				})
				.join("")}
		</div>
	`;

	stage.querySelectorAll("[data-option]").forEach((btn) => {
		btn.addEventListener("click", () => {
			btn.classList.add("is-picked");
			selectVibeXpAnswer(Number(btn.dataset.option));
		});
	});

	renderProgress();
}

function selectVibeXpAnswer(optionIndex) {
	const option = VIBE_QUESTIONS[vibeXpIndex].options[optionIndex];

	for (const [cat, points] of Object.entries(option.scores)) {
		vibeXpScores[cat] = (vibeXpScores[cat] || 0) + points;
	}

	// Later answers win: the last thing you said about energy or company
	// is the most current read on tonight.
	if (option.traits) Object.assign(vibeXpTraits, option.traits);

	// Field shifts toward the emerging winner as the quiz progresses.
	paintField(leadingVibeSoFar());

	vibeXpIndex++;
	renderProgress();

	const stage = vibeXpRoot?.querySelector("#vibeXpStage");

	stage?.classList.add("is-advancing");

	setTimeout(() => {
		if (vibeXpIndex < VIBE_QUESTIONS.length) {
			renderVibeXpQuestion();
			return;
		}

		renderVibeXpResult();
	}, 200);
}

// ── Result ──────────────────────────────────────────────────

function renderVibeXpResult() {
	const stage = vibeXpRoot?.querySelector("#vibeXpStage");

	if (!stage) return;

	const percentages = vibeXpPercentages();
	const ranked = Object.entries(percentages).sort((a, b) => b[1] - a[1]);
	const [topCat, topPct] = ranked[0];

	paintField(topCat);
	stage.classList.remove("is-advancing");

	stage.innerHTML = `
		<p class="vibe-result__label vibe-enter" style="--i:0">Your vibe</p>

		<div class="vibe-result__head vibe-enter" style="--i:1">
			<span class="vibe-result__icon">${vibeIconSvg(topCat, "w-16 h-16 md:w-24 md:h-24")}</span>
			<div>
				<h1 class="vibe-result__name">${escapeHtml(topCat)}</h1>
				<p class="text-white/50 text-sm md:text-base mt-1">${topPct}% of your answers pointed here</p>
			</div>
		</div>

		<div class="vibe-breakdown vibe-enter" style="--i:2">
			${ranked
				.map(([cat, pct]) => {
					const meta = VIBE_META[cat];

					return `
						<div>
							<div class="vibe-row__meta">
								<span class="inline-flex items-center gap-2 font-semibold">
									<span style="color:${meta.barTop}">${vibeIconSvg(cat, "w-4 h-4")}</span>
									${escapeHtml(cat)}
								</span>
								<span class="text-white/50">${pct}%</span>
							</div>
							<div class="vibe-row__track">
								<div class="vibe-row__fill"
									style="background:linear-gradient(90deg,${meta.barTop},${meta.barBot})"
									data-fill="${pct}"></div>
							</div>
						</div>`;
				})
				.join("")}
		</div>

		<div class="vibe-actions vibe-enter" style="--i:3">
			<button type="button" class="vibe-btn vibe-btn--primary" id="vibeXpApply">
				Show me ${escapeHtml(topCat)} spots →
			</button>
			<button type="button" class="vibe-btn vibe-btn--ghost" id="vibeXpRetake">
				Retake
			</button>
		</div>
	`;

	stage
		.querySelector("#vibeXpApply")
		.addEventListener("click", () => applyVibeXpResult(topCat));

	stage.querySelector("#vibeXpRetake").addEventListener("click", () => {
		vibeXpIndex = 0;
		vibeXpScores = emptyVibeXpScores();
		vibeXpTraits = {};
		vibeXpTraits = {};
		paintField("Social");
		renderVibeXpQuestion();
	});

	// Bars fill from zero once the browser has the initial scale painted.
	requestAnimationFrame(() =>
		requestAnimationFrame(() => {
			stage.querySelectorAll("[data-fill]").forEach((el) => {
				el.style.transform = `scaleX(${Number(el.dataset.fill) / 100})`;
			});
		}),
	);

	renderProgress();
}

function applyVibeXpResult(topCat) {
	const percentages = vibeXpPercentages();
	const taken = parseInt(
		localStorage.getItem(VIBE_XP_STORAGE_TAKEN) || "0",
		10,
	);

	localStorage.setItem(VIBE_XP_STORAGE_TAKEN, taken + 1);
	localStorage.setItem(VIBE_XP_STORAGE_SCORES, JSON.stringify(percentages));
	localStorage.setItem(VIBE_XP_STORAGE_TRAITS, JSON.stringify(vibeXpTraits));

	const traits = { ...vibeXpTraits };

	closeVibeQuiz();

	// Each page decides what to refresh — the quiz itself stays page-agnostic.
	window.dispatchEvent(
		new CustomEvent("vibe:applied", {
			detail: { topCat, scores: percentages, traits },
		}),
	);
}

// ── Open / close ────────────────────────────────────────────

function handleVibeXpKeydown(e) {
	if (e.key === "Escape") closeVibeQuiz();
}

function openVibeQuiz() {
	if (vibeXpRoot) return;

	vibeXpLastFocus = document.activeElement;
	vibeXpIndex = 0;
	vibeXpScores = emptyVibeXpScores();
	vibeXpTraits = {};

	vibeXpRoot = buildVibeXpShell();
	document.body.appendChild(vibeXpRoot);
	document.body.style.overflow = "hidden";

	paintField("Social");
	renderVibeXpQuestion();

	document.addEventListener("keydown", handleVibeXpKeydown);
	vibeXpRoot.querySelector(".vibe-option")?.focus();
}

function closeVibeQuiz() {
	if (!vibeXpRoot) return;

	const root = vibeXpRoot;

	// Null the handle up front so a second call can't double-remove.
	vibeXpRoot = null;

	document.removeEventListener("keydown", handleVibeXpKeydown);
	document.body.style.overflow = "";
	root.classList.add("is-closing");

	setTimeout(() => root.remove(), 240);

	vibeXpLastFocus?.focus?.();
	vibeXpLastFocus = null;
}

/**
 * Energy / group size / setting captured by the quiz, for the recommendation
 * context. Empty until someone completes a vibe check.
 */
function getStoredVibeTraits() {
	try {
		return (
			JSON.parse(localStorage.getItem(VIBE_XP_STORAGE_TRAITS) || "{}") || {}
		);
	} catch {
		return {};
	}
}

// ── Declarative trigger ──────────────────────────────────────
// Replaces onclick="openVibeQuiz()". See docs/module-migration.md.
document.addEventListener("click", (event) => {
	if (event.target.closest("[data-open-vibe-quiz]")) openVibeQuiz();
});
