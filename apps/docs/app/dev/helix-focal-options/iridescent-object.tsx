// PROTOTYPE — Focal track. So sánh các geometry focal (iridescent glass) để user
// chọn bằng MẮT (WebGL — verify live trong Chrome, headless không render). Cùng
// material + ánh sáng, chỉ khác hình. Honors reduced-motion, cleanup đầy đủ.
"use client";

import { useEffect, useRef } from "react";
import {
    ACESFilmicToneMapping,
    AmbientLight,
    BufferAttribute,
    BufferGeometry,
    DodecahedronGeometry,
    Group,
    IcosahedronGeometry,
    Mesh,
    MeshPhysicalMaterial,
    OctahedronGeometry,
    PerspectiveCamera,
    PMREMGenerator,
    PointLight,
    Scene,
    TorusKnotGeometry,
    Vector3,
    WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type FocalKind = "octahedron" | "icosahedron" | "dodecahedron" | "distorted" | "shards" | "torusknot";

function buildGeometry(kind: FocalKind): BufferGeometry {
    switch (kind) {
        case "octahedron":
            return new OctahedronGeometry(1.3, 0);
        case "icosahedron":
            return new IcosahedronGeometry(1.25, 0);
        case "dodecahedron":
            return new DodecahedronGeometry(1.2, 0);
        case "torusknot":
            return new TorusKnotGeometry(0.82, 0.3, 200, 30, 2, 3);
        case "distorted": {
            const g = new IcosahedronGeometry(1.2, 6);
            const p = g.getAttribute("position");
            if (!(p instanceof BufferAttribute)) return g;
            const v = new Vector3();
            for (let i = 0; i < p.count; i++) {
                v.fromBufferAttribute(p, i);
                const n = v.clone().normalize();
                const d = 1 + 0.16 * Math.sin(3 * v.x) * Math.cos(3 * v.y) + 0.1 * Math.sin(4 * v.z);
                v.copy(n).multiplyScalar(1.2 * d);
                p.setXYZ(i, v.x, v.y, v.z);
            }
            g.computeVertexNormals();
            return g;
        }
        default:
            return new OctahedronGeometry(1.3, 0);
    }
}

export function IridescentObject({ kind }: { kind: FocalKind }) {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        let renderer: WebGLRenderer;
        try {
            renderer = new WebGLRenderer({ antialias: true, alpha: true });
        } catch (e) {
            console.warn("[IridescentObject] WebGL không khả dụng", e);
            return;
        }

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const w = mount.clientWidth || 320;
        const h = mount.clientHeight || 320;

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
        renderer.setSize(w, h);
        renderer.setClearColor(0x000000, 0);
        renderer.toneMapping = ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;
        mount.appendChild(renderer.domElement);

        const scene = new Scene();
        const camera = new PerspectiveCamera(40, w / h, 0.1, 100);
        camera.position.set(0, 0, 3.8);

        const pmrem = new PMREMGenerator(renderer);
        const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
        scene.environment = envRT.texture;

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

        const geoms: BufferGeometry[] = [];
        const pivot = new Group();
        if (kind === "shards") {
            const base = new OctahedronGeometry(0.5, 0);
            geoms.push(base);
            const spots: [number, number, number, number][] = [
                [0, 0, 0, 1],
                [1.3, 0.6, -0.4, 0.6],
                [-1.2, -0.5, 0.3, 0.7],
                [0.7, -1.1, 0.2, 0.5],
                [-0.8, 1.1, -0.3, 0.55],
                [1.0, 1.0, 0.4, 0.42],
            ];
            for (const [x, y, z, s] of spots) {
                const m = new Mesh(base, material);
                m.position.set(x, y, z);
                m.scale.setScalar(s);
                m.rotation.set(x, y, z);
                pivot.add(m);
            }
        } else {
            const g = buildGeometry(kind);
            geoms.push(g);
            pivot.add(new Mesh(g, material));
        }
        scene.add(pivot);

        const lViolet = new PointLight(0x7c5cff, 26, 30);
        lViolet.position.set(3, 2, 3);
        const lBlue = new PointLight(0x5b8def, 20, 30);
        lBlue.position.set(-3.5, -1, 2);
        const lPink = new PointLight(0xc77dff, 16, 30);
        lPink.position.set(0, -3, 2.5);
        scene.add(lViolet, lBlue, lPink, new AmbientLight(0x404060, 0.6));

        let raf = 0;
        let running = false;
        let inViewport = true;
        const render = () => renderer.render(scene, camera);
        const tick = () => {
            pivot.rotation.y += 0.005;
            pivot.rotation.x += 0.0018;
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
            pivot.rotation.set(0.5, 0.4, 0);
            render();
        } else {
            start();
        }

        // Pause rAF khi object ra khỏi viewport hoặc tab ẩn — quan trọng vì trang
        // focal-options mount nhiều WebGL context cùng lúc.
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
            geoms.forEach((g) => g.dispose());
            material.dispose();
            envRT.dispose();
            pmrem.dispose();
            renderer.dispose();
            renderer.domElement.remove();
        };
    }, [kind]);

    return <div ref={mountRef} className="hxo-canvas" aria-hidden="true" />;
}
