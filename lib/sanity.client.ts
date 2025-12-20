import {createClient} from '@sanity/client';
import {createImageUrlBuilder} from '@sanity/image-url';
import type {SanityImageSource} from '@sanity/image-url';

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET;
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  process.env.SANITY_API_VERSION ||
  '2023-10-01';

export const isSanityConfigured = Boolean(projectId && dataset);

export const sanityClient = isSanityConfigured
  ? createClient({
      projectId: projectId!,
      dataset: dataset!,
      apiVersion,
      // For a CMS-driven marketing site, "instant" content sync matters more than CDN caching.
      // This ensures edits to Places/Promotions reflect immediately on the frontend.
      useCdn: false,
      token: process.env.SANITY_API_READ_TOKEN,
      perspective: 'published',
    })
  : null;

const builder = sanityClient ? createImageUrlBuilder(sanityClient) : null;

export const urlForImage = (source: SanityImageSource) => {
  if (!builder) {
    throw new Error(
      'Sanity image builder is not configured. Ensure Sanity environment variables exist before calling urlForImage.'
    );
  }

  return builder.image(source);
};
