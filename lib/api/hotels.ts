/**
 * Hotels API Client
 * 
 * Server-side only module for fetching hotels data from the EliteSport API.
 * This module should only be used in getStaticProps, getServerSideProps, or API routes.
 */

import type { Place } from "@/lib/placeTypes";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Raw hotel data from API response.
 * Based on actual API response structure observed:
 * { id: 2, name: "...", phone: "...", address: "...", image: "/media/uploads/..." }
 */
export type HotelApiResponse = {
  id: number;
  name?: string;
  phone?: string;
  address?: string;
  image?: string;
  // Allow additional fields in case API shape evolves
  [key: string]: unknown;
};

// =============================================================================
// CONFIGURATION
// =============================================================================

// Prefer the explicit hotels endpoint; fall back to the legacy ELITESPORT_API_URL for compatibility
const API_URL =
  process.env.ELITESPORT_HOTELS_API_URL ?? process.env.ELITESPORT_API_URL;
const API_TOKEN = process.env.ELITESPORT_API_TOKEN;

// =============================================================================
// API CLIENT
// =============================================================================

/**
 * Fetches hotels data from the EliteSport API.
 * 
 * This function is server-side only and should never be called from client code.
 * Uses POST request with token-based authorization as specified in the API documentation.
 * 
 * @returns Promise<HotelApiResponse[]> - Array of hotel data from API
 * @throws Error if API configuration is missing or request fails
 */
export async function fetchHotels(): Promise<HotelApiResponse[]> {
  // Validate environment configuration
  if (!API_URL) {
    throw new Error(
      "[Hotels API] Missing ELITESPORT_HOTELS_API_URL (or legacy ELITESPORT_API_URL) environment variable"
    );
  }

  if (!API_TOKEN) {
    throw new Error(
      "[Hotels API] Missing ELITESPORT_API_TOKEN environment variable"
    );
  }

  try {
    // Handle token format - if it already starts with "Token ", use as-is
    // Otherwise, prepend "Token " prefix
    const authHeader = API_TOKEN.startsWith("Token ") 
      ? API_TOKEN 
      : `Token ${API_TOKEN}`;

    const response = await fetch(API_URL, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      // Empty body for POST request (API may require this format)
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      console.error(
        `[Hotels API] Request failed with status ${response.status}:`,
        errorText
      );
      throw new Error(
        `Hotels API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Handle different response shapes (array at root or nested in data property)
    const hotels: HotelApiResponse[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.hotels)
          ? data.hotels
          : Array.isArray(data?.results)
            ? data.results
            : [];

    return hotels;
  } catch (error) {
    // Re-throw with context if it's already our error
    if (error instanceof Error && error.message.includes("Hotels API")) {
      throw error;
    }

    // Wrap unknown errors with context
    console.error("[Hotels API] Unexpected error:", error);
    throw new Error(
      `Failed to fetch hotels: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

// =============================================================================
// DATA MAPPING
// =============================================================================

// API base URL for constructing full image URLs
const API_BASE_URL = "https://elitesport.online";

/**
 * Constructs a full image URL from a relative path.
 * API returns relative paths like "/media/uploads/..." which need the base URL.
 * 
 * @param imagePath - Relative image path from API (e.g., "/media/uploads/file.jpg")
 * @returns Full URL or null if no path provided
 */
function getFullImageUrl(imagePath: string | undefined | null): string | null {
  if (!imagePath) return null;
  
  // If already a full URL, return as-is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  
  // Ensure path starts with /
  const path = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${API_BASE_URL}${path}`;
}

/**
 * Maps a raw hotel API response to the Place type used by UI components.
 * 
 * Handles the actual API response structure:
 * - id: numeric ID
 * - name: hotel name
 * - phone: phone number (not used in Place type)
 * - address: location/address string
 * - image: relative path to image (e.g., "/media/uploads/...")
 * 
 * Ensures all fields are either properly populated or null (not undefined)
 * to satisfy Next.js serialization requirements.
 * 
 * @param hotel - Raw hotel data from API
 * @returns Place object compatible with PlaceCard and PlaceModal components
 */
export function mapHotelToPlace(hotel: HotelApiResponse): Place {
  // Generate unique ID from API id
  const id = `hotel-api-${hotel.id}`;
  
  // Extract name
  const name = hotel.name ?? null;
  
  // Use address as location
  const location = hotel.address ?? null;
  
  // Construct full image URL from relative path
  const featuredImageUrl = getFullImageUrl(hotel.image);
  
  // For single image, create array with that image
  const imageUrls = featuredImageUrl ? [featuredImageUrl] : null;
  
  // Generate slug from name
  const slug = name 
    ? name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") 
    : null;

  return {
    _id: id,
    name,
    placeType: "hotel",
    category: "hotel",
    location,
    featuredImageUrl,
    imageUrls,
    imageAlt: name ? `${name} - EliteSport Partner Hotel` : "EliteSport Partner Hotel",
    overview: null, // API doesn't provide description
    benefits: null, // API doesn't provide benefits
    showInMostPopular: null,
    slug,
    tags: null,
  };
}

/**
 * Fetches hotels from the API and maps them to Place objects.
 * 
 * This is a convenience function that combines fetchHotels() and mapHotelToPlace().
 * Includes graceful error handling - returns empty array on failure rather than throwing.
 * 
 * @returns Promise<Place[]> - Array of Place objects for hotels, or empty array on error
 */
export async function getHotelsAsPlaces(): Promise<Place[]> {
  try {
    const hotelsData = await fetchHotels();
    return hotelsData.map(mapHotelToPlace);
  } catch (error) {
    console.error("[Hotels API] Failed to fetch and map hotels:", error);
    // Return empty array on error - allows page to render without hotels
    return [];
  }
}
