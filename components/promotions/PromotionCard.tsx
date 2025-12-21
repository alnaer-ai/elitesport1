import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import type { PromotionCardContent } from "@/lib/promotionCardContent";

import { PromoBadge } from "./PromoBadge";
import { PromotionDiscountBadge } from "./PromotionDiscountBadge";

type CardLayout = "carousel" | "grid" | "compact";

export type PromotionCardProps = {
  promotion: PromotionCardContent;
  layout?: CardLayout;
  showDescription?: boolean; // Kept for API compatibility but defaults to false visually
  onSelect?: () => void;
};

const layoutClasses: Record<CardLayout, string> = {
  carousel:
    "min-w-[260px] snap-start sm:min-w-[320px] lg:min-w-[360px] flex-shrink-0",
  grid: "h-full",
  compact: "h-full lg:min-h-[260px]",
};

const imageHeightClasses: Record<CardLayout, string> = {
  carousel: "h-48",
  grid: "h-56", // Match PlaceCard height
  compact: "h-36 sm:h-40",
};

export const PromotionCard = ({
  promotion,
  layout = "grid",
  onSelect,
}: PromotionCardProps) => {
  const [imageError, setImageError] = useState(false);
  
  const {
    title,
    imageUrl,
    imageAlt,
    discountPercentage,
    promotionTypeLabel,
    metaLabel,
  } = promotion;

  const baseClassName = cn(
    "glass-card premium-card group relative flex min-w-0 w-full flex-col overflow-hidden text-left transition-all duration-300 ease-out hover:scale-[1.02] transform-gpu",
    layoutClasses[layout],
    onSelect &&
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lightBlue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black cursor-pointer"
  );

  const badgeSizes: Record<CardLayout, "sm" | "md" | "lg"> = {
    carousel: "md",
    grid: "md",
    compact: "sm",
  };

  const content = (
    <>
      {/* Image Section */}
      <div
        className={cn(
          "relative w-full overflow-hidden",
          imageHeightClasses[layout]
        )}
      >
        {imageUrl && !imageError ? (
          <Image
            src={imageUrl}
            alt={imageAlt ?? title}
            fill
            sizes={
              layout === "grid"
                ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                : "(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 360px"
            }
            className="object-cover transition duration-700 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-deepBlue to-brand-black flex items-center justify-center">
            <span className="text-brand-ivory/40 text-sm">Image unavailable</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
        
        {/* Discount Badge - Top Right */}
        <PromotionDiscountBadge
          percentage={discountPercentage}
          size={badgeSizes[layout]}
          className="absolute right-4 top-4 z-10"
        />
        
        {/* Optional: Type Badge if needed on image, but we are moving to text below */}
        {/* Keeping PromoBadge if it distinguishes the type (e.g. "Limited Time") */}
         <div className="absolute left-4 top-4 flex flex-wrap gap-2 pr-16">
          {promotionTypeLabel && (
            <PromoBadge
              label={promotionTypeLabel}
              tone="accent"
              className="text-[0.55rem]"
            />
          )}
        </div>
      </div>

      {/* Content Section - Below Image */}
      <div
        className={cn(
          "flex flex-1 flex-col gap-1.5 px-5 py-5 bg-brand-black/40 backdrop-blur-sm",
          layout === "grid" && "px-5 py-5"
        )}
      >
        {metaLabel && (
          <p className="text-[0.6rem] uppercase tracking-[0.45em] text-brand-lightBlue">
            {metaLabel}
          </p>
        )}
        
        <h3
          className={cn(
            "font-semibold text-brand-ivory leading-tight",
            layout === "grid" ? "text-xl" : "text-lg"
          )}
        >
          {title}
        </h3>
        
      </div>
    </>
  );

  if (onSelect) {
    return (
      <button
        type="button"
        className={baseClassName}
        onClick={onSelect}
        aria-label={`View details for ${title}`}
      >
        {content}
      </button>
    );
  }

  return (
    <article className={baseClassName} aria-label={title}>
      {content}
    </article>
  );
};
