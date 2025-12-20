import type {SanityClient} from '@sanity/client';
import type {SanityImageSource} from '@sanity/image-url';

import {sanityClient} from './sanity.client';

export type HeroMediaType = 'image' | 'video';
export type HeroLayoutVariant = 'centered' | 'split' | 'overlay';
export type HeroTextAlignment = 'left' | 'center' | 'right';

export type HeroVideoSource = {
  file?: {
    asset?: {
      _ref?: string;
    };
    url?: string;
  };
  url?: string;
};

export type HeroPayload = {
  _id?: string;
  internalName?: string;
  title?: string;
  subtitle?: string;
  mediaType?: HeroMediaType;
  image?: SanityImageSource;
  video?: HeroVideoSource;
  ctaLabel?: string;
  ctaLink?: string;
  layoutVariant?: HeroLayoutVariant;
  overlayOpacity?: number;
  textAlignment?: HeroTextAlignment;
  isPublished?: boolean;
  targetSlug?: string;
};

export const HERO_PROJECTION = `
  _id,
  internalName,
  title,
  subtitle,
  mediaType,
  image,
  video{
    url,
    file{
      asset,
      "url": asset->url
    }
  },
  ctaLabel,
  ctaLink,
  layoutVariant,
  overlayOpacity,
  textAlignment,
  isPublished,
  targetSlug
`;
export const fetchPageHero = async (
  slug: string,
  client: SanityClient | null = sanityClient
): Promise<HeroPayload | null> => {
  if (!client) {
    return null;
  }

  const hero = await client.fetch<HeroPayload | null>(
    `
      *[_type == "hero" && isPublished == true && (targetSlug == $slug || targetPage->slug.current == $slug)]
      | order(_updatedAt desc)[0]{
        ${HERO_PROJECTION}
      }
    `,
    {
      slug,
    }
  );

  return hero;
};
