"use client";

import { useEffect, useRef, useState } from "react";

// Kích thước "thiết kế" của viewport ảo bên trong iframe. iframe render ở size này
// rồi scale xuống vừa chiều rộng card → giữ đúng tỉ lệ desktop của landing page.
const DESIGN_WIDTH = 1280;
const DESIGN_HEIGHT = 800;

// Trễ trước khi unmount iframe sau khi card rời viewport (hysteresis theo thời gian).
// Ngăn reload thrash khi user cuộn nhanh ngang qua card. Mount thì tức thì.
const UNMOUNT_DELAY_MS = 1500;

type TemplatePreviewFrameProps = {
  src: string;
  title: string;
};

export function TemplatePreviewFrame({
  src,
  title,
}: TemplatePreviewFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [visible, setVisible] = useState(false);

  // Đo chiều rộng container để tính scale (responsive theo card).
  // Equal-value guard: chỉ setState khi scale đổi đáng kể → tránh re-render thừa.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const next = el.clientWidth / DESIGN_WIDTH;
      setScale((prev) => (Math.abs(prev - next) < 0.001 ? prev : next));
    };
    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Mount iframe khi card vào viewport, unmount khi rời đi → giải phóng WebGL context
  // thay vì giữ vĩnh viễn. Unmount có trễ (hysteresis) để cuộn nhanh không reload thrash.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let unmountTimer: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          clearTimeout(unmountTimer);
          setVisible(true);
        } else {
          unmountTimer = setTimeout(() => setVisible(false), UNMOUNT_DELAY_MS);
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => {
      clearTimeout(unmountTimer);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
      style={{ aspectRatio: `${DESIGN_WIDTH} / ${DESIGN_HEIGHT}` }}
    >
      {visible && scale > 0 ? (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          tabIndex={-1}
          aria-hidden="true"
          className="absolute top-0 left-0 origin-top-left border-0"
          style={{
            width: DESIGN_WIDTH,
            height: DESIGN_HEIGHT,
            transform: `scale(${scale})`,
            pointerEvents: "none",
          }}
        />
      ) : null}
    </div>
  );
}
