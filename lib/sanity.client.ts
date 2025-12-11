import {createClient} from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type {SanityImageSource} from '@sanity/image-url/lib/types/types';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-10-01';

if (!projectId || !dataset) {
  throw new Error(
    'Missing Sanity environment variables. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.'
  );
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: 'published',
});

const builder = imageUrlBuilder(sanityClient);

export const urlForImage = (source: SanityImageSource) => builder.image(source);
