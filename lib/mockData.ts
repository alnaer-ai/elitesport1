import type { PortableTextBlock } from "@portabletext/types";

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
