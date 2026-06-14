/**
 * Glass-shape catalog (pure data — KHÔNG import three).
 *
 * Tách riêng để consumer (vd trang reference /ui/shapes) import danh sách
 * server-side mà không kéo theo three vào bundle. Component nặng (`GlassShape`)
 * import dynamic riêng.
 */

/** Các hình khối glass dispersion dựng sẵn. */
export type GlassShapeVariant =
  | "diamond"
  | "crystal"
  | "octahedron"
  | "icosahedron"
  | "dodecahedron"
  | "cube"
  | "prism"
  | "torus";

export interface GlassShapeInfo {
  variant: GlassShapeVariant;
  label: string;
  /** Mô tả ngắn dáng hình + cách dựng geometry. */
  blurb: string;
}

/** Thứ tự hiển thị trong gallery tham khảo. */
export const GLASS_SHAPES: readonly GlassShapeInfo[] = [
  {
    variant: "diamond",
    label: "Diamond",
    blurb: "Brilliant cut — crown + pavilion 8 mặt",
  },
  {
    variant: "crystal",
    label: "Crystal",
    blurb: "Tinh thể lục giác lưỡng tháp (quartz)",
  },
  {
    variant: "octahedron",
    label: "Octahedron",
    blurb: "Đá quý 8 mặt tam giác",
  },
  {
    variant: "icosahedron",
    label: "Icosahedron",
    blurb: "Khối 20 mặt tam giác",
  },
  {
    variant: "dodecahedron",
    label: "Dodecahedron",
    blurb: "Khối 12 mặt ngũ giác",
  },
  { variant: "cube", label: "Cube", blurb: "Lập phương bo cạnh (rounded)" },
  { variant: "prism", label: "Prism", blurb: "Lăng kính tam giác đứng" },
  { variant: "torus", label: "Torus", blurb: "Vòng nhẫn tròn" },
];
