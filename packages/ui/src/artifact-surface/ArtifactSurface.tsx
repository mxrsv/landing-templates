"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

import type { ArtifactSurfaceVariant } from "./surfaces";

export interface ArtifactSurfaceProps {
  surface: ArtifactSurfaceVariant;
  /** Tự xoay; tôn trọng `prefers-reduced-motion` (tắt khi user yêu cầu giảm chuyển động). */
  autoRotate?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** Hình khối chuẩn — flow knot (TorusKnot). Dùng chung cho mọi bề mặt. */
function makeKnotGeometry(): THREE.TorusKnotGeometry {
  return new THREE.TorusKnotGeometry(1.0, 0.33, 240, 36);
}

/**
 * Dựng (các) mesh theo từng bề mặt — chỉ khác VẬT LIỆU gắn vào cùng một
 * geometry. Trả về group đã add mesh + danh sách material để dispose.
 * Recipe: docs/ideas/reference/3d-artifact-surfaces.md
 */
function buildSurface(
  surface: ArtifactSurfaceVariant,
  geo: THREE.BufferGeometry,
): { object: THREE.Group; materials: THREE.Material[] } {
  const group = new THREE.Group();
  const materials: THREE.Material[] = [];

  switch (surface) {
    case "wireframe-flow": {
      // Unlit — không phụ thuộc đèn/môi trường → không bao giờ ăn màu nền.
      const fillMat = new THREE.MeshBasicMaterial({ color: 0x021712 });
      const fill = new THREE.Mesh(geo, fillMat);
      fill.scale.setScalar(0.985); // hơi nhỏ để lưới nằm sát bề mặt
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0x5dffce,
        wireframe: true,
        transparent: true,
        opacity: 0.9,
      });
      group.add(fill, new THREE.Mesh(geo, wireMat));
      materials.push(fillMat, wireMat);
      break;
    }
    case "frosted": {
      const mat = new THREE.MeshPhysicalMaterial({
        transmission: 1,
        thickness: 1.6,
        roughness: 0.5,
        ior: 1.4,
        color: 0xeafff6,
        attenuationColor: new THREE.Color(0x9ff0d6),
        attenuationDistance: 3,
        clearcoat: 0.4,
        clearcoatRoughness: 0.5,
        envMapIntensity: 1.1,
      });
      group.add(new THREE.Mesh(geo, mat));
      materials.push(mat);
      break;
    }
    case "frostwire": {
      const shellMat = new THREE.MeshPhysicalMaterial({
        transmission: 1,
        thickness: 1.4,
        roughness: 0.42,
        ior: 1.4,
        color: 0xeafff6,
        attenuationColor: new THREE.Color(0x9ff0d6),
        attenuationDistance: 3.2,
        clearcoat: 0.5,
        clearcoatRoughness: 0.4,
        envMapIntensity: 1.15,
      });
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0x6effd6,
        wireframe: true,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
      });
      const wire = new THREE.Mesh(geo, wireMat);
      wire.scale.setScalar(1.004); // lưới nằm ngay ngoài vỏ
      group.add(new THREE.Mesh(geo, shellMat), wire);
      materials.push(shellMat, wireMat);
      break;
    }
    case "holographic": {
      const mat = new THREE.MeshPhysicalMaterial({
        metalness: 0.45,
        roughness: 0.22,
        color: 0x07201b,
        clearcoat: 1,
        clearcoatRoughness: 0.14,
        iridescence: 1,
        iridescenceIOR: 2.1,
        iridescenceThicknessRange: [100, 900],
        envMapIntensity: 2.3,
        sheen: 1,
        sheenColor: new THREE.Color(0x88ffe0),
      });
      group.add(new THREE.Mesh(geo, mat));
      materials.push(mat);
      break;
    }
    case "chrome": {
      const mat = new THREE.MeshStandardMaterial({
        metalness: 1,
        roughness: 0.05,
        color: 0xc7f3e2,
        envMapIntensity: 2.1,
      });
      group.add(new THREE.Mesh(geo, mat));
      materials.push(mat);
      break;
    }
    case "glass":
    default: {
      const mat = new THREE.MeshPhysicalMaterial({
        transmission: 1,
        thickness: 0.9,
        roughness: 0.03,
        ior: 1.55,
        color: 0xffffff,
        attenuationColor: new THREE.Color(0xaef5dc),
        attenuationDistance: 6,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        iridescence: 1,
        iridescenceIOR: 1.5,
        iridescenceThicknessRange: [120, 520],
        envMapIntensity: 1.9,
      });
      group.add(new THREE.Mesh(geo, mat));
      materials.push(mat);
      break;
    }
  }

  return { object: group, materials };
}

