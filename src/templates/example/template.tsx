import Link from "next/link";
import { PixelBlast } from "@/components/pixel-blast";

export function ExampleTemplate() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-50">
            <div className="pointer-events-none absolute inset-0 z-0">
                <PixelBlast
                    variant="circle"
                    pixelSize={6}
                    color="#B497CF"
                    patternScale={3}
                    patternDensity={1.2}
                    pixelSizeJitter={0.5}
                    enableRipples
                    rippleSpeed={0.4}
                    rippleThickness={0.12}
                    rippleIntensityScale={1.5}
                    liquid
                    liquidStrength={0.12}
                    liquidRadius={1.2}
                    liquidWobbleSpeed={5}
                    speed={0.6}
                    edgeFade={0.25}
                    transparent
                />
            </div>

            <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
                <span className="text-sm font-semibold tracking-[0.2em] uppercase">Landing Templates</span>
                <Link href="/" className="text-sm text-zinc-400 transition hover:text-zinc-100">
                    Back to catalog
                </Link>
            </header>

            <main className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl flex-col justify-center px-6 pb-20">
                <p className="mb-4 text-sm font-medium tracking-[0.3em] text-violet-300 uppercase">
                    Template / Example
                </p>
                <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
                    Build landing pages faster with reusable templates.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
                    Drop templates and components into this repo, preview them locally, then copy what you need into
                    client projects.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                    <button
                        type="button"
                        className="rounded-full bg-violet-400 px-6 py-3 text-sm font-medium text-zinc-950 transition hover:bg-violet-300"
                    >
                        Get started
                    </button>
                    <button
                        type="button"
                        className="rounded-full border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-200 transition hover:border-zinc-500"
                    >
                        View components
                    </button>
                </div>
            </main>
        </div>
    );
}
