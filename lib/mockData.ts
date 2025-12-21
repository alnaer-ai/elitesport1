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
  subtitle?: string;
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
    title: "Endless Choices One Membership",
    subtitle:
      "Access the world's finest gyms, private clubs, and wellness retreats with a single EliteSport membership.",
    mediaType: "image",
    imageUrl:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2400&q=80",
    ctaLabel: "Explore Memberships",
    ctaLink: "/memberships",
    layoutVariant: "overlay",
    overlayOpacity: 65,
    textAlignment: "left",
    isPublished: true,
    targetSlug: "home",
  },
  about: {
    _id: "hero-about",
    internalName: "About Hero",
    title: "Elevating Performance Since 2015",
    subtitle:
      "We bridge the gap between luxury hospitality and elite fitness, creating seamless experiences for discerning members worldwide.",
    mediaType: "image",
    imageUrl:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=2400&q=80",
    layoutVariant: "overlay",
    overlayOpacity: 70,
    textAlignment: "center",
    isPublished: true,
    targetSlug: "about",
  },
  places: {
    _id: "hero-places",
    internalName: "Places Hero",
    title: "Elite Destinations",
    subtitle:
      "Curated residences and training spaces where performance, hospitality, and wellness are seamlessly woven together.",
    mediaType: "image",
    imageUrl:
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=2400&q=80",
    layoutVariant: "overlay",
    overlayOpacity: 60,
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
    imageUrl:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=2400&q=80",
    layoutVariant: "overlay",
    overlayOpacity: 65,
    textAlignment: "left",
    isPublished: true,
    targetSlug: "promotions",
  },
  memberships: {
    _id: "hero-memberships",
    internalName: "Memberships Hero",
    title: "Unlock Elite Access",
    subtitle:
      "Choose the membership level that fits your training needs and lifestyle.",
    mediaType: "image",
    imageUrl:
      "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=2400&q=80",
    layoutVariant: "overlay",
    overlayOpacity: 65,
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
    imageUrl:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2400&q=80",
    layoutVariant: "overlay",
    overlayOpacity: 70,
    textAlignment: "center",
    isPublished: true,
    targetSlug: "contact",
  },
  "partners-clients": {
    _id: "hero-partners",
    internalName: "Partners Hero",
    title: "Our Partners & Clients",
    subtitle:
      "World-renowned brands and tastemakers rely on EliteSport to curate elevated training experiences.",
    mediaType: "image",
    imageUrl:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=2400&q=80",
    layoutVariant: "overlay",
    overlayOpacity: 65,
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

export const MOCK_PLACES: Place[] = [
  {
    _id: "place-1",
    name: "Four Seasons Dubai",
    placeType: "hotel",
    location: "Dubai, UAE",
    featuredImageUrl:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80",
    imageUrls: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80",
    ],
    overview: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Experience world-class fitness facilities and spa services at the iconic Four Seasons Dubai. Our partnership provides exclusive member access to the resort's state-of-the-art gym and wellness center.",
          },
        ],
        markDefs: [],
      },
    ],
    benefits: [
      "24/7 gym access",
      "Complimentary spa access",
      "Personal training sessions",
      "Poolside service",
    ],
    showInMostPopular: true,
    slug: "four-seasons-dubai",
  },
  {
    _id: "place-2",
    name: "Equinox Fitness Club",
    placeType: "gym",
    location: "New York, USA",
    featuredImageUrl:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80",
    overview: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Premium fitness experience with cutting-edge equipment and expert trainers. Access multiple NYC locations with your EliteSport membership.",
          },
        ],
        markDefs: [],
      },
    ],
    benefits: [
      "State-of-the-art equipment",
      "Group fitness classes",
      "Eucalyptus steam rooms",
      "Kiehl's amenities",
    ],
    showInMostPopular: true,
    slug: "equinox-nyc",
  },
  {
    _id: "place-3",
    name: "She Fitness Abu Dhabi",
    placeType: "female",
    location: "Abu Dhabi, UAE",
    featuredImageUrl:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1600&q=80",
    overview: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "A women-only fitness sanctuary featuring guided classes, spa-grade recovery, and privacy-first amenities designed for the modern woman.",
          },
        ],
        markDefs: [],
      },
    ],
    benefits: [
      "Women-only environment",
      "Private training suites",
      "Spa and wellness services",
      "Childcare facilities",
    ],
    showInMostPopular: true,
    slug: "she-fitness-abudhabi",
  },
  {
    _id: "place-4",
    name: "Junior Champions Club",
    placeType: "kids",
    location: "London, UK",
    featuredImageUrl:
      "https://images.unsplash.com/photo-1472745942893-4b9f730c7668?auto=format&fit=crop&w=1600&q=80",
    overview: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Play-forward clubs where junior members explore sport safely with age-smart coaching staff and engaging activities.",
          },
        ],
        markDefs: [],
      },
    ],
    benefits: [
      "Age-appropriate programs",
      "Certified youth coaches",
      "Safe play environments",
      "Holiday camps",
    ],
    showInMostPopular: true,
    slug: "junior-champions-london",
  },
  {
    _id: "place-5",
    name: "Racquet Club Monaco",
    placeType: "tennisSquash",
    location: "Monaco",
    featuredImageUrl:
      "https://images.unsplash.com/photo-1551773188-0801da12ddda?auto=format&fit=crop&w=1600&q=80",
    overview: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Indoor and outdoor racquet venues offering pro-grade surfaces, match play, and tactical coaching with Mediterranean views.",
          },
        ],
        markDefs: [],
      },
    ],
    benefits: [
      "Indoor & outdoor courts",
      "Pro coaching available",
      "Equipment rental",
      "Match play organization",
    ],
    showInMostPopular: true,
    slug: "racquet-club-monaco",
  },
  {
    _id: "place-6",
    name: "Ritz-Carlton Wellness",
    placeType: "hotel",
    location: "Singapore",
    featuredImageUrl:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1600&q=80",
    overview: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Luxury wellness experience at the heart of Singapore, featuring a rooftop infinity pool, world-class spa, and exclusive fitness facilities.",
          },
        ],
        markDefs: [],
      },
    ],
    benefits: [
      "Rooftop infinity pool",
      "Full-service spa",
      "Personal trainers",
      "Nutritionist consultations",
    ],
    showInMostPopular: true,
    slug: "ritz-carlton-singapore",
  },
  {
    _id: "place-7",
    name: "Barry's Bootcamp",
    placeType: "gym",
    location: "Los Angeles, USA",
    featuredImageUrl:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1600&q=80",
    overview: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "High-intensity interval training in the famous red room. Experience the workout that celebrities swear by.",
          },
        ],
        markDefs: [],
      },
    ],
    benefits: [
      "HIIT classes",
      "Celebrity trainers",
      "Fuel bar",
      "Premium locker rooms",
    ],
    showInMostPopular: false,
    slug: "barrys-la",
  },
  {
    _id: "place-8",
    name: "Curves Fitness",
    placeType: "female",
    location: "Tokyo, Japan",
    featuredImageUrl:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1600&q=80",
    overview: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "30-minute circuit training designed specifically for women, in a supportive and encouraging environment.",
          },
        ],
        markDefs: [],
      },
    ],
    benefits: [
      "30-minute workouts",
      "No mirrors policy",
      "Supportive community",
      "Flexible scheduling",
    ],
    showInMostPopular: false,
    slug: "curves-tokyo",
  },
];

