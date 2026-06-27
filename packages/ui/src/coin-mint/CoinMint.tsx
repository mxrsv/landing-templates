"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

export interface CoinMintProps {
  /** Màu base của chrome (ám tím để phản chiếu neon thống trị). */
  color?: string;
  /** Màng mỏng iridescence — sinh cầu vồng đổi theo góc nhìn. 0–1. */
  iridescence?: number;
  /** Chrome ↔ glass. ~0.8 = kim loại holographic. */
  metalness?: number;
  /** Độ nhám bề mặt. */
  roughness?: number;
  /** Cường độ bloom (glow neon). 0 = tắt. */
  bloom?: number;
  /** Rim light magenta (hex). */
  rimMagenta?: string;
  /** Rim light cyan (hex). */
  rimCyan?: string;
  /** Tự xoay; tôn trọng `prefers-reduced-motion`. */
  autoRotate?: boolean;
  /** Tốc độ xoay (rad/s). */
  spinSpeed?: number;
  className?: string;
  style?: CSSProperties;
}

/** Profile nửa mặt cắt đồng coin → LatheGeometry (rim bevel). */
function buildCoinBody(): THREE.BufferGeometry {
  const R = 2.45;
  const t2 = 0.26;
  const bev = 0.12;
  const profile = [
    new THREE.Vector2(0, t2),
    new THREE.Vector2(R - bev, t2),
    new THREE.Vector2(R, t2 - bev),
    new THREE.Vector2(R, -t2 + bev),
    new THREE.Vector2(R - bev, -t2),
    new THREE.Vector2(0, -t2),
  ];
  const geo = new THREE.LatheGeometry(profile, 96);
  geo.rotateX(-Math.PI / 2); // mặt coin hướng +Z (về camera)
  return geo;
}

/** Tia chớp ⚡ (outline SVG classic, không tự cắt) — emboss nổi trên mặt. */
function buildBolt(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(0.1, 1.0);
  s.lineTo(-0.79, -0.1);
  s.lineTo(-0.1, -0.1);
  s.lineTo(-0.3, -1.0);
  s.lineTo(0.8, 0.3);
  s.lineTo(0.1, 0.3);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, {
    depth: 0.14,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 2,
    steps: 1,
  });
  g.center();
  g.scale(1.05, 1.05, 1);
  return g;
}

/**
 * $MEME minted coin — focal artifact cho template Memecoin (mood neon).
 * Chrome-holographic: rim bevel + reeded edge + inner ring + ⚡ emboss, rim
 * light magenta/cyan, bloom + chromatic aberration ở mép sinh viền cầu vồng.
 * Mỗi instance một WebGL context riêng; pause khi cuộn khỏi viewport; tôn trọng
 * `prefers-reduced-motion` (freeze thành 1 still). Material sync live qua ref —
 * đổi prop KHÔNG teardown context (trừ khi unmount).
 */
