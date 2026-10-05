// ============================================================
//  vibeCheck.js  —  Activito
//  • Scroll show/hide of the floating button
//  • Clicking opens a quiz modal (no page redirect)
//  • Results → animated progress bars injected under the wave
//  • Top vibe category filters the gallery
// ============================================================


  
  
  
  // ─── Floating button: scroll show/hide ────────────────────────
  const vibeButton = document.getElementById("vibeButton");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      vibeButton.classList.remove("hidden");
    } else {
      vibeButton.classList.add("hidden");
    }
  });

  // The button is an <a>; intercept both it and the wrapper so the
  // full-screen quiz opens instead of navigating away.
  vibeButton.addEventListener("click", (e) => {
    e.preventDefault();
    openVibeQuiz();
  });

  const vibeLink = vibeButton.querySelector("a");
  if (vibeLink) {
    vibeLink.addEventListener("click", (e) => e.preventDefault());
  }

  // ─── Quiz finished ────────────────────────────────────────────
  // The landing page runs on sample data with no backend behind it, so
  // unlike the dashboard it never re-queries anything. It just charts the
  // result and narrows the sample gallery to the winning vibe.
  window.addEventListener("vibe:applied", (e) => {
    const { topCat, scores } = e.detail;
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

    // Scores arrive already normalised to percentages.
    injectVibeProgressBar(sorted, 100, topCat);
    filterGalleryByVibe(topCat);

    setTimeout(() => {
      document
        .querySelector(".gallery-section-wrapper")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  });

  // ─── Inject vibe bar CHART under the wave ────────────────────
  function injectVibeProgressBar(sorted, total, topVibe) {
    document.getElementById("vibeProgressSection")?.remove();
  
    const topPct  = Math.round((sorted[0][1] / total) * 100);
    const topMeta = VIBE_META[topVibe];
  
    // Build ordered arrays matching sorted results
    const labels  = sorted.map(([cat]) => cat);
    const values  = sorted.map(([, score]) => Math.round((score / total) * 100));
    const colors  = sorted.map(([cat]) => ({ top: VIBE_META[cat].barTop, bot: VIBE_META[cat].barBot }));
  
    const section = document.createElement("section");
    section.id        = "vibeProgressSection";
    section.className = "px-6 pt-12 pb-8";
  
    section.innerHTML = `
      <div class="max-w-7xl mx-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8">
  
        <!-- Header row -->
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
          <div>
            <p class="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-1">Your Vibe DNA</p>
            <h3 class="text-2xl font-display font-black text-white inline-flex items-center gap-2">
              <span style="color:${topMeta.barTop}">${vibeIconSvg(topVibe, "w-6 h-6")}</span>
              You're ${topPct}% ${topVibe}
            </h3>
            <p class="text-white/50 text-sm mt-1">
              Showing spots picked for your personality. &nbsp;
              <button id="vibeRetakeBtn"
                class="text-emerald-400 font-semibold hover:underline">
                Retake quiz →
              </button>
            </p>
          </div>
  
          <!-- Legend -->
          <div class="flex flex-wrap gap-x-4 gap-y-1" id="vibeLegend"></div>
        </div>
  
        <!-- Chart canvas -->
        <div style="position:relative; width:100%; height:260px;">
          <canvas id="vibeBarChart"
            role="img"
            aria-label="Vibe DNA bar chart showing personality breakdown"></canvas>
        </div>
  
      </div>

      
    `;
  
    // Insert after wave section
    const waveSection = document.querySelector("section.bg-black");
    if (waveSection?.nextSibling) {
      waveSection.parentNode.insertBefore(section, waveSection.nextSibling);
    } else {
      document.querySelector(".gallery-section-wrapper")?.parentNode?.prepend(section);
    }
  
    // Legend pills
    const legend = section.querySelector("#vibeLegend");
    sorted.forEach(([cat]) => {
      const meta = VIBE_META[cat];
      const item = document.createElement("span");
      item.style.cssText =
        "display:flex;align-items:center;gap:6px;font-size:12px;color:rgba(255,255,255,.55);";
      item.innerHTML = `
        <span style="width:10px;height:10px;border-radius:3px;background:${meta.barTop};display:inline-block;"></span>
        ${cat}
      `;
      legend.appendChild(item);
    });
  
    // Wire retake
    section.querySelector("#vibeRetakeBtn").addEventListener("click", openVibeQuiz);
  
    // Load Chart.js then draw
    if (window.Chart) {
      drawVibeChart(labels, values, colors);
    } else {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
      script.onload = () => drawVibeChart(labels, values, colors);
      document.head.appendChild(script);
    }
  }
  
  function drawVibeChart(labels, values, colors) {
    const canvas = document.getElementById("vibeBarChart");
    if (!canvas) return;
  
    new Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Vibe %",
          data: values,
          backgroundColor: values.map(() => "#a855f7"), // filled by plugin
          borderRadius: 10,
          borderSkipped: false,
          barPercentage: 0.55,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 900, easing: "easeOutQuart" },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (ctx) => ` ${ctx.parsed.y}%` },
            backgroundColor: "rgba(0,0,0,0.85)",
            padding: 10,
            cornerRadius: 8,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: {
              color: "#9ca3af",
              font: { size: 13, weight: "500" },
            },
          },
          y: {
            min: 0,
            max: Math.max(...values) + 15,
            grid: { color: "rgba(255,255,255,0.08)", drawTicks: false },
            border: { display: false },
            ticks: {
              color: "#9ca3af",
              font: { size: 12 },
              stepSize: 10,
              callback: (v) => v + "%",
              padding: 8,
            },
          },
        },
      },
      plugins: [
        {
            id: "gradientBars",
            beforeDatasetsDraw(chart) {
              const { ctx, chartArea } = chart;
          
              if (!chartArea) return;
          
              const ds = chart.data.datasets[0];
          
              ds.backgroundColor = colors.map((c) => {
                const g = ctx.createLinearGradient(
                  0,
                  chartArea.top,
                  0,
                  chartArea.bottom
                );
          
                g.addColorStop(0, c.top);
                g.addColorStop(1, c.bot);
          
                return g;
              });
            },
          },
        {
          // Draw the percentage above each bar
          id: "topLabels",
          afterDatasetsDraw(chart) {
            const { ctx, scales: { x, y } } = chart;
            chart.data.datasets[0].data.forEach((val, i) => {
              const xPos = x.getPixelForValue(i);
              const yPos = y.getPixelForValue(val);
              ctx.save();
              ctx.fillStyle = "#e5e7eb";
              ctx.font = "700 12px sans-serif";
              ctx.textAlign = "center";
              ctx.fillText(val + "%", xPos, yPos - 8);
              ctx.restore();
            });
          },
        },
      ],
    });
  }
  
  // ─── Filter gallery by vibe category ─────────────────────────
  function filterGalleryByVibe(category) {
    // gallery.js exposes buildGallery() and freeActivities globally
    if (typeof buildGallery === "undefined" || typeof freeActivities === "undefined") return;
    const filtered = freeActivities.filter(a =>
      a.category === category || a.tags.includes(category)
    );
    buildGallery(filtered.length ? filtered : freeActivities);
  }