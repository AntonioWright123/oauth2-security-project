// ─── Sticky nav + category hide + hero parallax on scroll ──
const stickyNav = document.getElementById("stickyNav");
const categoryNav = document.getElementById("categoryNav");
const heroHeadline = document.getElementById("heroHeadline");
const heroStack = document.getElementById("cardStack");
const prefersReducedMotion = window.matchMedia(
	"(prefers-reduced-motion: reduce)",
).matches;

let scrollTicking = false;

window.addEventListener("scroll", () => {
	if (scrollTicking) return;

	scrollTicking = true;

	requestAnimationFrame(() => {
		const y = window.scrollY;

		stickyNav.classList.toggle("scrolled", y > 30);

		// Hide category pills once we've scrolled past the hero
		categoryNav.classList.toggle("hidden-nav", y > window.innerHeight * 0.4);

		// Gentle parallax drift — headline and card stack scroll at
		// slightly different speeds so the hero feels layered.
		if (!prefersReducedMotion && y < window.innerHeight * 1.2) {
			if (heroHeadline)
				heroHeadline.style.transform = `translateY(${y * 0.14}px)`;
			if (heroStack)
				heroStack.style.setProperty("--parallax-y", `${y * 0.06}px`);
		}

		scrollTicking = false;
	});
});

// ─── Hero card stack data ─────────────────────────────────
const heroCards = [
	{
		title: "Cedar Point",
		address: "1 Cedar Point Dr, Sandusky, OH",
		rating: "4.8 • $45–$85 • 62 mi",
		tags: [
			{ label: "Adventure", cls: "from-orange-500 to-amber-400" },
			{ label: "Social", cls: "from-purple-600 to-pink-500" },
		],
		images: [
			"https://images.unsplash.com/photo-1502136969935-8d8eef54d77b?w=600&q=80",
			"https://images.unsplash.com/photo-1578374173705-969cbe6f2d6b?w=600&q=80",
			"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
			"https://images.unsplash.com/photo-1501612780327-45045538702b?w=600&q=80",
		],
		logo: "https://images.unsplash.com/photo-1502136969935-8d8eef54d77b?w=100&q=80",
	},
	{
		title: "Edgewater Park Beach",
		address: "6500 Memorial Shoreway, Cleveland",
		rating: "4.6 • Free • 3.4 mi",
		tags: [
			{ label: "Relax", cls: "from-sky-500 to-blue-400" },
			{ label: "Adventure", cls: "from-green-500 to-emerald-400" },
		],
		images: [
			"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
			"https://images.unsplash.com/photo-1526485856375-9110812fbf35?w=600&q=80",
			"https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80",
			"https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=600&q=80",
		],
		logo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&q=80",
	},
	{
		title: "Scene75 Entertainment",
		address: "3688 Center Rd, Brunswick, OH",
		rating: "4.7 • $15–$40 • 18 mi",
		tags: [
			{ label: "Social", cls: "from-purple-600 to-pink-500" },
			{ label: "Explore", cls: "from-indigo-500 to-blue-500" },
		],
		images: [
			"https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80",
			"https://images.unsplash.com/photo-1511882150382-421056c89033?w=600&q=80",
			"https://images.unsplash.com/photo-1595429035839-c99c298ffdde?w=600&q=80",
			"https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80",
		],
		logo: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&q=80",
	},
];

let currentCard = 0;
let isAnimating = false;

