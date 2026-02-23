import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    domains: ["res.cloudinary.com", "images.unsplash.com", "www.google.com"],
  },
};

export default nextConfig;