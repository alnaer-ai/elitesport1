/**
 * Promotion content utilities.
 * Previously used Sanity image processing, now uses plain URLs.
 */

import type { PortableTextBlock } from "@portabletext/types";

import { getPromotionTypeLabel } from "./promotionLabels";
import type { PromotionCardContent } from "./promotionCardContent";

export type PromotionRecord = {
  _id: string;
  title?: string | null;
  promotionType?: string | null;
  promotionCategoryId?: number | null;
  promotionCategoryIcon?: string | null;
  overview?: PortableTextBlock[] | null;
  overviewText?: string | null;
  benefits?: string[] | null;
  ctaLabel?: string | null;
  ctaAction?: string | null;
  featuredImageUrl?: string | null;
  imageAlt?: string | null;
  discountPercentage?: number | null;
  isPublished?: boolean | null;
  publishStartDate?: string | null;
  publishEndDate?: string | null;
};

export const PROMOTION_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80";

type PromotionCardOptions = {
  metaLabelFallback?: string;
  fallbackImage?: string;
};

export const mapPromotionRecordToCardContent = (
  promotion: PromotionRecord,
  { metaLabelFallback, fallbackImage = PROMOTION_FALLBACK_IMAGE }: PromotionCardOptions = {}
): PromotionCardContent => {
  const imageUrl = promotion.featuredImageUrl ?? fallbackImage;
  const promotionTypeLabel = getPromotionTypeLabel(promotion.promotionType);
  const discountPercentage =
    typeof promotion.discountPercentage === "number"
      ? promotion.discountPercentage
      : undefined;
  const metaLabel = metaLabelFallback ?? "Member Exclusive";
  const description =
    promotion.overviewText ?? "Exclusive member benefit curated by EliteSport.";
  const title = promotion.title ?? "EliteSport Promotion";
  const imageAlt = promotion.imageAlt ?? title ?? "EliteSport promotion";

  return {
    id: promotion._id,
    title,
    description,
    imageUrl,
    imageAlt,
    discountPercentage,
    promotionTypeLabel,
    promotionCategoryId: promotion.promotionCategoryId ?? undefined,
    promotionCategoryIcon: promotion.promotionCategoryIcon ?? undefined,
    metaLabel,
    overview: promotion.overview ?? undefined,
    benefits: promotion.benefits ?? undefined,
    ctaLabel: promotion.ctaLabel ?? undefined,
    ctaAction: promotion.ctaAction ?? undefined,
    publishStartDate: promotion.publishStartDate ?? undefined,
    publishEndDate: promotion.publishEndDate ?? undefined,
  };
};

export const isPromotionActive = (promotion?: {
  isPublished?: boolean | null;
  publishStartDate?: string | null;
  publishEndDate?: string | null;
}) => {
  if (!promotion) {
    return false;
  }

  if (promotion.isPublished === false) {
    return false;
  }

  const now = Date.now();

  if (promotion.publishStartDate) {
    const startsAt = Date.parse(promotion.publishStartDate);
    if (!Number.isNaN(startsAt) && startsAt > now) {
      return false;
    }
  }

  if (promotion.publishEndDate) {
    const endsAt = Date.parse(promotion.publishEndDate);
    if (!Number.isNaN(endsAt) && endsAt <= now) {
      return false;
    }
  }

  return true;
};
