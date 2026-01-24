export type MembershipTier = {
  name?: string;
  price?: string | null;
  description?: string | null;
  descriptionHtml?: string;
  benefits?: string[];
  familyBenefits?: string[];
  hotelsGyms?: string[];
  isPopular?: boolean;
  isFamilyFriendly?: boolean;
  isBusinessOnly?: boolean;
  cardColor?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  categoryName?: string;
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

export type MembershipTierEntry = {
  membership: MembershipInfo;
  tier: MembershipTier;
};

export const defaultTierColors = [
  "#f4b942", // gold - more vibrant
  "#e8e8e8", // silver - brighter metallic
  "#d4a574", // bronze - richer tone
] as const;

// =============================================================================
// MOCK MEMBERSHIPS DATA (fallback when API is unavailable)
// =============================================================================

export const MOCK_MEMBERSHIPS: MembershipInfo[] = [
  {
    title: "EliteSport Memberships",
    ctaLabel: "Contact Membership",
    ctaUrl: "/contact",
    tiers: [
      {
        name: "Gold",
        description:
          "This plan includes premium hotels, resorts, and gyms across the UAE, offering wide access to high-end hospitality and fitness facilities.",
        benefits: [
          "Beach",
          "Swimming",
          "Pool",
          "Sauna",
          "Steam",
          "Jacuzzi",
          "Gym",
          "Kids play area",
        ],
        familyBenefits: [
          "All single benefits",
          "Up to 4 family members included",
          "Kids club access",
          "Family wellness programs",
          "Priority family event booking",
        ],
        hotelsGyms: [
          "Millennium Al Rawdha",
          "Park Hyatt Al Saadiyat Abu Dhabi",
          "Etizan Fitness Mixed Gym",
          "Radisson Blu Hotel & Resort Abu Dhabi",
          "Abu Dhabi Golf Club",
          "Grand Millennium – Al Wahda",
          "UFC Gym",
          "Millennium Central – Al Mafraq",
          "Uform Fitness",
          "Khaldiya Palace Rayhaan",
          "St. Regis Hotel Abu Dhabi Corniche",
          "Al Forsan International Sports Resort",
          "InterContinental Hotel Abu Dhabi",
          "Fitness First UAE",
          "UAE JJ Fitness",
          "Radisson Blu Hotel & Resort Al Ain",
          "Inspire Sports Ladies Club",
          "Workout Gym Al Ain",
          "Millennium Downtown Abu Dhabi",
        ],
        isPopular: false,
        isFamilyFriendly: false,
        isBusinessOnly: true,
        cardColor: "#f4b942",
        ctaLabel: "Contact Business Team",
        ctaUrl: "/contact",
      },
      {
        name: "Silver",
        description:
          "This plan includes premium hotels, resorts, and gyms across the UAE, providing broad access to hotels and fitness centers nationwide.",
        benefits: [
          "Beach",
          "Swimming",
          "Pool",
          "Sauna",
          "Steam",
          "Jacuzzi",
          "Gym",
          "Kids play area",
        ],
        familyBenefits: [
          "2 Adults & 2 Kids",
          "One Year",
        ],
        hotelsGyms: [
          "Radisson Blu Hotel & Resort Abu Dhabi",
          "Radisson Blu Hotel & Resort Al Ain",
          "Grand Millennium Al Wahda",
          "Metropolitan Al Mafraq",
          "Millennium Al Rawdha",
          "Khaldiya Palace Rotana",
          "Millennium Downtown Hotel Abu Dhabi",
          "VOGO Hotel Abu Dhabi",
          "Fitness First (All Branches)",
          "St. Regis Hotel Abu Dhabi Corniche",
          "InterContinental Hotel Abu Dhabi",
          "Etizan Fitness Mixed Gym",
          "Adrenagy Fitness",
          "45 Min Fitness",
          "UFC Gym (All Branches)",
          "Abu Dhabi Golf Club",
          "Energy Plus Khalifa City",
          "UForm Al Ain",
          "UForm Dubai",
          "UForm Fujairah",
        ],
        isPopular: false,
        isFamilyFriendly: true,
        cardColor: "#e8e8e8",
        ctaLabel: "Join Silver",
        ctaUrl: "/contact",
      },
      {
        name: "Bronze",
        description:
          "This plan includes selected premium hotels, resorts, and gyms across the UAE, offering essential leisure and fitness access.",
        benefits: [
          "Beach",
          "Swimming",
          "Pool",
          "Sauna",
          "Steam",
          "Jacuzzi",
          "Gym",
          "Kids play area",
        ],
        familyBenefits: [
          "2 Adults & 2 Kids",
          "One Year Membership",
        ],
        hotelsGyms: [
          "VOGO Hotel Abu Dhabi",
          "Millennium Downtown Hotel",
          "Grand Millennium Al Wahda",
          "Metropolitan Al Mafraq",
          "Millennium Al Rawdha",
          "Khalidiya Palace Rotana",
          "Etizan Fitness Mixed Gym",
          "Fitness First (All Branches)",
          "UFC Gym (All Branches)",
          "Abu Dhabi Golf Hotel",
        ],
        isPopular: false,
        isFamilyFriendly: true,
        cardColor: "#d4a574",
        ctaLabel: "Start Bronze",
        ctaUrl: "/contact",
      },
      {
        name: "Gym",
        description:
          "This plan provides access to gyms across the UAE, covering a wide range of fitness clubs.",
        hotelsGyms: [
          "Etizan Fitness Mixed Gym",
          "45 Minute Fitness",
          "Adrenagy Gym",
          "UFC gyms (multiple branches)",
          "Fitness First UAE branches",
          "Workout Gym Al Ain",
          "Energy Plus Khalifa City",
        ],
        isPopular: false,
        isFamilyFriendly: false,
        cardColor: "#6fafce",
        ctaLabel: "Join Gym",
        ctaUrl: "/contact",
      },
      {
        name: "She",
        description:
          "This category is for ladies only and includes access to multiple women-only fitness clubs across the UAE.",
        hotelsGyms: [
          "Adrenagy Fitness Center",
          "45 min Fitness",
          "Inspire Sports Club for Ladies",
          "Millenium Al Rawdha",
          "Grand Millennium Al Wahda",
          "Workout Gym",
          "Fitness First – Abu Dhabi Mall",
          "Fitness First – Dalma Mall",
          "Fitness First – Al Seef Mall",
          "Fitness First – Bawabat Al Sharq",
          "Fitness First – Marina Mall",
          "Fitness First – Hili Mall",
          "Fitness First – Al Barsha",
          "Fitness First – Palm Jabal Ali",
          "Fitness First – Burjuman Center",
          "Fitness First – DAMAC Hills",
          "Fitness First – Deira City Centre",
          "Fitness First – Dubai Festival City",
          "Fitness First – Dubai International Financial Centre",
          "Fitness First – Dubai Silicon Oasis",
          "Fitness First – Ibn Battuta Mall",
          "Fitness First – Marina Gate",
          "Fitness First – Meadows Village",
          "Fitness First – Motor City",
          "Fitness First – Mudon Athletic Concept",
          "Fitness First – Oasis Center",
          "Fitness First – Uptown Mirdif",
          "Fitness First – Mirdif City Center",
          "Fitness First – Vision Tower",
          "Fitness First – Sahara Centre",
          "Fitness First – Zero 6",
        ],
        isPopular: false,
        isFamilyFriendly: false,
        cardColor: "#e91e8c",
        ctaLabel: "Join She",
        ctaUrl: "/contact",
      },
    ],
    faq: [
      {
        question: "How do I upgrade my membership?",
        answer:
          "Contact our membership team via the app or website. Upgrades are prorated based on your remaining membership period.",
      },
      {
        question: "Can I freeze my membership?",
        answer:
          "Yes, members can freeze their membership for up to 3 months per year for medical or travel reasons.",
      },
      {
        question: "Are there family membership options?",
        answer:
          "Gold and Silver tiers offer family benefits. Contact our team for family package pricing.",
      },
      {
        question: "What happens if a partner location closes?",
        answer:
          "We continuously update our network. If a location closes, we'll direct you to the nearest alternative partner.",
      },
    ],
  },
];

export const getMemberships = (): MembershipInfo[] => {
  return MOCK_MEMBERSHIPS;
};

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

// =============================================================================
// PLAN CATEGORY TYPES & UTILITIES (for Plans API integration)
// =============================================================================

export type PlanCategoryName = "Bronze" | "Silver" | "Gold" | "SHE" | "Gym Only";

export type PlanVariant = {
  id: string;
  name: string;
  planType: "single" | "family";
  categoryName: PlanCategoryName;
  descriptionHtml: string;
  descriptionText: string | null;
  includedServices: string[];
  price: string | null;
};

export type PlanCategoryWithVariants = {
  categoryName: PlanCategoryName;
  categorySlug: string;
  heroDescription: string;
  variants: PlanVariant[];
};

const CATEGORY_NAME_MAP: Record<string, PlanCategoryName> = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
  she: "SHE",
  "gym only": "Gym Only",
  gym: "Gym Only",
  "gymonly": "Gym Only",
};

