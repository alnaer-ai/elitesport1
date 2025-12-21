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
    title: "Fitness is Happiness",
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

