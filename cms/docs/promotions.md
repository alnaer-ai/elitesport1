# Promotions CMS Guide

## Schema summary
- `promotion` is a standalone document type. Editors create promotions independently with no references to Places.
- Required fields:
  - `title` (string)
  - `featuredImage` (image)
- Content fields:
  - `overview` (rich text / Portable Text)
  - `benefits` (array of strings)
  - `discountPercentage` (number, optional)
  - `promotionType` (string, optional)
- CTA fields:
  - `ctaLabel` (string, optional)
  - `ctaAction` (string, optional; internal route or full URL)
- Publishing fields (optional):
  - `isPublished` (boolean)
  - `publishStartDate` (datetime)
  - `publishEndDate` (datetime)

## Active promotion logic
A promotion is active when:
- `isPublished` is not `false`, and
- `publishStartDate` is empty or in the past, and
- `publishEndDate` is empty or in the future.

This keeps the CMS as the single source of truth while allowing optional scheduling.

## GROQ queries
**Latest promotions (limit 5):**
```groq
*[_type == "promotion" && (isPublished != false) && (!defined(publishStartDate) || publishStartDate <= now()) && (!defined(publishEndDate) || publishEndDate >= now())]
| order(coalesce(publishStartDate, _updatedAt, _createdAt) desc)[0...5] {
  _id,
  title,
  promotionType,
  discountPercentage,
  featuredImage,
  overview,
  benefits,
  ctaLabel,
  ctaAction,
  publishStartDate,
  publishEndDate
}
```

**All active promotions:**
```groq
*[_type == "promotion" && (isPublished != false) && (!defined(publishStartDate) || publishStartDate <= now()) && (!defined(publishEndDate) || publishEndDate >= now())]
| order(coalesce(publishStartDate, _updatedAt, _createdAt) desc) {
  _id,
  title,
  promotionType,
  discountPercentage,
  featuredImage,
  overview,
  benefits,
  ctaLabel,
  ctaAction,
  publishStartDate,
  publishEndDate
}
```

**Promotions by category:**
```groq
*[_type == "promotion" && promotionType == $promotionType] {
  _id,
  title,
  featuredImage
}
```

## Editorial workflow
1. **Add a promotion**
   - Go to Promotions → “New Promotion”.
   - Add Title and Featured Image (required).
   - Add Overview, Benefits, and optional CTA.
   - Publish. The promotion will appear on the promotions page and the home page carousel.
2. **Schedule or end a promotion**
   - Set `publishStartDate` and/or `publishEndDate`.
   - Optionally set `isPublished` to false to hide it immediately.
3. **Update a promotion**
   - Edit any fields and publish changes. The frontend updates automatically.

These patterns keep promotions modular, scalable, and independent of Places.
