// database/userQueries.js

const db = require('./database');

// This function retrieves a user from the database by their username.
function getUserByUsername(username) {
    const query = db.prepare(`
        SELECT id, username, password_hash,
               display_name, email
        FROM users
        WHERE username = ?
    `);

    return query.get(username);
}


 // Find a user by their email address.
function getUserByEmail(email) {
  const query = db.prepare(`
    SELECT id, username, password_hash,
           display_name, email
    FROM users
    WHERE email = ?
  `);

  return query.get(email);
}



module.exports = {
  getUserByUsername,
  getUserByEmail
};
