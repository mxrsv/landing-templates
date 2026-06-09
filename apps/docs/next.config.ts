import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Explicit list — Next 16 KHÔNG hỗ trợ glob trong transpilePackages.
  // Mỗi package workspace mới phải được append vào list này (registration task).
  // design-tokens / templates-ternus được khai báo trước (contract Epic 1);
  // package thật xuất hiện ở Story 1.3b/1.4.
  transpilePackages: [
    "@landing/ui",
    "@landing/design-tokens",
    "@landing/templates-ternus",
  ],
};

export default nextConfig;
