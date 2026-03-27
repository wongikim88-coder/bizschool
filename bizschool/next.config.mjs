/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5gb",
    },
  },
  async redirects() {
    return [
      {
        source: "/directions",
        destination: "/venue#directions",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
