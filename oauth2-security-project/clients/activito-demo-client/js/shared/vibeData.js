// shared/vibeData.js
// eventually change catgory from emojis to svg img
// ─── Categories & colours ────────────────────────────────────
const VIBE_META = {
	Adventure: {
		color: "from-orange-500 to-amber-400",
		barTop: "#f97316",
		barBot: "#fbbf24",
		emoji: "🧗",
	},
	Social: {
		color: "from-purple-600 to-pink-500",
		barTop: "#a855f7",
		barBot: "#ec4899",
		emoji: "👥",
	},
	Relax: {
		color: "from-sky-400 to-teal-400",
		barTop: "#38bdf8",
		barBot: "#2dd4bf",
		emoji: "🌊",
	},
	Explore: {
		color: "from-indigo-500 to-blue-500",
		barTop: "#6366f1",
		barBot: "#3b82f6",
		emoji: "🧭",
	},
	Wellness: {
		color: "from-green-500 to-emerald-400",
		barTop: "#22c55e",
		barBot: "#34d399",
		emoji: "🌱",
	},
};

const VIBE_QUESTIONS = [
	{
		q: "What kind of plan sounds best right now?",
		options: [
			{
				text: "Something active, bold, or outside 🧗",
				scores: { Adventure: 3, Wellness: 1 },
			},
			{
				text: "Something fun with people, food, or music 👥",
				scores: { Social: 3 },
			},
			{
				text: "Something calm, cozy, and low-pressure 🌊",
				scores: { Relax: 3 },
			},
			{
				text: "Something new I have not tried before 🧭",
				scores: { Explore: 3 },
			},
		],
	},
	{
		q: "What energy level are you feeling today?",
		options: [
			{
				text: "High energy — I want to move around ⚡",
				scores: { Adventure: 2, Social: 1 },
				traits: { energy: 5 },
			},
			{
				text: "Medium energy — I want a good experience, not too much 🧭",
				scores: { Explore: 2, Social: 1 },
				traits: { energy: 3 },
			},
			{
				text: "Low energy — I want something easy and peaceful 🕯️",
				scores: { Relax: 3 },
				traits: { energy: 1 },
			},
			{
				text: "Reset energy — I want to feel better after 🌱",
				scores: { Wellness: 3 },
				traits: { energy: 2 },
			},
		],
	},
	{
		q: "Who are you most likely going with?",
		options: [
			{
				text: "Just me — solo mission 🎧",
				scores: { Relax: 1, Explore: 2 },
				traits: { groupSize: "solo", socialLevel: 1 },
			},
			{
				text: "A friend or date 🍜",
				scores: { Social: 2, Explore: 1 },
				traits: { groupSize: "couple", socialLevel: 3 },
			},
			{
				text: "A group of people 🎉",
				scores: { Social: 3 },
				traits: { groupSize: "large-group", socialLevel: 5 },
			},
			{
				text: "I am not sure yet — I just need ideas ✨",
				scores: { Explore: 2, Adventure: 1 },
			},
		],
	},
	{
		q: "What would make the activity feel worth it?",
		options: [
			{
				text: "A cool memory or adrenaline rush 🔥",
				scores: { Adventure: 3 },
			},
			{
				text: "Good conversation and a fun atmosphere 🗣️",
				scores: { Social: 3 },
			},
			{
				text: "Peace, comfort, and no stress ☁️",
				scores: { Relax: 3 },
			},
			{
				text: "Finding a hidden gem or learning something new 🧠",
				scores: { Explore: 3 },
			},
		],
	},
	{
		q: "Pick the place you would walk into first:",
		options: [
			{
				text: "A trail, climbing gym, beach, or outdoor spot 🌄",
				scores: { Adventure: 3 },
				traits: { setting: "outdoor" },
			},
			{
				text: "A restaurant, lounge, event, or game spot 🍹",
				scores: { Social: 3 },
			},
			{
				text: "A café, garden, spa, or quiet scenic place ☕",
				scores: { Relax: 2, Wellness: 1 },
				traits: { setting: "indoor" },
			},
			{
				text: "A museum, market, bookstore, or local landmark 🎨",
				scores: { Explore: 3 },
				traits: { setting: "indoor" },
			},
		],
	},
	{
		q: "What kind of recommendation do you trust most?",
		options: [
			{
				text: "Something exciting that gets me out of my routine 🚀",
				scores: { Adventure: 2, Explore: 1 },
			},
			{
				text: "Something popular with good vibes and people around 👥",
				scores: { Social: 3 },
			},
			{
				text: "Something peaceful with good reviews and a calm setting 🌙",
				scores: { Relax: 3 },
			},
			{
				text: "Something unique that feels local and different 📍",
				scores: { Explore: 3 },
			},
		],
	},
];
