// database/clientQueries.js

const db = require('./database');

// This function retrieves a client from the database by its client_id.
function getClientById(clientId) {
    const query = db.prepare(`
        SELECT id, client_id, client_name,
               redirect_uri, allowed_scopes
        FROM oauth_clients
        WHERE client_id = ?
    `);
    
// Execute the query with the provided clientId.
const client = query.get(clientId);

// If the client is not found, return undefined.
if (!client) {
    return undefined;
}

// Return the client object with allowed_scopes as an array of strings.
return {
    ...client,
    scopes: client.allowed_scopes.trim().split(/\s+/)
};
}

// Export the function so it can be used in other parts of the application.
module.exports = { getClientById };
