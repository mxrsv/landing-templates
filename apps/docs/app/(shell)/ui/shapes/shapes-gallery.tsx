import { GLASS_SHAPES } from "@landing/ui/glass-shape/shapes";

import { ShapeCard } from "./shape-card";

/**
 * Grid các khối thuỷ tinh, mỗi khối có panel slider riêng (ShapeCard giữ state).
 * Server component: chỉ map data thuần; WebGL nằm trong ShapeCard (client).
 */
export function ShapesGallery() {
  return (
    <div className="grid gap-[var(--space-4)] sm:grid-cols-2 xl:grid-cols-3">
      {GLASS_SHAPES.map((shape) => (
        <ShapeCard key={shape.variant} shape={shape} />
      ))}
    </div>
  );
}
