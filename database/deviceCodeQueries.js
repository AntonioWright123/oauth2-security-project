
 // database/deviceCodeQueries.js

const db = require('./database');

// Save a new device authorization request.
function saveDeviceCode(deviceCode, userCode, clientId, scope, expiresAt) {
    const query = db.prepare(`
        INSERT INTO device_codes
        (device_code, user_code, client_id, scope, expires_at)
        VALUES (?, ?, ?, ?, ?)
    `);

    return query.run(deviceCode, userCode, clientId, scope, expiresAt);
}

// Find a request using its device code.
function getDeviceByCode(deviceCode) {
    const query = db.prepare(`
        SELECT * FROM device_codes
        WHERE device_code = ?
    `);

    return query.get(deviceCode);
}

// Find a request using the user-facing code.
function getDeviceByUserCode(userCode) {
    const query = db.prepare(`
        SELECT * FROM device_codes
        WHERE user_code = ?
    `);

    return query.get(userCode);
}

// Approve a pending, unexpired device request.
function approveDeviceCode(deviceCode, userId) {
    const query = db.prepare(`
        UPDATE device_codes
        SET status = 'approved', user_id = ?
        WHERE device_code = ?
          AND status = 'pending'
          AND expires_at > ?
    `);

return query.run(userId, deviceCode, new Date().toISOString());
}

// Deny a pending, unexpired device request.
function denyDeviceCode(deviceCode) {
    const query = db.prepare(`
        UPDATE device_codes
        SET status = 'denied'
        WHERE device_code = ?
          AND status = 'pending'
          AND expires_at > ?
    `);

    return query.run(deviceCode, new Date().toISOString());
}

// Check whether a device request has expired.
function isDeviceCodeExpired(deviceCode) {
    const request = getDeviceByCode(deviceCode);

    if (!request) {
        return true;
    }

    return new Date(request.expires_at).getTime() <= Date.now();
}

module.exports = {
    saveDeviceCode,
    getDeviceByCode,
    getDeviceByUserCode,
    approveDeviceCode,
    denyDeviceCode,
    isDeviceCodeExpired
};
