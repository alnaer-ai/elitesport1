# Place Schema Architecture

## Overview
The Place schema is focused exclusively on Place content and is organized into two groups:
- **Card Fields**: Data shown on cards and in lists.
- **Modal Details**: Content shown in the place detail modal.

Places do not reference Promotions. Promotions are a separate content stream.

## Card Fields (Used Everywhere)
- **Place Name** (`name`) - Required string
- **Place Type** (`placeType`) - Required enum (Hotel, Gym, Female Club, Kids Club, Tennis & Squash, Wellness)
- **Location** (`location`) - Required short text (e.g., "Dubai Marina")
- **Featured Image** (`featuredImage`) - Required image with alt text
- **Show in Most Popular** (`showInMostPopular`) - Optional boolean

**Frontend usage:**
- Place cards (homepage, places page)
- Place modal header

## Modal Details (Detail View)
- **Gallery Images** (`images`) - Optional image gallery
- **Overview** (`overview`) - Rich text (Portable Text)
- **Benefits** (`benefits`) - Array of bullet points

**Frontend usage:**
- Place modal content

## Query example
```groq
*[_type == "place"] | order(name asc) {
  _id,
  name,
  placeType,
  location,
  featuredImage,
  images,
  overview,
  benefits,
  showInMostPopular
}
```

## Editorial workflow
1. **Create a new Place**
   - Fill in card fields (required).
   - Add modal details as needed.
2. **Update a Place**
   - Publish changes; the site updates automatically.
