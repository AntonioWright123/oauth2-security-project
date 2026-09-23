# OAuth 2.0 Security project

## Project Overview

This project is a cybersecurity group project focused on building a working OAuth 2.0 authorization system and then demonstrating security risks involving OAuth consent and device-code phishing.

The main goal is to first build a normal, functioning OAuth environment. After that, we will create controlled attack demonstrations showing how a user can accidentally authorize the wrong application or approve a device request they did not initiate.

The project will use only test accounts, test data, and systems created by our group.

---

# Main Technical Goals

- Build an OAuth 2.0 authorization server
- Build a legitimate OAuth client
- Create login and consent flows
- Generate authorization codes
- Generate and validate access tokens
- Create protected API endpoints
- Implement OAuth scopes and permissions
- Implement device authorization flow
- Build contrlled consent-phishing demonstration
- Build controlled device-code phishing demonstration
- Store users, clients, tokens, codes, and consent information
- Test normal and abnormal OAuth behavior

---

# Team Technical Roles

Each person should choose one main technical role.

The person assigned to a section is responsible for making sure that section works and integrates with the rest of the project.

Team members can still help each other across sections.

- [ ] **Role 1 — OAuth Authorization Server Core**  
  Owner: ______________________

- [ ] **Role 2 — Database, Users & OAuth Client Management**  
  Owner: ______________________

- [ ] **Role 3 — Legitimate Client Application & Frontend**  
  Owner: ______________________

- [ ] **Role 4 — OAuth Device Authorization Flow**  
  Owner: ______________________

- [ ] **Role 5 — Security / Phishing Demonstration & Testing**  
  Owner: ______________________

---

# 1. OAuth Authorization Server Core

**Owner:** ______________________

This person will focus on the main OAuth server and authorization-code flow.

## Tasks

- [ ] Create Node.js project
- [ ] Install and configure Express
- [ ] Create main server
- [ ] Create `/authorize` endpoint
- [ ] Create login process
- [ ] Create consent process
- [ ] Generate authorization codes
- [ ] Create `/token` endpoint
- [ ] Exchange authorization code for access token
- [ ] Create access-token validation
- [ ] Create `/userinfo` endpoint
- [ ] Return protected user information
- [ ] Handle expired authorization codes
- [ ] Handle invalid authorization codes
- [ ] Connect server to database layer

---

# 2. Database, Users & OAuth Client Management

**Owner:** ______________________

This person will manage the data required by the authorization server.

## Tasks

- [ ] Choose database system
- [ ] Set up database connection
- [ ] Create users table
- [ ] Create OAuth clients table
- [ ] Create authorization codes table
- [ ] Create access tokens table
- [ ] Create consent records table
- [ ] Create device codes table
- [ ] Store registered client IDs
- [ ] Store approved redirect URIs
- [ ] Store OAuth scopes
- [ ] Store token expiration times
- [ ] Create test users
- [ ] Create legitimate test client
- [ ] Create security-demo test client
- [ ] Add database helper functions

Possible database:

```text
SQLite during early development

or

PostgreSQL if we decide to deploy
```

---

# 3. Legitimate Client Application & Frontend

**Owner:** ______________________

This person will create the normal application that uses the OAuth server correctly.

## Tasks

- [ ] Create legitimate client application
- [ ] Create frontend
- [ ] Add "Connect Account" or "Sign In" button
- [ ] Redirect user to OAuth `/authorize`
- [ ] Send client ID
- [ ] Send redirect URI
- [ ] Send requested scopes
- [ ] Create OAuth callback route
- [ ] Receive authorization code
- [ ] Exchange authorization code for access token
- [ ] Store token safely for the demo
- [ ] Call `/userinfo`
- [ ] Display returned user information
- [ ] Create login page UI
- [ ] Create consent page UI
- [ ] Make frontend visually consistent

Possible future integration:

```text
Activito Demo Client
```

The existing production Activito project should not be changed until the standalone OAuth system works.

---

# 4. OAuth Device Authorization Flow

**Owner:** ______________________

This person will build the device-code portion of OAuth.

## Tasks

- [ ] Create `/device_authorization` endpoint
- [ ] Generate device code
- [ ] Generate user code
- [ ] Create verification URL
- [ ] Create device verification page
- [ ] Allow user to enter user code
- [ ] Connect device request to user account
- [ ] Create device consent screen
- [ ] Implement device approval
- [ ] Implement device denial
- [ ] Implement token polling
- [ ] Return `authorization_pending`
- [ ] Issue access token after approval
- [ ] Add device-code expiration
- [ ] Handle invalid device codes
- [ ] Handle expired device codes

Normal device flow:

```text
Device
   ↓
Requests device code
   ↓
OAuth Server
   ↓
User receives code
   ↓
User opens verification page
   ↓
User logs in
   ↓
User approves
   ↓
Device receives access token
```

---

# 5. Security / Phishing Demonstration & Testing

**Owner:** ______________________

This person will build the controlled security demonstrations and test the completed system.

## Consent Phishing Demo

