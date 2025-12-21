# TASK 1 — Promotions API Capability Audit

**Status:** ✅ COMPLETE  
**Date:** 2025-12-21  
**Build Status:** `npm run build` PASSES

---

## Executive Summary

The EliteSport Promotions API provides **comprehensive data** for promotions display. All critical fields required for the UI are **available** from the API:

| Field | Status |
|-------|--------|
| Title/Name | ✅ Available |
| Image | ✅ Available |
| Discount | ✅ Available |
| Description/Overview | ✅ Available |
| Validity Dates | ✅ Available |
| Place Relationship | ❌ **NOT Available** |

---

## API Response Analysis

### Endpoint Information

- **URL:** `https://elitesport.online/api/get-promo-web`
- **Method:** POST
- **Auth:** Token-based (`Authorization: Token <token>`)
- **Response Format:** `{ data: [...], status: "success" }`
- **Total Records:** 117 promotions

### Fields Provided by API

| Field | Type | Coverage | Description |
|-------|------|----------|-------------|
| `id` | number | 117/117 (100%) | Unique promotion identifier |
| `name` | string | 117/117 (100%) | Promotion title (e.g., "Qaser Al Salateen - Dalma Mall") |
| `discount` | number | 117/117 (100%) | Discount percentage (e.g., 20, 30, 15) |
| `image` | string | 117/117 (100%) | Relative image path (e.g., "/media/uploads/202307-1815-3605..webp") |
| `description` | string | 117/117 (100%) | Full description with details, location, contact info |
| `start_date` | string | 117/117 (100%) | Start date in YYYY-MM-DD format |
| `end_date` | string | 117/117 (100%) | End date in YYYY-MM-DD format |

### Sample API Response

```json
{
  "data": [
    {
      "id": 3,
      "name": "Qaser Al Salateen - Dalma Mall",
      "discount": 20,
      "image": "/media/uploads/202307-1815-3605..webp",
      "description": "The restaurant offers mouth-watering traditional Middle Eastern dishes. \r\nGet a 20% discount located at Dalma Mall, 2nd floor\r\n\r\n\r\nContact: 02- 550-3355\r\nEmail:alsalateenqaser@gmail.com",
      "start_date": "2021-05-16",
      "end_date": "2026-12-31"
    },
    {
      "id": 6,
      "name": "Fairooz Spa",
      "discount": 20,
      "image": "/media/uploads/202107-2714-4215..jpg",
      "description": "The relaxing body you deserve.\r\nFull body massage, Moroccan bath & waxing.\r\n\r\nget 20% disc off\r\n\r\nMillennium Central Mafraq Hotel\r\n\r\nDial- 02 6596705",
      "start_date": "2022-07-01",
      "end_date": "2023-06-30"
    }
  ],
  "status": "success"
}
```

---

## Required Fields Status (for UI)

| UI Requirement | API Field | Status | Notes |
|----------------|-----------|--------|-------|
| `title` | `name` | ✅ **Available** | 100% coverage, good quality titles |
| `image(s)` | `image` | ✅ **Available** | Single image only (relative path) |
| `discountPercentage` | `discount` | ✅ **Available** | Numeric value (10-50 range observed) |
| `overview/description` | `description` | ✅ **Available** | Rich text with location & contact |
| `publishStartDate` | `start_date` | ✅ **Available** | YYYY-MM-DD format |
| `publishEndDate` | `end_date` | ✅ **Available** | YYYY-MM-DD format |
| `placeRelation` | — | ❌ **MISSING** | No hotel/place ID reference |
| `promotionType` | — | ❌ **MISSING** | No category field |

---

## Detailed Findings

### 1. NAME (Title) ✅

- **API Field:** `name`
- **Coverage:** 100% (117/117 records)
- **Quality:** Good - includes venue name and sometimes location
- **Examples:**
  - "Qaser Al Salateen - Dalma Mall"
  - "Fairooz Spa"
  - "Catch Restaurant - The St. Regis Abu Dhabi"
  - "Personal Training - Grand Millennium Al Wahda"

### 2. IMAGE ✅

- **API Field:** `image`
- **Coverage:** 100% (117/117 records)
- **Format:** Relative URL path (e.g., `/media/uploads/...`)
- **File types:** JPG, PNG, WebP observed
- **Note:** Needs base URL prepended: `https://elitesport.online`
- **Limitation:** Only ONE image per promotion (no gallery)

### 3. DISCOUNT ✅

- **API Field:** `discount`
- **Coverage:** 100% (117/117 records)
- **Type:** Number (integer)
- **Range:** 10% to 50% observed
- **Distribution of values:**
  - 10%: Several promotions
  - 15%: Many promotions
  - 20%: Most common
  - 25%: Several promotions
  - 30%: Many promotions
  - 50%: Rare (e.g., OYA Boutique)

### 4. DESCRIPTION (Overview) ✅

- **API Field:** `description`
- **Coverage:** 100% (117/117 records)
- **Format:** Plain text with `\r\n` line breaks
- **Content includes:**
  - Service/offer description
  - Location details
  - Contact information (phone, email)
  - Operating hours
  - Terms and conditions
- **Quality:** Rich, detailed descriptions

### 5. VALIDITY DATES ✅

- **Start Date Field:** `start_date`
- **End Date Field:** `end_date`
- **Coverage:** 100% (117/117 records)
- **Format:** YYYY-MM-DD (ISO date format)
- **Range:** 2021 to 2027
- **Note:** Some promotions have expired end dates (historical data)

### 6. PLACE RELATIONSHIP ❌

