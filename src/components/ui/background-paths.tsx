"use client";

import { memo, useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";

const FloatingPaths = memo(function FloatingPaths({ position }: { position: number }) {
    // Computed once per instance: random durations used to be re-rolled on every render,
    // which restarted every path animation whenever the parent re-rendered.
    const paths = useMemo(
        () =>
            Array.from({ length: 36 }, (_, i) => ({
                id: i,
                d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
                    380 - i * 5 * position
                } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
                    152 - i * 5 * position
                } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
                    684 - i * 5 * position
                } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
                color: `rgba(255,255,255,${0.1 + i * 0.02})`,
                width: 1.5 + i * 0.1,
                duration: 25 + Math.random() * 10,
            })),
        [position]
    );

    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg
                className="w-full h-full"
                viewBox="0 0 696 316"
                fill="none"
            >
                <title>Background Paths</title>
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke={path.color}
                        strokeWidth={path.width}
                        strokeOpacity={0.6 + path.id * 0.05}
                        initial={{ pathLength: 0.3, opacity: 0.8 }}
                        animate={{
                            pathLength: [0.3, 1, 0.3],
                            opacity: [0.5, 1, 0.5],
                            pathOffset: [0, 1, 0],
                        }}
                        transition={{
                            duration: path.duration,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </svg>
        </div>
    );
});

export function BackgroundPaths() {
    const ref = useRef<HTMLDivElement>(null);
    // Only run the 72 infinite path animations while this layer is near the viewport.
    const inView = useInView(ref, { margin: "200px 0px 200px 0px" });

    return (
        <div ref={ref} className="absolute inset-0 pointer-events-none overflow-hidden">
            {inView && (
                <div className="absolute inset-0">
                    <FloatingPaths position={1} />
                    <FloatingPaths position={-1} />
                </div>
            )}
        </div>
    );
}
