/**
 * Static mock data to replace Sanity CMS content.
 * These data shapes match exactly what was previously returned from Sanity.
 * Ready for future API integration.
 */

import type { PortableTextBlock } from "@portabletext/types";

// =============================================================================
// HERO DATA
// =============================================================================

export type HeroMediaType = "image" | "video";
export type HeroLayoutVariant = "centered" | "split" | "overlay";
export type HeroTextAlignment = "left" | "center" | "right";

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
  subtitle?: string | null;
  mediaType?: HeroMediaType;
  imageUrl?: string;
  video?: HeroVideoSource;
  ctaLabel?: string;
  ctaLink?: string;
  layoutVariant?: HeroLayoutVariant;
  overlayOpacity?: number;
  textAlignment?: HeroTextAlignment;
  isPublished?: boolean;
  targetSlug?: string;
};

export const MOCK_HEROES: Record<string, HeroPayload> = {
  home: {
    _id: "hero-home",
    internalName: "Home Hero",
    title: "Fitness is Happniess",
    subtitle: null,
    mediaType: "video",
    video: {
      file: {
        url: "/heroo.mp4",
      },
    },
    ctaLabel: "Explore Memberships",
    ctaLink: "/memberships",
    layoutVariant: "overlay",
    overlayOpacity: 55,
    textAlignment: "left",
    isPublished: true,
    targetSlug: "home",
  },
  about: {
    _id: "hero-about",
    internalName: "About Hero",
    title: "Calm Escapes, Elevated Living",
    subtitle:
      "We blend resort-level hospitality, private beach access, and restorative rituals with optional performance when you want it.",
    mediaType: "image",
    // Luxury hotel lobby with elegant interior design
    imageUrl:
      "/goldenh.png",
    layoutVariant: "overlay",
    overlayOpacity: 65,
    textAlignment: "center",
    isPublished: true,
    targetSlug: "about",
  },
  places: {
    _id: "hero-places",
    internalName: "Places Hero",
    title: "Elite Destinations",
    subtitle:
      "Curated residences and retreats where hospitality, wellness, and elevated living are seamlessly woven together.",
    mediaType: "image",
    // Stunning luxury resort pool with palm trees and ocean view
    imageUrl:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=2400&q=80",
    layoutVariant: "overlay",
    overlayOpacity: 55,
    textAlignment: "left",
    isPublished: true,
    targetSlug: "places",
  },
  promotions: {
    _id: "hero-promotions",
    internalName: "Promotions Hero",
    title: "Member Exclusives",
    subtitle:
      "Discover curated offers and benefits available only to EliteSport members.",
    mediaType: "image",
    // Luxurious spa and wellness setting with candles and relaxation
    imageUrl:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2400&q=80",
    layoutVariant: "overlay",
    overlayOpacity: 60,
    textAlignment: "left",
    isPublished: true,
    targetSlug: "promotions",
  },
  memberships: {
    _id: "hero-memberships",
    internalName: "Memberships Hero",
    title: "Unlock Elite Access",
    subtitle:
      "Choose the membership level that complements your lifestyle and wellness journey.",
    mediaType: "image",
    // Local brand illustration for growth theme
    imageUrl: "/growth.png",
    layoutVariant: "overlay",
    overlayOpacity: 60,
    textAlignment: "left",
    isPublished: true,
    targetSlug: "memberships",
  },
  contact: {
    _id: "hero-contact",
    internalName: "Contact Hero",
    title: "Get in Touch",
    subtitle:
      "Our concierge team is ready to assist with membership inquiries, partnerships, and more.",
    mediaType: "image",
    // Sophisticated hotel concierge/reception area
    imageUrl:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=2400&q=80",
    layoutVariant: "overlay",
    overlayOpacity: 65,
    textAlignment: "center",
    isPublished: true,
    targetSlug: "contact",
  },
  "partners-clients": {
    _id: "hero-partners",
    internalName: "Partners Hero",
    title: "Our Partners & Clients",
    subtitle:
      "World-renowned brands and tastemakers rely on EliteSport to curate elevated lifestyle experiences.",
    mediaType: "image",
    // Elegant rooftop lounge or upscale hospitality setting
    imageUrl:
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=2400&q=80",
    layoutVariant: "overlay",
    overlayOpacity: 60,
    textAlignment: "left",
    isPublished: true,
    targetSlug: "partners-clients",
  },
};

export const getPageHero = (slug: string): HeroPayload | null => {
  return MOCK_HEROES[slug] ?? null;
};