export default function CoinMint({
  color = "#351a4e",
  iridescence = 0.9,
  metalness = 0.82,
  roughness = 0.16,
  bloom = 0.42,
  rimMagenta = "#d946ef",
  rimCyan = "#22d3ee",
  autoRotate = true,
  spinSpeed = 0.5,
  className,
  style,
}: CoinMintProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const bloomRef = useRef<UnrealBloomPass | null>(null);
  const spinRef = useRef(true);
  const spinSpeedRef = useRef(spinSpeed);
  const dirtyRef = useRef(true);
  const prefersReducedRef = useRef(false);
  spinSpeedRef.current = spinSpeed;

  const paramsRef = useRef({
    color,
    iridescence,
    metalness,
    roughness,
    bloom,
    rimMagenta,
    rimCyan,
  });
  paramsRef.current = {
    color,
    iridescence,
    metalness,
    roughness,
    bloom,
    rimMagenta,
    rimCyan,
  };

  // Init một lần — geometry coin cố định, không phụ thuộc prop.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    prefersReducedRef.current =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const p = paramsRef.current;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setClearColor(0x000000, 0); // canvas trong suốt — coin nổi trên nền
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    // KHÔNG set scene.background → trong suốt; coin dissolve thẳng vào surface
    // section + ambient glow xuyên qua (tránh khối canvas lệch màu / che glow).
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0.4, 0.6, 8.4);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    pmrem.dispose();

    const key = new THREE.DirectionalLight(0xffffff, 2.6);
    key.position.set(-4, 6, 6);
    scene.add(key);
    scene.add(new THREE.AmbientLight(0x3a1f55, 0.55));
    const magenta = new THREE.PointLight(new THREE.Color(p.rimMagenta), 38, 42);
    magenta.position.set(5, -1, 3);
    scene.add(magenta);
    const cyan = new THREE.PointLight(new THREE.Color(p.rimCyan), 32, 42);
    cyan.position.set(-5, 2, -2);
    scene.add(cyan);
    // fill màu hắt thẳng lên mặt coin (về camera) → nhuộm neon thay vì xám
    const faceMag = new THREE.PointLight(new THREE.Color(p.rimMagenta), 14, 30);
    faceMag.position.set(2.4, 1.6, 6);
    scene.add(faceMag);
    const faceCyan = new THREE.PointLight(new THREE.Color(p.rimCyan), 12, 30);
    faceCyan.position.set(-2.4, -1.4, 6);
    scene.add(faceCyan);

    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(p.color),
      metalness: p.metalness,
      roughness: p.roughness,
      transmission: 0,
      ior: 1.5,
      iridescence: p.iridescence,
      iridescenceIOR: 1.55,
      iridescenceThicknessRange: [160, 760],
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.55,
    });
    materialRef.current = material;

    const t2 = 0.26;
    const coin = new THREE.Group();
    const bodyGeo = buildCoinBody();
    coin.add(new THREE.Mesh(bodyGeo, material));
    const reedGeo = new THREE.TorusGeometry(2.43, 0.05, 12, 160);
    coin.add(new THREE.Mesh(reedGeo, material));
    const boltGeo = buildBolt();
    const front = new THREE.Mesh(boltGeo, material);
    front.position.z = t2;
    coin.add(front);
    const back = new THREE.Mesh(boltGeo, material);
    back.position.z = -t2;
    back.rotation.y = Math.PI;
    coin.add(back);
    const ringGeo = new THREE.TorusGeometry(1.78, 0.045, 10, 120);
    const ringFront = new THREE.Mesh(ringGeo, material);
    ringFront.position.z = t2 - 0.02;
    coin.add(ringFront);
    const ringBack = new THREE.Mesh(ringGeo, material);
    ringBack.position.z = -(t2 - 0.02);
    coin.add(ringBack);
    const baseRotX = 0.36;
    const baseRotY = -0.3;
    coin.rotation.set(baseRotX, baseRotY, 0.04);
    scene.add(coin);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(1, 1),
      p.bloom,
      0.6,
      0.85,
    );
    bloomRef.current = bloomPass;
    composer.addPass(bloomPass);
    const caPass = new ShaderPass({
      uniforms: { tDiffuse: { value: null }, amount: { value: 0.0026 } },
      vertexShader:
        "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader:
        "uniform sampler2D tDiffuse; uniform float amount; varying vec2 vUv;" +
        "void main(){ vec2 dir = vUv - 0.5; vec2 off = dir * amount * length(dir) * 3.0;" +
        "float r = texture2D(tDiffuse, vUv + off).r; float g = texture2D(tDiffuse, vUv).g;" +
        // giữ alpha (max của 3 mẫu) để canvas trong suốt — KHÔNG ép 1.0 (sẽ thành khối đục)
        "vec4 c = texture2D(tDiffuse, vUv - off); float b = c.b;" +
        "float a = max(texture2D(tDiffuse, vUv + off).a, max(texture2D(tDiffuse, vUv).a, c.a));" +
        "gl_FragColor = vec4(r, g, b, a); }",
    });
    composer.addPass(caPass);
    composer.addPass(new OutputPass());

    const setSize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h, false);
      composer.setSize(w, h);
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
        // Lắc qua lại quanh chính diện (không quay tròn 360° → không bao giờ
        // thành cạnh mỏng, mặt + ⚡ luôn đọc được). Vẫn là "sign of life".
        coin.rotation.y = baseRotY + Math.sin(t * spinSpeedRef.current) * 0.55;
        coin.rotation.x = baseRotX + Math.sin(t * 0.5) * 0.06;
        composer.render();
      } else if (dirtyRef.current) {
        dirtyRef.current = false;
        composer.render();
      }
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      bodyGeo.dispose();
      reedGeo.dispose();
      boltGeo.dispose();
      ringGeo.dispose();
      material.dispose();
      materialRef.current = null;
      bloomRef.current = null;
      envRT.texture.dispose();
      composer.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Sync prop live (không teardown).
  useEffect(() => {
    const m = materialRef.current;
    if (m) {
      m.color.set(color);
      m.iridescence = iridescence;
      m.metalness = metalness;
      m.roughness = roughness;
    }
    if (bloomRef.current) bloomRef.current.strength = bloom;
    spinRef.current = autoRotate && !prefersReducedRef.current;
    dirtyRef.current = true;
  }, [color, iridescence, metalness, roughness, bloom, autoRotate]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: "100%", ...style }}
      aria-hidden
    />
  );
}
