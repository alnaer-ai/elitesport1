# TASK 2 — Promotions Data Model & Mapping Plan

**Status:** ✅ COMPLETE  
**Date:** 2025-12-21  
**Prerequisites:** Task 1 (API Audit) complete

---

## Executive Summary

This document defines how Promotions API data maps to the existing UI expectations. The mapping strategy preserves UI compatibility while transforming API data into the established `PromotionRecord` and `PromotionCardContent` types.

**Key Findings:**
- The existing `PromotionRecord` type is suitable for API data with minor adjustments
- All critical UI fields can be populated from the API
- Place relationship is **NOT** available from API (acceptable limitation)
- Promotion type/category is **NOT** available from API (use null fallback)

---

## Data Types Overview

### 1. API Response Type (New)

This type represents the raw data returned by the Promotions API:

```typescript
/**
 * Raw promotion data from the EliteSport API
 * Endpoint: POST https://elitesport.online/api/get-promo-web
 */
export type PromotionApiResponse = {
  id: number;
  name: string;
  discount: number;
  image: string;        // Relative path, e.g., "/media/uploads/..."
  description: string;  // Plain text with \r\n line breaks
  start_date: string;   // YYYY-MM-DD format
  end_date: string;     // YYYY-MM-DD format
};

/**
 * Full API response wrapper
 */
export type PromotionsApiResult = {
  data: PromotionApiResponse[];
  status: "success" | "error";
};
```

### 2. Existing UI Type (PromotionRecord)

The current `PromotionRecord` type in `lib/promotionContent.ts`:

```typescript
export type PromotionRecord = {
  _id: string;
  title?: string | null;
  promotionType?: string | null;          // Not available from API
  overview?: PortableTextBlock[] | null;  // Converted from API description
  overviewText?: string | null;           // From API description
  benefits?: string[] | null;             // Parsed from description or null
  ctaLabel?: string | null;               // Static fallback
  ctaAction?: string | null;              // Static fallback
  featuredImageUrl?: string | null;       // From API with base URL
  imageAlt?: string | null;               // Generated from name
  discountPercentage?: number | null;     // Direct from API
  isPublished?: boolean | null;           // Calculated from dates
  publishStartDate?: string | null;       // Direct from API
  publishEndDate?: string | null;         // Direct from API
};
```

### 3. Card Display Type (PromotionCardContent)

The type used by UI components (`lib/promotionCardContent.ts`):

```typescript
export type PromotionCardContent = {
  id: string;
  title: string;
  description?: string;           // Short description for card
  imageUrl?: string;              // Full image URL
  imageAlt?: string;              // Alt text
  discountPercentage?: number;    // Discount badge
  promotionTypeLabel?: string;    // Category label (will be null from API)
  metaLabel?: string;             // "Valid until Dec 31, 2026"
  overview?: PortableTextBlock[]; // Full description for modal
  benefits?: string[];            // Parsed benefits list
  ctaLabel?: string;              // CTA button text
  ctaAction?: string;             // CTA link
  publishStartDate?: string;      // Validity start
  publishEndDate?: string;        // Validity end
};
```

---

## Field Mapping Rules

### Complete Mapping Table

| UI Field | API Field | Mapping Logic | Fallback |
|----------|-----------|---------------|----------|
| `_id` | `id` | `String(api.id)` | Required |
| `title` | `name` | Direct | "EliteSport Promotion" |
| `promotionType` | — | Not available | `null` |
| `overview` | `description` | Convert to PortableText blocks | `null` |
| `overviewText` | `description` | First 200 chars, cleaned | Static fallback |
| `benefits` | `description` | Parse bullet points if present | `null` |
| `ctaLabel` | — | Static | "Learn More" |
| `ctaAction` | — | Static | "/contact" |
| `featuredImageUrl` | `image` | Prepend base URL | Fallback image |
| `imageAlt` | `name` | Use promotion name | "EliteSport promotion" |
| `discountPercentage` | `discount` | Direct (number) | `null` |
| `isPublished` | `start_date`, `end_date` | Calculate from dates | `true` |
| `publishStartDate` | `start_date` | Direct (YYYY-MM-DD) | `null` |
| `publishEndDate` | `end_date` | Direct (YYYY-MM-DD) | `null` |

### Card Content Mapping

