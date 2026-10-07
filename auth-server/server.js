// auth server.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;




// Allow CORS from the demo client origin.
app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true
}));

// Lets Express read JSON from POST requests
app.use(express.json());

// Lets Express read form submissions
app.use(express.urlencoded({ extended: false }));

// Temporary list of registered OAuth clients.
// will come from the database later.
const clients = {
  "activito-client": {
    redirect_uri: "http://127.0.0.1:5500/clients/activito-demo-client/callback.html",
    scopes: ["profile"]
  }
};

// Test endpoint
app.get("/", (req, res) => {
  res.send("Auth server is running");
});

app.get("/login", (req, res) => {
  res.send(`
    <form method="POST" action="/login">
      <label>
        Username:
        <input type="text" name="username">
      </label>

      <br>

      <label>
        Password:
        <input type="password" name="password">
      </label>

      <br>

      <button type="submit">Log in</button>
    </form>
  `);
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required.");
  }

  res.send(`Login submitted for ${username}`);
});

// OAuth authorization endpoint.
// Our client (Activito) sends its ID, redirect URI, and requested scope here.
app.get("/authorize", (req, res) => {
  const { client_id, redirect_uri, scope } = req.query;

  // Look up the client using the client_id.
  const client = clients[client_id];

  // Reject the request if the client is not registered.
  if (!client) {
    return res.status(400).send("Invalid client_id");
  }

  // Make sure the redirect URI matches the one registered for this client.
  // This helps prevent authorization codes from being sent to the wrong site.
  if (redirect_uri !== client.redirect_uri) {
    return res.status(400).send("Invalid redirect_uri");
  }

  // Make sure the client is allowed to request this scope.
  if (!client.scopes.includes(scope)) {
    return res.status(400).send("Invalid scope");
  }

  // If all checks pass, continue to login/consent.
  res.redirect("/login");
});

// Starts the OAuth demo flow
app.post("/api/auth/sign-in/oauth-demo", (req, res) => {
    const { callbackURL } = req.body;

    const authorizeUrl = new URL("http://localhost:4000/authorize");

    authorizeUrl.searchParams.set("client_id", "activito-client");
    authorizeUrl.searchParams.set(
        "redirect_uri",
        "http://127.0.0.1:5500/clients/activito-demo-client/callback.html"
    );
    authorizeUrl.searchParams.set("scope", "profile");

    res.json({
        url: authorizeUrl.href
    });
});


// Start the server.
app.listen(PORT, () => {
  console.log(`Auth server is running on port ${PORT}`);
});
