import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { getTierColor, type MembershipTier } from "@/lib/membership";

type TierCardShellProps = {
    tier: MembershipTier;
    index?: number;
    className?: string;
    children: React.ReactNode;
    animate?: boolean;
};

export function TierCardShell({
    tier,
    index = 0,
    className,
    children,
    animate = true,
}: TierCardShellProps) {
    const baseColor = getTierColor(tier, index);

    // CSS variables for dynamic color handling
    const style = {
        "--tier-color": baseColor,
        "--glass-border": "rgba(255, 255, 255, 0.25)",
        "--glass-glow": `color-mix(in srgb, ${baseColor} 70%, transparent)`,
        "--glass-bg": `radial-gradient(circle at 25% 20%, rgba(255,255,255,0.3), rgba(255,255,255,0.05) 55%), linear-gradient(140deg, color-mix(in srgb, ${baseColor} 65%, rgba(7,13,28,0.85)) 0%, color-mix(in srgb, ${baseColor} 25%, rgba(2,4,9,0.9)) 100%)`,
        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)",
    } as React.CSSProperties;

    const motionProps = animate
        ? {
            initial: { opacity: 0, y: 24 },
            animate: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
            },
        }
        : {};

    return (
        <motion.article
            {...motionProps}
            style={style}
            className={cn(
                "glass-card premium-card group relative isolate flex flex-col overflow-hidden rounded-3xl",
                tier.isPopular && "ring-1 ring-white/50",
                className
            )}
        >
            {/* Metallic Surface & Lighting Effects */}
            {/* 1. Base Radial Gradient (Lighter center, richer edges) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,rgba(0,0,0,0.05)_80%)] mix-blend-hard-light" />

            {/* 2. Glossy Overlay (Top-left light source) */}
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0)_40%,rgba(0,0,0,0.05)_100%)] mix-blend-overlay" />

            {/* 3. Outer Glow (Light from behind) - Slightly reduced opacity for subordinate cards if needed, but keeping consistent */}
            <div
                className="absolute inset-0 transition-opacity duration-500 opacity-50 group-hover:opacity-75"
                style={{
                    boxShadow:
                        "inset 0 0 60px color-mix(in srgb, var(--tier-color) 80%, black 20%)",
                }}
            />

            {/* 4. Specular Highlights (Top edge streaks) */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent opacity-80" />
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/15 to-transparent opacity-60 pointer-events-none" />

            {/* 5. Edge Highlight (Inner border light) */}
            <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/20 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">{children}</div>
        </motion.article>
    );
}
