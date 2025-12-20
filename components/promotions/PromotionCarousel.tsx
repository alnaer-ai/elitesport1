import type { PromotionCardContent } from "@/lib/promotionCardContent";

import { PromotionCard } from "./PromotionCard";

export type PromotionCarouselProps = {
  promotions: PromotionCardContent[];
  ariaLabel?: string;
  onSelect?: (promotion: PromotionCardContent) => void;
};

export const PromotionCarousel = ({
  promotions,
  ariaLabel = "Latest promotions",
  onSelect,
}: PromotionCarouselProps) => {
  if (promotions.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 pr-6 text-left transition [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label={ariaLabel}
      >
        {promotions.map((promotion) => (
          <PromotionCard
            key={promotion.id}
            promotion={promotion}
            layout="carousel"
            showDescription={false}
            onSelect={onSelect ? () => onSelect(promotion) : undefined}
          />
        ))}
      </div>
    </div>
  );
};
