"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { PromotionCardContent } from "@/lib/promotionCardContent";
import { PromotionCard } from "./PromotionCard";

export type PromotionMarqueeProps = {
  promotions: PromotionCardContent[];
  className?: string;
  onSelect?: (promotion: PromotionCardContent) => void;
  speed?: number; // Duration in seconds for one full cycle
};

/**
 * Continuous marquee animation component for promotion cards.
 * Features:
 * - Smooth infinite right-to-left scrolling
 * - Seamless looping with duplicated content
 * - Pause on hover
 * - Respects reduced-motion preferences
 * - Performance optimized with CSS transforms and will-change
 * - Responsive card sizing
 */
export const PromotionMarquee = ({
  promotions,
  className,
  onSelect,
  speed = 30,
}: PromotionMarqueeProps) => {
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [singleSetWidth, setSingleSetWidth] = useState(0);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Calculate the width of one set of promotions for seamless looping
  useEffect(() => {
    if (!trackRef.current || promotions.length === 0 || prefersReducedMotion) {
      return;
    }

    let resizeObserver: ResizeObserver | null = null;

    const calculateWidth = () => {
      const firstCard = trackRef.current?.firstElementChild as HTMLElement;
      if (!firstCard || firstCard.offsetWidth === 0) {
        // Retry if card hasn't rendered yet
        requestAnimationFrame(calculateWidth);
        return;
      }

      const cardWidth = firstCard.offsetWidth;
      const gap = 24; // gap-6 = 1.5rem = 24px
      const cardWithGap = cardWidth + gap;
      const width = promotions.length * cardWithGap;
      setSingleSetWidth(width);
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      calculateWidth();
      
      // Also observe for resize changes
      resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(calculateWidth);
      });
      
      if (trackRef.current) {
        resizeObserver.observe(trackRef.current);
      }
    });

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [promotions.length, prefersReducedMotion]);

  // Duplicate promotions for seamless looping
  // We need at least 2 copies to ensure seamless transition
  const duplicatedPromotions = [...promotions, ...promotions, ...promotions];

  if (promotions.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden py-4",
        "before:absolute before:left-0 before:top-0 before:bottom-0 before:z-10 before:w-24 before:bg-gradient-to-r before:from-brand-black before:via-brand-black/80 before:to-transparent before:pointer-events-none",
        "after:absolute after:right-0 after:top-0 after:bottom-0 after:z-10 after:w-24 after:bg-gradient-to-l after:from-brand-black after:via-brand-black/80 after:to-transparent after:pointer-events-none",
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      aria-label="Latest promotions marquee"
    >
      <div
        ref={trackRef}
        className={cn(
          "flex gap-6 will-change-transform",
          !prefersReducedMotion && singleSetWidth > 0 && "animate-marquee",
          prefersReducedMotion && "justify-center flex-wrap"
        )}
        style={
          !prefersReducedMotion && singleSetWidth > 0
            ? {
                // CSS custom properties for dynamic animation
                "--marquee-speed": `${speed}s`,
                "--marquee-distance": `-${singleSetWidth}px`,
                animationPlayState: isPaused ? "paused" : "running",
              } as React.CSSProperties
            : undefined
        }
      >
        {duplicatedPromotions.map((promotion, index) => (
          <div
            key={`${promotion.id}-${index}`}
            className="flex-shrink-0 w-[280px] sm:w-[300px] lg:w-[320px]"
          >
            <PromotionCard
              promotion={promotion}
              layout="grid"
              onSelect={onSelect ? () => onSelect(promotion) : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

