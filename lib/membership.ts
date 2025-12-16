export type MembershipTier = {
  name?: string;
  price?: string;
  description?: string;
  benefits?: string[];
  isPopular?: boolean;
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
      isPopular,
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

const defaultTierColors = [
  "linear-gradient(135deg, #8f6b29 0%, #fde08d 50%, #df9f28 100%)", // gold
  "linear-gradient(135deg, #5f5f61 0%, #c0c0c0 50%, #f5f7fa 100%)", // silver
  "linear-gradient(135deg, #4c2a0a 0%, #cd7f32 55%, #f4b183 100%)", // bronze
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

export const getTierCardBackground = (
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

  return undefined;
};
