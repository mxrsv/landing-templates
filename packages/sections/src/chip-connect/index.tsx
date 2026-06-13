import { ErrorBoundary } from "@landing/ui/lib/error-boundary";

import "./chip-connect.css";

/**
 * Toạ độ đường mạch chip ↔ 6 icon vệ tinh, trong hệ viewBox SVG 2000×670.
 * Một nguồn sự thật DUY NHẤT — render cả `.cc-wire` (mờ, tĩnh) lẫn `.cc-pulse`
 * (xung sáng chạy) từ cùng path → pulse luôn dính đúng dây.
 *
 * Mép chip trong hệ này: L=815 R=1185 T=155 B=515, tâm (1000,335). Mỗi path bắt
 * đầu ĐÚNG tâm icon vệ tinh và kết thúc ĐÚNG mép chip (không hụt, không vượt).
 */
const WIRE_PATHS: readonly string[] = [
  "M162 102 H850 Q919 102 919 155", // s1 → mép trên-trái chip
  "M322 335 H815", // s2 → mép trái chip (giữa)
  "M612 562 H850 Q919 562 919 515", // s3 → mép đáy-trái chip
  "M1838 102 H1150 Q1081 102 1081 155", // s4 → mép trên-phải chip
  "M1678 335 H1185", // s5 → mép phải chip (giữa)
  "M1388 562 H1150 Q1081 562 1081 515", // s6 → mép đáy-phải chip
];

/**
 * Chip Connect — faithful clone của Revo (revo-template.framer.website) hero
 * "integration chip": glass chip phát sáng ở giữa với logo X-cross, tia sáng
 * ngang hai bên, lưới caro mờ dần ra rìa, và 6 icon vệ tinh nối vào chip bằng
 * đường mạch cong. 100% CSS + SVG (0 ảnh raster). Mọi toạ độ theo % trên khung
 * khoá `aspect-ratio` nên responsive — đường nối luôn dính đúng dù co giãn.
 *
 * Static (không hook) → render được như Server Component; `ErrorBoundary` là
 * client boundary bọc nội dung. Self-scopes `data-theme="infra"`.
 */
export function ChipConnect() {
  return (
    <section data-theme="infra" aria-label="Integration chip">
      <ErrorBoundary label="Chip Connect unavailable">
        <div className="cc" aria-hidden>
          <div className="cc-grid" />
          <div className="cc-glow" />

          <svg
            className="cc-wires"
            viewBox="0 0 2000 670"
            preserveAspectRatio="xMidYMid meet"
            focusable="false"
          >
            {/* dây tĩnh (mờ) */}
            {WIRE_PATHS.map((d) => (
              <path key={d} className="cc-wire" d={d} />
            ))}
            {/* xung sáng chạy dọc dây (satellite → chip); pathLength=100 để
                dasharray/offset độc lập độ dài thật, stagger qua animation-delay */}
            <g className="cc-pulses">
              {WIRE_PATHS.map((d) => (
                <path key={d} className="cc-pulse" pathLength={100} d={d} />
              ))}
            </g>
          </svg>

          <div className="cc-chip">
            <span className="cc-corner tl" />
            <span className="cc-corner tr" />
            <span className="cc-corner bl" />
            <span className="cc-corner br" />
            <span className="cc-beam l b2" />
            <span className="cc-beam l" />
            <span className="cc-beam l b3" />
            <span className="cc-beam r b2" />
            <span className="cc-beam r" />
            <span className="cc-beam r b3" />
            <svg
              className="cc-logo"
              viewBox="0 0 48 48"
              fill="none"
              stroke="currentColor"
              strokeWidth={3.4}
              focusable="false"
            >
              <rect
                x="14"
                y="6"
                width="20"
                height="20"
                rx="6"
                transform="rotate(45 24 16)"
              />
              <rect
                x="14"
                y="22"
                width="20"
                height="20"
                rx="6"
                transform="rotate(45 24 32)"
              />
            </svg>
          </div>

          <div className="cc-sat s1">
            <svg viewBox="0 0 24 24" fill="currentColor" focusable="false">
              <path d="M12 2 4 7v10l8 5 8-5V7z" opacity=".5" />
              <path d="M12 8l2 2-2 2-2-2z" />
            </svg>
          </div>
          <div className="cc-sat s2">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              focusable="false"
            >
              <circle cx="12" cy="12" r="8" />
              <path d="M12 12 7 8" />
            </svg>
          </div>
          <div className="cc-sat s3">
            <svg viewBox="0 0 24 24" fill="currentColor" focusable="false">
              <circle cx="9" cy="9" r="4" opacity=".55" />
              <circle cx="15" cy="15" r="4" />
            </svg>
          </div>
          <div className="cc-sat s4">
            <svg viewBox="0 0 24 24" fill="currentColor" focusable="false">
              <path d="M4 18 14 4l2 0L8 18z" opacity=".6" />
              <path d="M10 18 20 4l-2 0L8 18z" />
            </svg>
          </div>
          <div className="cc-sat s5">
            <svg viewBox="0 0 24 24" fill="currentColor" focusable="false">
              <path d="M12 3v6M12 15v6M3 12h6M15 12h6M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" />
              <circle cx="12" cy="12" r="2.5" />
            </svg>
          </div>
          <div className="cc-sat s6">
            <svg viewBox="0 0 24 24" fill="currentColor" focusable="false">
              <rect x="4" y="4" width="7" height="7" rx="2" />
              <rect x="13" y="4" width="7" height="7" rx="2" opacity=".6" />
              <rect x="4" y="13" width="7" height="7" rx="2" opacity=".6" />
              <rect x="13" y="13" width="7" height="7" rx="2" />
            </svg>
          </div>
        </div>
      </ErrorBoundary>
    </section>
  );
}

export default ChipConnect;
