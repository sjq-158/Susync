import fs from "fs";
import path from "path";

/**
 * Server-only: load preprocessed HTML/CSS from import-data/<slug>/
 * @param {string} slug
 */
export function loadImport(slug) {
  const base = path.join(process.cwd(), "import-data", slug);
  const css = fs.readFileSync(path.join(base, "style.css"), "utf8");
  const html = fs.readFileSync(path.join(base, "body.html"), "utf8");
  return { css, html };
}