// =============================================================================
// PLACES DATA
// =============================================================================

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
  featuredImageUrl?: string;
  imageUrls?: string[];
  imageAlt?: string;
  overview?: PortableTextBlock[];
  benefits?: string[];
  showInMostPopular?: boolean | null;
  slug?: string;
  tags?: string[];
};

export const MOCK_PLACES: Place[] = [];

export const getPopularPlaces = (): Place[] => {
  return [];
};

export const getAllPlaces = (): Place[] => {
  return [];
};

// =============================================================================
// PROMOTIONS DATA
// =============================================================================

export type PromotionRecord = {
  _id: string;
  title?: string;
  promotionType?: string;
  overview?: PortableTextBlock[];
  overviewText?: string;
  benefits?: string[];
  ctaLabel?: string;
  ctaAction?: string;
  featuredImageUrl?: string;
  imageAlt?: string;
  discountPercentage?: number;
  isPublished?: boolean;
  publishStartDate?: string;
  publishEndDate?: string;
};

export const MOCK_PROMOTIONS: PromotionRecord[] = [
  {
    _id: "promo-1",
    title: "Summer Wellness Package",
    promotionType: "hotel",
    overview: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Enjoy exclusive summer rates at our partner hotels with complimentary spa treatments and poolside service.",
          },
        ],
        markDefs: [],
      },
    ],
    overviewText:
      "Enjoy exclusive summer rates at our partner hotels with complimentary spa treatments and poolside service.",
    benefits: [
      "20% off room rates",
      "Complimentary spa access",
      "Priority pool cabana booking",
      "Welcome amenity",
    ],
    ctaLabel: "Book Now",
    ctaAction: "/contact",
    // Luxury resort pool with sun loungers
    featuredImageUrl:
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1400&q=80",
    discountPercentage: 20,
    isPublished: true,
    publishStartDate: "2024-06-01",
    publishEndDate: "2025-12-31",
  },
  {
    _id: "promo-2",
    title: "Wellness Partner Discount",
    promotionType: "gym",
    overview: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Bring a friend and both enjoy 15% off your membership fees for the next 3 months.",
          },
        ],
        markDefs: [],
      },
    ],
    overviewText:
      "Bring a friend and both enjoy 15% off your membership fees for the next 3 months.",
    benefits: [
      "15% off for both members",
      "3-month duration",
      "No commitment required",
      "Stackable with other offers",
    ],
    ctaLabel: "Learn More",
    ctaAction: "/contact",
    // Elegant hotel terrace or lounge setting
    featuredImageUrl:
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1400&q=80",
    discountPercentage: 15,
    isPublished: true,
    publishStartDate: "2024-01-01",
    publishEndDate: "2025-12-31",
  },
  {
    _id: "promo-3",
    title: "Ladies Wellness Evening",
    promotionType: "female",
    overview: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Every Thursday enjoy extended spa hours and exclusive wellness experiences at our women-only facilities.",
          },
        ],
        markDefs: [],
      },
    ],
    overviewText:
      "Every Thursday enjoy extended spa hours and exclusive wellness experiences at our women-only facilities.",
    benefits: [
      "Extended hours until 11pm",
      "Exclusive spa treatments",
      "Complimentary refreshments",
      "Guest passes available",
    ],
    ctaLabel: "Join Now",
    ctaAction: "/contact",
    // Elegant spa or wellness lounge setting
    featuredImageUrl:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1400&q=80",
    isPublished: true,
    publishStartDate: "2024-01-01",
    publishEndDate: "2025-12-31",
  },
  {
    _id: "promo-4",
    title: "Kids Summer Resort",
    promotionType: "kids",
    overview: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Keep your children entertained during school holidays with our curated resort experiences.",
          },
        ],
        markDefs: [],
      },
    ],
    overviewText:
      "Keep your children entertained during school holidays with our curated resort experiences.",
    benefits: [
      "Weekly programs",
      "Beach and pool activities",
      "Supervised adventures",
      "Healthy meals included",
    ],
    ctaLabel: "Register",
    ctaAction: "/contact",
    // Family-friendly resort pool or beach
    featuredImageUrl:
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1400&q=80",
    discountPercentage: 10,
    isPublished: true,
    publishStartDate: "2024-06-01",
    publishEndDate: "2025-12-31",
  },
  {
    _id: "promo-5",
    title: "Tennis & Leisure Package",
    promotionType: "tennisSquash",
    overview: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "10 private tennis sessions at our resort courts with spa access included.",
          },
        ],
        markDefs: [],
      },
    ],
    overviewText:
      "10 private tennis sessions at our resort courts with spa access included.",
    benefits: [
      "10 private sessions",
      "Premium court access",
      "Post-session spa treatment",
      "Equipment provided",
    ],
    ctaLabel: "Book Sessions",
    ctaAction: "/contact",
    // Luxury resort tennis court or club setting
    featuredImageUrl:
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1400&q=80",
    discountPercentage: 25,
    isPublished: true,
    publishStartDate: "2024-01-01",
    publishEndDate: "2025-12-31",
  },
];

