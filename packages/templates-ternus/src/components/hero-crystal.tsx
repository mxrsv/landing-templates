"use client";

import { useEffect, useRef } from "react";

// Octahedron geometry: 6 vertices, 8 triangular faces, 12 edges.
const VERTS: Record<string, [number, number, number]> = {
  T: [0, -0.82, 0],
  B: [0, 1.0, 0],
  F: [0, -0.04, 0.6],
  R: [0.6, -0.04, 0],
  K: [0, -0.04, -0.6],
  L: [-0.6, -0.04, 0],
};
const FACES: [string, string, string][] = [
  ["T", "F", "R"],
  ["T", "R", "K"],
  ["T", "K", "L"],
  ["T", "L", "F"],
  ["B", "F", "R"],
  ["B", "R", "K"],
  ["B", "K", "L"],
  ["B", "L", "F"],
];
const EDGES: [string, string][] = [
  ["T", "F"],
  ["T", "R"],
  ["T", "K"],
  ["T", "L"],
  ["B", "F"],
  ["B", "R"],
  ["B", "K"],
  ["B", "L"],
  ["F", "R"],
  ["R", "K"],
  ["K", "L"],
  ["L", "F"],
];
const DARK: [number, number, number] = [16, 58, 80];
const LITE: [number, number, number] = [165, 238, 255];

function rotate(
  p: [number, number, number],
  ax: number,
  ay: number,
): [number, number, number] {
  const [x, y, z] = p;
  const x1 = x * Math.cos(ay) + z * Math.sin(ay);
  const z1 = -x * Math.sin(ay) + z * Math.cos(ay);
  const y2 = y * Math.cos(ax) - z1 * Math.sin(ax);
  const z2 = y * Math.sin(ax) + z1 * Math.cos(ax);
  return [x1, y2, z2];
}

/**
 * Ethereum-style crystal that flips slowly about its vertical axis with
 * flat-shaded cyan facets. Pays off "secured by Ethereum"; calm by design.
 */
export function HeroCrystal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      if (!w) resize();
      if (!w) return;
      ctx.clearRect(0, 0, w, h);
      const ox = w / 2;
      const oy = h / 2;
      const bob = reduced ? 0 : Math.sin(time * 0.0011) * 5;
      const s = Math.min(w, h) * 0.46;
      const ay = reduced ? 0.6 : time * 0.0003;
      const ax = 0.32;

      const screen: Record<string, { x: number; y: number; z: number }> = {};
      const rotated: Record<string, [number, number, number]> = {};
      for (const k in VERTS) {
        const vk = VERTS[k];
        if (!vk) continue;
        const r = rotate(vk, ax, ay);
        rotated[k] = r;
        const persp = 1 + r[2] * 0.18;
        screen[k] = {
          x: ox + r[0] * s * persp,
          y: oy + r[1] * s * persp + bob,
          z: r[2],
        };
      }

      const lightVec: [number, number, number] = [-0.38, -0.46, 0.8];
      const lightLen = Math.hypot(lightVec[0], lightVec[1], lightVec[2]);

      const ordered = FACES.map((f) => ({
        f,
        z:
          ((screen[f[0]]?.z ?? 0) +
            (screen[f[1]]?.z ?? 0) +
            (screen[f[2]]?.z ?? 0)) /
          3,
      })).sort((a, b) => a.z - b.z);

      for (const { f } of ordered) {
        const A = rotated[f[0]];
        const B = rotated[f[1]];
        const C = rotated[f[2]];
        if (!A || !B || !C) continue;
        const u: [number, number, number] = [
          B[0] - A[0],
          B[1] - A[1],
          B[2] - A[2],
        ];
        const v: [number, number, number] = [
          C[0] - A[0],
          C[1] - A[1],
          C[2] - A[2],
        ];
        let nx = u[1] * v[2] - u[2] * v[1];
        let ny = u[2] * v[0] - u[0] * v[2];
        let nz = u[0] * v[1] - u[1] * v[0];
        const nl = Math.hypot(nx, ny, nz) || 1;
        nx /= nl;
        ny /= nl;
        nz /= nl;
        if (nz < 0) {
          nx = -nx;
          ny = -ny;
          nz = -nz;
        }
        const diff = Math.max(
          0,
          (nx * lightVec[0] + ny * lightVec[1] + nz * lightVec[2]) / lightLen,
        );
        const sh = 0.26 + 0.74 * diff;
        const r = Math.round(DARK[0] + (LITE[0] - DARK[0]) * sh);
        const g = Math.round(DARK[1] + (LITE[1] - DARK[1]) * sh);
        const b = Math.round(DARK[2] + (LITE[2] - DARK[2]) * sh);
        const a = screen[f[0]];
        const bb = screen[f[1]];
        const cc = screen[f[2]];
        if (!a || !bb || !cc) continue;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(bb.x, bb.y);
        ctx.lineTo(cc.x, cc.y);
        ctx.closePath();
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fill();
        ctx.strokeStyle = `rgb(${r},${g},${b})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.lineWidth = 1;
      for (const e of EDGES) {
        const a = screen[e[0]];
        const b = screen[e[1]];
        if (!a || !b) continue;
        const front = Math.max(0, ((a.z + b.z) / 2 + 0.6) / 1.2);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(205,245,255,${0.25 + 0.5 * front})`;
        ctx.stroke();
      }
    };

    resize();

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    if (reduced) {
      draw(0);
    } else {
      const loop = (time: number) => {
        raf = requestAnimationFrame(loop);
        if (!visible) return;
        draw(time);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="crystal" aria-hidden />;
}
