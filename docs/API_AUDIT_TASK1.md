# TASK 1 — API Capability Audit

**Status:** ✅ COMPLETE  
**Date:** 2025-12-21  
**Build Status:** `npm run build` PASSES

---

## Executive Summary

The EliteSport Hotels API provides **basic data only**. Critical fields required for a rich UI experience (overview, benefits, type/category) are **NOT available** from the API.

---

## API Response Analysis

### Endpoint Information
- **URL:** `https://elitesport.online/api/get-hotels-web`
- **Method:** POST
- **Auth:** Token-based (`Authorization: Token <token>`)
- **Response:** JSON array of hotel objects
- **Total Records:** 57 hotels

### Fields Provided by API

| Field | Type | Coverage | Sample Value |
|-------|------|----------|--------------|
| `id` | number | 57/57 (100%) | `2` |
| `name` | string | 57/57 (100%) | `"Radisson Blu Hotel & Resort Abu Dhabi"` |
| `phone` | string | 57/57 (100%) | `"+971 268 119 00"` |
| `address` | string | 57/57 (100%) | `"Corniche Abu Dhabi,UAE"` |
| `image` | string | 57/57 (100%) | `"/media/uploads/202502-1711-3811..jpg"` |

### Sample API Response

```json
{
  "id": 2,
  "name": "Radisson Blu Hotel & Resort Abu Dhabi",
  "phone": "+971 268 119 00",
  "address": "Corniche Abu Dhabi,UAE",
  "image": "/media/uploads/202502-1711-3811..jpg"
}
```

---

## Required Fields Status (for UI)

| UI Field | API Field | Status | Notes |
|----------|-----------|--------|-------|
| `name` | `name` | ✅ Available | 100% coverage |
| `image(s)` | `image` | ✅ Available | Single image only (relative path) |
| `overview / description` | — | ❌ **MISSING** | No description/overview field in API |
| `benefits / features` | — | ❌ **MISSING** | No benefits/amenities field in API |
| `type / category` | — | ❌ **MISSING** | No type field; all items are hotels |
| `location` | `address` | ✅ Available | Using address as location |

---

## Detailed Findings

### 1. NAME ✅
- **Field:** `name`
- **Coverage:** 100% (57/57 records)
- **Quality:** Good - proper hotel names

### 2. IMAGE ✅
- **Field:** `image`
- **Coverage:** 100% (57/57 records)
- **Format:** Relative URL path (e.g., `/media/uploads/...`)
- **Issue:** Needs base URL prepended: `https://elitesport.online`
- **Note:** Only ONE image per hotel (no gallery)

### 3. OVERVIEW / DESCRIPTION ❌
- **Field:** NOT PRESENT
- **Checked for:** `overview`, `description`, `about`, `details`, `info`
- **Coverage:** 0%
- **Impact:** Cannot show rich descriptions in Place modal

### 4. BENEFITS / FEATURES ❌
- **Field:** NOT PRESENT
- **Checked for:** `benefits`, `features`, `amenities`, `facilities`, `services`
- **Coverage:** 0%
- **Impact:** Cannot show list of hotel benefits/amenities

### 5. TYPE / CATEGORY ❌
- **Field:** NOT PRESENT
- **Checked for:** `type`, `category`, `placeType`, `kind`, `classification`
- **Coverage:** 0%
- **Possible Values:** N/A
- **Impact:** Cannot filter/sort into Hotels, Gyms, Female-only sections
- **Note:** Current API only returns hotels (implied by endpoint name)

---

## Image URL Construction

The API returns relative image paths. Full URLs must be constructed:

```typescript
// API returns: "/media/uploads/202502-1711-3811..jpg"
// Full URL:    "https://elitesport.online/media/uploads/202502-1711-3811..jpg"
```

**Current Implementation:** Already handled in `lib/api/hotels.ts` via `getFullImageUrl()` function.

---

## Current Mapping (lib/api/hotels.ts)

The existing `mapHotelToPlace()` function correctly maps available fields:

```typescript
{
  _id: `hotel-api-${hotel.id}`,
  name: hotel.name ?? null,
  placeType: "hotel",           // Hardcoded (API doesn't provide)
  category: "hotel",            // Hardcoded (API doesn't provide)
  location: hotel.address ?? null,
  featuredImageUrl: getFullImageUrl(hotel.image),
  imageUrls: featuredImageUrl ? [featuredImageUrl] : null,
  overview: null,               // API doesn't provide
  benefits: null,               // API doesn't provide
  slug: generateSlug(name),
}
```

---

## Recommendations for Subsequent Tasks

### Task 2 (Data Normalization)
1. Keep current mapping structure
2. Define fallback strategy for missing fields:
   - `overview`: null (or generate generic placeholder text)
   - `benefits`: null (or empty array)
3. `type/category`: All API records are hotels by definition

### Task 3 (Sorting & Grouping)
1. All API data goes to "Hotels" section only
2. Non-hotel categories (gym, female, kids, tennisSquash) will only have mock data until API provides:
   - A type/category field, OR
   - Separate endpoints for each place type

### Task 4 (Overview & Benefits Integration)
1. Handle null gracefully in UI components
2. Consider showing "Contact for details" placeholder when overview is null
3. Hide benefits section when benefits array is null/empty

---

## API Improvement Requests

To fully support the website, the API should provide:

1. **`description`** or **`overview`** (string) - Hotel description text
2. **`benefits`** or **`amenities`** (array of strings) - List of features
3. **`type`** or **`category`** (string) - Place classification (hotel, gym, female, kids, etc.)
4. **`images`** (array) - Multiple images for gallery view
5. **`website`** (string) - Hotel website URL (optional)

---

## Verification

- [x] API response inspected
- [x] `overview` field: **MISSING**
- [x] `benefits` field: **MISSING**
- [x] `type/category` field: **MISSING**
- [x] Possible values for type: N/A (field not present)
- [x] Findings documented clearly
- [x] `npm run build` passes locally

---

## Files Created/Modified

1. **Created:** `pages/api/audit-hotels.ts` - Diagnostic endpoint for API inspection
2. **Created:** `docs/API_AUDIT_TASK1.md` - This documentation file

---

**END OF TASK 1 AUDIT**