const CATEGORY_SLUG_MAP: Record<PlanCategoryName, string> = {
  Bronze: "bronze",
  Silver: "silver",
  Gold: "gold",
  SHE: "she",
  "Gym Only": "gym",
};

export function normalizePlanCategoryName(
  raw: string | undefined | null
): PlanCategoryName | null {
  if (!raw) return null;
  const normalized = raw.trim().toLowerCase();
  return CATEGORY_NAME_MAP[normalized] ?? null;
}

export function normalizePlanType(
  raw: string | undefined | null
): "single" | "family" | null {
  if (!raw) return null;
  const normalized = raw.trim().toLowerCase();
  if (normalized === "single" || normalized === "individual") return "single";
  if (normalized === "family") return "family";
  return null;
}

export function getCategorySlug(categoryName: PlanCategoryName): string | null {
  return CATEGORY_SLUG_MAP[categoryName] ?? null;
}

export function getAvailablePlanTypes(
  categories: PlanCategoryWithVariants[]
): ("single" | "family")[] {
  const types = new Set<"single" | "family">();
  categories.forEach((cat) => {
    cat.variants.forEach((v) => types.add(v.planType));
  });
  // Ensure consistent ordering: single first, then family
  const result: ("single" | "family")[] = [];
  if (types.has("single")) result.push("single");
  if (types.has("family")) result.push("family");
  return result;
}

