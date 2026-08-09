import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // YouTube thumbnails
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      // GNews images
      {
        protocol: "https",
        hostname: "**.gnews.io",
      },
      // Common news image CDNs used by GNews/Currents articles
      {
        protocol: "https",
        hostname: "**.reuters.com",
      },
      {
        protocol: "https",
        hostname: "**.bbc.co.uk",
      },
      {
        protocol: "https",
        hostname: "**.cnn.com",
      },
      {
        protocol: "https",
        hostname: "**.ndtv.com",
      },
      {
        protocol: "https",
        hostname: "**.hindustantimes.com",
      },
      {
        protocol: "https",
        hostname: "**.indianexpress.com",
      },
      {
        protocol: "https",
        hostname: "**.livemint.com",
      },
      {
        protocol: "https",
        hostname: "**.aljazeera.com",
      },
      {
        protocol: "https",
        hostname: "**.theguardian.com",
      },
      {
        protocol: "https",
        hostname: "**.washingtonpost.com",
      },
      {
        protocol: "https",
        hostname: "**.nytimes.com",
      },
    ],
  },
};

export default nextConfig;