export type MembershipTier = {
  name?: string;
  price?: string;
  description?: string;
  benefits?: string[];
  familyBenefits?: string[];
  hotelsGyms?: string[];
  isPopular?: boolean;
  isFamilyFriendly?: boolean;
  cardColor?: string;
  ctaLabel?: string;
  ctaUrl?: string;
};

export type MembershipFaq = {
  question?: string;
  answer?: string;
};

export type MembershipInfo = {
  title?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  tiers?: MembershipTier[];
  faq?: MembershipFaq[];
};

export const MEMBERSHIP_QUERY = `
  *[_type == "membershipInfo"] | order(_createdAt asc){
    title,
    ctaLabel,
    ctaUrl,
    tiers[]{
      name,
      price,
      description,
      benefits,
      familyBenefits,
      hotelsGyms,
      isPopular,
      isFamilyFriendly,
      cardColor,
      ctaLabel,
      ctaUrl
    },
    faq[]{
      question,
      answer
    }
  }
`;

export type MembershipTierEntry = {
  membership: MembershipInfo;
  tier: MembershipTier;
};

export const defaultTierColors = [
  "#f4b942", // gold - more vibrant
  "#e8e8e8", // silver - brighter metallic
  "#d4a574", // bronze - richer tone
] as const;

export const collectMembershipTiers = (memberships: MembershipInfo[]) =>
  memberships.flatMap((entry) => entry.tiers ?? []);

export const collectMembershipFaqs = (memberships: MembershipInfo[]) =>
  memberships.flatMap((entry) => entry.faq ?? []);

export const mapMembershipTierEntries = (memberships: MembershipInfo[]) =>
  memberships.flatMap((entry) =>
    (entry.tiers ?? []).map((tier) => ({
      membership: entry,
      tier,
    }))
  );

const slugifyPattern = /[^a-z0-9]+/g;

export const getTierSlug = (tierName?: string) => {
  if (!tierName) return;

  return tierName
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(slugifyPattern, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

export const getTierHref = (tierName?: string) => {
  const slug = getTierSlug(tierName);
  return slug ? `/memberships/${slug}` : "/memberships";
};

export const getTierColor = (
  tier: MembershipTier,
  fallbackIndex?: number
) => {
  const configuredColor = tier.cardColor?.trim();
  if (configuredColor) {
    return configuredColor;
  }

  if (typeof fallbackIndex === "number" && fallbackIndex >= 0) {
    const paletteIndex = Math.min(fallbackIndex, defaultTierColors.length - 1);
    return defaultTierColors[paletteIndex];
  }

  return defaultTierColors[0];
};

/**
 * @deprecated Use getTierColor instead
 */
export const getTierCardBackground = (
  tier: MembershipTier,
  fallbackIndex?: number
) => {
  return getTierColor(tier, fallbackIndex);
};
