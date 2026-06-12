import type { NextConfig } from "next";

import { catalogTranspilePackages } from "./lib/catalog/transpile-packages";

const nextConfig: NextConfig = {
  // Derived từ piece-registrations.ts — thêm piece mới không cần sửa file này.
  transpilePackages: catalogTranspilePackages,
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