- [ ] Create separate security-demo OAuth client
- [ ] Register separate client ID
- [ ] Create controlled misleading application scenario
- [ ] Request OAuth scopes
- [ ] Redirect user to legitimate OAuth server
- [ ] Display consent screen
- [ ] Demonstrate user approving wrong client
- [ ] Show token being issued to demo client
- [ ] Demonstrate what approved scopes allow
- [ ] Clearly label demo as educational/test environment

## Device-Code Phishing Demo

- [ ] Start device authorization request
- [ ] Generate test device code
- [ ] Generate user code
- [ ] Create controlled social-engineering scenario
- [ ] Have test user enter code
- [ ] Have test user approve device
- [ ] Demonstrate requesting device receiving token
- [ ] Show why this is dangerous
- [ ] Keep demo isolated from real accounts and systems

## Testing

- [ ] Test successful authorization
- [ ] Test denied consent
- [ ] Test invalid client ID
- [ ] Test invalid redirect URI
- [ ] Test invalid scope
- [ ] Test expired authorization code
- [ ] Test reused authorization code
- [ ] Test invalid access token
- [ ] Test expired access token
- [ ] Test device-code approval
- [ ] Test device-code denial
- [ ] Test expired device code
- [ ] Test authorization pending response
- [ ] Verify one client cannot use another client's authorization code

---

# OAuth Flow We Are Building

The first major goal is to make this work:

```text
Legitimate Client
       ↓
OAuth /authorize
       ↓
User Login
       ↓
Consent Screen
       ↓
Authorization Code
       ↓
Client Callback
       ↓
OAuth /token
       ↓
Access Token
       ↓
Protected API /userinfo
```

---

# Device Flow We Are Building

After the normal OAuth flow works:

```text
Device Client
      ↓
/device_authorization
      ↓
Device Code + User Code
      ↓
User visits verification page
      ↓
User enters code
      ↓
User approves
      ↓
Device polls /token
      ↓
Access Token
```

---

# Security Demonstrations

## Consent Phishing

The user is convinced to authorize a client that they did not fully understand or intend to trust.

The demo should demonstrate:

```text
Security Demo Client
        ↓
Real OAuth Server
        ↓
Real Consent Screen
        ↓
User approves
        ↓
Demo Client receives access token
```

The demo client should receive OAuth authorization only.

It should not collect real usernames or passwords.

---

## Device-Code Phishing

The user is convinced to approve a device authorization request that they did not initiate.

```text
Demo Client
     ↓
Requests device code
     ↓
Receives user code
     ↓
Test user is convinced to enter code
     ↓
User approves
     ↓
Demo client receives token
```

---

# Suggested Project Structure

```text
oauth2-security-project/
│
├── auth-server/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   ├── views/
│   └── server.js
│
├── clients/
│   ├── legitimate-client/
│   └── security-demo-client/
│
├── database/
│   ├── models/
│   └── database.js
│
├── device-flow/
│
├── tests/
│
├── docs/
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

# Technology

- **Language:** JavaScript
- **Runtime:** Node.js
- **Backend Framework:** Express.js
- **Frontend:** HTML / CSS / JavaScript
- **Database:** TBD
- **Version Control:** GitHub

---

# Development Order

We should not try to build everything at once.

## Phase 1 — Basic Server

- [ ] Node/Express project runs
- [ ] Database connects
- [ ] Test users exist
- [ ] Test OAuth client exists

## Phase 2 — Normal OAuth

- [ ] `/authorize`
- [ ] Login
- [ ] Consent
- [ ] Authorization code
- [ ] `/token`
- [ ] Access token
- [ ] `/userinfo`

## Phase 3 — Legitimate Client

- [ ] Client redirects correctly
- [ ] OAuth callback works
- [ ] Token exchange works
- [ ] Protected data can be accessed

## Phase 4 — Device Authorization

- [ ] Device codes
- [ ] User codes
- [ ] Verification page
- [ ] Approval
- [ ] Polling
- [ ] Token issuance

## Phase 5 — Security Demonstrations

- [ ] Consent-phishing demo
- [ ] Device-code phishing demo
- [ ] Security testing

## Phase 6 — Integration & Cleanup

- [ ] Connect all components
- [ ] Fix bugs
- [ ] Improve UI
- [ ] Clean repository
- [ ] Verify no secrets are committed
- [ ] Prepare stable demo environment

---

# Important Development Rules

- Never commit `.env`
- Never commit API keys
- Never commit client secrets
- Never use real passwords in the repository
- Use test accounts only
- Use test data only
- Keep the security demonstrations inside systems controlled by the group
- Do not test against real third-party OAuth services
- Pull the latest changes before starting work
- Create separate branches for major features
- Use clear commit messages

---

# Current Status

**Phase:** Planning / Initial Development

### First Milestone

Get this working locally:

```text
Client
  → /authorize
  → login
  → consent
  → authorization code
  → /token
  → access token
  → /userinfo
```

Once this works, then our group will have the foundation needed for the device-code flow and security demonstrations.

