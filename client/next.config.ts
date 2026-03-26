import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a self-contained build for Docker — no node_modules in the final image.
  output: "standalone",

  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
