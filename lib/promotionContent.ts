import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url";

import { getPromotionTypeLabel } from "./promotionLabels";
import type { PromotionCardContent } from "./promotionCardContent";
import { isSanityConfigured, urlForImage } from "./sanity.client";

export type PromotionRecord = {
  _id: string;
  title?: string;
  promotionType?: string;
  overview?: PortableTextBlock[];
  overviewText?: string;
  benefits?: string[];
  ctaLabel?: string;
  ctaAction?: string;
  featuredImage?: SanityImageSource;
  imageAlt?: string;
  discountPercentage?: number;
  isPublished?: boolean;
  publishStartDate?: string;
  publishEndDate?: string;
};

export const PROMOTION_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80";

type ImageOptions = {
  width?: number;
  height?: number;
};

export const getPromotionImageUrl = (
  source?: SanityImageSource,
  { width = 1400, height = 900 }: ImageOptions = {}
) => {
  if (!source || !isSanityConfigured) {
    return undefined;
  }

  try {
    let builder = urlForImage(source).width(width).auto("format");
    if (height) {
      builder = builder.height(height).fit("crop");
    }
    return builder.url();
  } catch {
    return undefined;
  }
};

type PromotionCardOptions = {
  metaLabelFallback?: string;
  fallbackImage?: string;
};

export const mapPromotionRecordToCardContent = (
  promotion: PromotionRecord,
  { metaLabelFallback, fallbackImage = PROMOTION_FALLBACK_IMAGE }: PromotionCardOptions = {}
): PromotionCardContent => {
  const imageSource = promotion.featuredImage;
  const imageUrl = getPromotionImageUrl(imageSource) ?? fallbackImage;
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
    metaLabel,
    overview: promotion.overview,
    benefits: promotion.benefits,
    ctaLabel: promotion.ctaLabel,
    ctaAction: promotion.ctaAction,
    publishStartDate: promotion.publishStartDate,
    publishEndDate: promotion.publishEndDate,
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