export const getPopularPlaces = (): Place[] => {
  return MOCK_PLACES.filter((place) => place.showInMostPopular === true).slice(
    0,
    6
  );
};

export const getAllPlaces = (): Place[] => {
  return MOCK_PLACES;
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
            text: "Enjoy exclusive summer rates at our partner hotels with complimentary spa treatments and fitness classes.",
          },
        ],
        markDefs: [],
      },
    ],
    overviewText:
      "Enjoy exclusive summer rates at our partner hotels with complimentary spa treatments and fitness classes.",
    benefits: [
      "20% off room rates",
      "Complimentary spa access",
      "Free fitness classes",
      "Welcome amenity",
    ],
    ctaLabel: "Book Now",
    ctaAction: "/contact",
    featuredImageUrl:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1400&q=80",
    discountPercentage: 20,
    isPublished: true,
    publishStartDate: "2024-06-01",
    publishEndDate: "2025-12-31",
  },
  {
    _id: "promo-2",
    title: "Gym Partner Discount",
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
    featuredImageUrl:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80",
    discountPercentage: 15,
    isPublished: true,
    publishStartDate: "2024-01-01",
    publishEndDate: "2025-12-31",
  },
  {
    _id: "promo-3",
    title: "Ladies Night Special",
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
            text: "Every Thursday enjoy extended hours and exclusive classes at our women-only facilities.",
          },
        ],
        markDefs: [],
      },
    ],
    overviewText:
      "Every Thursday enjoy extended hours and exclusive classes at our women-only facilities.",
    benefits: [
      "Extended hours until 11pm",
      "Exclusive yoga sessions",
      "Complimentary smoothies",
      "Guest passes available",
    ],
    ctaLabel: "Join Now",
    ctaAction: "/contact",
    featuredImageUrl:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=80",
    isPublished: true,
    publishStartDate: "2024-01-01",
    publishEndDate: "2025-12-31",
  },
  {
    _id: "promo-4",
    title: "Kids Summer Camp",
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
            text: "Keep your children active during school holidays with our multi-sport summer camps.",
          },
        ],
        markDefs: [],
      },
    ],
    overviewText:
      "Keep your children active during school holidays with our multi-sport summer camps.",
    benefits: [
      "Weekly programs",
      "Multi-sport activities",
      "Certified coaches",
      "Healthy lunch included",
    ],
    ctaLabel: "Register",
    ctaAction: "/contact",
    featuredImageUrl:
      "https://images.unsplash.com/photo-1472745942893-4b9f730c7668?auto=format&fit=crop&w=1400&q=80",
    discountPercentage: 10,
    isPublished: true,
    publishStartDate: "2024-06-01",
    publishEndDate: "2025-12-31",
  },
  {
    _id: "promo-5",
    title: "Tennis Coaching Package",
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
            text: "10 private tennis lessons with our certified pros at a special member rate.",
          },
        ],
        markDefs: [],
      },
    ],
    overviewText:
      "10 private tennis lessons with our certified pros at a special member rate.",
    benefits: [
      "10 private lessons",
      "Video analysis included",
      "Court booking priority",
      "Equipment discount",
    ],
    ctaLabel: "Book Sessions",
    ctaAction: "/contact",
    featuredImageUrl:
      "https://images.unsplash.com/photo-1551773188-0801da12ddda?auto=format&fit=crop&w=1400&q=80",
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

