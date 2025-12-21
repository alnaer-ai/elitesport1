/**
 * Place type definitions.
 * Previously used Sanity image types, now uses plain URL strings.
 */

import type { PortableTextBlock } from "@portabletext/types";

export type PlaceCategory =
  | "hotel"
  | "gym"
  | "female"
  | "kids"
  | "tennisSquash"
  | "wellness";

export type Place = {
  _id: string;
  name?: string | null;
  placeType?: PlaceCategory | null;
  category?: PlaceCategory | null;
  location?: string | null;
  featuredImageUrl?: string | null;
  imageUrls?: string[] | null;
  imageAlt?: string | null;
  overview?: PortableTextBlock[] | null;
  benefits?: string[] | null;
  showInMostPopular?: boolean | null;
  slug?: string | null;
  tags?: string[] | null;
};
