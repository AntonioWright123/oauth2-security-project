// database/authorizationCodeQueries.js

const db = require('./database');
const crypto = require('node:crypto');

function hashCode(code) {
    return crypto.createHash('sha256')
        .update(code)
        .digest('hex');
}

// This function saves an authorization code to the database.
function saveAuthorizationCode(code, clientId, userId, redirectUri, scope, expiresAt) {
    const query = db.prepare(`
        INSERT INTO authorization_codes
        (code, client_id, user_id, redirect_uri, scope, expires_at)
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    return query.run(
        hashCode(code),
        clientId,
        userId,
        redirectUri,
        scope,
        expiresAt
    );
}

// This function retrieves an authorization code from the database by its code value.
function getAuthorizationCode(code) {
    const query = db.prepare(`
        SELECT *
        FROM authorization_codes
        WHERE code = ?
    `);

    return query.get(hashCode(code));
}


 // This function marks an authorization code as used in the database.
function consumeAuthorizationCode(code, clientId, redirectUri) {
    const now = new Date().toISOString();

    const query = db.prepare(`
        UPDATE authorization_codes
        SET used = 1
        WHERE code = ?
          AND client_id = ?
          AND redirect_uri = ?
          AND used = 0
          AND expires_at > ?
        RETURNING id, client_id, user_id, redirect_uri, scope
    `);

    return query.get(hashCode(code), clientId, redirectUri, now);
}


// Export the functions so they can be used in other parts of the application.
module.exports = {
    saveAuthorizationCode,
    getAuthorizationCode,
    consumeAuthorizationCode
};