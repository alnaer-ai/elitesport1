/**
 * Hero data types and fetching utilities.
 * Previously fetched from Sanity CMS, now returns static mock data.
 */

import { getPageHero as getMockPageHero, type HeroPayload } from "./mockData";

export type {
  HeroPayload,
  HeroMediaType,
  HeroLayoutVariant,
  HeroTextAlignment,
  HeroVideoSource,
} from "./mockData";

/**
 * Fetches hero data for a given page slug.
 * Returns static mock data (ready for future API integration).
 */
export const fetchPageHero = async (slug: string): Promise<HeroPayload | null> => {
  // Return static mock data
  return getMockPageHero(slug);
};
