/**
 * Preview registry — map slug → React component cho live preview.
 *
 * Tách khỏi pieceMeta (pure data, cấm import component): chỉ các page
 * render preview (server components) mới import file này. Khi registration
 * piece mới, Epic D owner thêm entry tương ứng tại đây cùng lúc với
 * aggregator (`lib/catalog/index.ts`).
 */
import type { ComponentType } from "react";

import { TernusTemplate } from "@landing/templates-ternus";

export const previewComponents: Readonly<Record<string, ComponentType>> = {
  ternus: TernusTemplate,
};