/**
 * Backdrop đa sắc (5 vũng radial — mint/aqua/emerald/gold/tím) trên nền tối.
 * Quan trọng cho glass/frosted để khúc xạ đọc được; ambient nhẹ cho phần còn lại.
 */
function makeBackdropTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const ctx = c.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#05140f";
    ctx.fillRect(0, 0, 512, 512);
    const pools: ReadonlyArray<readonly [number, number, number, string]> = [
      [150, 170, 300, "rgba(150,255,228,.9)"],
      [385, 250, 230, "rgba(46,196,210,.55)"],
      [300, 360, 240, "rgba(11,185,138,.5)"],
      [240, 470, 210, "rgba(255,207,107,.5)"],
      [440, 430, 150, "rgba(150,120,255,.28)"],
    ];
    for (const [x, y, r, color] of pools) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color);
      g.addColorStop(1, "rgba(5,20,15,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 512, 512);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Một viên flow knot (TorusKnot) render theo một bề mặt cho trước — mỗi instance
 * là một WebGL context riêng. Tự pause khi cuộn khỏi viewport, render 1 frame
 * tĩnh khi `prefers-reduced-motion`.
 */
export default function ArtifactSurface({
  surface,
  autoRotate = true,
  className,
  style,
}: ArtifactSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const spin = autoRotate && !prefersReduced;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const bgTex = makeBackdropTexture();
    scene.background = bgTex;

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 4.6);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    pmrem.dispose();

    // Đèn rim màu — cần cho bề mặt phản chiếu (chrome/holo/glass); vô hại với unlit.
    const key = new THREE.DirectionalLight(0xeafff6, 2.8);
    key.position.set(4, 5, 6);
    scene.add(key);
    const rimGold = new THREE.DirectionalLight(0xffcf6b, 1.3);
    rimGold.position.set(-5, -3, -4);
    scene.add(rimGold);
    const rimAqua = new THREE.DirectionalLight(0x49e0d8, 1.1);
    rimAqua.position.set(5, -4, -3);
    scene.add(rimAqua);
    scene.add(new THREE.AmbientLight(0x183f3a, 0.4));

    const geometry = makeKnotGeometry();
    const { object: knot, materials } = buildSurface(surface, geometry);
    knot.rotation.set(0.2, 0, 0);
    scene.add(knot);

    const setSize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(container);

    let visible = true;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) visible = entry.isIntersecting;
      },
      { threshold: 0.01 },
    );
    io.observe(container);

    const timer = new THREE.Timer();
    let raf = 0;
    let lastRender = -1;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!visible) return;
      if (spin) {
        timer.update();
        const t = timer.getElapsed();
        knot.rotation.y = t * 0.4;
        knot.rotation.x = 0.2 + Math.sin(t * 0.35) * 0.12;
        renderer.render(scene, camera);
      } else if (lastRender < 0) {
        // Reduced-motion / autoRotate=false: render một frame tĩnh.
        renderer.render(scene, camera);
        lastRender = 1;
      }
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      geometry.dispose();
      materials.forEach((m) => m.dispose());
      bgTex.dispose();
      envRT.texture.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [surface, autoRotate]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: "100%", ...style }}
      aria-hidden
    />
  );
}
