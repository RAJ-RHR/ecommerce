/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)', // Apply to all routes
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://herbolife.in', // Allow embedding in herbolife.in
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors https://herbolife.in;", // CSP support
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
