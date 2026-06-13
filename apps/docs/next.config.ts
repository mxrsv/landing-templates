import type { NextConfig } from "next";

import { catalogTranspilePackages } from "./lib/catalog/transpile-packages";

const nextConfig: NextConfig = {
  // Derived từ piece-registrations.ts — thêm piece mới không cần sửa file này.
  // `@landing/templates-aikit` là spike chưa đăng ký catalog → append thủ công.
  transpilePackages: [...catalogTranspilePackages, "@landing/templates-aikit"],
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
