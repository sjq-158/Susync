/**
 * Reads final/*.html → import-data/<slug>/{style.css, body.html}
 * - Scopes body { → .susync-root {
 * - Rewrites .html hrefs to Next routes
 * - Cebu-only copy fixes (see CEbu_REPLACEMENTS)
 * - Fixes buyer transaction list sidebars (wrong active tab in source)
 * - Patches app nav href="#" → real routes
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const finalDir = path.join(root, "final");
const outDir = path.join(root, "import-data");

const hrefMap = {
  "01_landing_page.html": "/",
  "02_about_us.html": "/about",
  "03_careers.html": "/careers",
  "04_contact_us.html": "/contact",
  "05_help_center.html": "/help",
  "06_privacy_policy.html": "/privacy",
  "07_terms_of_service.html": "/terms",
  "08_auth_login_SEE.html": "/login",
  "08_auth_login_NOTSEE.html": "/login",
  "09_auth_register_BUYER_SEE.html": "/register",
  "09_auth_register_BUYER_NOTSEE.html": "/register",
  "09_auth_register_SELLER_SEE.html": "/register",
  "09_auth_register_SELLER_NOTSEE.html": "/register",
  "10_dashboard_BUYER.html": "/buyer/dashboard",
  "10_dashboard_SELLER.html": "/seller/dashboard",
  "view_properties_BUYER.html": "/buyer/properties",
  "saved_properties_BUYER.html": "/buyer/saved",
  "transactions_tracker.html": "/buyer/transactions",
  "transactions_list_BUYER_ALLDEALS.html": "/buyer/transactions?tab=all",
  "transactions_list_BUYER_INPROGRESS.html": "/buyer/transactions?tab=in_progress",
  "transactions_list_BUYER_COMPLETED.html": "/buyer/transactions?tab=completed",
  "transactions_list_BUYER_CANCELLED.html": "/buyer/transactions?tab=cancelled",
  "messages_BUYER.html": "/buyer/messages",
  "messages_SELLER.html": "/seller/messages",
  "settings_BUYER.html": "/buyer/settings",
  "settings_SELLER.html": "/seller/settings",
  "sales_activity.html": "/seller/sales",
};

/** Longest-first to avoid partial replacements */
const CEBU_REPLACEMENTS = [
  ["Maria Santos replied to your inquiry about QC House", "Maria Santos replied to your inquiry about Cebu House"],
  ["Studio Unit in Ortigas Center", "Studio Unit near Cebu Business Park"],
  ["Modern 4-Bedroom House, Quezon City", "Modern 4-Bedroom House, Cebu City"],
  ["Modern 4BR House, Quezon City", "Modern 4BR House, Cebu City"],
  ["Modern 4BR House in QC", "Modern 4BR House in Cebu City"],
  ["Stylish 2BR Condo in BGC", "Stylish 2BR Condo in Cebu IT Park"],
  ["2BR Condo in BGC, Taguig", "2BR Condo in Cebu IT Park"],
  ["2BR Condo in BGC", "2BR Condo in Cebu IT Park"],
  ["Modern 4BR House, QC", "Modern 4BR House, Cebu City"],
  ["Modern 4BR, QC", "Modern 4BR, Cebu City"],
  ["📍 Diliman, Quezon City", "📍 Lahug, Cebu City"],
  ["📍 Diliman, QC", "📍 Lahug, Cebu City"],
  ["📍 BGC, Taguig", "📍 Cebu IT Park"],
  ["📍 Taguig, Metro Manila", "📍 Mandaue City, Cebu"],
  ["Makati City, Metro Manila", "Mandaue City, Cebu"],
  ["Cozy Townhouse in Makati", "Cozy Townhouse in Consolacion"],
  ["📍 Makati City", "📍 Consolacion, Cebu"],
  ["Studio Unit, Makati", "Studio Unit, Mandaue"],
  ["Quezon City, Metro Manila", "Cebu City, Cebu"],
  ["Pasig City", "Cebu City"],
  ["the virtual tour of the QC house", "the virtual tour of the Cebu house"],
  ["Hi Maria! I really liked the virtual tour of the QC house.", "Hi Maria! I really liked the virtual tour of the Cebu house."],
  ["about QC House", "about Cebu House"],
  ["Contract for BGC Condo is ready for review", "Contract for IT Park Condo is ready for review"],
  ["4BR House, QC", "4BR House, Cebu City"],
  ["2BR Condo, BGC", "2BR Condo, IT Park"],
  ['alt="QC House"', 'alt="Cebu House"'],
  ["Taguig City", "Mandaue City"],
  ["Quezon City", "Cebu City"],
];

