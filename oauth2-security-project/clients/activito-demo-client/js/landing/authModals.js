// ════════════════════════════════════════════════════════════
//  AUTH — full-screen sign in / sign up
//
//  Fields are read by name rather than by position. The previous
//  version indexed into querySelectorAll results, so adding the
//  date-of-birth input would have silently shifted which element
//  was treated as the password.
// ════════════════════════════════════════════════════════════

// COPPA: under-13 accounts carry obligations this app is not set up
// to meet, so the form refuses them outright.
const MIN_SIGNUP_AGE = 13;
const MAX_SIGNUP_AGE = 120;

function ageOn(dobString, today = new Date()) {
	const dob = new Date(`${dobString}T00:00:00`);

	if (Number.isNaN(dob.getTime())) return null;

	let age = today.getFullYear() - dob.getFullYear();
	const monthDelta = today.getMonth() - dob.getMonth();

	// Birthday hasn't come round yet this year.
	if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < dob.getDate())) {
		age--;
	}

	return age;
}

document.addEventListener("DOMContentLoaded", () => {
	const signinModal = document.getElementById("signinModal");
	const signupModal = document.getElementById("signupModal");

	if (!signinModal || !signupModal) {
		console.error("Auth screens not found. Check signinModal/signupModal IDs.");
		return;
	}

	// ── Icons ─────────────────────────────────────────────────
	// Markup declares intent with data-icon; the SVG comes from the
	// shared set so the auth screens can't drift from the rest of the app.
	document.querySelectorAll("[data-icon]").forEach((el) => {
		el.innerHTML = iconSvg(el.dataset.icon, "w-5 h-5");
	});

	// ── Password reveal ───────────────────────────────────────
	document.querySelectorAll("[data-reveal-field]").forEach((field) => {
		const input = field.querySelector("input");

		if (!input) return;

		const toggle = document.createElement("button");

		toggle.type = "button";
		toggle.className = "auth-reveal";
		toggle.setAttribute("aria-label", "Show password");
		toggle.innerHTML = iconSvg("eye", "w-5 h-5");

		toggle.addEventListener("click", () => {
			const revealed = input.type === "text";

			input.type = revealed ? "password" : "text";
			toggle.innerHTML = iconSvg(revealed ? "eye" : "eyeOff", "w-5 h-5");
			toggle.setAttribute("aria-label", revealed ? "Show password" : "Hide password");
			input.focus();
		});

		field.appendChild(toggle);
	});

	// ── Open / close ──────────────────────────────────────────
	function showAuth(target) {
		signinModal.hidden = target !== signinModal;
		signupModal.hidden = target !== signupModal;
		document.body.style.overflow = "hidden";

		target.querySelector("input")?.focus();
	}

	function closeAuth() {
		signinModal.hidden = true;
		signupModal.hidden = true;
		document.body.style.overflow = "";
	}

	document
		.getElementById("openSignin")
		?.addEventListener("click", () => showAuth(signinModal));

	document
		.getElementById("openSignup")
		?.addEventListener("click", () => showAuth(signupModal));

	document.querySelectorAll(".switchToSignIn").forEach((button) => {
		button.addEventListener("click", () => showAuth(signinModal));
	});

	document.querySelectorAll(".switchToSignUp").forEach((button) => {
		button.addEventListener("click", () => showAuth(signupModal));
	});

	document.querySelectorAll(".closeModal").forEach((button) => {
		button.addEventListener("click", closeAuth);
	});

	document.addEventListener("keydown", (e) => {
		if (e.key !== "Escape") return;
		if (signinModal.hidden && signupModal.hidden) return;

		closeAuth();
	});

	// ── Google sign-in ────────────────────────────────────────
	// Buttons stay hidden until the backend confirms it has OAuth
	// credentials, so users never click something that can't work.
	fetchAuthConfig().then((config) => {
		if (!config.google) return;

		document.querySelectorAll("[data-google-signin]").forEach((button) => {
			button.classList.remove("hidden");
		});

		document.querySelectorAll("[data-google-divider]").forEach((divider) => {
			divider.hidden = false;
		});
	});

	// Landed here from the canonical-host hop — pick the flow back up
	// so the user only clicks once.
	if (new URLSearchParams(window.location.search).get("continue") === "google") {
		const cleanUrl = new URL(window.location.href);

		cleanUrl.searchParams.delete("continue");
		window.history.replaceState({}, "", cleanUrl.href);

		signInWithGoogle().catch((err) => {
			console.error("Google sign-in failed:", err);
			showToast(err.message || "Google sign-in failed.", "error");
		});
	}

	document.querySelectorAll("[data-google-signin]").forEach((button) => {
		button.addEventListener("click", async () => {
			button.disabled = true;

			try {
				await signInWithGoogle();
			} catch (err) {
				console.error("Google sign-in failed:", err);
				showToast(err.message || "Google sign-in failed.", "error");
				button.disabled = false;
			}
		});
	});

	function saveFrontendUser(sessionData, fallbackEmail = "") {
		const user = sessionData?.user || sessionData?.data?.user;

		const displayName =
			user?.name ||
			user?.email?.split("@")[0] ||
			fallbackEmail.split("@")[0] ||
			"User";

		localStorage.setItem(
			"activito_user",
			JSON.stringify({
				id: user?.id || null,
				name: displayName,
				email: user?.email || fallbackEmail,
				initials: displayName.slice(0, 2).toUpperCase(),
				avatar: user?.image || null,
			}),
		);
	}

	// ── Sign in ───────────────────────────────────────────────
	const signinForm = document.getElementById("signinForm");

	signinForm?.addEventListener("submit", async (e) => {
		e.preventDefault();

		const submit = signinForm.querySelector("[type='submit']");
		const email = signinForm.elements.email.value.trim();
		const password = signinForm.elements.password.value;

		if (!email || !password) {
			showToast("Please enter your email and password.", "error");
			return;
		}

		submit.disabled = true;

		try {
			// Use the sign-in response directly instead of a separate
			// /api/me call — avoids a cookie timing race where the browser
			// hasn't sent the new session cookie on the very next request.
			const signInData = await signInUser({ email, password });
			const user = signInData?.user || signInData?.data?.user || signInData;

			if (!user?.id && !user?.email) {
				console.error("Sign in response had no user:", signInData);
				showToast("Sign in failed — please try again.", "error");
				submit.disabled = false;
				return;
			}

			saveFrontendUser({ user }, email);
			window.location.href = "dashboard.html";
		} catch (err) {
			console.error("Sign in failed:", err);
			showToast(err.message || "Sign in failed.", "error");
			submit.disabled = false;
		}
	});

	// ── Sign up ───────────────────────────────────────────────
	const signupForm = document.getElementById("signupForm");

	signupForm?.addEventListener("submit", async (e) => {
		e.preventDefault();

		const fields = signupForm.elements;
		const submit = signupForm.querySelector("[type='submit']");

		const firstName = fields.firstName.value.trim();
		const lastName = fields.lastName.value.trim();
		const email = fields.email.value.trim();
		const dateOfBirth = fields.dateOfBirth.value;
		const password = fields.password.value;
		const confirmPassword = fields.confirmPassword.value;
		const termsAccepted = signupForm.querySelector("[type='checkbox']")?.checked;

		const name = `${firstName} ${lastName}`.trim() || email.split("@")[0];

		if (!firstName || !email || !dateOfBirth || !password || !confirmPassword) {
			showToast("Please fill out all required fields.", "error");
			return;
		}

		const age = ageOn(dateOfBirth);

		if (age === null) {
			showToast("Please enter a valid date of birth.", "error");
			return;
		}

		if (age < 0 || age > MAX_SIGNUP_AGE) {
			showToast("That date of birth doesn't look right.", "error");
			return;
		}

		if (age < MIN_SIGNUP_AGE) {
			showToast(`You must be at least ${MIN_SIGNUP_AGE} to use Activito.`, "error");
			return;
		}

		if (password !== confirmPassword) {
			showToast("Passwords do not match.", "error");
			return;
		}

		if (password.length < 8) {
			showToast("Password must be at least 8 characters.", "error");
			return;
		}

		if (!termsAccepted) {
			showToast("Please agree to the Terms and Privacy Policy.", "error");
			return;
		}

		submit.disabled = true;

		try {
			await signUpUser({ name, email, password, dateOfBirth });

			// Better Auth does not always auto-create a session on sign-up,
			// so explicitly sign in and use that response directly rather
			// than doing a separate /api/me round-trip that may race.
			const signInData = await signInUser({ email, password });
			const user = signInData?.user || signInData?.data?.user || signInData;

			if (!user?.id && !user?.email) {
				showToast(
					"Account created! Your session could not start automatically. " +
						"Please use the Sign In form to log in.",
				);
				submit.disabled = false;
				return;
			}

			saveFrontendUser({ user }, email);
			window.location.href = "dashboard.html";
		} catch (err) {
			console.error("Sign up failed:", err);
			showToast(err.message || "Sign up failed.", "error");
			submit.disabled = false;
		}
	});
});
