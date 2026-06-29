"use client";

import dynamic from "next/dynamic";

// Defer ShardsFocal (và toàn bộ three.js ~600KB) ra sau hydration qua ssr:false.
// CSS gem fallback (.hx-focal__gem) đã cover trạng thái pre-mount.
const ShardsFocal = dynamic(() => import("./shards-focal").then((m) => m.ShardsFocal), {
    ssr: false,
    loading: () => <div className="hx-focal__canvas" aria-hidden="true" />,
});

export { ShardsFocal };
