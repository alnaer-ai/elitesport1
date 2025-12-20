export type PromotionCardContent = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  discountPercentage?: number;
  promotionTypeLabel?: string;
  metaLabel?: string;
  overview?: any;
  benefits?: string[];
  ctaLabel?: string;
  ctaAction?: string;
  publishStartDate?: string;
  publishEndDate?: string;
};
