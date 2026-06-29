// PROTOTYPE — Phase 4 Motion (hero). CHỐT biến thể B "Snap precise" (user eye-review
// live, 2026-06-26). GSAP timeline + SplitType (headline line reveal) + mouse-parallax
// shards focal. expo.out, nhanh-gọn-sắc. Honors prefers-reduced-motion (skip, hiện
// final). Motion gate = video/live. Returns null.
"use client";

import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";

// Biến thể B "Snap precise" — đã chốt
const M = {
    ease: "expo.out",
    dur: 0.55,
    y: 16,
    stag: 0.05,
    hlEase: "expo.out",
    hlDur: 0.6,
    hlStag: 0.07,
    focalDur: 0.7,
    focalEase: "expo.out",
    focalScale: 0.96,
};

export function HeroMotion() {
    useLayoutEffect(() => {
        if (typeof window === "undefined") return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        let cancelled = false;
        let split: SplitType | null = null;
        let quickX: ((n: number) => void) | null = null;
        let quickY: ((n: number) => void) | null = null;

        const onMove = (e: PointerEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            quickX?.(nx * 22);
            quickY?.(ny * 18);
        };

        // Sync initial state — tracked bởi ctx (chạy trong gsap.context callback).
        const ctx = gsap.context(() => {
            gsap.set([".hx-tag", ".hx-hero__sub", ".hx-hero__cta", ".hx-ledger__item"], {
                opacity: 0,
                y: M.y,
            });
            gsap.set(".hx-focal", {
                opacity: 0,
                scale: M.focalScale,
                transformOrigin: "50% 50%",
            });
        });

        // run() chạy async (sau document.fonts.ready) — bọc nội dung trong ctx.add()
        // để ctx.revert() dọn được timeline + quickTo tween tạo ở đây.
        const run = () => {
            if (cancelled) return;
            ctx.add(() => {
                const hl = document.querySelector(".hx-hero__headline");
                let lines: Element[] = [];
                if (hl) {
                    split = new SplitType(hl as HTMLElement, { types: "lines" });
                    lines = split.lines ?? [];
                    gsap.set(lines, { yPercent: 70, opacity: 0 });
                }

                const tl = gsap.timeline({
                    defaults: { ease: M.ease, duration: M.dur },
                });
                tl.to(".hx-focal", { opacity: 1, scale: 1, duration: M.focalDur, ease: M.focalEase }, 0);
                tl.to(".hx-tag", { opacity: 1, y: 0 }, 0.1);
                if (lines.length) {
                    tl.to(
                        lines,
                        {
                            yPercent: 0,
                            opacity: 1,
                            duration: M.hlDur,
                            ease: M.hlEase,
                            stagger: M.hlStag,
                        },
                        0.18,
                    );
                }
                tl.to(".hx-hero__sub", { opacity: 1, y: 0 }, "-=0.3");
                tl.to(".hx-hero__cta", { opacity: 1, y: 0 }, "-=0.32");
                tl.to(".hx-ledger__item", { opacity: 1, y: 0, stagger: M.stag }, "-=0.25");

                // mouse-parallax shards (subtle)
                quickX = gsap.quickTo(".hx-focal", "x", {
                    duration: 0.6,
                    ease: "power2.out",
                });
                quickY = gsap.quickTo(".hx-focal", "y", {
                    duration: 0.6,
                    ease: "power2.out",
                });
                window.addEventListener("pointermove", onMove);
            });
        };

        if (document.fonts?.ready) {
            document.fonts.ready.then(run).catch((e: unknown) => {
                console.warn("[HeroMotion] document.fonts.ready rejected", e);
                run();
            });
        } else {
            run();
        }

        return () => {
            cancelled = true;
            window.removeEventListener("pointermove", onMove);
            split?.revert();
            ctx.revert();
        };
    }, []);

    return null;
}