| CardContent Field | Source | Logic |
|-------------------|--------|-------|
| `id` | `_id` | Direct |
| `title` | `title` | Direct |
| `description` | `overviewText` | Short excerpt |
| `imageUrl` | `featuredImageUrl` | Full URL |
| `imageAlt` | `imageAlt` | Generated from title |
| `discountPercentage` | `discountPercentage` | Direct number |
| `promotionTypeLabel` | `promotionType` | Will be `undefined` (no API support) |
| `metaLabel` | `publishEndDate` | "Valid until {date}" format |
| `overview` | `overview` | PortableText blocks |
| `benefits` | `benefits` | Array of strings |
| `ctaLabel` | `ctaLabel` | "Learn More" fallback |
| `ctaAction` | `ctaAction` | "/contact" fallback |

---

## Mapping Implementation

### 1. API to PromotionRecord Mapper

```typescript
// lib/api/promotions.ts

const API_BASE_URL = "https://elitesport.online";

/**
 * Convert API promotion to PromotionRecord type
 */
export function mapApiPromotionToRecord(
  apiPromotion: PromotionApiResponse
): PromotionRecord {
  const fullImageUrl = getFullImageUrl(apiPromotion.image);
  const cleanedDescription = cleanDescription(apiPromotion.description);
  const overviewBlocks = descriptionToPortableText(cleanedDescription);
  
  return {
    _id: `promo-${apiPromotion.id}`,
    title: apiPromotion.name || null,
    promotionType: null,                      // Not available from API
    overview: overviewBlocks,
    overviewText: truncateDescription(cleanedDescription, 200),
    benefits: parseBenefitsFromDescription(cleanedDescription),
    ctaLabel: "Learn More",
    ctaAction: "/contact",
    featuredImageUrl: fullImageUrl,
    imageAlt: apiPromotion.name || null,
    discountPercentage: apiPromotion.discount,
    isPublished: true,                        // API only returns active promotions
    publishStartDate: apiPromotion.start_date || null,
    publishEndDate: apiPromotion.end_date || null,
  };
}
```

### 2. Image URL Construction

```typescript
/**
 * Convert relative image path to full URL
 */
function getFullImageUrl(imagePath: string | undefined): string | null {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  
  const separator = imagePath.startsWith("/") ? "" : "/";
  return `${API_BASE_URL}${separator}${imagePath}`;
}
```

### 3. Description Cleaning

```typescript
/**
 * Clean API description text
 * - Normalize line breaks (\r\n → \n)
 * - Trim whitespace
 */
function cleanDescription(description: string): string {
  if (!description) return "";
  return description
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Truncate description for card display
 */
function truncateDescription(text: string, maxLength: number): string {
  if (!text) return "Exclusive member benefit curated by EliteSport.";
  
  const firstParagraph = text.split("\n")[0];
  if (firstParagraph.length <= maxLength) return firstParagraph;
  
  return firstParagraph.substring(0, maxLength - 3).trim() + "...";
}
```

### 4. PortableText Conversion

```typescript
import type { PortableTextBlock } from "@portabletext/types";

/**
 * Convert plain text description to PortableText blocks
 */
function descriptionToPortableText(description: string): PortableTextBlock[] | null {
  if (!description) return null;
  
  const paragraphs = description.split("\n\n").filter(Boolean);
  
  return paragraphs.map((paragraph, index) => ({
    _type: "block",
    _key: `block-${index}`,
    style: "normal",
    children: [
      {
        _type: "span",
        _key: `span-${index}`,
        text: paragraph.replace(/\n/g, " ").trim(),
      },
    ],
    markDefs: [],
  }));
}
```

### 5. Benefits Parsing (Optional Enhancement)

```typescript
/**
 * Attempt to parse benefits from description
 * Returns null if no clear benefit list found
 * 
 * Note: The API descriptions don't have structured benefits,
 * so this is best-effort parsing. If no clear pattern,
 * return null and let the UI handle the absence.
 */
function parseBenefitsFromDescription(description: string): string[] | null {
  // API descriptions don't have structured benefits
  // For now, return null - the overview will show full content
  return null;
}
```

---

## Fallback Strategy

### Field Fallbacks

| Field | Fallback Value | Rationale |
|-------|---------------|-----------|
| `title` | "EliteSport Promotion" | Should never happen (API has 100% coverage) |
| `imageUrl` | Fallback Unsplash image | Consistent visual experience |
| `description` | "Exclusive member benefit..." | Generic but informative |
| `promotionTypeLabel` | `undefined` (no badge shown) | API doesn't provide category |
| `metaLabel` | "Member Exclusive" | Generic label when dates unavailable |
| `ctaLabel` | "Learn More" | Generic CTA |
| `ctaAction` | "/contact" | Directs to contact page |
| `benefits` | `undefined` (section hidden) | No structured benefits in API |

### Error Fallbacks

| Scenario | Fallback Behavior |
|----------|-------------------|
| API returns empty array | Show empty state: "No promotions available" |
| API returns error | Use empty array, log error server-side |
| Image fails to load | Next.js Image will show broken image indicator |
| Invalid date format | Treat as null, hide date label |

