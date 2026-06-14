/**
 * Thông số material điều chỉnh được của một khối thuỷ tinh (UI lab).
 * Pure data — không phụ thuộc React/three, dùng chung cho card + controls.
 */
export interface GlassParams {
  color: string;
  dispersion: number;
  iridescence: number;
  metalness: number;
  roughness: number;
  transmission: number;
}

/** Mặc định khớp giá trị khởi tạo trong `GlassShape`. */
export const DEFAULT_GLASS_PARAMS: GlassParams = {
  color: "#3b4dff",
  dispersion: 1.1,
  iridescence: 0.45,
  metalness: 0,
  roughness: 0.05,
  transmission: 1,
};

export interface GlassSliderConfig {
  key: Exclude<keyof GlassParams, "color">;
  label: string;
  min: number;
  max: number;
  step: number;
}

/** Cấu hình các slider số (color tách riêng vì là input màu). */
export const GLASS_SLIDERS: readonly GlassSliderConfig[] = [
  { key: "dispersion", label: "Dispersion", min: 0, max: 3, step: 0.05 },
  { key: "iridescence", label: "Iridescence", min: 0, max: 1, step: 0.01 },
  { key: "metalness", label: "Metalness", min: 0, max: 1, step: 0.01 },
  { key: "roughness", label: "Roughness", min: 0, max: 0.6, step: 0.01 },
  { key: "transmission", label: "Transmission", min: 0, max: 1, step: 0.01 },
];
