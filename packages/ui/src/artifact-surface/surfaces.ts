/**
 * Artifact-surface catalog (pure data — KHÔNG import three).
 *
 * Kho bề mặt 3D tham khảo cho viên "flow knot" (TorusKnot) — sinh ra từ
 * brainstorm Waitlist template. Tách data riêng để consumer (trang reference
 * /ui/surfaces) import server-side mà không kéo three vào bundle eager;
 * component nặng (`ArtifactSurface`) import dynamic riêng.
 *
 * Nguồn recipe: docs/ideas/reference/3d-artifact-surfaces.md
 * Đây là REFERENCE (không phải catalog piece) → không đụng manifest budget.
 */

/** Các loại bề mặt 3D đã thử nghiệm (Plasma Core bị loại có chủ đích). */
export type ArtifactSurfaceVariant =
  | "wireframe-flow"
  | "frosted"
  | "frostwire"
  | "holographic"
  | "chrome"
  | "glass";

export interface ArtifactSurfaceInfo {
  variant: ArtifactSurfaceVariant;
  label: string;
  /** Mô tả ngắn cách xử lý ánh sáng + khi nào dùng. */
  blurb: string;
  /** Đánh dấu bề mặt đã chọn cho trang Waitlist (Aenor). */
  chosen?: boolean;
}

/** Thứ tự hiển thị trong gallery tham khảo (bản đã chọn lên đầu). */
export const ARTIFACT_SURFACES: readonly ArtifactSurfaceInfo[] = [
  {
    variant: "wireframe-flow",
    label: "Wireframe Flow",
    blurb: "Lưới dây emerald phát sáng quanh lõi tối — unlit, không ăn màu nền",
    chosen: true,
  },
  {
    variant: "frosted",
    label: "Frosted satin",
    blurb: "Kính mờ sương mịn, bán trong — khuếch tán ánh sáng (roughness cao)",
  },
  {
    variant: "frostwire",
    label: "Frost + Wire",
    blurb:
      "Vỏ kính mờ + lưới wireframe additive bên trong — mềm mà có cấu trúc",
  },
  {
    variant: "holographic",
    label: "Holographic",
    blurb: "Màng dầu loang đổi màu cầu vồng theo góc nhìn (iridescence cao)",
  },
  {
    variant: "chrome",
    label: "Liquid Chrome",
    blurb: "Kim loại gương lỏng, ám sắc mint, phản chiếu môi trường",
  },
  {
    variant: "glass",
    label: "Glass crystal",
    blurb: "Pha lê trong khúc xạ backdrop đa sắc (bản gốc, dễ thành khối đặc)",
  },
];
