
const {DatabaseSync} = require('node:sqlite');/**This gives JavaScript program access to SQLite/** */

const fs = require('node:fs');/**fs means file system. use it to read schema.sql file/** */

const path = require('node:path');/**helps Node reliably find files regardless of where the program was launched from** */






/**Define the path to the SQLite database file. The database file will be created in the same directory as this script.** */

const dbPath = path.join(__dirname, 'oauth.db');

const db = new DatabaseSync(dbPath);




/**Read the schema.sql file and execute its contents to create the necessary tables in the database** */

const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');



/**Execute the SQL commands from the schema.sql file to create the tables in the database** */
db.exec(schema);

console.log('OAuth database initialized successfully.');




/**Query the database to list all tables and log them to the console** */

const tables = db.prepare(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table'
    ORDER BY name
`).all();

console.log('Database tables:');
console.table(tables);