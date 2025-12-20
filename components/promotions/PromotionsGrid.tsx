import { cn } from "@/lib/cn";
import type { PromotionCardContent } from "@/lib/promotionCardContent";

import { PromotionCard } from "./PromotionCard";

export type PromotionsGridProps = {
  promotions: PromotionCardContent[];
  className?: string;
  onSelect?: (promotion: PromotionCardContent) => void;
};

export const PromotionsGrid = ({
  promotions,
  className,
  onSelect,
}: PromotionsGridProps) => {
  if (promotions.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
        className
      )}
    >
      {promotions.map((promotion) => (
        <PromotionCard
          key={promotion.id}
          promotion={promotion}
          layout="grid"
          showDescription
          onSelect={onSelect ? () => onSelect(promotion) : undefined}
        />
      ))}
    </div>
  );
};
