// database/seed.js 
// This script seeds the database with initial data for testing purposes.
const { DatabaseSync } = require('node:sqlite');
const bcrypt = require('bcrypt');
const path = require('node:path');

// Path to the SQLite database file
const dbPath = path.join(__dirname, 'oauth.db');
const db = new DatabaseSync(dbPath);

// Seed the database with a test user
const testPassword = 'TestPassword123';
const passwordHash = bcrypt.hashSync(testPassword, 12);

// Insert a test user into the users table
const insertUser = db.prepare(`
    INSERT or Ignore INTO users 
        (username, password_hash, display_name, email) 
    VALUES (?, ?, ?, ?)
`);
// Run the insert statement with test user data
insertUser.run(
    'testuser', 
    passwordHash, 
    'Test User', 
    'testuser@example.com'
);

// Seed the database with a test OAuth client
const insertClient = db.prepare(`
    INSERT or Ignore INTO oauth_clients 
        (client_id, client_name, redirect_uri, allowed_scopes)
    VALUES (?, ?, ?, ?)
`);
// Run the insert statement with test client data
insertClient.run(
    'activito-demo',
    'Activito Demo Client',
    'http://localhost:3000/callback',
    'profile email'
);
// Close the database connection
console.log('Test user and OAuth client have been seeded into the database.');

// Retrieve and log the seeded users for verification
const users = db.prepare('SELECT id, username, display_name, email FROM users').all();

// Retrieve and log the seeded clients for verification
const clients = db.prepare('SELECT id, client_id, client_name, redirect_uri, allowed_scopes FROM oauth_clients').all();

// Log the seeded users and clients to the console
console.log('\nUsers:');
console.table(users);
console.log('\nOAuth Clients:');
console.table(clients);

db.close();