// this branch added a few lines to server.js
// device-flow/deviceRoutes.js
// OAuth 2.0 Device Authorization Flow (RFC 8628) - Role 4
//
// Flow:
//   1. Device  -> POST /device_authorization   gets device_code + user_code
//   2. User    -> POST /device/verify          looks up the user_code
//              -> POST /device/decision        allows or denies
//   3. Device  -> polls /token                 checkDeviceCode() answers
//
// /token itself belongs to the auth server core; it should call
// checkDeviceCode() when grant_type is
// urn:ietf:params:oauth:grant-type:device_code

const express = require("express");
const crypto = require("crypto");

const router = express.Router();

// Device clients send form-encoded bodies; the JSON parser is for fetch() calls.
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

// ---------------------------------------------------------------
// Settings
// ---------------------------------------------------------------
const PORT = process.env.PORT || 4000; // same rule as server.js
const VERIFICATION_URI = `http://localhost:${PORT}/device`; // GET /device page not built yet
const EXPIRES_IN_SECONDS = 600;
const POLL_INTERVAL_SECONDS = 5;

// No vowels or look-alike characters, so codes can't spell words or be misread.
const USER_CODE_ALPHABET = "BCDFGHJKLMNPQRSTVWXZ";
const USER_CODE_LENGTH = 8; // displayed as ABCD-EFGH

// ---------------------------------------------------------------
// Storage (in memory; swap for the device_codes table later)
// Keyed by device_code. Each entry:
//   { deviceCode, userCode, clientId, scope,
//     status: "pending" | "approved" | "denied",
//     userId, expiresAt }
// ---------------------------------------------------------------
const deviceRequests = new Map();

// Registered clients, shared from server.js via setClientRegistry(clients).
// If never set, client/scope validation is skipped.
let clientRegistry = null;

function setClientRegistry(clients) {
  clientRegistry = clients;
}

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------
function generateDeviceCode() {
  return crypto.randomBytes(32).toString("hex");
}

function generateUserCode() {
  let code = "";
  for (let i = 0; i < USER_CODE_LENGTH; i++) {
    code += USER_CODE_ALPHABET[crypto.randomInt(USER_CODE_ALPHABET.length)];
  }
  return code.slice(0, 4) + "-" + code.slice(4);
}

function generateUniqueUserCode() {
  let userCode;
  do {
    userCode = generateUserCode();
  } while (findByUserCode(userCode));
  return userCode;
}

// "wdjb mjht" / "WDJB-MJHT" -> "WDJB-MJHT"; null if the length is wrong.
function normalizeUserCode(input) {
  const letters = String(input || "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");

  if (letters.length !== USER_CODE_LENGTH) return null;

  return letters.slice(0, 4) + "-" + letters.slice(4);
}

function findByUserCode(userCode) {
  for (const request of deviceRequests.values()) {
    if (request.userCode === userCode) return request;
  }
  return undefined;
}

function isExpired(request) {
  return Date.now() > request.expiresAt;
}

// PLACEHOLDER: replace with the real logged-in user once login exists.
function getLoggedInUser(req) {
  return "demo-user";
}

// Sweep out expired requests that were never polled again.
setInterval(() => {
  for (const [deviceCode, request] of deviceRequests) {
    if (isExpired(request)) deviceRequests.delete(deviceCode);
  }
}, 60 * 1000).unref();

// ---------------------------------------------------------------
// POST /device_authorization
// Device sends client_id (+ optional scope); gets back the codes.
// ---------------------------------------------------------------
router.post("/device_authorization", (req, res) => {
  const body = req.body || {};
  const clientId = body.client_id;
  const scope = body.scope || "profile";

  if (!clientId) {
    return res.status(400).json({
      error: "invalid_request",
      error_description: "client_id is required",
    });
  }

  if (clientRegistry) {
    const client = clientRegistry[clientId];

    if (!client) {
      return res.status(400).json({ error: "invalid_client" });
    }

    // scope is a space-separated list; every entry must be allowed
    const requestedScopes = scope.split(" ").filter(Boolean);

    if (!requestedScopes.every((s) => client.scopes.includes(s))) {
      return res.status(400).json({ error: "invalid_scope" });
    }
  }

  const deviceCode = generateDeviceCode();
  const userCode = generateUniqueUserCode();

  deviceRequests.set(deviceCode, {
    deviceCode,
    userCode,
    clientId,
    scope,
    status: "pending",
    userId: null,
    expiresAt: Date.now() + EXPIRES_IN_SECONDS * 1000,
  });

  res.set("Cache-Control", "no-store");
  res.json({
    device_code: deviceCode,
    user_code: userCode,
    verification_uri: VERIFICATION_URI,
    verification_uri_complete: `${VERIFICATION_URI}?user_code=${userCode}`,
    expires_in: EXPIRES_IN_SECONDS,
    interval: POLL_INTERVAL_SECONDS,
  });
});

