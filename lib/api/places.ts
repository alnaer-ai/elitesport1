/**
 * Places API Client
 *
 * Server-side only module for fetching places (hotels, gyms, clubs) from the EliteSport API.
 * This module replaces the legacy hotels.ts client.
 */

import type { Place, PlaceCategory, PlaceService } from "@/lib/placeTypes";

// =============================================================================
// TYPES
// =============================================================================

export type PlaceServiceApi = {
    id: number;
    name: string;
    icon?: string;
    thumbnail?: string;
};

export type PlaceApiResponse = {
    id: number;
    name?: string;
    description?: string; // HTML
    place_offers?: string; // HTML, or sometimes "offers" key
    offers?: string;       // Fallback for offers
    address?: string;      // Used for location derivation
    image?: string;        // Main image
    gallery?: string[];    // Array of image URLs
    services?: PlaceServiceApi[];
    // Contact info exists in API but MUST NOT be mapped/used
    phone?: string;
    email?: string;
    [key: string]: unknown;
};

// =============================================================================
// CONFIGURATION
// =============================================================================

// Use the new variable for Places, fallback to legacy if needed
const API_URL =
    process.env.ELITESPORT_GET_HOTELS_WEB_URL ?? process.env.ELITESPORT_API_URL;
const API_TOKEN = process.env.ELITESPORT_API_TOKEN;
const API_BASE_URL = "https://elitesport.online";

// =============================================================================
// HELPERS
// =============================================================================

function getFullImageUrl(imagePath: string | undefined | null): string | null {
    if (!imagePath) return null;
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
        return imagePath;
    }
    const path = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `${API_BASE_URL}${path}`;
}

/**
 * Derives the primary category and tags from the list of services/facilities.
 * Strictly follows the logic:
 * - Hotels: Service name contains "Hotel"
 * - Gyms: Service name contains "Gym" or "Training" or "Fitness"
 * - Females: Service name contains "Female" or "Ladies"
 * - Kids: Service name contains "Kid" or "Child"
 * - Tennis/Squash: Service name contains "Tennis" or "Squash"
 * - Spa: Service name contains "Spa" or "Wellness"
 */
function deriveCategoryAndTags(services: PlaceServiceApi[] = []): {
    category: PlaceCategory;
    tags: string[];
} {
    const serviceNames = services.map((s) => s.name.toLowerCase());
    const tags: string[] = [];

    // Default category
    let category: PlaceCategory = "wellness";

    // Check for categories in priority order
    if (serviceNames.some((n) => n.includes("hotel") || n.includes("residence"))) {
        category = "hotel";
    } else if (serviceNames.some((n) => n.includes("gym") || n.includes("fitness") || n.includes("training"))) {
        category = "gym";
    } else if (serviceNames.some((n) => n.includes("padel") || n.includes("tennis") || n.includes("squash"))) {
        category = "tennisSquash";
    } else if (serviceNames.some((n) => n.includes("spa") || n.includes("sauna") || n.includes("massage"))) {
        category = "spa";
    }

    // Derive Tags
    if (serviceNames.some((n) => n.includes("kid") || n.includes("child") || n.includes("family"))) {
        tags.push("Family Friendly");
    }
    if (serviceNames.some((n) => n.includes("female") || n.includes("ladies") || n.includes("women"))) {
        tags.push("For women");
    }
    if (serviceNames.some((n) => n.includes("pool") || n.includes("swim"))) {
        tags.push("Pool");
    }

    return { category, tags };
}

// =============================================================================
// MAPPER
// =============================================================================

export function mapPlaceApiResponse(item: PlaceApiResponse): Place {
    const id = `place-${item.id}`;
    const name = item.name ?? "Elite Destination";

    // Transform services
    const services: PlaceService[] = (item.services ?? []).map((s) => ({
        id: `svc-${s.id}`,
        name: s.name,
        icon: s.icon,
        thumbnail: getFullImageUrl(s.thumbnail) ?? undefined,
    }));

    // Derive category and tags
    const { category, tags } = deriveCategoryAndTags(item.services ?? []);

    // HTML Content
    // Prefer 'description', fallback to manual mapping if needed
    const description = item.description ?? null;
    const offers = item.place_offers ?? item.offers ?? null;

    // Media
    const featuredImageUrl = getFullImageUrl(item.image);
    const imageUrls = (item.gallery ?? []).map((url) => getFullImageUrl(url)).filter((url): url is string => !!url);

    // Address derived location (simple string)
    const location = item.address ?? null;

    return {
        _id: id,
        name,
        description,
        offers,
        services,
        placeType: category, // Derived
        category,            // Derived
        location,
        featuredImageUrl,
        imageUrls: imageUrls.length > 0 ? imageUrls : null,
        imageAlt: `${name} - EliteSport Destination`,
        showInMostPopular: false, // Default
        slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        tags: tags.length > 0 ? tags : null,

        // Legacy mapping (empty arrays to prevent errors in existing components until updated)
        overview: null,
        benefits: null,
    };
}

// =============================================================================
// API CLIENT
// =============================================================================

export async function fetchPlaces(): Promise<Place[]> {
    if (!API_URL) {
        console.error("Missing ELITESPORT_GET_HOTELS_WEB_URL");
        return [];
    }
    if (!API_TOKEN) {
        console.error("Missing ELITESPORT_API_TOKEN");
        return [];
    }

    try {
        const authHeader = API_TOKEN.startsWith("Token ") ? API_TOKEN : `Token ${API_TOKEN}`;

        // Using POST as per previous pattern, or GET depending on updated API spec. 
        // Assuming POST for now based on legacy implementation of the same endpoint structure.
        const response = await fetch(API_URL, {
            method: "POST",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
                Authorization: authHeader,
            },
            body: JSON.stringify({}),
        });

        if (!response.ok) {
            console.error(`Places API Error: ${response.status} ${response.statusText}`);
            return [];
        }

        const json = await response.json();

        // Normalize data structure
        let results: PlaceApiResponse[] = [];
        if (Array.isArray(json)) {
            results = json;
        } else if (Array.isArray(json.data)) {
            results = json.data;
        } else if (Array.isArray(json.results)) {
            results = json.results;
        }

        return results.map(mapPlaceApiResponse);

    } catch (error) {
        console.error("Failed to fetch places", error);
        return [];
    }
}
