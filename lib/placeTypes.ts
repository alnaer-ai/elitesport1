import type { SanityImageSource } from "@sanity/image-url";
export type PlaceCategory =
  | "hotel"
  | "gym"
  | "female"
  | "kids"
  | "tennisSquash"
  | "wellness";

export type PlaceImage = SanityImageSource & { alt?: string };

export type Place = {
  _id: string;
  name?: string | null;
  placeType?: PlaceCategory | null;
  category?: PlaceCategory | null;
  location?: string | null;
  featuredImage?: PlaceImage;
  images?: PlaceImage[];
  image?: SanityImageSource;
  imageAlt?: string;
  overview?: any;
  benefits?: string[];
  showInMostPopular?: boolean | null;
  slug?: string;
  tags?: string[];
};