function buildHeroCard(data, index) {
	const tagsHTML = data.tags
		.map(
			(t) =>
				`<div class="px-2.5 py-1 rounded-full bg-gradient-to-r ${t.cls} shadow-md">
       <span class="text-white font-bold text-[10px] md:text-xs">${t.label}</span>
     </div>`,
		)
		.join("");

	const card = document.createElement("div");
	card.className = `hero-card absolute inset-0 rounded-[2rem] bg-[#12101a]/95 backdrop-blur-xl
                    border border-white/10 ring-1 ring-white/5
                    shadow-[0_25px_60px_rgba(0,0,0,0.55)]
                    p-3 md:p-4 text-white overflow-hidden`;
	card.style.zIndex = heroCards.length - index;

	// slight rotation for cards underneath to show stack depth
	if (index === 1) card.style.transform = "rotate(-6deg)";
	if (index === 2) card.style.transform = "rotate(4deg) translate(8px,8px)";

	card.innerHTML = `
    <!-- Ambient glow — hero palette -->
    <div class="absolute -top-16 -right-12 w-48 h-48 rounded-full bg-emerald-500/20 blur-[70px] pointer-events-none"></div>
    <div class="absolute -bottom-20 -left-12 w-44 h-44 rounded-full bg-purple-600/20 blur-[70px] pointer-events-none"></div>

    <!-- Header bar -->
    <div class="relative flex items-center justify-between gap-3 mb-2 px-3.5 py-2.5 rounded-2xl
                bg-white/[0.05] backdrop-blur-xl border border-white/10">
      <div class="min-w-0">
        <p class="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-300 uppercase tracking-[0.18em]">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
          Suggested Activito
        </p>
        <p class="text-[11px] text-white/50 truncate mt-0.5">${iconSvg("pin", "w-3 h-3 inline -mt-0.5 text-white/35")} ${data.address}</p>
      </div>
      <img src="../static/images/activitoA.svg"
           class="h-7 md:h-9 object-contain shrink-0 opacity-90 drop-shadow-[0_0_10px_rgba(52,211,153,0.35)]" alt="A">
    </div>

    <!-- 2×2 image grid -->
    <div class="relative grid grid-cols-2 gap-1.5 rounded-2xl overflow-hidden border border-white/10
          h-[295px] md:h-[405px]">
      ${data.images
				.map(
					(src) => `
        <div class="overflow-hidden bg-white/5">
          <img src="${src}" class="img-fade w-full h-full object-cover"
               loading="lazy" onload="this.classList.add('loaded')"
               onerror="this.src='../static/images/no-image.svg'" alt="">
        </div>`,
				)
				.join("")}
      <!-- soft fade so the floating place bar sits on a settled base -->
      <div class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
    </div>

    <!-- Bottom place card -->
    <div class="absolute left-3 right-3 bottom-3
                flex items-center gap-3
                rounded-2xl bg-[#0b0a10]/85 backdrop-blur-2xl
                border border-white/10 ring-1 ring-white/5 p-3 md:p-4
                shadow-[0_12px_32px_rgba(0,0,0,0.5)]">

      <!-- Logo circle -->
      <div class="flex items-center justify-center h-12 w-12 md:h-14 md:w-14
                  rounded-full ring-2 ring-emerald-400/50 ring-offset-2 ring-offset-black
                  bg-black shrink-0 overflow-hidden">
        <img class="w-full h-full object-cover"
             src="${data.logo}"
             onerror="this.src='../static/images/activitoA.svg'" alt="">
      </div>

      <!-- Name + rating + tags -->
      <div class="flex flex-col flex-1 min-w-0 gap-1">
        <h3 class="font-display font-bold text-base md:text-xl text-white truncate">${data.title}</h3>
        <p class="text-[11px] md:text-sm text-white/50">${iconSvg("star", "w-3 h-3 inline -mt-0.5 text-amber-400")} ${data.rating}</p>
        <div class="flex gap-1.5 flex-wrap">${tagsHTML}</div>
      </div>

      <!-- Flip arrow — same gradient family as the hero CTA -->
      <button type="button" data-flip-card aria-label="Next spot"
        class="group/flip h-10 w-10 md:h-12 md:w-12 rounded-full
               bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600
               shadow-[0_6px_20px_rgba(16,185,129,0.4)] border border-white/20
               flex items-center justify-center transition-all duration-300
               hover:scale-110 hover:shadow-[0_8px_26px_rgba(16,185,129,0.55)]
               active:scale-95 shrink-0">
        <svg class="w-4 h-4 md:w-5 md:h-5 text-white transition-transform duration-300 group-hover/flip:translate-x-0.5"
             viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2.5" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
        </svg>
      </button>
    </div>
  `;

	return card;
}

function renderStack() {
	const stack = document.getElementById("cardStack");
	stack.innerHTML = "";
	// render from last to first so top card is on top
	for (let i = heroCards.length - 1; i >= 0; i--) {
		const dataIndex = (currentCard + i) % heroCards.length;
		const card = buildHeroCard(heroCards[dataIndex], i);
		stack.appendChild(card);
	}
}

// Re-apply depth styling (z-index + the stacked rotations) based on each
// card's position in the DOM. Last child = top of the stack.
function applyStackDepth() {
	const stack = document.getElementById("cardStack");
	const cards = [...stack.querySelectorAll(".hero-card")];

	cards.forEach((card, domIndex) => {
		const depth = cards.length - 1 - domIndex; // 0 = top card

		card.style.zIndex = heroCards.length - depth;
		card.style.transform =
			depth === 1
				? "rotate(-6deg)"
				: depth === 2
					? "rotate(4deg) translate(8px,8px)"
					: "";
	});
}

function flipCard() {
	if (isAnimating) return;
	isAnimating = true;

	const stack = document.getElementById("cardStack");
	const topCard = stack.querySelector(".hero-card:last-child");
	if (!topCard) {
		isAnimating = false;
		return;
	}

	// animate top card flying off like paper
	topCard.classList.add("card-flip-off");

	let settled = false;
	const settle = () => {
		if (settled) return;
		settled = true;

		currentCard = (currentCard + 1) % heroCards.length;

		// Move the SAME element to the bottom of the stack instead of
		// rebuilding everything. A DOM move keeps every <img> alive, so
		// nothing refetches or re-fades — the old innerHTML rebuild made
		// the whole stack flash like a page reload on every flip.
		topCard.classList.remove("card-flip-off");
		topCard.style.transition = "none"; // snap behind the stack…
		stack.prepend(topCard); // (first child = bottom)
		applyStackDepth();
		void topCard.offsetWidth; // …commit before re-enabling
		topCard.style.transition = "";

		isAnimating = false;
	};

	// animationend is the happy path; the timeout covers every case where
	// it never fires (hidden tab, reduced motion, animation interrupted) so
	// the flip button can't get stuck in the isAnimating lock.
	topCard.addEventListener("animationend", settle, { once: true });
	setTimeout(settle, 700); // flip animation runs 550ms
}

// Initial render
renderStack();

// ── Declarative trigger ──────────────────────────────────────
// Replaces data-flip-card built into the hero card markup.
document.addEventListener("click", (event) => {
	if (event.target.closest("[data-flip-card]")) flipCard();
});
