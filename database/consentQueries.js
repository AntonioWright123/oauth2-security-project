
 // database/consentQueries.js

const db = require('./database');

// Save a user's consent decision for an OAuth client.
function saveConsent(userId, clientId, scope, approved) {
    const query = db.prepare(`
        INSERT INTO consent_records
        (user_id, client_id, scope, approved)
        VALUES (?, ?, ?, ?)
    `);

    return query.run(
        userId,
        clientId,
        scope,
        approved ? 1 : 0
    );
}

// Retrieve consent records for a specific user and client.
function getConsent(userId, clientId) {
    const query = db.prepare(`
        SELECT id, user_id, client_id, scope,
               approved, created_at
        FROM consent_records
        WHERE user_id = ?
          AND client_id = ?
        ORDER BY id DESC
        LIMIT 1
    `);

    return query.get(userId, clientId);
}

// Retrieve all consent records for a user.
function getUserConsents(userId) {
    const query = db.prepare(`
        SELECT id, user_id, client_id, scope,
               approved, created_at
        FROM consent_records
        WHERE user_id = ?
        ORDER BY id DESC
    `);

    return query.all(userId);
}

// Export functions for use by the authorization server.
module.exports = {
    saveConsent,
    getConsent,
    getUserConsents
};
