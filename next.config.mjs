/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/signup',
        destination: 'https://travelwise-server.onrender.com/signup',
      },
    ];
  },
};

export default nextConfig;
