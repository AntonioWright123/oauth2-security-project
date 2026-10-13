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

- Build controlled consent-phishing demonstration

- Build controlled device-code phishing demonstration

- Store users, clients, tokens, codes, and consent information

- Test normal and abnormal OAuth behavior

---

# Team Technical Roles

Each person should choose one main technical role.

The person assigned to a section is responsible for making sure that section works and integrates with the rest of the project.

Team members can still help each other across sections.

- [ ] **Role 1 — OAuth Authorization Server Core**

      Owner: **Brady McManus**

- [ ] **Role 2 — Database, Users & OAuth Client Management**

      Owner: **AJ Flower**

- [ ] **Role 3 — Legitimate Client Application & Frontend**

      Owner: **Antonio Wright**

- [ ] **Role 4 — OAuth Device Authorization Flow**

      Owner: **AJ Kozina**

- [ ] **Role 5 — Security / Phishing Demonstration & Testing**

      Owner: **Sam Smith**

---

# 1. OAuth Authorization Server Core

**Owner:** **Brady McManus**

This person will focus on the main OAuth server and authorization-code flow.

## Tasks

- [x] Create Node.js project

- [x] Install and configure Express

- [x] Create main server

- [x] Create `/authorize` endpoint

- [x] Create login process

- [x] Create consent process

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

**Owner:** _AJ Flower_

This person will manage the data required by the authorization server.

## Tasks

- [x] Choose database system

- [x] Set up database connection

- [x] Create users table

- [x] Create OAuth clients table

- [x] Create authorization codes table

- [x] Create access tokens table

- [ ] Create consent records table

- [ ] Create device codes table

- [x] Store registered client IDs

- [x] Store approved redirect URIs

- [x] Store OAuth scopes

- [x] Store token expiration times

- [x] Create test users

- [x] Create legitimate test client

- [ ] Create security-demo test client

- [ ] Add database helper functions

### Current role 2 progress

The SQLite database has been initialized and tested successfully. The current schema includes:

- users

- oauth_clients

- authorization_codes

- access_tokens

A seeded test user and legitimate OAuth client can be inserted successfully with seed.js. The current seeded client values still need to be aligned with the client ID and callback URL used by the integrated Activito flow.

Consent-record and device-code tables are not yet present in the current schema.

Possible database:

```text

SQLite during early development

or

PostgreSQL if we decide to deploy

```

---

# 3. Legitimate Client Application & Frontend

**Owner:** **Antonio Wright**

This person will create the normal application that uses the OAuth server correctly.

## Tasks

- [x] Create legitimate client application

- [x] Create frontend

- [x] Add "Connect Account" or "Sign In" button

- [x] Redirect user to OAuth `/authorize`

- [x] Send client ID

- [x] Send redirect URI

- [x] Send requested scopes

- [x] Create OAuth callback route

- [x] Receive authorization code

- [ ] Exchange authorization code for access token

- [ ] Store token safely for the demo

- [ ] Call `/userinfo`

- [ ] Display returned user information

- [x] Create login page UI

- [x] Create consent page UI

- [x] Make frontend visually consistent

### Current role 3 progress

The Activito client has been added under

```text

clients/activito-demo-client/

```

The existing production Activito project should not be changed until the standalone OAuth system works.

---

# 4. OAuth Device Authorization Flow

**Owner:** _AJ Kozina_

This person will build the device-code portion of OAuth.

## Tasks

- [x] Create `/device_authorization` endpoint

- [x] Generate device code

- [x] Generate user code

- [x] Create verification URL

- [ ] Create device verification page

- [ ] Allow user to enter user code

- [ ] Connect device request to user account

- [ ] Create device consent screen

- [x] Implement device approval

- [x] Implement device denial

- [ ] Implement token polling

- [x] Return `authorization_pending`

- [ ] Issue access token after approval

- [x] Add device-code expiration

- [x] Handle invalid device codes

- [x] Handle expired device codes

### Current role 4 progress

The device authorization API has been tested successfully through the temporary test flow:

/device_authorization
↓
device_code + user_code
↓
/device/verify
↓
/device/decision
↓
approved
↓
/device/poll-test
The current implementation supports generated device/user codes, approval/denial state, expiration checks, invalid-code handling, and authorization-pending state logic.

The verification page, device consent UI, real user-account connection, shared /token integration, and access-token issuance are still in progress.

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

**Owner:** _Sam Smith_

This person will build the controlled security demonstrations and test the completed system.