export const getActivePromotions = (): PromotionRecord[] => {
  const now = Date.now();
  return MOCK_PROMOTIONS.filter((promo) => {
    if (promo.isPublished === false) return false;
    if (promo.publishStartDate) {
      const start = Date.parse(promo.publishStartDate);
      if (!Number.isNaN(start) && start > now) return false;
    }
    if (promo.publishEndDate) {
      const end = Date.parse(promo.publishEndDate);
      if (!Number.isNaN(end) && end <= now) return false;
    }
    return true;
  });
};

export const getLatestPromotions = (limit = 5): PromotionRecord[] => {
  return getActivePromotions().slice(0, limit);
};

/*
  MOCK_MEMBERSHIPS and getMemberships have been removed.
  We now fetch strictly from the live API via lib/api/plans.ts
*/


// =============================================================================
// ABOUT PAGE DATA
// =============================================================================

export type Differentiator = {
  title?: string;
  description?: string;
};

export type TeamMember = {
  name?: string;
  role?: string;
  bio?: string;
  photoUrl?: string;
};

export type AboutInfo = {
  missionSectionEyebrow?: string;
  missionSectionTitle?: string;
  missionStatement?: string;
  missionImageUrl?: string;
  vision?: string;
  visionImageUrl?: string;
  valuesSectionEyebrow?: string;
  valuesSectionTitle?: string;
  valuesSectionDescription?: string;
  teamSectionEyebrow?: string;
  teamSectionTitle?: string;
  teamSectionDescription?: string;
  teamMembers?: TeamMember[];
  coreValues?: string[];
  differentiators?: Differentiator[];
};

export const MOCK_ABOUT: AboutInfo = {
  missionSectionEyebrow: "Our Purpose",
  missionSectionTitle: "Mission & Vision",
  missionStatement:
    "Encouraging children, families, and employees to have a healthy lifestyle by being active and avoiding chronic diseases.",
  missionImageUrl:
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1800&q=80",
  vision:
    "Spreading our delightful service and expanding it through the GCC countries, aiming for better health and an active lifestyle for our communities.",
  visionImageUrl: "/image.png",
  valuesSectionEyebrow: "What We Stand For",
  valuesSectionTitle: "Our Values",
  valuesSectionDescription:
    "These principles guide every decision we make and every partnership we form.",
  coreValues: ["Excellence", "Innovation", "Integrity", "Service", "Community"],
  differentiators: [
    {
      title: "Global Network",
      description:
        "Access to 500+ premium fitness and wellness destinations across 50 countries.",
    },
    {
      title: "Curated Quality",
      description:
        "Every partner is personally vetted to meet our exacting standards.",
    },
    {
      title: "Concierge Service",
      description:
        "Dedicated support team available 24/7 to assist with your wellness journey.",
    },
    {
      title: "Seamless Experience",
      description:
        "One membership, one app, unlimited possibilities wherever you travel.",
    },
  ],
};

export const getAboutInfo = (): AboutInfo => {
  return MOCK_ABOUT;
};

// =============================================================================
// CONTACT PAGE DATA
// =============================================================================

export type ContactHours = {
  label?: string;
  value?: string;
};

export type ContactInfo = {
  address?: string;
  phone?: string;
  email?: string;
  introText?: string;
  mapLocation?: {
    lat?: number;
    lng?: number;
  };
  hours?: ContactHours[];
};

export const MOCK_CONTACT: ContactInfo = {
  address:
    "EliteSport Headquarters\nAl Maryah Island, Abu Dhabi\nUnited Arab Emirates",
  phone: "+971 2 44444 99",
  email: "info@theelitesport.com",
  introText:
    "We would love to hear from you. Whether you're interested in membership, partnerships, or have questions about our services, our team is here to help.",
  mapLocation: {
    lat: 24.4539,
    lng: 54.3773,
  },
  hours: [
    {
      label: "Monday - Friday",
      value: "9:00 AM - 8:00 PM",
    },
    {
      label: "Saturday",
      value: "10:00 AM - 6:00 PM",
    },
    {
      label: "Sunday",
      value: "Closed",
    },
  ],
};

export const getContactInfo = (): ContactInfo => {
  return MOCK_CONTACT;
};
