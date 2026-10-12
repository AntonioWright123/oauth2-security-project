// auth server.js
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

// Allow CORS from the demo client origin.
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
  }),
);

// Lets Express read JSON from POST requests
app.use(express.json());

// Lets Express read normal HTML form submissions
app.use(express.urlencoded({ extended: false }));

// Serve static files from public
app.use(express.static("public"));

// Temporary list of registered OAuth clients.
// Will come from the database later.
const clients = {
  "activito-client": {
    redirect_uri:
      "http://127.0.0.1:5500/clients/activito-demo-client/callback.html",
    scopes: ["profile"],
  },
};

// Test endpoint
app.get("/", (req, res) => {
  res.send("Auth server is running");
});

// Show styled login page
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

// Process login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const { client_id, redirect_uri, scope } = req.query;

  if (!email || !password) {
    return res.status(400).send("Email and password are required.");
  }

  const consentParams = new URLSearchParams({
    client_id,
    redirect_uri,
    scope,
    email,
  });

  res.redirect(`/consent?${consentParams.toString()}`);
});

// Show styled consent page
app.get("/consent", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "consent.html"));
});

app.post("/consent", (req, res) => {
  const { decision } = req.body;
  const { client_id, redirect_uri, scope, email } = req.query;

  if (decision === "allow") {
    return res.redirect(`${redirect_uri}?code=test123`);
  }

  return res.redirect(`${redirect_uri}?error=access_denied`);
});

// OAuth authorization endpoint
app.get("/authorize", (req, res) => {
  const { client_id, redirect_uri, scope } = req.query;

  const client = clients[client_id];

  if (!client) {
    return res.status(400).send("Invalid client_id");
  }

  if (redirect_uri !== client.redirect_uri) {
    return res.status(400).send("Invalid redirect_uri");
  }

  if (!client.scopes.includes(scope)) {
    return res.status(400).send("Invalid scope");
  }

  // Preserve OAuth information when going to login.
  const loginParams = new URLSearchParams({
    client_id,
    redirect_uri,
    scope,
  });

  res.redirect(`/login?${loginParams.toString()}`);
});

// Starts the OAuth demo flow
app.post("/api/auth/sign-in/oauth-demo", (req, res) => {
  const authorizeUrl = new URL("http://localhost:4000/authorize");

  authorizeUrl.searchParams.set("client_id", "activito-client");
  authorizeUrl.searchParams.set(
    "redirect_uri",
    "http://127.0.0.1:5500/clients/activito-demo-client/callback.html",
  );
  authorizeUrl.searchParams.set("scope", "profile");

  res.json({
    url: authorizeUrl.href,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Auth server is running on port ${PORT}`);
});
