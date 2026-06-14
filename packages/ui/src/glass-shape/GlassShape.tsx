"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import type { GlassShapeVariant } from "./shapes";

export interface GlassShapeProps {
  shape: GlassShapeVariant;
  /** Màu base của thuỷ tinh (electric/klein blue mặc định). */
  color?: string;
  /** Tán sắc cầu vồng (prism). 0 = tắt, ~1.1 mặc định. */
  dispersion?: number;
  /** Màng mỏng iridescence (đổi màu theo góc nhìn). 0–1. */
  iridescence?: number;
  /** Chrome ↔ glass. 0 = thuỷ tinh trong, 1 = kim loại bóng. */
  metalness?: number;
  /** Độ nhám bề mặt — cao thì mờ đục. */
  roughness?: number;
  /** Độ trong suốt khúc xạ. 0 = đục, 1 = trong. */
  transmission?: number;
  /** Tự xoay; tôn trọng `prefers-reduced-motion` (tắt khi user yêu cầu giảm chuyển động). */
  autoRotate?: boolean;
  className?: string;
  style?: CSSProperties;
}

const TARGET_RADIUS = 1.28;

/**
 * Dựng geometry theo variant, đã recenter. Diamond/crystal merge từ nhiều
 * cylinder; còn lại dùng polyhedra built-in. Kích thước normalize ở caller.
 */
function buildGeometry(shape: GlassShapeVariant): THREE.BufferGeometry {
  switch (shape) {
    case "octahedron":
      return new THREE.OctahedronGeometry(1.15);
    case "icosahedron":
      return new THREE.IcosahedronGeometry(1.1, 0);
    case "dodecahedron":
      return new THREE.DodecahedronGeometry(1.05);
    case "cube":
      return new RoundedBoxGeometry(1.7, 1.7, 1.7, 6, 0.13);
    case "torus":
      return new THREE.TorusGeometry(0.82, 0.33, 40, 96);
    case "prism":
      // Lăng kính tam giác: cylinder 3 cạnh, đứng theo trục Y.
      return new THREE.CylinderGeometry(1.0, 1.0, 1.7, 3, 1);
    case "diamond": {
      const crown = new THREE.CylinderGeometry(0.5, 1.05, 0.42, 8, 1);
      crown.translate(0, 0.21, 0);
      const pavilion = new THREE.CylinderGeometry(1.05, 0.0, 1.15, 8, 1);
      pavilion.translate(0, -0.575, 0);
      const merged = mergeGeometries([crown, pavilion], false);
      crown.dispose();
      pavilion.dispose();
      if (!merged) return new THREE.OctahedronGeometry(1.15);
      merged.center();
      return merged;
    }
    case "crystal": {
      const body = new THREE.CylinderGeometry(0.6, 0.6, 1.5, 6, 1);
      const topCap = new THREE.CylinderGeometry(0.0, 0.6, 0.72, 6, 1);
      topCap.translate(0, 1.11, 0);
      const bottomCap = new THREE.CylinderGeometry(0.6, 0.0, 0.52, 6, 1);
      bottomCap.translate(0, -1.01, 0);
      const merged = mergeGeometries([body, topCap, bottomCap], false);
      body.dispose();
      topCap.dispose();
      bottomCap.dispose();
      if (!merged) return new THREE.IcosahedronGeometry(1.1, 0);
      merged.center();
      return merged;
    }
    default:
      return new THREE.IcosahedronGeometry(1.1, 0);
  }
}

/** Nền sáng lavender → trắng để thuỷ tinh khúc xạ xuyên qua (giống product shot). */
function makeGradientTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(128, 96, 24, 128, 128, 220);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.6, "#eef0fb");
    g.addColorStop(1, "#dbe0f4");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Một khối thuỷ tinh holographic (transmission + dispersion + iridescence),
 * mỗi instance là một WebGL context riêng. Tự pause khi cuộn khỏi viewport.
 *
 * Init/teardown chỉ chạy lại khi đổi `shape` (geometry). Các thông số material
 * (color, dispersion, …) đồng bộ live qua ref — KHÔNG rebuild context, nên kéo
 * slider mượt. Các feature (transmission/dispersion/iridescence) khởi tạo > 0
 * để shader define bật sẵn → chỉ cập nhật uniform runtime, không recompile.
 */