function slugify(filename) {
  return filename.replace(/\.html$/i, "");
}

function scopeCss(css) {
  return css
    .replace(/\bbody\s*\{/g, ".susync-root {")
    .replace(/\bbody,/g, ".susync-root,");
}

function rewriteFileLinks(html) {
  let out = html;
  for (const [file, route] of Object.entries(hrefMap)) {
    const esc = file.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(`href="${esc}"`, "g"), `href="${route}"`);
  }
  out = out.replace(/href="transaction_tracker\.html"/g, 'href="/buyer/transactions/SY-2025-04-0021"');
  return out;
}

function applyCebu(html) {
  let out = html;
  for (const [a, b] of CEBU_REPLACEMENTS) {
    out = out.split(a).join(b);
  }
  return out;
}

/** Source HTML marked Dashboard active on some transaction list pages — fix to My Transactions */
function fixBuyerTxListActive(body, slug) {
  if (!slug.startsWith("transactions_list_BUYER_")) return body;
  if (slug === "transactions_list_BUYER_ALLDEALS") return body;
  return body.replace(
    /<a href="[^"]*" class="side-item active">📊 Dashboard<\/a>\s*\n\s*<a href="[^"]*" class="side-item">🔄 My Transactions<\/a>/,
    '<a href="/buyer/dashboard" class="side-item">📊 Dashboard</a>\n            <a href="/buyer/transactions?tab=all" class="side-item active">🔄 My Transactions</a>',
  );
}

