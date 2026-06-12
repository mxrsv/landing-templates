"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@landing/ui/lib/use-reduced-motion";

const INITIAL_BLOCK = 18234567;

export function TernusNetstrip() {
    const reduced = useReducedMotion();
    const [block, setBlock] = useState(INITIAL_BLOCK);

    useEffect(() => {
        if (reduced) return;
        const id = window.setInterval(() => {
            setBlock((b) => b + 1 + Math.floor(Math.random() * 2));
        }, 2400);
        return () => window.clearInterval(id);
    }, [reduced]);

    return (
        <div className="netstrip">
            <div className="nstat">
                <span className="nk">
                    Throughput
                    <span className="net-tag">testnet</span>
                </span>
                <span className="nv">9,400</span>
            </div>
            <span className="nsep" />
            <div className="nstat">
                <span className="nk">Avg fee</span>
                <span className="nv">$0.001</span>
            </div>
            <span className="nsep" />
            <div className="nstat">
                <span className="nk">Block height</span>
                <span className="nv">{block.toLocaleString("en-US")}</span>
            </div>
        </div>
    );
}