export default function GlassShape({
  shape,
  color = "#3b4dff",
  dispersion = 1.1,
  iridescence = 0.45,
  metalness = 0,
  roughness = 0.05,
  transmission = 1,
  autoRotate = true,
  className,
  style,
}: GlassShapeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const spinRef = useRef(true);
  const dirtyRef = useRef(true);
  const prefersReducedRef = useRef(false);
  // Snapshot params hiện tại để init effect (deps [shape]) dựng material đúng
  // giá trị slider mà không cần đưa từng param vào deps.
  const paramsRef = useRef({
    color,
    dispersion,
    iridescence,
    metalness,
    roughness,
    transmission,
  });
  paramsRef.current = {
    color,
    dispersion,
    iridescence,
    metalness,
    roughness,
    transmission,
  };

  // Init / rebuild — chỉ khi đổi geometry (shape).
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    prefersReducedRef.current =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const bgTex = makeGradientTexture();
    scene.background = bgTex;

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    pmrem.dispose();

    const key = new THREE.DirectionalLight(0xffffff, 2.6);
    key.position.set(-3, 5, 4);
    scene.add(key);
    scene.add(new THREE.AmbientLight(0xb9c4ff, 0.5));
    const magenta = new THREE.PointLight(0xff4fb0, 9, 30);
    magenta.position.set(4, -2, 2);
    scene.add(magenta);
    const cyan = new THREE.PointLight(0x3fd8ff, 8, 30);
    cyan.position.set(-4, -1, -2);
    scene.add(cyan);

    const geometry = buildGeometry(shape);
    geometry.computeBoundingSphere();
    const radius = geometry.boundingSphere?.radius ?? 1;
    const fit = TARGET_RADIUS / radius;
    geometry.scale(fit, fit, fit);

    const p = paramsRef.current;
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(p.color),
      metalness: p.metalness,
      roughness: p.roughness,
      transmission: p.transmission,
      ior: 1.55,
      thickness: 1.6,
      dispersion: p.dispersion,
      attenuationColor: new THREE.Color(0x2a3aff),
      attenuationDistance: 2.4,
      iridescence: p.iridescence,
      iridescenceIOR: 1.4,
      iridescenceThicknessRange: [100, 680],
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.45,
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.set(0.32, 0.5, 0);
    scene.add(mesh);

    const setSize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      dirtyRef.current = true;
    };
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(container);

    let visible = true;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        visible = entry.isIntersecting;
        if (visible) dirtyRef.current = true;
      },
      { threshold: 0.01 },
    );
    io.observe(container);

    const timer = new THREE.Timer();
    dirtyRef.current = true;
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!visible) return;
      if (spinRef.current) {
        timer.update();
        const t = timer.getElapsed();
        mesh.rotation.y = t * 0.5;
        mesh.rotation.x = 0.32 + Math.sin(t * 0.4) * 0.12;
        renderer.render(scene, camera);
      } else if (dirtyRef.current) {
        // Tĩnh (reduced-motion / autoRotate=false): render lại khi có thay đổi.
        dirtyRef.current = false;
        renderer.render(scene, camera);
      }
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      geometry.dispose();
      material.dispose();
      materialRef.current = null;
      bgTex.dispose();
      envRT.texture.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [shape]);

  // Sync material live (không teardown) + toggle xoay. Feature define đã bật
  // sẵn lúc init nên đây chỉ gán uniform → không recompile shader.
  useEffect(() => {
    const m = materialRef.current;
    if (m) {
      m.color.set(color);
      m.dispersion = dispersion;
      m.iridescence = iridescence;
      m.metalness = metalness;
      m.roughness = roughness;
      m.transmission = transmission;
    }
    spinRef.current = autoRotate && !prefersReducedRef.current;
    dirtyRef.current = true;
  }, [
    color,
    dispersion,
    iridescence,
    metalness,
    roughness,
    transmission,
    autoRotate,
  ]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: "100%", ...style }}
      aria-hidden
    />
  );
}