function patchNav(body, slug) {
  let out = body;
  const buyerSlugs = new Set([
    "10_dashboard_BUYER",
    "view_properties_BUYER",
    "saved_properties_BUYER",
    "transactions_tracker",
    "transactions_list_BUYER_ALLDEALS",
    "transactions_list_BUYER_INPROGRESS",
    "transactions_list_BUYER_COMPLETED",
    "transactions_list_BUYER_CANCELLED",
    "messages_BUYER",
    "settings_BUYER",
  ]);
  const sellerSlugs = new Set([
    "10_dashboard_SELLER",
    "sales_activity",
    "messages_SELLER",
    "settings_SELLER",
  ]);

  const logoHref =
    buyerSlugs.has(slug) ? "/buyer/dashboard" : sellerSlugs.has(slug) ? "/seller/dashboard" : null;

  if (logoHref) {
    out = out.replace(/<a href="#" class="logo">/g, `<a href="${logoHref}" class="logo">`);
    out = out.replace(/<a href="#" class="logo" /g, `<a href="${logoHref}" class="logo" `);
  }

  if (buyerSlugs.has(slug)) {
    const reps = [
      [/<a href="#" class="side-item active">📊 Dashboard<\/a>/g, '<a href="/buyer/dashboard" class="side-item active">📊 Dashboard</a>'],
      [/<a href="#" class="side-item">📊 Dashboard<\/a>/g, '<a href="/buyer/dashboard" class="side-item">📊 Dashboard</a>'],
      [/<a href="#" class="side-item active">🔄 My Transactions<\/a>/g, '<a href="/buyer/transactions?tab=all" class="side-item active">🔄 My Transactions</a>'],
      [/<a href="#" class="side-item">🔄 My Transactions<\/a>/g, '<a href="/buyer/transactions?tab=all" class="side-item">🔄 My Transactions</a>'],
      [/<a href="#" class="side-item active">💬 Messages<\/a>/g, '<a href="/buyer/messages" class="side-item active">💬 Messages</a>'],
      [/<a href="#" class="side-item">💬 Messages<\/a>/g, '<a href="/buyer/messages" class="side-item">💬 Messages</a>'],
      [/<a href="#" class="side-item active">❤️ Bookmark<\/a>/g, '<a href="/buyer/saved" class="side-item active">❤️ Bookmark</a>'],
      [/<a href="#" class="side-item">❤️ Bookmark<\/a>/g, '<a href="/buyer/saved" class="side-item">❤️ Bookmark</a>'],
      [/<a href="#" class="side-item active">⚙️ Settings<\/a>/g, '<a href="/buyer/settings" class="side-item active">⚙️ Settings</a>'],
      [/<a href="#" class="side-item">⚙️ Settings<\/a>/g, '<a href="/buyer/settings" class="side-item">⚙️ Settings</a>'],
      [/<a href="#" class="nav-item active">📊 Dashboard<\/a>/g, '<a href="/buyer/dashboard" class="nav-item active">📊 Dashboard</a>'],
      [/<a href="#" class="nav-item">📊 Dashboard<\/a>/g, '<a href="/buyer/dashboard" class="nav-item">📊 Dashboard</a>'],
      [/<a href="#" class="nav-item active">🔄 My Transactions<\/a>/g, '<a href="/buyer/transactions?tab=all" class="nav-item active">🔄 My Transactions</a>'],
      [/<a href="#" class="nav-item">🔄 My Transactions<\/a>/g, '<a href="/buyer/transactions?tab=all" class="nav-item">🔄 My Transactions</a>'],
      [/<a href="#" class="nav-item active">💬 Messages<\/a>/g, '<a href="/buyer/messages" class="nav-item active">💬 Messages</a>'],
      [/<a href="#" class="nav-item">💬 Messages<\/a>/g, '<a href="/buyer/messages" class="nav-item">💬 Messages</a>'],
      [/<a href="#" class="nav-item active">❤️ Saved Properties<\/a>/g, '<a href="/buyer/saved" class="nav-item active">❤️ Saved Properties</a>'],
      [/<a href="#" class="nav-item">❤️ Saved Properties<\/a>/g, '<a href="/buyer/saved" class="nav-item">❤️ Saved Properties</a>'],
      [/<a href="#" class="nav-item active">⚙️ Settings<\/a>/g, '<a href="/buyer/settings" class="nav-item active">⚙️ Settings</a>'],
      [/<a href="#" class="nav-item">⚙️ Settings<\/a>/g, '<a href="/buyer/settings" class="nav-item">⚙️ Settings</a>'],
      [/<a href="#" class="side-link active">📊 &nbsp; Dashboard<\/a>/g, '<a href="/buyer/dashboard" class="side-link active">📊 &nbsp; Dashboard</a>'],
      [/<a href="#" class="side-link">📊 &nbsp; Dashboard<\/a>/g, '<a href="/buyer/dashboard" class="side-link">📊 &nbsp; Dashboard</a>'],
      [/<a href="#" class="side-link active">🔄 &nbsp; My Transactions<\/a>/g, '<a href="/buyer/transactions?tab=all" class="side-link active">🔄 &nbsp; My Transactions</a>'],
      [/<a href="#" class="side-link">🔄 &nbsp; My Transactions<\/a>/g, '<a href="/buyer/transactions?tab=all" class="side-link">🔄 &nbsp; My Transactions</a>'],
      [/<a href="#" class="side-link active">💬 &nbsp; Messages<\/a>/g, '<a href="/buyer/messages" class="side-link active">💬 &nbsp; Messages</a>'],
      [/<a href="#" class="side-link">💬 &nbsp; Messages<\/a>/g, '<a href="/buyer/messages" class="side-link">💬 &nbsp; Messages</a>'],
      [/<a href="#" class="side-link active">❤️ &nbsp; Saved Properties<\/a>/g, '<a href="/buyer/saved" class="side-link active">❤️ &nbsp; Saved Properties</a>'],
      [/<a href="#" class="side-link">❤️ &nbsp; Saved Properties<\/a>/g, '<a href="/buyer/saved" class="side-link">❤️ &nbsp; Saved Properties</a>'],
      [/<a href="#" class="side-link active">⚙️ &nbsp; Settings<\/a>/g, '<a href="/buyer/settings" class="side-link active">⚙️ &nbsp; Settings</a>'],
      [/<a href="#" class="side-link">⚙️ &nbsp; Settings<\/a>/g, '<a href="/buyer/settings" class="side-link">⚙️ &nbsp; Settings</a>'],
    ];
    for (const [re, to] of reps) out = out.replace(re, to);
  }

  if (sellerSlugs.has(slug)) {
    const reps = [
      [/<a href="#" class="nav-item active">🏠 My Properties<\/a>/g, '<a href="/seller/properties" class="nav-item active">🏠 My Properties</a>'],
      [/<a href="#" class="nav-item">🏠 My Properties<\/a>/g, '<a href="/seller/properties" class="nav-item">🏠 My Properties</a>'],
      [/<a href="#" class="nav-item active">📈 Sales Activity<\/a>/g, '<a href="/seller/sales" class="nav-item active">📈 Sales Activity</a>'],
      [/<a href="#" class="nav-item">📈 Sales Activity<\/a>/g, '<a href="/seller/sales" class="nav-item">📈 Sales Activity</a>'],
      [/<a href="#" class="nav-item active">💬 Messages \(4\)<\/a>/g, '<a href="/seller/messages" class="nav-item active">💬 Messages (4)</a>'],
      [/<a href="#" class="nav-item">💬 Messages \(4\)<\/a>/g, '<a href="/seller/messages" class="nav-item">💬 Messages (4)</a>'],
      [/<a href="#" class="nav-item active">💬 Inquiries \(12\)<\/a>/g, '<a href="/seller/messages" class="nav-item active">💬 Inquiries (12)</a>'],
      [/<a href="#" class="nav-item">💬 Inquiries \(12\)<\/a>/g, '<a href="/seller/messages" class="nav-item">💬 Inquiries (12)</a>'],
      [/<a href="#" class="nav-item active">📄 Digital Contracts<\/a>/g, '<a href="/seller/documents" class="nav-item active">📄 Digital Contracts</a>'],
      [/<a href="#" class="nav-item">📄 Digital Contracts<\/a>/g, '<a href="/seller/documents" class="nav-item">📄 Digital Contracts</a>'],
      [/<a href="#" class="nav-item active">📄 Documents<\/a>/g, '<a href="/seller/documents" class="nav-item active">📄 Documents</a>'],
      [/<a href="#" class="nav-item">📄 Documents<\/a>/g, '<a href="/seller/documents" class="nav-item">📄 Documents</a>'],
      [/<a href="#" class="nav-item active">⚙️ Settings<\/a>/g, '<a href="/seller/settings" class="nav-item active">⚙️ Settings</a>'],
      [/<a href="#" class="nav-item">⚙️ Settings<\/a>/g, '<a href="/seller/settings" class="nav-item">⚙️ Settings</a>'],
      [/<a href="#" class="side-item active">🏠 My Properties<\/a>/g, '<a href="/seller/properties" class="side-item active">🏠 My Properties</a>'],
      [/<a href="#" class="side-item">🏠 My Properties<\/a>/g, '<a href="/seller/properties" class="side-item">🏠 My Properties</a>'],
      [/<a href="#" class="side-item active">📈 Sales Activity<\/a>/g, '<a href="/seller/sales" class="side-item active">📈 Sales Activity</a>'],
      [/<a href="#" class="side-item">📈 Sales Activity<\/a>/g, '<a href="/seller/sales" class="side-item">📈 Sales Activity</a>'],
      [/<a href="#" class="side-item active">💬 Inquiries \(2\)<\/a>/g, '<a href="/seller/messages" class="side-item active">💬 Inquiries (2)</a>'],
      [/<a href="#" class="side-item">💬 Inquiries \(2\)<\/a>/g, '<a href="/seller/messages" class="side-item">💬 Inquiries (2)</a>'],
      [/<a href="#" class="side-item active">📄 Documents<\/a>/g, '<a href="/seller/documents" class="side-item active">📄 Documents</a>'],
      [/<a href="#" class="side-item">📄 Documents<\/a>/g, '<a href="/seller/documents" class="side-item">📄 Documents</a>'],
      [/<a href="#" class="side-item active">⚙️ Settings<\/a>/g, '<a href="/seller/settings" class="side-item active">⚙️ Settings</a>'],
      [/<a href="#" class="side-item">⚙️ Settings<\/a>/g, '<a href="/seller/settings" class="side-item">⚙️ Settings</a>'],
      [/<a href="#" class="side-link active">📊 &nbsp; Dashboard<\/a>/g, '<a href="/seller/dashboard" class="side-link active">📊 &nbsp; Dashboard</a>'],
      [/<a href="#" class="side-link">📊 &nbsp; Dashboard<\/a>/g, '<a href="/seller/dashboard" class="side-link">📊 &nbsp; Dashboard</a>'],
      [/<a href="#" class="side-link active">🏠 &nbsp; My Properties<\/a>/g, '<a href="/seller/properties" class="side-link active">🏠 &nbsp; My Properties</a>'],
      [/<a href="#" class="side-link">🏠 &nbsp; My Properties<\/a>/g, '<a href="/seller/properties" class="side-link">🏠 &nbsp; My Properties</a>'],
      [/<a href="#" class="side-link active">📈 &nbsp; Sales Activity<\/a>/g, '<a href="/seller/sales" class="side-link active">📈 &nbsp; Sales Activity</a>'],
      [/<a href="#" class="side-link">📈 &nbsp; Sales Activity<\/a>/g, '<a href="/seller/sales" class="side-link">📈 &nbsp; Sales Activity</a>'],
      [/<a href="#" class="side-link active">💬 &nbsp; Messages<\/a>/g, '<a href="/seller/messages" class="side-link active">💬 &nbsp; Messages</a>'],
      [/<a href="#" class="side-link">💬 &nbsp; Messages<\/a>/g, '<a href="/seller/messages" class="side-link">💬 &nbsp; Messages</a>'],
      [/<a href="#" class="side-link active">⚙️ &nbsp; Settings<\/a>/g, '<a href="/seller/settings" class="side-link active">⚙️ &nbsp; Settings</a>'],
      [/<a href="#" class="side-link">⚙️ &nbsp; Settings<\/a>/g, '<a href="/seller/settings" class="side-link">⚙️ &nbsp; Settings</a>'],
    ];
    for (const [re, to] of reps) out = out.replace(re, to);
  }

  out = out.replace(
    /<a href="[^"]*" class="side-item" style="color: #ef4444;">🚪 Logout<\/a>/g,
    '<a href="/" class="side-item" style="color: #ef4444;">🚪 Logout</a>',
  );
  out = out.replace(
    /<a href="[^"]*" class="side-item" style="color: #EF4444;">🚪 Logout<\/a>/g,
    '<a href="/" class="side-item" style="color: #EF4444;">🚪 Logout</a>',
  );
  out = out.replace(
    /<a href="[^"]*" class="nav-item" style="color: #EF4444;">🚪 Logout<\/a>/g,
    '<a href="/" class="nav-item" style="color: #EF4444;">🚪 Logout</a>',
  );
  out = out.replace(
    /<a href="[^"]*" class="side-link" style="color: var\(--destructive\);">🚪 &nbsp; Logout<\/a>/g,
    '<a href="/" class="side-link" style="color: var(--destructive);">🚪 &nbsp; Logout</a>',
  );
  out = out.replace(
    /<a href="[^"]*" class="side-link" style="color: #ef4444;">🚪 &nbsp; Logout<\/a>/g,
    '<a href="/" class="side-link" style="color: #ef4444;">🚪 &nbsp; Logout</a>',
  );

  return out;
}

