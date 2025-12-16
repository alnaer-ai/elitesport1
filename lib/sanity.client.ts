import {createClient} from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type {SanityImageSource} from '@sanity/image-url/lib/types/types';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-10-01';

export const isSanityConfigured = Boolean(projectId && dataset);

export const sanityClient = isSanityConfigured
  ? createClient({
      projectId: projectId!,
      dataset: dataset!,
      apiVersion,
      useCdn: true,
      token: process.env.SANITY_API_READ_TOKEN,
      perspective: 'published',
    })
  : null;

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

export const urlForImage = (source: SanityImageSource) => {
  if (!builder) {
    throw new Error(
      'Sanity image builder is not configured. Ensure Sanity environment variables exist before calling urlForImage.'
    );
  }

  return builder.image(source);
};
