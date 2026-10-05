// ============================================================
//  Activito — gallery.js
//  Cleveland, Ohio activity data + dynamic card rendering
//  Layout: 4-col × 2-row FREE grid + blurred locked section

//index still uses this file
// ============================================================

const activities = [
    {
      id: 1,
      name: "Cedar Point",
      category: "Adventure",
      tags: ["Adventure", "Social"],
      rating: 4.8,
      price: "$45–$85",
      distance: "62 mi",
      address: "1 Cedar Point Dr, Sandusky, OH",
      hours: "Open until 10 PM",
      website: "cedarpoint.com",
      description: "America's Roller Coast — 70+ rides, record-breaking coasters, and a mile-long beach on Lake Erie.",
      whyActivito: "The ultimate thrill day. Nobody comes back from Cedar Point without a story.",
      image: "https://images.unsplash.com/photo-1502136969935-8d8eef54d77b?w=800&q=80",
      images: ["https://images.unsplash.com/photo-1502136969935-8d8eef54d77b?w=800&q=80","https://images.unsplash.com/photo-1578374173705-969cbe6f2d6b?w=800&q=80","https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80","https://images.unsplash.com/photo-1501612780327-45045538702b?w=800&q=80"],
      tagColors: ["bg-orange-500", "bg-pink-500"],
    },
    {
      id: 2,
      name: "Edgewater Park Beach",
      category: "Relax",
      tags: ["Relax", "Adventure"],
      rating: 4.6,
      price: "Free",
      distance: "3.4 mi",
      address: "6500 Memorial Shoreway, Cleveland",
      hours: "Open until 11 PM",
      website: "clevelandmetroparks.com",
      description: "A stunning lakefront beach on Lake Erie — golden-hour sunsets, volleyball, and summer hangs.",
      whyActivito: "The easiest good day in Cleveland. Bring a towel, stay for the sunset.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
      images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80","https://images.unsplash.com/photo-1526485856375-9110812fbf35?w=800&q=80","https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80","https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&q=80"],
      tagColors: ["bg-sky-500", "bg-green-500"],
    },
    {
      id: 3,
      name: "Scene75 Entertainment",
      category: "Social",
      tags: ["Social", "Explore"],
      rating: 4.7,
      price: "$15–$40",
      distance: "18 mi",
      address: "3688 Center Rd, Brunswick, OH",
      hours: "Open until 11 PM",
      website: "scene75.com",
      description: "Massive indoor playground — arcade, go-karts, laser tag, mini bowling, and a two-story drop tower.",
      whyActivito: "Rainy-day cheat code. Groups walk in for an hour and stay for five.",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
      images: ["https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80","https://images.unsplash.com/photo-1511882150382-421056c89033?w=800&q=80","https://images.unsplash.com/photo-1595429035839-c99c298ffdde?w=800&q=80","https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80"],
      tagColors: ["bg-purple-500", "bg-blue-500"],
    },
    {
      id: 4,
      name: "Sweeties Golfland",
      category: "Social",
      tags: ["Social", "Relax"],
      rating: 4.5,
      price: "$8–$14",
      distance: "7.1 mi",
      address: "6770 Brookpark Rd, Cleveland",
      hours: "Open until 9 PM",
      website: "sweetiescandy.com",
      description: "Old-school putt-putt next to Ohio's biggest candy store — 18 holes, then a sugar rush.",
      whyActivito: "Mini golf + a warehouse of candy. Date-night material since forever.",
      image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
      images: ["https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80","https://images.unsplash.com/photo-1592919505780-303950717480?w=800&q=80","https://images.unsplash.com/photo-1595429035839-c99c298ffdde?w=800&q=80","https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80"],
      tagColors: ["bg-pink-500", "bg-teal-500"],
    },
    {
      id: 5,
      name: "Kalahari Indoor Waterpark",
      category: "Adventure",
      tags: ["Adventure", "Relax"],
      rating: 4.6,
      price: "$59–$99",
      distance: "58 mi",
      address: "7000 Kalahari Dr, Sandusky, OH",
      hours: "Open until 9 PM",
      website: "kalahariresorts.com",
      description: "America's largest indoor waterpark — wave pools, raft slides, and a lazy river, 84° all year.",
      whyActivito: "Summer in the middle of January. The waterslides do not care what season it is.",
      image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80",
      images: ["https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80","https://images.unsplash.com/photo-1560090995-01632a28895b?w=800&q=80","https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800&q=80","https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80"],
      tagColors: ["bg-orange-500", "bg-sky-500"],
    },
    {
      id: 6,
      name: "Topgolf Cleveland",
      category: "Social",
      tags: ["Social", "Adventure"],
      rating: 4.6,
      price: "$30–$60",
      distance: "9.8 mi",
      address: "5820 Rockside Woods Blvd, Independence, OH",
      hours: "Open until 12 AM",
      website: "topgolf.com",
      description: "Three stories of climate-controlled hitting bays with games, food, and drinks — zero golf skill required.",
      whyActivito: "The group hang that works for everyone, golfer or not.",
      image: "https://images.unsplash.com/photo-1592919505780-303950717480?w=800&q=80",
      images: ["https://images.unsplash.com/photo-1592919505780-303950717480?w=800&q=80","https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80","https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80","https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80"],
      tagColors: ["bg-green-500", "bg-purple-500"],
    },
    {
      id: 7,
      name: "Go Ape Zipline & Adventure",
      category: "Adventure",
      tags: ["Adventure", "Wellness"],
      rating: 4.7,
      price: "$35–$65",
      distance: "14 mi",
      address: "Mill Stream Run Reservation, Strongsville, OH",
      hours: "9 AM – 6 PM",
      website: "goape.com",
      description: "Treetop obstacle courses, Tarzan swings, and ziplines soaring through the Metroparks canopy.",
      whyActivito: "Adrenaline with a forest view. You will yell. Everyone yells.",
      image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
      images: ["https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80","https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80","https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80","https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?w=800&q=80"],
      tagColors: ["bg-orange-500", "bg-emerald-500"],
    },
    {
      id: 8,
      name: "Whirlyball Cleveland",
      category: "Social",
      tags: ["Social", "Adventure"],
      rating: 4.5,
      price: "$20–$35",
      distance: "11 mi",
      address: "5055 Richmond Rd, Bedford Heights, OH",
      hours: "Open until 11 PM",
      website: "whirlyball.com",
      description: "Bumper cars meets lacrosse meets basketball — the team sport you can talk trash in while seated.",
      whyActivito: "The birthday-party pick that adults secretly love more than kids.",
      image: "https://images.unsplash.com/photo-1511882150382-421056c89033?w=800&q=80",
      images: ["https://images.unsplash.com/photo-1511882150382-421056c89033?w=800&q=80","https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80","https://images.unsplash.com/photo-1595429035839-c99c298ffdde?w=800&q=80","https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80"],
      tagColors: ["bg-pink-500", "bg-orange-500"],
    },

    // ── LOCKED cards ─────────────────────────────────────────────
    {
      id: 9,
      name: "Brandywine Falls Trail",
      category: "Adventure",
      tags: ["Adventure", "Wellness"],
      rating: 4.8,
      price: "Free",
      distance: "21 mi",
      address: "8176 Brandywine Rd, Sagamore Hills, OH",
      hours: "Dawn to Dusk",
      website: "nps.gov/cuva",
      description: "A 65-foot waterfall in Cuyahoga Valley National Park with a boardwalk gorge trail.",
      whyActivito: "The most photographed spot in the national park — and it earns it.",
      image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=80",
      images: ["https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=80","https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80","https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80","https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80"],
      tagColors: ["bg-emerald-500", "bg-sky-500"],
    },
    {
      id: 10,
      name: "Trapped! Escape Room",
      category: "Social",
      tags: ["Social", "Explore"],
      rating: 4.7,
      price: "$28–$35",
      distance: "8.4 mi",
      address: "26953 Chagrin Blvd, Beachwood, OH",
      hours: "Open until 10 PM",
      website: "trappedcleveland.com",
      description: "Sixty minutes, one locked room, and a dozen puzzles between your crew and bragging rights.",
      whyActivito: "The fastest way to find out who your smartest friend actually is.",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
      images: ["https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80","https://images.unsplash.com/photo-1508898578281-774ac4893c0c?w=800&q=80","https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80","https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80"],
      tagColors: ["bg-purple-500", "bg-indigo-500"],
    },
    {
      id: 11,
      name: "Cleveland Metroparks Zoo",
      category: "Explore",
      tags: ["Explore", "Wellness"],
      rating: 4.6,
      price: "$17–$22",
      distance: "6.2 mi",
      address: "3900 Wildlife Way, Cleveland, OH",
      hours: "Open until 5 PM",
      website: "clevelandmetroparks.com/zoo",
      description: "3,000 animals across 183 acres — rainforest dome, giraffe feedings, and a treetop skywalk.",
      whyActivito: "A full day out that works for literally any group you bring.",
      image: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=800&q=80",
      images: ["https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=800&q=80","https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&q=80","https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80","https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80"],
      tagColors: ["bg-indigo-500", "bg-green-500"],
    },
    {
      id: 12,
      name: "Memphis Kiddie Park",
      category: "Social",
      tags: ["Social", "Relax"],
      rating: 4.7,
      price: "$2–$15",
      distance: "5.9 mi",
      address: "10340 Memphis Ave, Brooklyn, OH",
      hours: "10 AM – 8 PM",
      website: "memphiskiddiepark.com",
      description: "A 1952 time capsule of kiddie rides, a miniature coaster, and classic putt-putt.",
      whyActivito: "Pure nostalgia — the tiny Ferris wheel has been spinning for 70 years.",
      image: "https://images.unsplash.com/photo-1502136969935-8d8eef54d77b?w=800&q=80",
      images: ["https://images.unsplash.com/photo-1502136969935-8d8eef54d77b?w=800&q=80","https://images.unsplash.com/photo-1578374173705-969cbe6f2d6b?w=800&q=80","https://images.unsplash.com/photo-1595429035839-c99c298ffdde?w=800&q=80","https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80"],
      tagColors: ["bg-pink-500", "bg-sky-500"],
    },
  ];
  
  // First 8 free, rest locked
  const FREE_COUNT      = 8;
  const freeActivities  = activities.slice(0, FREE_COUNT);
  const lockedActivities = activities.slice(FREE_COUNT);
  
  // ─────────────────────────────────────────────
  //  Helpers
  // ─────────────────────────────────────────────
  
  function tagBadge(label, colorClass) {
    return `<span class="px-3 py-1 rounded-full ${colorClass} text-white text-xs font-semibold">${label}</span>`;
  }
  
  function buildCard(activity, locked = false) {
    const tags = activity.tags
      .map((tag, i) => tagBadge(tag, activity.tagColors[i] || "bg-purple-500"))
      .join("");
  
    const card = document.createElement("div");
    // Dark glass to match the rest of the page — the old white cards read
    // as a different product dropped into the middle of a dark site.
    card.className =
      "gallery-card group cursor-pointer rounded-3xl overflow-hidden " +
      "bg-[#14121b]/90 backdrop-blur-xl border border-white/10 " +
      "shadow-[0_10px_30px_rgba(0,0,0,0.4)] " +
      "hover:-translate-y-1 hover:border-emerald-400/30 " +
      "hover:shadow-[0_18px_44px_rgba(16,185,129,0.16)] " +
      "transition-all duration-300";
    card.dataset.id = activity.id;

    card.innerHTML = `
      <div class="relative h-48 overflow-hidden">
        <img src="${activity.image}"
             class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
             alt="${activity.name}"
             onerror="this.src='../static/images/no-image.svg'">
        <!-- bottom fade keeps the tag chips readable on bright photos -->
        <div class="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>
        <button class="heart-btn heart-button absolute top-3 right-3 h-9 w-9 rounded-full
                       bg-black/45 backdrop-blur-xl border border-white/20
                       flex items-center justify-center text-white/80
                       hover:bg-black/65 hover:text-white transition">
          ${iconSvg("heart", "w-4 h-4")}
        </button>
        <div class="absolute bottom-3 left-3 flex gap-2">${tags}</div>
      </div>
      <div class="p-4">
        <h3 class="text-base font-display font-bold text-white leading-tight">${activity.name}</h3>
        <p class="text-white/45 text-xs mt-1.5">${iconSvg("star", "w-3 h-3 inline -mt-0.5 text-amber-400")} ${activity.rating} • ${activity.price} • ${activity.distance}</p>
        <p class="text-white/55 text-xs mt-2 line-clamp-2 leading-relaxed">${activity.description}</p>
      </div>
    `;
  
    // Delegate to the header buttons — authModals.js owns showing the
    // auth screens (they toggle the `hidden` ATTRIBUTE now, plus body
    // scroll lock and focus). Toggling a "hidden" class here silently
    // did nothing after the auth redesign.
    const openSignup = () => {
      document.getElementById("openSignup")?.click();
    };
  
    if (!locked) {
      card.querySelector(".heart-button").addEventListener("click", (e) => {
        e.stopPropagation();
        const btn = e.currentTarget;

        // Visual demo only on the landing page — real saving lives in the app.
        btn.classList.toggle("saved");

        if (btn.classList.contains("saved") && typeof popHeart === "function") {
          popHeart(btn);
        }
      });
      card.addEventListener("click", () => {
        const index = freeActivities.findIndex((a) => a.id === activity.id);

        openDetailModal(activity, freeActivities, index);
      });
    } else {
      card.querySelector(".heart-button").addEventListener("click", (e) => {
        e.stopPropagation();
        openSignup();
      });
      card.addEventListener("click", openSignup);
    }
  
    return card;
  }
  
  // ─────────────────────────────────────────────
  //  Render both grids
  // ─────────────────────────────────────────────
  
  function buildGallery(freeList) {
    const wrapper = document.querySelector(".gallery-section-wrapper");
    if (!wrapper) return;
  
    wrapper.innerHTML = "";
  
    // ── FREE grid: 4 cols × 2 rows ──────────────────────────────
    const freeGrid = document.createElement("div");
    freeGrid.className = "gallery-grid grid grid-cols-2 md:grid-cols-4 gap-5";

    // Stagger cards in on first view only — search rebuilds render instantly.
    if (!buildGallery.revealed) {
      freeGrid.setAttribute("data-reveal-children", "");
    }
  
    freeList.forEach((activity) => {
      freeGrid.appendChild(buildCard(activity, false));
    });
  
    wrapper.appendChild(freeGrid);

    if (!buildGallery.revealed && typeof observeReveals === "function") {
      observeReveals(wrapper);
      buildGallery.revealed = true;
    }
  
    // ── LOCKED section ──────────────────────────────────────────
    const lockedSection = document.createElement("div");
    // min-height guarantees the centered glass panel fits — the blurred
    // card grid behind it is only ~one row tall on desktop and the
    // section clips overflow.
    lockedSection.className =
      "relative mt-5 rounded-3xl overflow-hidden min-h-[600px] sm:min-h-[560px]";
  
    // Blurred card grid (pointer events off so clicks fall through to overlay)
    const lockedGrid = document.createElement("div");
    lockedGrid.className =
      "grid grid-cols-2 md:grid-cols-4 gap-5 blur-sm pointer-events-none select-none";
  
    lockedActivities.forEach((activity) => {
      lockedGrid.appendChild(buildCard(activity, true));
    });
  
    lockedSection.appendChild(lockedGrid);
  
    // Gradient + CTA overlay
    const overlay = document.createElement("div");
    overlay.className = [
      "absolute inset-0 z-10",
      "flex flex-col items-center justify-center",
      "bg-gradient-to-t from-[#0d0d0f] via-[#0d0d0f]/80 to-transparent",
      "rounded-3xl px-4",
    ].join(" ");

    overlay.innerHTML = `
      <div class="locked-panel relative overflow-hidden text-center px-6 py-10 md:px-10 rounded-[2rem] max-w-md w-full
                  bg-[#0c0c12]/90 backdrop-blur-2xl border border-white/10 ring-1 ring-white/5
                  shadow-2xl shadow-emerald-500/10">

        <!-- ambient corners, same language as the auth brand panel -->
        <div class="absolute -top-14 -left-14 w-44 h-44 rounded-full bg-emerald-500/15 blur-[60px] pointer-events-none"></div>
        <div class="absolute -bottom-16 -right-14 w-44 h-44 rounded-full bg-purple-600/15 blur-[60px] pointer-events-none"></div>

        <!-- Lock icon — floats, with a pulsing halo -->
        <div class="locked-reveal relative inline-flex mb-5 lock-float">
          <span class="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping"></span>
          <div class="relative flex items-center justify-center w-16 h-16 rounded-full
                      bg-gradient-to-br from-emerald-400 via-teal-500 to-purple-600
                      shadow-[0_0_30px_rgba(16,185,129,0.45)]">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
        </div>

        <h3 class="locked-reveal text-2xl md:text-3xl font-display font-black text-white mb-2">
          ${lockedActivities.length} more spots
          <span class="bg-gradient-to-r from-emerald-300 to-purple-400 bg-clip-text text-transparent">waiting for you</span>
        </h3>

        <p class="locked-reveal text-white/50 max-w-sm mx-auto mb-7 text-sm leading-relaxed">
          Create a free account to unlock personalized recommendations,
          save favorites, and discover every hidden gem near you.
        </p>

        <div class="locked-reveal flex flex-col sm:flex-row gap-3 justify-center">
          <button id="lockedSignupBtn" type="button" class="hero-cta-primary justify-center">
            Sign up — it's free
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2.5" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6"/>
            </svg>
          </button>
          <button id="lockedSigninBtn" type="button" class="hero-cta-ghost">
            Sign in
          </button>
        </div>

        <p class="locked-reveal mt-4 text-[11px] text-white/30">
          Free to join · No credit card · Takes 60 seconds
        </p>
      </div>
    `;

    lockedSection.appendChild(overlay);
    wrapper.appendChild(lockedSection);

    // Staggered reveal when the locked section scrolls into view.
    const revealItems = overlay.querySelectorAll(".locked-reveal");
    revealItems.forEach((el, i) => {
      el.style.transitionDelay = `${i * 120}ms`;
    });

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealItems.forEach((el) => el.classList.add("in-view"));
            revealObserver.disconnect();
          }
        });
      },
      { threshold: 0.25 },
    );

    revealObserver.observe(overlay);
  
    // Wire overlay CTAs — delegate to the header buttons so authModals.js
    // handles showing the screens (hidden attribute, scroll lock, focus).
    document.getElementById("lockedSignupBtn").addEventListener("click", () => {
      document.getElementById("openSignup")?.click();
    });
    document.getElementById("lockedSigninBtn").addEventListener("click", () => {
      document.getElementById("openSignin")?.click();
    });
  }
  
  // ─────────────────────────────────────────────
  //  Detail modal — uses the shared openDetailModal()
  //  from shared/detailModal.js (same as the app pages)
  // ─────────────────────────────────────────────

  // ─────────────────────────────────────────────
  //  Search filtering (only filters free cards)
  // ─────────────────────────────────────────────
  
  const searchInput = document.querySelector("input[placeholder='Search activities...']");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.toLowerCase().trim();
      const filtered = q
        ? freeActivities.filter(
            (a) =>
              a.name.toLowerCase().includes(q) ||
              a.category.toLowerCase().includes(q) ||
              a.tags.some((t) => t.toLowerCase().includes(q)) ||
              a.description.toLowerCase().includes(q)
          )
        : freeActivities;
      buildGallery(filtered);
    });
  }
  
  // ─────────────────────────────────────────────
  //  Initial render
  // ─────────────────────────────────────────────
  
  buildGallery(freeActivities);