export function buildTiersForPlanType(
  categories: PlanCategoryWithVariants[],
  planType: "single" | "family"
): MembershipTier[] {
  return categories.flatMap((cat) =>
    cat.variants
      .filter((v) => v.planType === planType)
      .map((v) => ({
        name: v.name,
        price: v.price ?? undefined,
        description: v.descriptionText ?? undefined,
        descriptionHtml: v.descriptionHtml,
        benefits: v.includedServices,
        categoryName: v.categoryName,
      }))
  );
}

/**
 * Convert PlanCategoryWithVariants[] (from Plans API) to MembershipInfo[] 
 * (legacy format expected by memberships pages).
 * This enables backward-compatible rendering with existing components.
 */
export function planCategoriesToMembershipInfo(
  categories: PlanCategoryWithVariants[]
): MembershipInfo[] {
  if (!categories || categories.length === 0) {
    return [];
  }

  // Flatten all variants into MembershipTier objects and wrap in a single MembershipInfo
  const tiers: MembershipTier[] = categories.flatMap((cat) =>
    cat.variants.map((v) => ({
      name: v.name,
      price: v.price ?? null,
      description: v.descriptionText ?? null,
      descriptionHtml: v.descriptionHtml,
      benefits: v.includedServices,
      categoryName: v.categoryName,
      // Set isFamilyFriendly based on whether this category has both single and family variants
      // Gold tier is explicitly excluded from being family friendly
      isFamilyFriendly: v.categoryName !== "Gold" && cat.variants.some((variant) => variant.planType === "family"),
    }))
  );

  // Return as a single MembershipInfo wrapper
  return [
    {
      title: "Memberships",
      ctaLabel: "Contact Membership",
      ctaUrl: "/contact",
      tiers,
      faq: [],
    },
  ];
}

