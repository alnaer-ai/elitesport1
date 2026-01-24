import type { PortableTextBlock } from "@portabletext/types";

export type PromotionCardContent = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  discountPercentage?: number;
  promotionTypeLabel?: string;
  promotionCategoryId?: number;
  promotionCategoryIcon?: string;
  metaLabel?: string;
  overview?: PortableTextBlock[];
  benefits?: string[];
  ctaLabel?: string;
  ctaAction?: string;
  publishStartDate?: string;
  publishEndDate?: string;
};