---

## Date Handling

### Active Promotion Filtering

The existing `isPromotionActive()` function in `lib/promotionContent.ts` is already suitable:

```typescript
export const isPromotionActive = (promotion?: {
  isPublished?: boolean | null;
  publishStartDate?: string | null;
  publishEndDate?: string | null;
}) => {
  if (!promotion) return false;
  if (promotion.isPublished === false) return false;

  const now = Date.now();

  if (promotion.publishStartDate) {
    const startsAt = Date.parse(promotion.publishStartDate);
    if (!Number.isNaN(startsAt) && startsAt > now) return false;
  }

  if (promotion.publishEndDate) {
    const endsAt = Date.parse(promotion.publishEndDate);
    if (!Number.isNaN(endsAt) && endsAt <= now) return false;
  }

  return true;
};
```

### Meta Label Generation

For the card meta label, generate a "Valid until" message:

```typescript
function generateMetaLabel(endDate: string | null): string {
  if (!endDate) return "Member Exclusive";
  
  try {
    const date = new Date(endDate);
    const formatted = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `Valid until ${formatted}`;
  } catch {
    return "Member Exclusive";
  }
}
```

---

## Sorting Strategy

### Primary Sort: Latest First

Sort promotions by `start_date` descending (newest first):

```typescript
function sortPromotionsByDate(promotions: PromotionRecord[]): PromotionRecord[] {
  return [...promotions].sort((a, b) => {
    const dateA = a.publishStartDate ? new Date(a.publishStartDate).getTime() : 0;
    const dateB = b.publishStartDate ? new Date(b.publishStartDate).getTime() : 0;
    return dateB - dateA; // Descending order
  });
}
```

### Page-Specific Limits

| Page | Limit | Rationale |
|------|-------|-----------|
| Home | 5 | Carousel/grid preview |
| Promotions | All | Full list with filtering |

---

## What's NOT Available (Accepted Limitations)

### 1. Place Relationship ❌

- **Impact:** Cannot link promotions to specific Places
- **Workaround:** None needed - promotions display independently
- **UI Impact:** No "View Place" button in modal

### 2. Promotion Category/Type ❌

- **Impact:** Category filter on Promotions page will be empty
- **Workaround:** Hide category filter when no categories exist
- **UI Impact:** `promotionTypeLabel` badge will not render

### 3. Multiple Images ❌

- **Impact:** Only single image per promotion
- **Workaround:** None needed - current UI uses single image
- **UI Impact:** None

### 4. Structured Benefits ❌

- **Impact:** Benefits section may be empty
- **Workaround:** Benefits section hidden when null
- **UI Impact:** Modal shows overview only, no bullet list

---

## Implementation Checklist

- [x] `PromotionApiResponse` type defined
- [x] `mapApiPromotionToRecord()` logic defined
- [x] Image URL construction logic defined
- [x] Description cleaning logic defined
- [x] PortableText conversion logic defined
- [x] Fallback strategy defined
- [x] Date handling confirmed compatible
- [x] Sorting strategy defined
- [x] Limitations documented

---

## Next Steps (Task 3)

1. Create `/lib/api/promotions.ts` with:
   - `PromotionApiResponse` type
   - `PromotionsApiResult` type
   - `fetchPromotions()` function
   - `mapApiPromotionToRecord()` function

2. Use environment variables:
   - `ELITESPORT_API_TOKEN` for authorization

3. Return sorted, filtered `PromotionRecord[]`

---

## File Changes Summary

**No code changes in Task 2** - this is a planning document.

### Files to Create (Task 3):
- `/lib/api/promotions.ts` - API client and mappers

### Files to Modify (Task 4):
- `/pages/index.tsx` - Use API data for home promotions
- `/pages/promotions.tsx` - Use API data for all promotions
- Possibly hide category filter if no categories exist

---

## Compatibility Notes

### Existing Code Compatibility

| Component | Compatibility | Notes |
|-----------|--------------|-------|
| `PromotionCard` | ✅ Full | Uses `PromotionCardContent` |
| `PromotionModal` | ✅ Full | Uses `PromotionCardContent` |
| `PromotionsGrid` | ✅ Full | Uses `PromotionCardContent[]` |
| `PromotionCarousel` | ✅ Full | Uses `PromotionCardContent[]` |
| `promotionContent.ts` | ✅ Full | Types and mappers compatible |
| `promotionLabels.ts` | ✅ Full | Fallback to undefined works |

### Breaking Changes

**None** - The mapping preserves all existing type contracts.

---

**END OF TASK 2 DATA MODEL**

