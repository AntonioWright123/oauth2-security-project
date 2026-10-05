//====================================================
//CALCULATE YOUR VIBE: getTopVibe(), vibePercentages()
//====================================================

// shared/vibeCalculator.js
function createEmptyVibeScores() {
    return { Adventure: 0, Social: 0, Relax: 0, Explore: 0, Wellness: 0 };
  }
  
  function calculateVibePercentages(scores) {
    const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  
    return Object.fromEntries(
      Object.entries(scores).map(([cat, score]) => [
        cat,
        Math.round((score / total) * 100)
      ])
    );
  }
  
  function getSortedVibes(scores) {
    return Object.entries(scores).sort((a, b) => b[1] - a[1]);
  }
  
  function getTopVibe(scores) {
    return getSortedVibes(scores)[0][0];
  }