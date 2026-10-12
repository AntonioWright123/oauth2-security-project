# Role 5 Security Testing

This file documents security testing completed for the OAuth 2.0 project.

## Test Results

| Test | Test Input | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| Invalid client ID | `client_id=fake-client` | Server rejects unknown client | `Invalid client_id` | Passed |
| Invalid redirect URI | Valid client ID with unregistered redirect URI | Server rejects redirect URI | `Invalid redirect_uri` | Passed |
| Invalid scope | Valid client and redirect URI with `scope=admin` | Server rejects unsupported scope | `Invalid scope` | Passed |
| Denied consent | Clicked Deny on OAuth consent screen | Authorization should be denied and user redirected safely | `Cannot POST /consent` | Not Implemented |
| Approved consent | Clicked Allow on OAuth consent screen | Authorization code should be issued and user redirected to the client callback | `Cannot POST /consent` | Not Implemented |

## Notes

The authorization server was run locally using Node.js and tested through the `/authorize` endpoint.

Additional Role 5 testing will be completed as the token endpoint and device authorization flow are implemented.

The consent page currently submits to `/consent`, but the authorization server does not yet have a POST `/consent` handler. Denied-consent behavior cannot be fully completed until that route is implemented.

The Allow action also submits to `/consent` and currently returns `Cannot POST /consent`. The authorization server needs a POST `/consent` handler before authorization codes can be issued through the consent screen.