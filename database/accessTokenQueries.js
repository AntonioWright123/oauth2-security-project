// database/accessTokenQueries.js
const db = require('./database');

// Save an access token in the database
// Store a SHA-256 hash instead of the actual token
function saveAccessToken(token, clientId, userId, scope, expiresAt) {
    const crypto = require('node:crypto');
    const tokenHash = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    const query = db.prepare(`
        INSERT INTO access_tokens
        (token, client_id, user_id, scope, expires_at)
        VALUES (?, ?, ?, ?, ?)
    `);

    return query.run(
        tokenHash,
        clientId,
        userId,
        scope,
        expiresAt
    );
}

// Retrieve an access token from the database by its token value
function getAccessToken(token) {
    const crypto = require('node:crypto');
    const tokenHash = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    const query = db.prepare(`
        SELECT id, client_id, user_id, scope, expires_at
        FROM access_tokens
        WHERE token = ?
          AND expires_at > ?
    `);

    return query.get(tokenHash, new Date().toISOString());
}

// Export the functions so they can be used in other parts of the application
module.exports = {
    saveAccessToken,
    getAccessToken
};
