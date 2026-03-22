/** @type {import('next').NextConfig} */
const nextConfig = {
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
