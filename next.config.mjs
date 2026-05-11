/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
  serverExternalPackages: ["better-sqlite3", "sql.js"],
  // Picomatch route keys: use "/*" for all server traces (not "/**").
  outputFileTracingIncludes: {
    "/*": ["./public/sql-wasm.wasm", "./public/susync-demo.sqlite"],
  },
};

export default nextConfig;
