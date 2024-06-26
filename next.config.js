/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  images: { domains: ["gateway.pinata.cloud", "gateway.ipfscdn.io"] },
};

module.exports = nextConfig;
