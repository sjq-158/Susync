const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const root = path.join(__dirname, "..");
const dataDir = path.join(root, "data");
const dbPath = path.join(dataDir, "susync.db");

fs.mkdirSync(dataDir, { recursive: true });
if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);

const db = new Database(dbPath);
const schema = fs.readFileSync(path.join(root, "db", "schema.sql"), "utf8");
const seed = fs.readFileSync(path.join(root, "db", "seed.sql"), "utf8");
db.exec(schema);
db.exec(seed);
db.close();
console.log("Initialized", dbPath);
