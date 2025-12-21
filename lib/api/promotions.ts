/**
 * Promotions API Client
 *
 * Server-side only module for fetching promotions data from the EliteSport API.
 * This module should only be used in getStaticProps, getServerSideProps, or API routes.
 */

import type { PortableTextBlock } from "@portabletext/types";

import type { PromotionRecord } from "@/lib/promotionContent";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Raw promotion data from the EliteSport API.
 * Endpoint: POST https://elitesport.online/api/get-promo-web
 */
export type PromotionApiResponse = {
  id: number;
  name: string;
  discount: number;
  image: string;
  description: string;
  start_date: string;
  end_date: string;
};

/**
 * Full API response wrapper from /get-promo-web endpoint.
 */
export type PromotionsApiResult = {
  data: PromotionApiResponse[];
  status: "success" | "error";
};

// =============================================================================
// CONFIGURATION
// =============================================================================

const API_BASE_URL = "https://elitesport.online";
const PROMOTIONS_API_URL = process.env.ELITESPORT_PROMOTIONS_API_URL;
const API_TOKEN = process.env.ELITESPORT_API_TOKEN;

// =============================================================================
// API CLIENT
// =============================================================================

/**
 * Fetches raw promotions data from the EliteSport API.
 *
 * This function is server-side only and should never be called from client code.
 * Uses POST request with token-based authorization as specified in the API documentation.
 *
 * @returns Promise<PromotionApiResponse[]> - Array of promotion data from API
 * @throws Error if API configuration is missing or request fails
 */
export async function fetchPromotions(): Promise<PromotionApiResponse[]> {
  if (!PROMOTIONS_API_URL) {
    throw new Error(
      "[Promotions API] Missing ELITESPORT_PROMOTIONS_API_URL environment variable"
    );
  }

  if (!API_TOKEN) {
    throw new Error(
      "[Promotions API] Missing ELITESPORT_API_TOKEN environment variable"
    );
  }

  try {
    const authHeader = API_TOKEN.startsWith("Token ")
      ? API_TOKEN
      : `Token ${API_TOKEN}`;

    const response = await fetch(PROMOTIONS_API_URL, {
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
        `[Promotions API] Request failed with status ${response.status}:`,
        errorText
      );
      throw new Error(
        `Promotions API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // API returns { data: [...], status: "success" }
    const promotions: PromotionApiResponse[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : [];

    return promotions;
  } catch (error) {
    if (error instanceof Error && error.message.includes("Promotions API")) {
      throw error;
    }

    console.error("[Promotions API] Unexpected error:", error);
    throw new Error(
      `Failed to fetch promotions: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

// =============================================================================
// MAPPING UTILITIES
// =============================================================================

/**
 * Constructs a full image URL from a relative path.
 * API returns relative paths like "/media/uploads/..." which need the base URL.
 *
 * @param imagePath - Relative image path from API (e.g., "/media/uploads/file.jpg")
 * @returns Full URL or null if no path provided
 */
function getFullImageUrl(imagePath: string | undefined | null): string | null {
  if (!imagePath) return null;

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const separator = imagePath.startsWith("/") ? "" : "/";
  return `${API_BASE_URL}${separator}${imagePath}`;
}

/**
 * Clean API description text.
 * Normalizes line breaks and trims excessive whitespace.
 *
 * @param description - Raw description from API
 * @returns Cleaned description string
 */
function cleanDescription(description: string | undefined | null): string {
  if (!description) return "";
  return description
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Truncate description for card display.
 * Extracts first paragraph and limits length.
 *
 * @param text - Full description text
 * @param maxLength - Maximum character length
 * @returns Truncated description
 */
function truncateDescription(text: string, maxLength: number): string {
  if (!text) return "Exclusive member benefit curated by EliteSport.";

  const firstParagraph = text.split("\n")[0];
  if (firstParagraph.length <= maxLength) return firstParagraph;

  return firstParagraph.substring(0, maxLength - 3).trim() + "...";
}

/**
 * Convert plain text description to PortableText blocks.
 * Splits by double newlines to create paragraphs.
 *
 * @param description - Cleaned description text
 * @returns Array of PortableText blocks or null
 */
function descriptionToPortableText(
  description: string
): PortableTextBlock[] | null {
  if (!description) return null;

  const paragraphs = description.split("\n\n").filter(Boolean);

  return paragraphs.map((paragraph, index) => ({
    _type: "block" as const,
    _key: `block-${index}`,
    style: "normal" as const,
    children: [
      {
        _type: "span" as const,
        _key: `span-${index}`,
        text: paragraph.replace(/\n/g, " ").trim(),
        marks: [] as string[],
      },
    ],
    markDefs: [],
  }));
}

// =============================================================================
// DATA MAPPING
// =============================================================================

/**
 * Maps a raw promotion API response to the PromotionRecord type used by UI components.
 *
 * Handles the actual API response structure:
 * - id: numeric ID
 * - name: promotion title
 * - discount: discount percentage
 * - image: relative path to image
 * - description: full text description
 * - start_date: validity start date (YYYY-MM-DD)
 * - end_date: validity end date (YYYY-MM-DD)
 *
 * @param apiPromotion - Raw promotion data from API
 * @returns PromotionRecord compatible with UI components
 */
export function mapApiPromotionToRecord(
  apiPromotion: PromotionApiResponse
): PromotionRecord {
  const fullImageUrl = getFullImageUrl(apiPromotion.image);
  const cleanedDescription = cleanDescription(apiPromotion.description);
  const overviewBlocks = descriptionToPortableText(cleanedDescription);

  return {
    _id: `promo-${apiPromotion.id}`,
    title: apiPromotion.name || null,
    promotionType: null, // Not available from API
    overview: overviewBlocks,
    overviewText: truncateDescription(cleanedDescription, 200),
    benefits: null, // Not structured in API descriptions
    ctaLabel: "Learn More",
    ctaAction: "/contact",
    featuredImageUrl: fullImageUrl,
    imageAlt: apiPromotion.name || null,
    discountPercentage: apiPromotion.discount,
    isPublished: true,
    publishStartDate: apiPromotion.start_date || null,
    publishEndDate: apiPromotion.end_date || null,
  };
}

/**
 * Sorts promotions by start date descending (newest first).
 *
 * @param promotions - Array of promotion records
 * @returns Sorted array (new array, does not mutate input)
 */
export function sortPromotionsByDate(
  promotions: PromotionRecord[]
): PromotionRecord[] {
  return [...promotions].sort((a, b) => {
    const dateA = a.publishStartDate
      ? new Date(a.publishStartDate).getTime()
      : 0;
    const dateB = b.publishStartDate
      ? new Date(b.publishStartDate).getTime()
      : 0;
    return dateB - dateA; // Descending order
  });
}

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Fetches promotions from the API and maps them to PromotionRecord objects.
 *
 * This is the main entry point for getting promotions data.
 * Includes graceful error handling - returns empty array on failure rather than throwing.
 *
 * @returns Promise<PromotionRecord[]> - Array of PromotionRecord objects, or empty array on error
 */
export async function getPromotions(): Promise<PromotionRecord[]> {
  try {
    const rawPromotions = await fetchPromotions();
    const mappedPromotions = rawPromotions.map(mapApiPromotionToRecord);
    const sortedPromotions = sortPromotionsByDate(mappedPromotions);

    return sortedPromotions;
  } catch (error) {
    console.error("[Promotions API] Failed to fetch and map promotions:", error);
    return [];
  }
}

