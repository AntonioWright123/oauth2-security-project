# Role 5 Security Testing

This file documents security testing completed for the OAuth 2.0 project.

## Test Results

| Test | Test Input | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| Invalid client ID | `client_id=fake-client` | Server rejects unknown client | `Invalid client_id` | Passed |
| Invalid redirect URI | Valid client ID with unregistered redirect URI | Server rejects redirect URI | `Invalid redirect_uri` | Passed |
| Invalid scope | Valid client and redirect URI with `scope=admin` | Server rejects unsupported scope | `Invalid scope` | Passed |

## Notes

The authorization server was run locally using Node.js and tested through the `/authorize` endpoint.

Additional Role 5 testing will be completed as the token endpoint and device authorization flow are implemented.