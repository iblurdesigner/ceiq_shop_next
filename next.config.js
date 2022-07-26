const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
];
module.exports = {
  compress: true,
  reactStrictMode: true,
  concurrentFeatures: true,
  images: { domains: ["res.cloudinary.com"] },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};