// =============================================================================
// MEMBERSHIPS DATA
// =============================================================================

export type MembershipTier = {
  name?: string;
  price?: string;
  description?: string;
  benefits?: string[];
  familyBenefits?: string[];
  hotelsGyms?: string[];
  isPopular?: boolean;
  isFamilyFriendly?: boolean;
  cardColor?: string;
  ctaLabel?: string;
  ctaUrl?: string;
};

export type MembershipFaq = {
  question?: string;
  answer?: string;
};

export type MembershipInfo = {
  title?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  tiers?: MembershipTier[];
  faq?: MembershipFaq[];
};

export const MOCK_MEMBERSHIPS: MembershipInfo[] = [
  {
    title: "EliteSport Memberships",
    ctaLabel: "Contact Membership",
    ctaUrl: "/contact",
    tiers: [
      {
        name: "Gold",
        price: "AED 15,000/year",
        description:
          "Our flagship membership tier offering unlimited access to all partner locations worldwide, priority booking, and exclusive member events.",
        benefits: [
          "Unlimited gym access worldwide",
          "Priority booking at all locations",
          "Personal concierge service",
          "VIP lounge access",
          "Annual health assessment",
        ],
        familyBenefits: [
          "All single benefits",
          "Up to 4 family members included",
          "Kids club access",
          "Family wellness programs",
          "Priority family event booking",
        ],
        hotelsGyms: [
          "Four Seasons Dubai",
          "Equinox All Locations",
          "Ritz-Carlton Worldwide",
          "Barry's Bootcamp Global",
        ],
        isPopular: true,
        isFamilyFriendly: true,
        cardColor: "#f4b942",
        ctaLabel: "Contact Business Team",
        ctaUrl: "/contact",
      },
      {
        name: "Silver",
        price: "AED 8,000/year",
        description:
          "Premium access to select partner gyms and hotels with personalized training programs and wellness consultations.",
        benefits: [
          "Access to 50+ partner locations",
          "Monthly personal training session",
          "Spa discounts",
          "Group class access",
          "Mobile app premium features",
        ],
        familyBenefits: [
          "All single benefits",
          "Up to 2 family members",
          "Shared training sessions",
          "Family spa packages",
        ],
        hotelsGyms: [
          "Selected Four Seasons",
          "Equinox Select Cities",
          "Partner Hotel Network",
        ],
        isPopular: false,
        isFamilyFriendly: true,
        cardColor: "#e8e8e8",
        ctaLabel: "Join Silver",
        ctaUrl: "/contact",
      },
      {
        name: "Bronze",
        price: "AED 4,000/year",
        description:
          "Entry-level membership with access to local partner gyms and basic wellness benefits.",
        benefits: [
          "Access to 20+ partner locations",
          "Quarterly wellness check",
          "Group class access",
          "Member events access",
          "Mobile app access",
        ],
        hotelsGyms: ["Local Partner Gyms", "Select Wellness Centers"],
        isPopular: false,
        isFamilyFriendly: false,
        cardColor: "#d4a574",
        ctaLabel: "Start Bronze",
        ctaUrl: "/contact",
      },
      {
        name: "Gym",
        price: "AED 2,000/year",
        description:
          "Gym-only access to our network of fitness centers. Perfect for dedicated fitness enthusiasts.",
        benefits: [
          "Access to gym network",
          "Basic equipment access",
          "Locker room facilities",
          "Online workout library",
        ],
        isPopular: false,
        isFamilyFriendly: false,
        cardColor: "#6fafce",
        ctaLabel: "Join Gym",
        ctaUrl: "/contact",
      },
      {
        name: "She",
        price: "AED 3,000/year",
        description:
          "Women-only membership with access to female-focused facilities and programs.",
        benefits: [
          "Women-only facilities",
          "Female trainers available",
          "Specialized fitness programs",
          "Wellness workshops",
          "Private changing areas",
        ],
        isPopular: false,
        isFamilyFriendly: false,
        cardColor: "#e91e8c",
        ctaLabel: "Join She",
        ctaUrl: "/contact",
      },
    ],
    faq: [
      {
        question: "How do I upgrade my membership?",
        answer:
          "Contact our membership team via the app or website. Upgrades are prorated based on your remaining membership period.",
      },
      {
        question: "Can I freeze my membership?",
        answer:
          "Yes, members can freeze their membership for up to 3 months per year for medical or travel reasons.",
      },
      {
        question: "Are there family membership options?",
        answer:
          "Gold and Silver tiers offer family benefits. Contact our team for family package pricing.",
      },
      {
        question: "What happens if a partner location closes?",
        answer:
          "We continuously update our network. If a location closes, we'll direct you to the nearest alternative partner.",
      },
    ],
  },
];

