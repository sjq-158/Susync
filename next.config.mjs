/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
  serverExternalPackages: ["better-sqlite3", "sql.js"],
  outputFileTracingIncludes: {
    "/**": ["./public/sql-wasm.wasm", "./public/susync-demo.sqlite"],
  },
};

export default nextConfig;
