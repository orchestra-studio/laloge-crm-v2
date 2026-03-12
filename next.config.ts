import type { NextConfig } from "next";
import { config } from "dotenv";

config();

const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost"
      },
      {
        protocol: "https",
        hostname: "bundui-images.netlify.app"
      },
      {
        protocol: "https",
        hostname: "lhimlzvslcvdcdqmaadg.supabase.co"
      }
    ]
  }
};

export default nextConfig;
