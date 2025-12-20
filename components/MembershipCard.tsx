import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { FamilyFriendlyIcon } from "./FamilyFriendlyIcon";
import {
  getTierColor,
  getTierHref,
  getTierSlug,
  type MembershipTier,
  defaultTierColors,
} from "@/lib/membership";

type MembershipCardProps = {
  tier: MembershipTier;
  index: number;
  fallbackCtaHref?: string;
};

const motionItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function MembershipCard({
  tier,
  index,
  fallbackCtaHref = "/contact",
}: MembershipCardProps) {
  const baseColor = getTierColor(tier, index);
  const tierActionLabel =
    tier.ctaLabel ?? `Discover more about ${tier.name ?? "this tier"}`;
  const tierSlug = getTierSlug(tier.name);
  const tierHref = tierSlug ? getTierHref(tier.name) : fallbackCtaHref;

  // CSS variables for dynamic color handling
  const style = {
    "--tier-color": baseColor,
    "--glass-border": "rgba(255, 255, 255, 0.25)",
    "--glass-glow": `color-mix(in srgb, ${baseColor} 70%, transparent)`,
    "--glass-bg": `radial-gradient(circle at 25% 20%, rgba(255,255,255,0.3), rgba(255,255,255,0.05) 55%), linear-gradient(140deg, color-mix(in srgb, ${baseColor} 65%, rgba(7,13,28,0.85)) 0%, color-mix(in srgb, ${baseColor} 25%, rgba(2,4,9,0.9)) 100%)`,
  } as React.CSSProperties;

  return (
    <Link
      href={tierHref}
      className="block h-full"
      aria-label={`${tier.name ?? "Membership tier"} — ${tierActionLabel}`}
    >
      <motion.article
        variants={motionItem}
        style={style}
        className={cn(
          "glass-card premium-card group relative isolate flex h-full flex-col overflow-hidden rounded-3xl p-7",
          "shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]",
          "cursor-pointer transition-transform duration-300 hover:scale-[1.02]",
          tier.isPopular && "ring-1 ring-white/50"
        )}
      >
        {/* Metallic Surface & Lighting Effects */}
        {/* 1. Base Radial Gradient (Lighter center, richer edges) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,rgba(0,0,0,0.05)_80%)] mix-blend-hard-light" />

        {/* 2. Glossy Overlay (Top-left light source) */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0)_40%,rgba(0,0,0,0.05)_100%)] mix-blend-overlay" />

        {/* 3. Outer Glow (Light from behind) */}
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

        <div className="relative z-10 flex h-full flex-col gap-5 text-white drop-shadow-md">
          <div className="relative flex flex-col items-center gap-4">
            {tier.isFamilyFriendly && (
              <span className="absolute top-0 left-0 -ml-4 rounded-full border border-white/40 bg-white/10 p-1.5 text-white shadow-sm backdrop-blur-sm" title="Family Friendly">
                <FamilyFriendlyIcon className="h-4 w-4" />
              </span>
            )}
            {tier.isPopular && (
              <span className="absolute top-0 right-0 rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white shadow-sm backdrop-blur-sm">
                Popular
              </span>
            )}
            <div className="text-center">
              <p className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                {tier.name}
              </p>
              {tier.price && (
                <p className="mt-2 text-sm uppercase tracking-[0.2em] font-medium text-white/90">
                  {tier.price}
                </p>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">
              Description
            </p>
            <p className="text-sm font-medium leading-relaxed text-white/90">
              {tier.description ??
                "Details for this membership tier will be published soon."}
            </p>
          </div>

          <p className="text-xs uppercase tracking-[0.2em] text-white font-semibold flex items-center gap-2 group-hover:translate-x-1 transition-transform">
            {tierActionLabel}
            <span aria-hidden="true">&rarr;</span>
          </p>
        </div>
      </motion.article>
    </Link>
  );
}
