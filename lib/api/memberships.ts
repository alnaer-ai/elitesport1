/**
 * Memberships/Plans API Client
 *
 * Server-side only module for fetching membership plans data from the EliteSport API.
 * This module should only be used in getStaticProps, getServerSideProps, or API routes.
 */

import type { MembershipTier, MembershipInfo } from "@/lib/membership";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Plan card styling data from the API.
 */
type PlanCardApiResponse = {
    name: string;
    primary_color: string;
    gradient_1: string;
    gradient_2: string;
    card_header: string | null;
    card_logo: string | null;
    card_bg: string | null;
};

/**
 * Plan category object from the API.
 */
type PlanCategoryApiResponse = {
    id: number;
    name: string;
    description: string;
    discount: string;
    image: string;
    plancard: PlanCardApiResponse;
};

/**
 * Raw plan data from the EliteSport API.
 * Endpoint: POST https://elitesport.online/api/get-plans-web
 */
type PlanApiResponse = {
    id: number;
    plan_category: PlanCategoryApiResponse;
    plan_type: "single" | "family";
};

/**
 * Full API response wrapper from /get-plans-web endpoint.
 */
type PlansApiResult = {
    data: PlanApiResponse[];
    status?: "success" | "error";
};

// =============================================================================
// CONFIGURATION
// =============================================================================

const API_BASE_URL = "https://elitesport.online";
const PLANS_API_URL = process.env.ELITESPORT_GET_PLANS_WEB_URL;
const API_TOKEN = process.env.ELITESPORT_API_TOKEN;

// Target categories to display on membership page
const TARGET_CATEGORIES = ["Gold", "Silver", "Gym Only"];

// =============================================================================
// API CLIENT
// =============================================================================

/**
 * Fetches raw membership plans data from the EliteSport API.
 *
 * This function is server-side only and should never be called from client code.
 * Uses POST request with token-based authorization.
 *
 * @returns Promise<PlanApiResponse[]> - Array of plan data from API
 * @throws Error if API configuration is missing or request fails
 */