## Consent Phishing Demo

- [x] Create separate security-demo OAuth client
- [ ] Register separate client ID
- [ ] Create controlled misleading application scenario
- [x] Request OAuth scopes
- [x] Redirect user to legitimate OAuth server
- [x] Display consent screen
- [ ] Demonstrate user approving wrong client
- [ ] Show token being issued to demo client
- [ ] Demonstrate what approved scopes allow
- [x] Clearly label demo as educational/test environment

### Current role 5 progress

A separate security-demo client page has been created under `clients/security-demo-client/`.

The Connect Test Account button now redirects to the legitimate OAuth authorization server and requests the `profile` scope. The consent screen can be displayed through the existing OAuth flow.

The security demo currently reuses the `activito-client` client ID and Activito callback URL. A separate registered security-demo OAuth client, token issuance, and the complete misleading-consent demonstration are still in progress.

## Device-Code Phishing Demo

- [ ] Start device authorization request
- [ ] Generate test device code
- [x] Generate user code
- [ ] Create controlled social-engineering scenario
- [ ] Have test user enter code
- [ ] Have test user approve device
- [ ] Demonstrate requesting device receiving token
- [ ] Show why this is dangerous
- [ ] Keep demo isolated from real accounts and systems

## Testing

- [ ] Test successful authorization
- [x] Test denied consent
- [x] Test invalid client ID
- [x] Test invalid redirect URI
- [x] Test invalid scope
- [ ] Test expired authorization code
- [ ] Test reused authorization code
- [ ] Test invalid access token
- [ ] Test expired access token
- [x] Test device-code approval
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

- **Database:** SQLite (current development database)

- **Version Control:** GitHub

---

# Development Order

We should not try to build everything at once.

## Phase 1 — Basic Server

- [x] Node/Express project runs

- [x] Database connects

- [x] Test users exist

- [x] Test OAuth client exists

## Phase 2 — Normal OAuth

- [x] `/authorize`

- [x] Login

- [x] Consent

- [ ] Authorization code

- [ ] `/token`

- [ ] Access token

- [ ] `/userinfo`

## Phase 3 — Legitimate Client

- [x] Client redirects correctly

- [x] OAuth callback works

- [ ] Token exchange works

- [ ] Protected data can be accessed

## Phase 4 — Device Authorization

- [x] Device codes

- [x] User codes

- [ ] Verification page

- [x] Approval

- [ ] Polling

- [ ] Token issuance

## Phase 5 — Security Demonstrations

- [x] Consent-phishing demo

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

**Phase:** OAuth Integration and Device-Flow Progress

### Working Now

- Node.js / Express authorization server runs locally

- Activito legitimate OAuth demo client is integrated

- OAuth demo sign-in button starts the authorization flow

- /authorize validates client ID, redirect URI, and requested scope

- Styled login and consent pages are connected into the browser flow

- Login form submission routes the user into consent

- Consent approval redirects the user to the Activito callback

- OAuth callback page receives and reads an authorization code

- SQLite database initializes successfully

- Database contains users, oauth_clients, authorization_codes, and access_tokens tables

- Seed script successfully creates a bcrypt-hashed test user and legitimate OAuth client

- Device authorization endpoint generates device codes and user codes

- Device verification and approval flow works through the temporary /device/poll-test route

- Device flow includes expiration, invalid-code, denied, approved, and authorization-pending state handling

- Separate security-demo client page exists and is clearly labeled as an educational/test environment

- Team branches have been merged into a temporary integration branch for testing

### Known Integration Gaps

- Login currently checks that credentials were entered, but it is not yet connected to the stored SQLite test-user credentials

- The database seed client values need to be aligned with the Activito client ID and callback URL used by the integrated flow

- Authorization codes are still represented by a temporary test code instead of generated/stored one-time codes

- /token has not yet been implemented for the authorization-code flow

- Device polling is currently tested through /device/poll-test; it is not yet connected to the shared /token endpoint

- /userinfo and protected user-data access are not yet implemented

- Device verification/consent UI is not yet built

- Security-demo client behavior is not yet connected to the OAuth server

### Next Milestone

Complete the full authorization-code flow and connect it to the database:

Activito Client
↓
/authorize
↓
Database-backed Login
↓
Consent
↓
Generated Authorization Code
↓
Activito Callback
↓
/token
↓
Access Token
↓
/userinfo
Then connect the device flow to the shared /token endpoint and continue the controlled security demonstrations.
