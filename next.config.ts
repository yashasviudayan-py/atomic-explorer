import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow phones/other devices on the local network to load Next.js dev
  // resources (`/_next/*`). Without this, `next dev` blocks cross-origin
  // requests from the LAN IP, which silently stops client-only dynamic imports
  // (e.g. the 3D atom viewer) from loading on a phone. Dev-only; ignored in
  // production builds.
  allowedDevOrigins: [
    "192.168.0.122",
    "192.168.*.*",
    "10.*.*.*",
    "172.16.*.*",
  ],
};

export default nextConfig;