function patchTxCardHrefs(body, slug) {
  if (!slug.includes("transactions")) return body;
  const order = ["SY-2025-04-0021", "SY-2025-03-0942", "SY-2025-01-0210"];
  let i = 0;
  return body.replace(/<a href="#" class="tx-card">/g, () => {
    const id = order[i] ?? order[0];
    i += 1;
    return `<a href="/buyer/transactions/${id}" class="tx-card">`;
  });
}

function marketingNavAndFooter(body) {
  let out = body;
  const pairs = [
    [/<button class="btn-ghost">Login<\/button>/g, '<a href="/login" class="btn-ghost" style="text-decoration:none;display:inline-flex;align-items:center;">Login</a>'],
    [/<button class="btn-primary-sm">Get Started<\/button>/g, '<a href="/register" class="btn-primary-sm" style="text-decoration:none;display:inline-flex;align-items:center;">Get Started</a>'],
  ];
  for (const [re, to] of pairs) out = out.replace(re, to);

  out = out.replace(/<a href="#" class="logo">/g, '<a href="/" class="logo">');

  const foot = [
    [/<a href="#">Browse Properties<\/a>/g, '<a href="/buyer/properties">Browse Properties</a>'],
    [/<a href="#">How It Works<\/a>/g, '<a href="/help">How It Works</a>'],
    [/<a href="#">Virtual Tours<\/a>/g, '<a href="/help">Virtual Tours</a>'],
    [/<a href="#">Progress Tracker<\/a>/g, '<a href="/buyer/transactions?tab=all">Progress Tracker</a>'],
    [/<a href="#">About Us<\/a>/g, '<a href="/about">About Us</a>'],
    [/<a href="#">Careers<\/a>/g, '<a href="/careers">Careers</a>'],
    [/<a href="#">Contact Us<\/a>/g, '<a href="/contact">Contact Us</a>'],
    [/<a href="#">Blog<\/a>/g, '<a href="/about">Blog</a>'],
    [/<a href="#">Help Center<\/a>/g, '<a href="/help">Help Center</a>'],
    [/<a href="#">Privacy Policy<\/a>/g, '<a href="/privacy">Privacy Policy</a>'],
    [/<a href="#">Terms of Service<\/a>/g, '<a href="/terms">Terms of Service</a>'],
  ];
  for (const [re, to] of foot) out = out.replace(re, to);

  out = out.replace(
    /<a href="#" class="btn-main btn-primary">Browse Properties →<\/a>/g,
    '<a href="/buyer/properties" class="btn-main btn-primary">Browse Properties →</a>',
  );
  out = out.replace(
    /<a href="#" class="btn-main btn-outline">How It Works<\/a>/g,
    '<a href="/help" class="btn-main btn-outline">How It Works</a>',
  );

  return out;
}

