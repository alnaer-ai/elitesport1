import type { PortableTextBlock } from "@portabletext/types";

export type PlaceCategory =
  | "hotel"
  | "gym"
  | "female"
  | "kids"
  | "tennisSquash"
  | "wellness"
  | "spa" // added based on user request
  | "resort"; // added based on user request

export type PlaceService = {
  id: string;
  name: string;
  icon?: string;
  thumbnail?: string;
};

export type Place = {
  _id: string; // "id" from API
  name?: string | null;

  // Core Data
  description?: string | null; // HTML content
  offers?: string | null;      // HTML content

  // Categorization
  services?: PlaceService[] | null;
  placeType?: PlaceCategory | null; // Derived from services
  category?: PlaceCategory | null;  // derived

  // Location
  location?: string | null; // "address" from API

  // Media
  featuredImageUrl?: string | null;
  imageUrls?: string[] | null;
  imageAlt?: string | null;

  // Derived/Legacy flags
  showInMostPopular?: boolean | null;
  slug?: string | null;
  tags?: string[] | null; // derived from services

  // Legacy / unused fields mapping
  overview?: PortableTextBlock[] | null; // Kept for type compatibility if needed, but we prefer 'description'
  benefits?: string[] | null; // Kept for compatibility, but we prefer 'offers'
};
