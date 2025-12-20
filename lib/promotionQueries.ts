export const ACTIVE_PROMOTION_FILTER = `
  (isPublished != false) &&
  (!defined(publishStartDate) || publishStartDate <= now()) &&
  (!defined(publishEndDate) || publishEndDate >= now())
`;

const PROMOTION_ORDER =
  "coalesce(publishStartDate, _updatedAt, _createdAt) desc";

const PROMOTION_DOCUMENT_FIELDS = `
  _id,
  title,
  discountPercentage,
  "promotionType": promotionType,
  overview,
  "overviewText": pt::text(overview),
  benefits,
  ctaLabel,
  ctaAction,
  featuredImage,
  "imageAlt": featuredImage.alt,
  isPublished,
  publishStartDate,
  publishEndDate
`;

const PROMOTION_DOCUMENT_PROJECTION = `{
  ${PROMOTION_DOCUMENT_FIELDS}
}`;

// Query promotion documents that are active
const ACTIVE_PROMOTION_DOCUMENT_FILTER = `
  _type == "promotion" &&
  (${ACTIVE_PROMOTION_FILTER})
`;

export const ALL_ACTIVE_PROMOTIONS_QUERY = `
  *[${ACTIVE_PROMOTION_DOCUMENT_FILTER}] | order(${PROMOTION_ORDER}) ${PROMOTION_DOCUMENT_PROJECTION}
`;

export const buildLatestPromotionsQuery = (limit = 5) => `
  *[${ACTIVE_PROMOTION_DOCUMENT_FILTER}] | order(${PROMOTION_ORDER})[0...${limit}] ${PROMOTION_DOCUMENT_PROJECTION}
`;
