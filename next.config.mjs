/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  experimental: {
    // This line tells Next.js to look for middleware in the src folder
  },
};

export default nextConfig;
