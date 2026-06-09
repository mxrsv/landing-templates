import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Explicit list — Next 16 KHÔNG hỗ trợ glob trong transpilePackages.
  // Mỗi package workspace mới phải được append vào list này (registration task).
  // Lưu ý: "@landing/design-tokens" được pre-register theo contract Epic 1 nhưng
  // package CHƯA tồn tại — sẽ được tạo ở Epic 2 story 2-1-base-token-package.
  // Build chỉ vỡ nếu có code import nó trước khi package được tạo.
  transpilePackages: [
    "@landing/ui",
    "@landing/design-tokens",
    "@landing/templates-ternus",
    "@landing/sections",
    "@landing/templates-memecoin",
    "@landing/templates-gamefi",
    "@landing/templates-nft",
  ],
  // Legacy route redirect: /ternus → /templates/ternus (308 permanent).
  // Query string tự pass-through; hash do browser tự giữ (client-side).
  async redirects() {
    return [
      {
        source: "/ternus",
        destination: "/templates/ternus",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