export const getMemberships = (): MembershipInfo[] => {
  return MOCK_MEMBERSHIPS;
};

// =============================================================================
// CLIENT PARTNERS DATA
// =============================================================================

export type ClientPartner = {
  _id: string;
  name?: string;
  category?: "client" | "partner" | "sponsor";
  logoUrl?: string;
  logoAlt?: string;
  website?: string;
};

export const MOCK_CLIENT_PARTNERS: ClientPartner[] = [
  {
    _id: "cp-1",
    name: "Four Seasons Hotels",
    category: "partner",
    logoUrl:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=300&h=150&q=80",
    logoAlt: "Four Seasons Hotels logo",
    website: "https://fourseasons.com",
  },
  {
    _id: "cp-2",
    name: "Equinox Fitness",
    category: "partner",
    logoUrl:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=300&h=150&q=80",
    logoAlt: "Equinox Fitness logo",
    website: "https://equinox.com",
  },
  {
    _id: "cp-3",
    name: "Ritz-Carlton",
    category: "partner",
    logoUrl:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=300&h=150&q=80",
    logoAlt: "Ritz-Carlton logo",
    website: "https://ritzcarlton.com",
  },
  {
    _id: "cp-4",
    name: "Emirates Airlines",
    category: "client",
    logoUrl:
      "https://images.unsplash.com/photo-1583161442222-b45a92c19afe?auto=format&fit=crop&w=300&h=150&q=80",
    logoAlt: "Emirates Airlines logo",
    website: "https://emirates.com",
  },
  {
    _id: "cp-5",
    name: "ADNOC",
    category: "client",
    logoUrl:
      "https://images.unsplash.com/photo-1566473965997-3de9c817e938?auto=format&fit=crop&w=300&h=150&q=80",
    logoAlt: "ADNOC logo",
    website: "https://adnoc.ae",
  },
  {
    _id: "cp-6",
    name: "Etihad Airways",
    category: "client",
    logoUrl:
      "https://images.unsplash.com/photo-1583161442222-b45a92c19afe?auto=format&fit=crop&w=300&h=150&q=80",
    logoAlt: "Etihad Airways logo",
    website: "https://etihad.com",
  },
  {
    _id: "cp-7",
    name: "Barry's Bootcamp",
    category: "partner",
    logoUrl:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=300&h=150&q=80",
    logoAlt: "Barry's Bootcamp logo",
    website: "https://barrys.com",
  },
  {
    _id: "cp-8",
    name: "Mandarin Oriental",
    category: "partner",
    logoUrl:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=300&h=150&q=80",
    logoAlt: "Mandarin Oriental logo",
    website: "https://mandarinoriental.com",
  },
  {
    _id: "cp-9",
    name: "Dubai Holdings",
    category: "client",
    logoUrl:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=300&h=150&q=80",
    logoAlt: "Dubai Holdings logo",
    website: "https://dubaiholding.com",
  },
  {
    _id: "cp-10",
    name: "Mubadala",
    category: "client",
    logoUrl:
      "https://images.unsplash.com/photo-1566473965997-3de9c817e938?auto=format&fit=crop&w=300&h=150&q=80",
    logoAlt: "Mubadala logo",
    website: "https://mubadala.com",
  },
  {
    _id: "cp-11",
    name: "SoulCycle",
    category: "partner",
    logoUrl:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=300&h=150&q=80",
    logoAlt: "SoulCycle logo",
    website: "https://soul-cycle.com",
  },
  {
    _id: "cp-12",
    name: "Aman Resorts",
    category: "partner",
    logoUrl:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=300&h=150&q=80",
    logoAlt: "Aman Resorts logo",
    website: "https://aman.com",
  },
];

export const getClientPartners = (): ClientPartner[] => {
  return MOCK_CLIENT_PARTNERS;
};

export const getClients = (): ClientPartner[] => {
  return MOCK_CLIENT_PARTNERS.filter((cp) => cp.category === "client");
};

export const getPartners = (): ClientPartner[] => {
  return MOCK_CLIENT_PARTNERS.filter((cp) => cp.category === "partner");
};

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
    "To provide discerning individuals with seamless access to the world's finest fitness and wellness destinations, creating a global community united by the pursuit of excellence.",
  missionImageUrl:
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1800&q=80",
  vision:
    "To become the definitive global platform connecting elite travelers with exceptional fitness experiences, transforming how the world's most ambitious individuals maintain their wellness routines wherever life takes them.",
  visionImageUrl:
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1800&q=80",
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
  phone: "+971 2 123 4567",
  email: "concierge@elitesport.com",
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

