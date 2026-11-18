
const db = require('./database');

// Find a user by their username.
function getUserByUsername(username) {
    const query = db.prepare(`
        SELECT id, username, password_hash,
               display_name, email
        FROM users
        WHERE username = ?
    `);

    return query.get(username);
}

// Export the function so other files can use it.
module.exports = { getUserByUsername };