async function fetchPlansFromApi(): Promise<PlanApiResponse[]> {
    if (!PLANS_API_URL) {
        throw new Error(
            "[Memberships API] Missing ELITESPORT_GET_PLANS_WEB_URL environment variable"
        );
    }

    if (!API_TOKEN) {
        throw new Error(
            "[Memberships API] Missing ELITESPORT_API_TOKEN environment variable"
        );
    }

    try {
        const authHeader = API_TOKEN.startsWith("Token ")
            ? API_TOKEN
            : `Token ${API_TOKEN}`;

        const response = await fetch(PLANS_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: authHeader,
            },
            body: JSON.stringify({}),
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => "Unknown error");
            console.error(
                `[Memberships API] Request failed with status ${response.status}:`,
                errorText
            );
            throw new Error(
                `Memberships API request failed: ${response.status} ${response.statusText}`
            );
        }

        const data: PlansApiResult = await response.json();

        // API returns { data: [...], status: "success" }
        const plans: PlanApiResponse[] = Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
                ? data.data
                : [];

        return plans;
    } catch (error) {
        if (error instanceof Error && error.message.includes("Memberships API")) {
            throw error;
        }

        console.error("[Memberships API] Unexpected error:", error);
        throw new Error(
            `Failed to fetch membership plans: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}

// =============================================================================
// MAPPING UTILITIES
// =============================================================================

/**
 * Strips HTML tags from a string and cleans up whitespace.
 *
 * @param html - HTML string to clean
 * @returns Plain text string
 */
function stripHtml(html: string | undefined | null): string {
    if (!html) return "";

    return html
        .replace(/<[^>]*>/g, " ") // Replace tags with spaces
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/\s+/g, " ") // Normalize whitespace
        .trim();
}

/**
 * Extracts a short description from the full HTML description.
 * Takes the first meaningful paragraph.
 *
 * @param description - Full HTML description
 * @returns Shortened plain text description
 */
function extractShortDescription(description: string): string {
    const plainText = stripHtml(description);

    // Find first sentence or limit to ~200 chars
    const firstSentenceMatch = plainText.match(/^[^.!?]+[.!?]/);
    if (firstSentenceMatch && firstSentenceMatch[0].length <= 200) {
        return firstSentenceMatch[0];
    }

    if (plainText.length <= 200) {
        return plainText;
    }

    return plainText.substring(0, 197).trim() + "...";
}

/**
 * Maps a raw plan API response to the MembershipTier type used by UI components.
 *
 * @param plan - Raw plan data from API
 * @returns MembershipTier compatible with UI components
 */
function mapPlanToMembershipTier(plan: PlanApiResponse): MembershipTier {
    const category = plan.plan_category;
    const plancard = category.plancard;

    // Use plan card primary color, or default based on category name
    let cardColor = plancard?.primary_color || "#f4b942";
    if (!plancard?.primary_color) {
        const categoryLower = category.name.toLowerCase();
        if (categoryLower.includes("gold")) {
            cardColor = "#f4b942";
        } else if (categoryLower.includes("silver")) {
            cardColor = "#e8e8e8";
        } else if (categoryLower.includes("gym")) {
            cardColor = "#6fafce";
        }
    }

    return {
        name: category.name,
        description: extractShortDescription(category.description),
        descriptionHtml: category.description,
        cardColor,
        ctaLabel: "Learn More",
        ctaUrl: "/contact",
        isPopular: false,
        isFamilyFriendly: plan.plan_type === "family",
        isBusinessOnly: false,
    };
}

// =============================================================================
// DATA FILTERING
// =============================================================================

/**
 * Filters plans to get only Gold, Silver, and Gym memberships.
 * For Gold, returns only one (single type preferred).
 *
 * @param plans - All plans from API
 * @returns Filtered array of plans
 */
function filterTargetMemberships(plans: PlanApiResponse[]): PlanApiResponse[] {
    const result: PlanApiResponse[] = [];
    let hasGold = false;

    for (const plan of plans) {
        const categoryName = plan.plan_category.name;

        // Check if this is a target category
        const isTargetCategory = TARGET_CATEGORIES.some(
            (target) => categoryName.toLowerCase() === target.toLowerCase()
        );

        if (!isTargetCategory) {
            continue;
        }

        // For Gold: only take one, prefer single type
        if (categoryName.toLowerCase() === "gold") {
            if (!hasGold) {
                // Prefer single over family
                if (plan.plan_type === "single") {
                    result.push(plan);
                    hasGold = true;
                }
            }
            continue;
        }

        // For Silver: take both single and family if available
        // But to avoid duplicates, only take single type
        if (categoryName.toLowerCase() === "silver") {
            if (plan.plan_type === "single") {
                result.push(plan);
            }
            continue;
        }

        // For Gym Only: take single type
        if (categoryName.toLowerCase() === "gym only") {
            if (plan.plan_type === "single") {
                result.push(plan);
            }
            continue;
        }
    }

    // If we didn't find a single Gold, try family
    if (!hasGold) {
        const goldFamily = plans.find(
            (p) =>
                p.plan_category.name.toLowerCase() === "gold" &&
                p.plan_type === "family"
        );
        if (goldFamily) {
            result.unshift(goldFamily);
        }
    }

    return result;
}

/**
 * Sorts memberships in a preferred order: Gold first, then Silver, then Gym.
 *
 * @param tiers - Array of membership tiers
 * @returns Sorted array
 */
function sortMembershipTiers(tiers: MembershipTier[]): MembershipTier[] {
    const order: Record<string, number> = {
        gold: 0,
        silver: 1,
        "gym only": 2,
    };

    return [...tiers].sort((a, b) => {
        const orderA = order[a.name?.toLowerCase() ?? ""] ?? 99;
        const orderB = order[b.name?.toLowerCase() ?? ""] ?? 99;
        return orderA - orderB;
    });
}

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Fetches membership plans from the API and returns them as MembershipInfo.
 *
 * Filters for Gold (single only, one instance), Silver, and Gym memberships.
 * Returns data in the format expected by the memberships page.
 *
 * @returns Promise<MembershipInfo[]> - Array of MembershipInfo, or empty array on error
 */
export async function fetchMembershipPlans(): Promise<MembershipInfo[]> {
    try {
        const rawPlans = await fetchPlansFromApi();
        const filteredPlans = filterTargetMemberships(rawPlans);
        const tiers = filteredPlans.map(mapPlanToMembershipTier);
        const sortedTiers = sortMembershipTiers(tiers);

        // Wrap in MembershipInfo format for compatibility with existing page
        return [
            {
                title: "EliteSport Memberships",
                ctaLabel: "Contact Membership",
                ctaUrl: "/contact",
                tiers: sortedTiers,
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
    } catch (error) {
        console.error("[Memberships API] Failed to fetch membership plans:", error);
        return [];
    }
}
