/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
};

const withPWA = async () => {
  const { default: pwa } = await import("next-pwa");
  return pwa({
    dest: "public",
    disable: process.env.NODE_ENV === "development",
    register: true,
    skipWaiting: true,
  });
};

export default async () => {
  const pwaConfig = await withPWA();
  return pwaConfig(nextConfig);
};
