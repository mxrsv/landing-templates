// PROTOTYPE — Focal track. Helix hero focal = SHARDS (cụm tinh thể iridescent bay).
// Signature: nhiều mảnh = một dòng vốn bảo chứng nhiều mạng. WebGL/three.js —
// KHÔNG render headless, user verify LIVE trong Chrome. Fallback = CSS gem khi
// WebGL fail / reduced-motion. Cleanup đầy đủ.
"use client";

import { useEffect, useRef, useState } from "react";
import {
    ACESFilmicToneMapping,
    AmbientLight,
    Group,
    Mesh,
    MeshPhysicalMaterial,
    OctahedronGeometry,
    PerspectiveCamera,
    PMREMGenerator,
    PointLight,
    Scene,
    WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// [x, y, z, scale] — 1 shard trội ở giữa + các mảnh nhỏ vây quanh
const SHARDS: [number, number, number, number][] = [
    [0, 0, 0, 1],
    [1.7, 0.8, -0.5, 0.5],
    [-1.6, -0.6, 0.4, 0.58],
    [1.0, -1.4, 0.3, 0.42],
    [-1.1, 1.4, -0.4, 0.46],
    [1.9, -0.4, 0.6, 0.34],
    [-2.0, 0.5, -0.2, 0.3],
    [0.2, 1.9, 0.2, 0.36],
];

export function ShardsFocal() {
    const mountRef = useRef<HTMLDivElement>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        let renderer: WebGLRenderer;
        try {
            renderer = new WebGLRenderer({ antialias: true, alpha: true });
        } catch (e) {
            console.warn("[ShardsFocal] WebGL không khả dụng, giữ fallback gem", e);
            return;
        }

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const w = mount.clientWidth || 480;
        const h = mount.clientHeight || 460;

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(w, h);
        renderer.setClearColor(0x000000, 0);
        renderer.toneMapping = ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;
        mount.appendChild(renderer.domElement);

        const scene = new Scene();
        const camera = new PerspectiveCamera(42, w / h, 0.1, 100);
        camera.position.set(0, 0, 5.2);

        const pmrem = new PMREMGenerator(renderer);
        const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
        scene.environment = envRT.texture;

        const geometry = new OctahedronGeometry(1, 0);
        const material = new MeshPhysicalMaterial({
            color: 0x0b0a18,
            metalness: 0,
            roughness: 0.18,
            clearcoat: 1,
            clearcoatRoughness: 0.12,
            iridescence: 1,
            iridescenceIOR: 1.32,
            iridescenceThicknessRange: [120, 420],
            envMapIntensity: 1.5,
        });

        const pivot = new Group();
        const shards: Mesh[] = [];
        for (const [x, y, z, s] of SHARDS) {
            const m = new Mesh(geometry, material);
            m.position.set(x, y, z);
            m.scale.setScalar(s);
            m.rotation.set(x * 0.6, y * 0.6, z);
            pivot.add(m);
            shards.push(m);
        }
        scene.add(pivot);

        const lViolet = new PointLight(0x7c5cff, 30, 40);
        lViolet.position.set(3, 2, 3);
        const lBlue = new PointLight(0x5b8def, 22, 40);
        lBlue.position.set(-3.5, -1, 2);
        const lPink = new PointLight(0xc77dff, 18, 40);
        lPink.position.set(0, -3, 2.5);
        scene.add(lViolet, lBlue, lPink, new AmbientLight(0x404060, 0.6));

        setReady(true);

        let raf = 0;
        let running = false;
        let inViewport = true;
        const render = () => renderer.render(scene, camera);
        const tick = () => {
            pivot.rotation.y += 0.0035;
            for (let i = 0; i < shards.length; i++) {
                const m = shards[i];
                if (!m) continue;
                m.rotation.y += 0.004 + i * 0.0006;
                m.rotation.x += 0.002;
            }
            render();
            if (running) raf = requestAnimationFrame(tick);
        };
        const shouldRun = () => !reduceMotion && inViewport && !document.hidden;
        const start = () => {
            if (running || !shouldRun()) return;
            running = true;
            raf = requestAnimationFrame(tick);
        };
        const stop = () => {
            running = false;
            cancelAnimationFrame(raf);
        };

        if (reduceMotion) {
            pivot.rotation.set(0.3, 0.4, 0);
            render();
        } else {
            start();
        }

        // Pause rAF khi focal ra khỏi viewport hoặc tab bị ẩn — tiết kiệm GPU/pin.
        const io = new IntersectionObserver(
            (entries) => {
                inViewport = entries[entries.length - 1]?.isIntersecting ?? true;
                if (shouldRun()) start();
                else stop();
            },
            { threshold: 0 },
        );
        io.observe(mount);

        const onVisibility = () => {
            if (shouldRun()) start();
            else stop();
        };
        document.addEventListener("visibilitychange", onVisibility);

        const ro = new ResizeObserver(() => {
            const nw = mount.clientWidth || w;
            const nh = mount.clientHeight || h;
            camera.aspect = nw / nh;
            camera.updateProjectionMatrix();
            renderer.setSize(nw, nh);
            if (reduceMotion) render();
        });
        ro.observe(mount);

        return () => {
            stop();
            io.disconnect();
            document.removeEventListener("visibilitychange", onVisibility);
            ro.disconnect();
            geometry.dispose();
            material.dispose();
            envRT.dispose();
            pmrem.dispose();
            renderer.dispose();
            renderer.domElement.remove();
        };
    }, []);

    return <div ref={mountRef} className="hx-focal__canvas" data-ready={ready} aria-hidden="true" />;
}
