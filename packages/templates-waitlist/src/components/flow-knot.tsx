"use client";

import { ErrorBoundary } from "@landing/ui/lib/error-boundary";
import { useEffect, useRef, useState } from "react";

/**
 * flow-knot — the page-wide 3D artifact (spec §6, "Wireframe Flow / Ion").
 *
 * A fixed, full-bleed `#scene` sitting behind every section (z-index 0,
 * pointer-events: none). It renders an unlit TorusKnot as three meshes
 * (fill / wireframe / additive glow) over a Canvas2D Ion backdrop, and the
 * whole-page scroll progress drives the knot's rotation / position / scale.
 *
 * Three independent fallbacks keep it from ever breaking the page:
 *  - `prefers-reduced-motion` → no WebGL at all, just the static `.fknot` blob.
 *  - no WebGL support → static `.fknot` blob (probed before importing three).
 *  - a render-time crash → ErrorBoundary swaps in the same `.fknot` blob.
 *
 * Colors here use literal hex (INVARIANT I-4 carve-out: WebGL + Canvas2D only).
 */

interface FlowKnotProps {
  /** `prefers-reduced-motion`, from the template's single hook call. */
  reduced: boolean;
  /** Whole-page scroll progress 0..1, from the template's useScrollProgress. */
  progress: number;
}

/** Static Ion blob — the one fallback shared by every degraded path. */
function KnotFallback() {
  return <div id="scene" className="fknot" aria-hidden />;
}

/** Synchronous WebGL capability probe — runs before three is ever imported. */
function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    // Release the throwaway probe context at once — browsers cap live contexts.
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function FlowKnot({ reduced, progress }: FlowKnotProps) {
  // Reduced-motion never mounts WebGL — the static blob is the whole artifact.
  if (reduced) return <KnotFallback />;

  return (
    <ErrorBoundary fallback={<KnotFallback />}>
      <FlowKnotCanvas progress={progress} />
    </ErrorBoundary>
  );
}

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/**
 * Build the Ion backdrop as a Canvas2D radial-pool texture (cyan / violet /
 * pop on near-black). Lets the wireframe read against a soft glow rather than
 * a flat void. Returns null if Canvas2D is unavailable.
 */
function makeBackdrop(
  THREE: typeof import("three"),
): import("three").CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const ctx = c.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#0a0b16";
    ctx.fillRect(0, 0, 512, 512);
    const pools: ReadonlyArray<readonly [number, number, number, string]> = [
      [170, 150, 300, "rgba(95,214,255,.34)"], // --wl-cy
      [380, 250, 240, "rgba(111,139,255,.28)"], // --wl-vi
      [260, 400, 220, "rgba(181,139,255,.22)"], // --wl-pop
    ];
    for (const [x, y, r, color] of pools) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color);
      g.addColorStop(1, "rgba(10,11,22,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 512, 512);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * WebGL flow-knot. The three.js setup lives inside one effect; the rAF loop
 * reads the latest scroll progress off a ref (so the closure never goes stale)
 * and lerps toward it for buttery motion. Pauses rendering once it has settled
 * and nothing is moving, to avoid burning GPU on an idle background.
 */
function FlowKnotCanvas({ progress }: { progress: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(progress);
  const [failed, setFailed] = useState(false);

  // Keep the loop's progress source fresh without re-running the heavy effect.
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!hasWebGL()) {
      setFailed(true);
      return;
    }

    let disposed = false;
    let cleanup = () => {};

    import("three")
      .then((THREE) => {
        if (disposed || !containerRef.current) return;
        cleanup = initScene(THREE, containerRef.current, progressRef);
      })
      .catch(() => {
        if (!disposed) setFailed(true);
      });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  if (failed) return <KnotFallback />;
  return <div id="scene" ref={containerRef} aria-hidden />;
}

/**
 * Imperative three.js scene. Returns a cleanup that disposes every GPU
 * resource and force-loses the context (no leak on navigate-away).
 */
function initScene(
  THREE: typeof import("three"),
  container: HTMLDivElement,
  progressRef: { current: number },
): () => void {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.display = "block";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const backdrop = makeBackdrop(THREE);
  scene.background = backdrop;

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 4.6);

  // One geometry, three unlit materials — no lights/env needed.
  const geometry = new THREE.TorusKnotGeometry(1.0, 0.33, 240, 36);
  const fillMat = new THREE.MeshBasicMaterial({ color: 0x05010a });
  const fill = new THREE.Mesh(geometry, fillMat);
  fill.scale.setScalar(0.985);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x66f3ff,
    wireframe: true,
    transparent: true,
    opacity: 0.9,
  });
  const wire = new THREE.Mesh(geometry, wireMat);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x33d6ff,
    wireframe: true,
    transparent: true,
    opacity: 0.28,
    blending: THREE.AdditiveBlending,
  });
  const glow = new THREE.Mesh(geometry, glowMat);
  glow.scale.setScalar(1.02);

  const group = new THREE.Group();
  group.add(fill, wire, glow);
  group.rotation.set(0.2, 0, 0);
  scene.add(group);

  // Forces a draw on the first frame and after every resize (drawing-buffer +
  // camera aspect just changed), even when the knot has otherwise settled.
  let needsRender = true;
  const setSize = () => {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    needsRender = true;
  };
  setSize();
  const ro = new ResizeObserver(setSize);
  ro.observe(container);

  // Smoothed state: lerp the live values toward the scroll-derived targets.
  let curRot = 0.2;
  let curPosY = 0;
  let curScale = 0.9;
  let raf = 0;

  const animate = () => {
    raf = requestAnimationFrame(animate);
    const p = progressRef.current;
    // Scroll drives a full turn, a gentle vertical drift, and a slight grow.
    const targetRotY = p * Math.PI * 2;
    const targetPosY = (0.5 - p) * 1.6;
    const targetScale = 0.9 + p * 0.35;

    curRot = lerp(curRot, targetRotY, 0.08);
    curPosY = lerp(curPosY, targetPosY, 0.08);
    curScale = lerp(curScale, targetScale, 0.08);

    const settled =
      Math.abs(curRot - targetRotY) < 1e-4 &&
      Math.abs(curPosY - targetPosY) < 1e-4 &&
      Math.abs(curScale - targetScale) < 1e-4;
    // Skip the draw once motion has settled AND nothing forced a redraw —
    // saves GPU on an idle background, but still repaints after a resize.
    if (settled && !needsRender) return;

    group.rotation.y = curRot;
    group.rotation.x = 0.2 + p * 0.5;
    group.position.y = curPosY;
    group.scale.setScalar(curScale);
    renderer.render(scene, camera);
    needsRender = false;
  };
  raf = requestAnimationFrame(animate);

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    geometry.dispose();
    fillMat.dispose();
    wireMat.dispose();
    glowMat.dispose();
    backdrop.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    if (renderer.domElement.parentElement === container) {
      container.removeChild(renderer.domElement);
    }
  };
}
