const nextConfig = {
  images: {
    // Let Vercel/Next.js optimize images (resize, webp conversion, caching)
    // This dramatically improves load time on mobile devices
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