function extractFromFile(filename) {
  const full = path.join(finalDir, filename);
  if (!fs.existsSync(full)) {
    console.warn("skip missing", filename);
    return;
  }
  const raw = fs.readFileSync(full, "utf8");
  if (!raw.trim()) {
    console.warn("skip empty", filename);
    return;
  }
  const styleMatch = raw.match(/<style>([\s\S]*?)<\/style>/i);
  const bodyMatch = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!styleMatch || !bodyMatch) {
    console.warn("skip parse fail", filename);
    return;
  }
  const slug = slugify(filename);
  let body = bodyMatch[1].trim();
  body = rewriteFileLinks(body);
  body = applyCebu(body);
  body = fixBuyerTxListActive(body, slug);
  body = patchNav(body, slug);
  body = patchTxCardHrefs(body, slug);

  const marketingSlugs = new Set([
    "01_landing_page",
    "02_about_us",
    "03_careers",
    "04_contact_us",
    "05_help_center",
    "06_privacy_policy",
    "07_terms_of_service",
  ]);
  if (marketingSlugs.has(slug)) {
    body = marketingNavAndFooter(body);
  }

  if (slug.startsWith("08_auth_") || slug.startsWith("09_auth_")) {
    body = body
      .replace(/<a href="#" class="logo-head">/g, '<a href="/" class="logo-head">')
      .replace(/<a href="#" class="logo-link">/g, '<a href="/" class="logo-link">')
      .replace(
        /<span>I agree to Susync's <a href="#">Terms of Service<\/a> and <a href="#">Privacy Policy<\/a><\/span>/g,
        '<span>I agree to Susync\'s <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a></span>',
      );
  }

  if (slug === "04_contact_us") {
    body = body
      .replace(
        /<button style="background: white; color: var\(--accent-500\); border: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; width: 100%;">List Your Property →<\/button>/,
        '<a href="/register" style="background: white; color: var(--accent-500); border: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; width: 100%; display: block; text-align: center; text-decoration: none;">List Your Property →</a>',
      )
      .replace(
        /<a href="#" style="color: var\(--primary-500\);">Privacy Policy<\/a>/,
        '<a href="/privacy" style="color: var(--primary-500);">Privacy Policy</a>',
      )
      .replace(
        /<button type="button" class="btn-submit">Send Message<\/button>/,
        '<button type="submit" class="btn-submit">Send Message</button>',
      );
  }

  if (slug === "10_dashboard_BUYER") {
    body = body.replace(
      /<a href="#">View all deals →<\/a>/,
      '<a href="/buyer/transactions?tab=all">View all deals →</a>',
    );
  }

  const css = scopeCss(styleMatch[1].trim());
  const dir = path.join(outDir, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "style.css"), css);
  fs.writeFileSync(path.join(dir, "body.html"), body);
  console.log("extracted", slug);
}

fs.mkdirSync(outDir, { recursive: true });
const files = fs.readdirSync(finalDir).filter((f) => f.endsWith(".html"));
for (const f of files.sort()) {
  extractFromFile(f);
}