- **Field:** NOT PRESENT
- **Checked for:** `hotel`, `hotel_id`, `place`, `place_id`, `venue`, `location`, `partner`
- **Coverage:** 0%
- **Impact:** Cannot programmatically link promotions to specific Places
- **Workaround:** Parse location from `name` or `description` text

### 7. PROMOTION TYPE (Category) ❌

- **Field:** NOT PRESENT
- **Checked for:** `type`, `category`, `promotionType`, `kind`
- **Coverage:** 0%
- **Impact:** Cannot filter promotions by category (hotel, gym, spa, restaurant)
- **Workaround:** Infer from `name` or `description` keywords

---

## Image URL Construction

The API returns relative image paths. Full URLs must be constructed:

```typescript
// API returns: "/media/uploads/202307-1815-3605..webp"
// Full URL:    "https://elitesport.online/media/uploads/202307-1815-3605..webp"

const API_BASE_URL = "https://elitesport.online";

function getFullImageUrl(imagePath: string | undefined): string | null {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  return `${API_BASE_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
}
```

---

## Data Mapping to UI Model

### Current UI Model (`PromotionCardContent`)

```typescript
type PromotionCardContent = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  discountPercentage?: number;
  promotionTypeLabel?: string;
  metaLabel?: string;
  overview?: PortableTextBlock[];
  benefits?: string[];
  ctaLabel?: string;
  ctaAction?: string;
  publishStartDate?: string;
  publishEndDate?: string;
};
```

### Proposed Mapping

| UI Field | API Field | Mapping Logic |
|----------|-----------|---------------|
| `id` | `id` | `String(promo.id)` or `promo-${promo.id}` |
| `title` | `name` | Direct mapping |
| `description` | `description` | First line or truncated |
| `imageUrl` | `image` | Prepend base URL |
| `imageAlt` | `name` | Use name as alt text |
| `discountPercentage` | `discount` | Direct mapping (number) |
| `promotionTypeLabel` | — | Infer from name/description or null |
| `metaLabel` | — | Generate from dates ("Valid until...") |
| `overview` | `description` | Convert to PortableText or plain text |
| `benefits` | — | Parse from description or null |
| `ctaLabel` | — | Static: "View Details" or "Learn More" |
| `ctaAction` | — | Static: "/contact" or modal trigger |
| `publishStartDate` | `start_date` | Direct mapping |
| `publishEndDate` | `end_date` | Direct mapping |

---

## Active vs Expired Promotions

The API returns ALL promotions including expired ones. Filtering needed:

```typescript
function isPromotionActive(promo: PromotionApiResponse): boolean {
  const now = new Date();
  const startDate = promo.start_date ? new Date(promo.start_date) : null;
  const endDate = promo.end_date ? new Date(promo.end_date) : null;

  if (startDate && startDate > now) return false; // Not started yet
  if (endDate && endDate < now) return false; // Already ended
  return true;
}
```

**Active promotions (as of Dec 2025):** ~80+ promotions with `end_date` in 2026 or later.

---

## Recommendations for Subsequent Tasks

### Task 2 (Data Model & Mapping Plan)

1. Define `PromotionApiResponse` type matching API structure
2. Define mapping function `mapApiPromotionToUI()`
3. Handle:
   - Image URL construction
   - Date filtering for active promotions
   - Text truncation for card descriptions
   - Fallbacks for missing optional fields

### Task 3 (API Client)

1. Create `/lib/api/promotions.ts`
2. Implement `fetchPromotions()` using POST method
3. Use same auth pattern as hotels API
4. Log response structure for debugging

### Task 4 (Integration & Sorting)

1. Sort by `start_date` descending (latest first)
2. Filter out expired promotions
3. Limit for home page carousel (e.g., 6 items)
4. Show all on promotions page

### Task 5 (Stability)

1. Handle API errors gracefully (fallback to empty array)
2. Remove console.logs
3. Ensure no secrets in client code

---

## API Improvement Suggestions

To fully support the website, the API could additionally provide:

1. **`place_id` or `hotel_id`** - Link to specific partner location
2. **`category` or `type`** - Promotion category (spa, restaurant, gym, etc.)
3. **`images`** (array) - Multiple images for gallery view
4. **`is_active`** (boolean) - Pre-computed active status
5. **`featured`** (boolean) - Flag for homepage highlighting

---

## Verification Checklist

- [x] API response inspected
- [x] Discount field: **CONFIRMED** (100% coverage)
- [x] Overview/description field: **CONFIRMED** (100% coverage)
- [x] Place relationship field: **MISSING** (not in API response)
- [x] Validity dates: **CONFIRMED** (start_date + end_date)
- [x] Findings documented clearly
- [x] `npm run build` passes locally

---

## Files Created/Modified

1. **Created:** `pages/api/audit-promotions.ts` - Diagnostic endpoint for API inspection
2. **Created:** `docs/PROMOTIONS_API_AUDIT.md` - This documentation file

---

## Comparison: Hotels API vs Promotions API

| Feature | Hotels API | Promotions API |
|---------|------------|----------------|
| Endpoint | `/get-hotels-web` | `/get-promo-web` |
| Method | POST | POST |
| Auth | Token-based | Token-based |
| Records | 57 | 117 |
| Name/Title | ✅ | ✅ |
| Image | ✅ | ✅ |
| Description | ❌ | ✅ |
| Type/Category | ❌ | ❌ |
| Discount | N/A | ✅ |
| Dates | N/A | ✅ |

**Conclusion:** The Promotions API is more complete than the Hotels API and provides all essential data for rendering promotion cards and modals.

---

**END OF TASK 1 AUDIT**

