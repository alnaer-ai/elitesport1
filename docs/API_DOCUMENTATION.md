# EliteSport API Documentation

This document covers all API integrations in the EliteSport application, **excluding Plans and Membership APIs**.

---

## Table of Contents

1. [Places API](#places-api)
2. [Promotions API](#promotions-api)
3. [Style Updates](#style-updates)
   - [Places Page Categories](#places-page-categories)
   - [Home Page - Most Popular Places](#home-page---most-popular-places)

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ELITESPORT_GET_HOTELS_WEB_URL` | Places/Hotels API endpoint |
| `ELITESPORT_GET_PROMOTIONS_WEB_URL` | Promotions API endpoint |
| `ELITESPORT_API_TOKEN` | API authentication token (Token-based auth) |

---

## Places API

### Overview

The Places API fetches hotels, gyms, clubs, and other destinations from the EliteSport backend. This replaces the legacy hotels client.

- **File**: [`lib/api/places.ts`](file:///Users/home/Documents/Projects/elitesport/lib/api/places.ts)
- **Endpoint**: `POST https://elitesport.online/api/get-hotels-web`
- **Auth**: Token-based (`Authorization: Token <token>`)

### API Response Structure

```typescript
type PlaceServiceApi = {
  id: number;
  name: string;
  icon?: string;
  thumbnail?: string;
};

type PlaceApiResponse = {
  id: number;
  name?: string;
  description?: string;     // HTML content
  place_offers?: string;    // HTML content
  offers?: string;          // Fallback for offers
  address?: string;         // Location text
  image?: string;           // Main image path
  gallery?: string[];       // Array of image URLs
  services?: PlaceServiceApi[];
  phone?: string;           // NOT mapped (privacy)
  email?: string;           // NOT mapped (privacy)
};
```

### Data Mapping

The raw API response is transformed using `mapPlaceApiResponse()`:

| API Field | Mapped To | Notes |
|-----------|-----------|-------|
| `id` | `_id` | Prefixed with `place-` |
| `name` | `name` | Fallback: "Elite Destination" |
| `description` | `description` | HTML content preserved |
| `place_offers` / `offers` | `offers` | HTML content |
| `address` | `location` | String location |
| `image` | `featuredImageUrl` | Converted to full URL |
| `gallery` | `imageUrls` | Array of full URLs |
| `services` | `services` | Mapped to PlaceService[] |
| - | `category` | **Derived from services** |
| - | `tags` | **Derived from services** |

### Category Derivation Logic

Categories are automatically derived from service names:

```typescript
// Priority order:
1. "hotel" → if service contains "Hotel" or "Residence"
2. "gym" → if service contains "Gym", "Fitness", or "Training"  
3. "tennisSquash" → if service contains "Padel", "Tennis", or "Squash"
4. "spa" → if service contains "Spa", "Sauna", or "Massage"
5. "wellness" → default fallback
```

### Tags Derivation

Tags are derived from services:

| Tag | Service Match |
|-----|---------------|
| `"Family Friendly"` | "kid", "child", "family" |
| `"For women"` | "female", "ladies", "women" |
| `"Pool"` | "pool", "swim" |

### Usage Example

```typescript
import { fetchPlaces } from "@/lib/api/places";

// In getStaticProps or getServerSideProps
const places = await fetchPlaces();
// Returns: Place[]
```

### Key Functions

| Function | Description |
|----------|-------------|
| `fetchPlaces()` | Main entry point - fetches and maps all places |
| `mapPlaceApiResponse(item)` | Maps single API response to Place type |
| `deriveCategoryAndTags(services)` | Determines category and tags from services |
| `getFullImageUrl(path)` | Converts relative paths to full URLs |

---

## Promotions API

### Overview

The Promotions API fetches current promotional offers for display on the website.

- **File**: [`lib/api/promotions.ts`](file:///Users/home/Documents/Projects/elitesport/lib/api/promotions.ts)
- **Endpoint**: `POST https://elitesport.online/api/get-promo-web`
- **Auth**: Token-based (`Authorization: Token <token>`)

### API Response Structure

```typescript
type PromotionApiResponse = {
  id: number;
  name: string;
  discount: number;
  image: string;
  description: string;
  start_date: string;  // YYYY-MM-DD
  end_date: string;    // YYYY-MM-DD
};

type PromotionsApiResult = {
  data: PromotionApiResponse[];
  status: "success" | "error";
};
```

### Data Mapping

Promotions are mapped using `mapApiPromotionToRecord()`:

| API Field | Mapped To | Notes |
|-----------|-----------|-------|
| `id` | `_id` | Prefixed with `promo-` |
| `name` | `title` | Promotion title |
| `discount` | `discountPercentage` | Discount value |
| `image` | `featuredImageUrl` | Converted to full URL |
| `description` | `overview` | Converted to PortableText blocks |
| `description` | `overviewText` | Truncated for card display (200 chars) |
| `start_date` | `publishStartDate` | ISO date string |
| `end_date` | `publishEndDate` | ISO date string |

### Usage Example

```typescript
import { getPromotions } from "@/lib/api/promotions";

// In getStaticProps or getServerSideProps
const promotions = await getPromotions();
// Returns: PromotionRecord[] (sorted by date, newest first)
```

### Key Functions

| Function | Description |
|----------|-------------|
| `getPromotions()` | Main entry point - fetches, maps, and sorts promotions |
| `fetchPromotions()` | Raw API fetch (internal) |
| `mapApiPromotionToRecord(promo)` | Maps single API response to PromotionRecord |
| `sortPromotionsByDate(promotions)` | Sorts by start_date descending |
| `descriptionToPortableText(text)` | Converts text to PortableText blocks |

---

## Style Updates

### Places Page Categories

**File**: [`pages/places.tsx`](file:///Users/home/Documents/Projects/elitesport/pages/places.tsx)

#### Category Section Definitions

Each section has unique filtering logic and styling:

```typescript
const SECTIONS: SectionDef[] = [
  {
    value: "promotions",
    label: "Start Your Journey",
    anchor: "promotions",
    filter: (p) => !!p.offers,  // Has HTML offers
  },
  {
    value: "hotel",
    label: "Hotels",
    anchor: "hotels",
    filter: (p) => p.category === "hotel",
  },
  {
    value: "gym",
    label: "Gyms & Clubs",
    anchor: "gyms",
    filter: (p) => p.category === "gym" || p.category === "wellness",
  },
  {
    value: "female",
    label: "For women",
    anchor: "ladies",
    filter: (p) => p.tags?.includes("For women") ?? false,
  },
  {
    value: "kids",
    label: "Family & Kids",
    anchor: "kids",
    filter: (p) => p.tags?.includes("Family Friendly") ?? false,
  },
  {
    value: "tennisSquash",
    label: "Tennis & Squash",
    anchor: "racquet",
    filter: (p) => p.category === "tennisSquash",
  },
];
```

#### Section-Specific Styling

| Section | Background | Border | Text Color |
|---------|------------|--------|------------|
| **Promotions** | `bg-brand-gold/5` | `border-brand-gold/10` | Gold headings |
| **For Women** | `bg-pink-950/10` | Rounded container | Standard |
| **Default** | Transparent | None | Standard |

#### Category Navigation Bar

- **Position**: Sticky on mobile (`top-24`), static on desktop
- **Style**: Pill-shaped buttons with uppercase tracking
- **Promotions button**: Gold border and text
- **Other buttons**: Light blue border, ivory text
- **Hover**: Gold highlight

#### Grid Layout

```css
grid gap-5 sm:grid-cols-2 lg:grid-cols-3
```

---

### Home Page - Most Popular Places

**File**: [`pages/index.tsx`](file:///Users/home/Documents/Projects/elitesport/pages/index.tsx)

#### Data Fetching Logic

```typescript
// In getStaticProps
const allPlaces = await fetchPlaces();

// Display up to 6 places, prioritizing hotels
const popularPlaces = allPlaces
  .sort((a, b) => {
    if (a.category === "hotel" && b.category !== "hotel") return -1;
    if (b.category === "hotel" && a.category !== "hotel") return 1;
    return 0;
  })
  .slice(0, 6);
```

#### Section Styling

- **Eyebrow**: "Elite Destinations" (light blue, uppercase)
- **Title**: "Most Popular Places" (ivory, 3xl responsive to 4xl)
- **Description**: Gray text, max 3xl width

#### Grid Layout

```css
grid gap-8 md:grid-cols-2 xl:grid-cols-3
```

#### Animation

Uses Framer Motion staggered animations:

```typescript
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};
```

#### Link to All Places

Positioned below the grid:
- Style: Uppercase tracking, light blue → gold on hover
- Text: "See All Places →"
- Route: `/places`

---

## PlaceCard Component

**File**: [`components/places/PlaceCard.tsx`](file:///Users/home/Documents/Projects/elitesport/components/places/PlaceCard.tsx)

### Styling Details

```css
/* Card Container */
.glass-card.premium-card
  - overflow: hidden
  - cursor: pointer
  - flex column, full height

/* Image Section */
- Height: h-56 (224px)
- Image: object-cover with scale-105 hover transform
- Overlay: black/10 to black/0 on hover

/* Content Section */
- Padding: px-5 py-5
- Background: brand-black/40 with backdrop-blur-sm
- Category Label: 0.6rem uppercase, light blue, tracking 0.45em
- Title: xl semibold, brand-ivory
- Location: sm, gray/80, light weight
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `place` | `Place` | Place data object |
| `categoryLabel` | `string?` | Override category display |
| `onSelect` | `(place) => void` | Click handler for modal |
| `motionProps` | `object?` | Framer Motion animation config |

---

## Type Definitions

**File**: [`lib/placeTypes.ts`](file:///Users/home/Documents/Projects/elitesport/lib/placeTypes.ts)

```typescript
type PlaceCategory =
  | "hotel"
  | "gym"
  | "female"
  | "kids"
  | "tennisSquash"
  | "wellness"
  | "spa"
  | "resort";

type Place = {
  _id: string;
  name?: string | null;
  description?: string | null;  // HTML
  offers?: string | null;       // HTML
  services?: PlaceService[] | null;
  placeType?: PlaceCategory | null;
  category?: PlaceCategory | null;
  location?: string | null;
  featuredImageUrl?: string | null;
  imageUrls?: string[] | null;
  imageAlt?: string | null;
  showInMostPopular?: boolean | null;
  slug?: string | null;
  tags?: string[] | null;
};
```
