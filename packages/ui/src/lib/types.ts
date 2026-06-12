/**
 * @deprecated Dùng `PieceMeta` (apps/docs/lib/catalog/types.ts) — schema catalog
 * canonical từ Story 4.2. Type này sẽ bị xoá khi aggregator live (Story 4.5).
 */
export type LandingTemplate = {
  slug: string;
  name: string;
  description: string;
  tags: string[];
  previewPath: string;
};
