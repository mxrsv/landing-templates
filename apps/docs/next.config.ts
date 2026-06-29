import type { NextConfig } from "next";

import { catalogTranspilePackages } from "./lib/catalog/transpile-packages";

const nextConfig: NextConfig = {
  // Derived từ piece-registrations.ts — thêm piece mới không cần sửa file này.
  // `@landing/templates-aikit` đã GỠ khỏi catalog (Phase 2 B1) nhưng giữ source làm
  // harvest + route /aikit-preview → vẫn append thủ công để transpile.
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
