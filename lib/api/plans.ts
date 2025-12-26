/**
 * Plans API Client
 *
 * Server-side only module for fetching membership plans from the EliteSport API.
 * This replaces mock membership data with the live /get-plans-web endpoint.
 */

import {
    type PlanCategoryName,
    type PlanCategoryWithVariants,
    type PlanVariant,
    normalizePlanCategoryName,
    normalizePlanType,
    getCategorySlug,
} from "@/lib/membership";
import DOMPurify from "isomorphic-dompurify";

// =============================================================================
// TYPES
// =============================================================================

// We purposefully omit all styling/cosmetic fields from the API definition 
// to ensure we never use them. We only map what we explicitly trust.

export type PlanCategoryApi = {
    id?: number;
    name?: string;
    description?: string;
    // We ignore 'plancard' entirely as it contains prohibited styling data
};

export type PlanApiResponse = {
    id: number;
    name?: string;
    description?: string; // HTML
    included_services?: string[] | string;
    plan_category?: PlanCategoryApi | string | null;
    plan_type?: string | null;
    price?: string;
};

export type PlansApiResult = {
    data?: PlanApiResponse[];
    status?: "success" | "error";
};

// =============================================================================
// CONFIGURATION
// =============================================================================

const PLANS_API_URL = process.env.ELITESPORT_GET_PLANS_WEB_URL;
const API_TOKEN = process.env.ELITESPORT_API_TOKEN;

// =============================================================================
// HELPERS
// =============================================================================

const CATEGORY_PRIORITY: PlanCategoryName[] = [
    "Gold",
    "Silver",
    "Bronze",
    "SHE",
    "Gym Only",
];

const CARD_DESCRIPTIONS: Record<PlanCategoryName, string> = {
    Bronze: "This plan includes selected premium hotels, resorts, and gyms across the UAE, offering essential leisure and fitness access.",
    Silver: "This plan includes premium hotels, resorts, and gyms across the UAE, providing broad access to hotels and fitness centers nationwide.",
    Gold: "This plan includes premium hotels, resorts, and gyms in Abu Dhabi, offering wide access to high-end hospitality and fitness facilities. This plan For corporate clients.",
    SHE: "This category is for ladies only and includes access to multiple women-only fitness clubs across the UAE.",
    "Gym Only": "This plan provides access to gyms across the UAE, covering a wide range of fitness clubs.",
};

const HERO_DESCRIPTIONS: Record<PlanCategoryName, string> = {
    Bronze: "This plan includes selected premium hotels, resorts, and gyms across the UAE, offering essential leisure and fitness access.",
    Silver: "This plan includes premium hotels, resorts, and gyms across the UAE, providing broad access to hotels and fitness centers nationwide.",
    Gold: "This plan includes premium hotels, resorts, and gyms in Abu Dhabi, offering wide access to high-end hospitality and fitness facilities. This plan For corporate clients.",
    SHE: "This category is for ladies only and includes access to multiple women-only fitness clubs across the UAE.",
    "Gym Only": "This plan provides access to gyms across the UAE, covering a wide range of fitness clubs.",
};

function normalizeIncludedServices(
    raw: unknown
): string[] {
    if (Array.isArray(raw)) {
        return raw
            .map((item) => (typeof item === "string" ? item.trim() : ""))
            .filter(Boolean);
    }

    if (typeof raw === "string") {
        return raw
            .split(/\r?\n|,/)
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return [];
}

const sanitizeHtml = (html: string) => {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "div", "br", "ul", "li", "span"],
        ALLOWED_ATTR: ["href", "target", "rel"],
    });
};

const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, "");
};

function mapPlanRecordToVariant(
    record: PlanApiResponse
): PlanVariant | null {
    const rawCategoryName = typeof record.plan_category === "string"
        ? record.plan_category
        : record.plan_category?.name;

    const categoryName = normalizePlanCategoryName(rawCategoryName);

    if (!categoryName) return null;

    const planType = normalizePlanType(record.plan_type) ?? "single";

    // Strictly prioritize record name or standardized fallback. 
    // We do NOT read nested plancard names.
    const name = record.name?.trim() || `${categoryName} Plan`;

    // Description priority: plan_category.description -> record.description
    const rawDescription =
        (typeof record.plan_category === "object" ? record.plan_category?.description : null) ??
        record.description ?? "";


    const descriptionHtml = sanitizeHtml(rawDescription);
    // Use strictly defined card description if available, otherwise fallback to API text
    const descriptionText = CARD_DESCRIPTIONS[categoryName] ?? stripHtml(rawDescription);

    // Normalize services
    const includedServices = normalizeIncludedServices(
        record.included_services
    );

    return {
        id: `plan-${record.id}-${planType}`,
        name,
        planType,
        categoryName,
        descriptionHtml,
        descriptionText: descriptionText || null,
        includedServices,
        price: record.price ?? null,
    };
}

// =============================================================================
// API CLIENT
// =============================================================================

export async function fetchPlans(): Promise<PlanCategoryWithVariants[]> {
    if (!PLANS_API_URL) {
        console.error("[Plans API] Missing ELITESPORT_GET_PLANS_WEB_URL");
        return [];
    }

    if (!API_TOKEN) {
        console.error("[Plans API] Missing ELITESPORT_API_TOKEN");
        return [];
    }

    try {
        const authHeader = API_TOKEN.startsWith("Token ")
            ? API_TOKEN
            : `Token ${API_TOKEN}`;

        const response = await fetch(PLANS_API_URL, {
            method: "POST",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
                Authorization: authHeader,
            },
            body: JSON.stringify({}),
        });

        if (!response.ok) {
            console.error(`[Plans API] ${response.status} ${response.statusText}`);
            return [];
        }

        const payload = await response.json();
        const rawPlans: PlanApiResponse[] = Array.isArray(payload)
            ? payload
            : Array.isArray(payload?.data)
                ? payload.data
                : [];

        const variants: PlanVariant[] = rawPlans
            .map(mapPlanRecordToVariant)
            .filter((variant): variant is PlanVariant => Boolean(variant));

        // Grouping logic remains the same
        const grouped = new Map<PlanCategoryName, PlanCategoryWithVariants>();

        variants.forEach((variant) => {
            const categorySlug = getCategorySlug(variant.categoryName);
            if (!categorySlug) return;

            const existing = grouped.get(variant.categoryName);
            if (existing) {
                existing.variants.push(variant);
            } else {
                grouped.set(variant.categoryName, {
                    categoryName: variant.categoryName,
                    categorySlug,
                    heroDescription: HERO_DESCRIPTIONS[variant.categoryName],
                    variants: [variant],
                });
            }
        });

        const categories = Array.from(grouped.values());

        // Sort variants within categories (Single first)
        categories.forEach((category) => {
            category.variants.sort((a, b) => {
                if (a.planType === b.planType) return 0;
                if (a.planType === "single") return -1;
                return 1;
            });
        });

        // Sort categories by priority
        categories.sort((a, b) => {
            const aIndex = CATEGORY_PRIORITY.indexOf(a.categoryName);
            const bIndex = CATEGORY_PRIORITY.indexOf(b.categoryName);
            if (aIndex === -1 && bIndex === -1) return 0;
            if (aIndex === -1) return 1;
            if (bIndex === -1) return -1;
            return aIndex - bIndex;
        });

        return categories;
    } catch (error) {
        console.error("[Plans API] Unexpected error", error);
        return [];
    }
}
