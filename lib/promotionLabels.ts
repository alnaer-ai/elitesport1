const PROMOTION_TYPE_LABELS: Record<string, string> = {
  hotel: "Hotel",
  gym: "Gym",
  female: "Female Club",
  kids: "Kids Club",
  tennisSquash: "Tennis & Squash",
  dining: "Dining",
  retail: "Retail",
};

export type PromotionCategory = keyof typeof PROMOTION_TYPE_LABELS;

export const getPromotionTypeLabel = (promotionType?: string) => {
  if (!promotionType) return undefined;
  return PROMOTION_TYPE_LABELS[promotionType] ?? promotionType;
};
