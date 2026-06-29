// Scoped layout cho helix-hero route. Clash Display (Fontshare) được load qua
// <link rel="stylesheet"> + preconnect thay vì @import trong CSS — loại waterfall
// serial (CSS → @import → CSS → woff2). Preconnect warm DNS/TLS cho font files.
// Long-term: self-host woff2 qua next/font/local (cần tải font files về).
import type { ReactNode } from "react";

const CLASH_DISPLAY_CSS = "https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap";

export default function HelixHeroLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
            <link rel="stylesheet" href={CLASH_DISPLAY_CSS} />
            {children}
        </>
    );
}
