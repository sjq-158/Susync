const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.join(__dirname, "..");
const dbPath = path.join(root, "data", "susync.db");
const outPath = path.join(root, "public", "susync-demo.sqlite");

if (!fs.existsSync(dbPath)) {
  execFileSync(process.execPath, [path.join(__dirname, "init-db.cjs")], {
    stdio: "inherit",
    cwd: root,
  });
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.copyFileSync(dbPath, outPath);
const wasmSrc = path.join(root, "node_modules", "sql.js", "dist", "sql-wasm.wasm");
const wasmOut = path.join(root, "public", "sql-wasm.wasm");
if (fs.existsSync(wasmSrc)) {
  fs.copyFileSync(wasmSrc, wasmOut);
  console.log("Copied sql-wasm.wasm to public/");
}
console.log("Bundled demo DB to public/susync-demo.sqlite");
