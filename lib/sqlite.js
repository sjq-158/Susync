import fs from "fs";
import path from "path";

let betterInstance;
let sqlJsInstance;

async function getBetter() {
  if (betterInstance) return betterInstance;
  if (process.env.VERCEL) return null;
  const dbPath = path.join(process.cwd(), "data", "susync.db");
  if (!fs.existsSync(dbPath)) return null;
  const { default: Database } = await import("better-sqlite3");
  betterInstance = new Database(dbPath);
  return betterInstance;
}

async function getSqlJs() {
  if (sqlJsInstance) return sqlJsInstance;
  const initSqlJs = (await import("sql.js/dist/sql-wasm.js")).default;
  const SQL = await initSqlJs({
    locateFile: () => path.join(process.cwd(), "public", "sql-wasm.wasm"),
  });
  const pub = path.join(process.cwd(), "public", "susync-demo.sqlite");
  const data = path.join(process.cwd(), "data", "susync.db");
  let buf;
  if (fs.existsSync(pub)) buf = fs.readFileSync(pub);
  else if (fs.existsSync(data)) buf = fs.readFileSync(data);
  else throw new Error("No SQLite file found. Run npm run db:init && npm run db:bundle");
  sqlJsInstance = new SQL.Database(new Uint8Array(buf));
  return sqlJsInstance;
}

/** @param {string} sql @param {unknown[]} params */
export async function dbAll(sql, params = []) {
  const b = await getBetter();
  if (b) return b.prepare(sql).all(...params);
  const db = await getSqlJs();
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

/** @param {string} sql @param {unknown[]} params */
export async function dbRun(sql, params = []) {
  const b = await getBetter();
  if (!b) return { ok: false, demoReadonly: true };
  const info = b.prepare(sql).run(...params);
  return { ok: true, changes: info.changes, lastInsertRowid: info.lastInsertRowid };
}