// ---------------------------------------------------------------
// POST /device/verify
// User submits their user_code. Returns the client and scope so the
// consent screen can display them. Does not approve anything.
// ---------------------------------------------------------------
router.post("/device/verify", (req, res) => {
  const body = req.body || {};
  const userCode = normalizeUserCode(body.user_code);
  const request = userCode ? findByUserCode(userCode) : undefined;

  if (!request) {
    return res.status(404).json({ error: "invalid_user_code" });
  }

  if (isExpired(request)) {
    return res.status(400).json({ error: "expired_token" });
  }

  if (request.status !== "pending") {
    return res.status(400).json({ error: "code_already_used" });
  }

  res.json({
    user_code: request.userCode,
    client_id: request.clientId,
    scope: request.scope,
  });
});

// ---------------------------------------------------------------
// POST /device/decision
// User sends user_code + decision ("allow" | "deny").
// NOTE: not authenticated yet; needs the login check once it exists.
// ---------------------------------------------------------------
router.post("/device/decision", (req, res) => {
  const body = req.body || {};
  const userCode = normalizeUserCode(body.user_code);
  const request = userCode ? findByUserCode(userCode) : undefined;

  if (!request) {
    return res.status(404).json({ error: "invalid_user_code" });
  }

  if (isExpired(request)) {
    return res.status(400).json({ error: "expired_token" });
  }

  if (request.status !== "pending") {
    return res.status(400).json({ error: "code_already_used" });
  }

  if (body.decision === "allow") {
    request.status = "approved";
    request.userId = getLoggedInUser(req);
  } else if (body.decision === "deny") {
    request.status = "denied";
  } else {
    return res.status(400).json({
      error: "invalid_request",
      error_description: 'decision must be "allow" or "deny"',
    });
  }

  res.json({ result: request.status });
});

// ---------------------------------------------------------------
// checkDeviceCode(deviceCode, clientId)
// Called by /token when a device polls. Returns { status } where status is:
//   "authorization_pending" | "access_denied" | "expired_token" |
//   "invalid_grant" | "approved" (also returns userId, clientId, scope)
// If clientId is given it must match the client that started the request.
// An approved code is consumed, so it can only be exchanged once.
// ---------------------------------------------------------------
function checkDeviceCode(deviceCode, clientId) {
  const request = deviceRequests.get(deviceCode);

  if (!request) {
    return { status: "invalid_grant" };
  }

  if (clientId && clientId !== request.clientId) {
    return { status: "invalid_grant" };
  }

  if (isExpired(request)) {
    deviceRequests.delete(deviceCode);
    return { status: "expired_token" };
  }

  if (request.status === "pending") {
    return { status: "authorization_pending" };
  }

  if (request.status === "denied") {
    deviceRequests.delete(deviceCode);
    return { status: "access_denied" };
  }

  deviceRequests.delete(deviceCode);

  return {
    status: "approved",
    userId: request.userId,
    clientId: request.clientId,
    scope: request.scope,
  };
}

// ---------------------------------------------------------------
// TEMPORARY: poll without /token. Delete once /token calls checkDeviceCode().
// ---------------------------------------------------------------
router.post("/device/poll-test", (req, res) => {
  const body = req.body || {};
  const result = checkDeviceCode(body.device_code, body.client_id);

  if (result.status === "approved") {
    return res.json(result);
  }

  res.status(400).json({ error: result.status });
});

module.exports = { router, setClientRegistry, checkDeviceCode };
