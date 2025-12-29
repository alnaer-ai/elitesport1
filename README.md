## Overview

EliteSport is a modern marketing site built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. The site integrates with the EliteSport API for dynamic content, with pages statically generated using ISR (Incremental Static Regeneration).

Key pages:

- Home, Memberships, About, Contact, Places, and Promotions
- Shared layout with accessible navigation, skip link, and footer
- Components live in `components/` to keep sections reusable and ready for future expansion

**API Integration:**
- ✅ **Places/Hotels API** - Integrated and live
- ✅ **Promotions API** - Integrated and live
- 🔄 **Memberships** - Using mock data (ready for API integration)

## Requirements

- Node.js 18+
- npm 10+ (or another package manager)

## Running the app

```bash
# install dependencies
npm install

# start the Next.js dev server
npm run dev

# lint the project
npm run lint

# run tests
npm test
```

The site runs at [http://localhost:3000](http://localhost:3000). All pages are statically generated with ISR (revalidate every 60 seconds).

## Data Layer

The site uses a hybrid data approach combining API integration and mock data:

### API Integration (Live)

**Places/Hotels API** (`lib/api/hotels.ts`):
- Fetches hotel/place data from `POST /api/get-hotels-web`
- Returns 57 places with: name, address, phone, image
- Mapped to `Place` type for UI components
- Endpoint: `/pages/api/audit-hotels` (dev only) for API inspection

**Promotions API** (`lib/api/promotions.ts`):
- Fetches promotion data from `POST /api/get-promo-web`
- Returns 121 promotions (78 active after date filtering)
- Fields: name, discount, image, description, start_date, end_date
- Automatically filters expired promotions via `isPromotionActive()`
- Endpoint: `/pages/api/audit-promotions` (dev only) for API inspection

### Mock Data (Static)

Content from `lib/mockData.ts`:
- `MOCK_HEROES` – hero content for each page
- `MOCK_MEMBERSHIPS` – membership tiers and FAQs
- `MOCK_ABOUT` – about page content
- `MOCK_CONTACT` – contact information

### Environment Variables Required

```bash
# Required for Places/Hotels API
ELITESPORT_GET_HOTELS_WEB_URL=https://elitesport.online/api/get-hotels-web

# Required for Promotions API
ELITESPORT_GET_PROMOTIONS_WEB_URL=https://elitesport.online/api/get-promo-web

# Required for all API calls - authentication token
ELITESPORT_API_TOKEN=your_token_here

# Email Configuration (for Contact Form)
# SMTP settings for sending contact form emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
CONTACT_EMAIL=info@theelitesport.com
```

**Note:** 
- API tokens should never be committed to the repository. Use `.env.local` for local development.
- For Gmail, you'll need to use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password.
- If email credentials are not configured, the contact form will still work but will log submissions to the console instead of sending emails.

> ⚠️ **Vercel Deployment:** These environment variables must be configured in your Vercel project settings under Settings → Environment Variables. Add all three variables for Production, Preview, and Development environments.

## Migration from CMS to API

**Previous Setup:** The site previously used Sanity CMS for content management.

**Current Setup:** 
- ✅ Removed Sanity CMS integration
- ✅ Integrated EliteSport REST API for Places and Promotions
- ✅ Server-side API clients in `lib/api/` (server-only, never called from client)
- ✅ Type-safe data mapping from API responses to UI components
- ✅ Graceful error handling (returns empty arrays on API failures)

**API Architecture:**
- All API calls are server-side only (in `getStaticProps` or API routes)
- API clients handle authentication, error handling, and data transformation
- UI components receive clean, typed data structures
- No API keys or tokens exposed to the client

## Structure and conventions

- `components/` holds UI atoms (Button, Container, Layout, Typography) and feature components
- `pages/` contains route-level components with `getStaticProps` for data fetching
- `lib/api/` contains server-side API clients (hotels.ts, promotions.ts)
- `lib/` contains data utilities, type definitions, and helper functions
- `pages/api/` contains API audit endpoints (development only)
- Tailwind custom theme tokens are defined in `tailwind.config.js`; global styles live in `styles/globals.css`

To add new sections/pages:

1. For API data: Create API client in `lib/api/` following existing patterns
2. For static content: Add mock data to `lib/mockData.ts`
3. Create a new page in `pages/` that consumes the data via `getStaticProps`
4. If a section will be reused, place it in `components/` and import it wherever needed

## Deployment

Deploy the Next.js site (e.g., to Vercel) as usual. 

**Required Environment Variables:**
- `ELITESPORT_GET_HOTELS_WEB_URL` - Hotels/places API endpoint (e.g., `https://elitesport.online/api/get-hotels-web`)
- `ELITESPORT_GET_PROMOTIONS_WEB_URL` - Promotions API endpoint (e.g., `https://elitesport.online/api/get-promo-web`)
- `ELITESPORT_API_TOKEN` - API authentication token

Set these in your deployment platform's environment variable settings:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each variable with the correct value
3. Make sure to enable for Production, Preview, and Development environments
4. Redeploy the application for changes to take effect

**ISR Configuration:**
- Pages revalidate every 60 seconds to fetch fresh API data
- Static pages are generated at build time and updated incrementally

## Development Tools

**API Audit Endpoints** (Development Only):
- `GET /api/audit-promotions` - Inspect promotions API response structure
- `GET /api/audit-hotels` - Inspect hotels/places API response structure

These endpoints help verify API field availability, coverage, and data quality. They are automatically disabled in production.

## QA & Maintenance notes

- Navigation is fully responsive with keyboard-accessible skip links and ARIA labels.
- All imagery uses `next/image` and remote domains are whitelisted in `next.config.ts`.
- Image loading includes error handling with fallback UI for failed/timeout images.
- Framer Motion animations respect `prefers-reduced-motion` via browser defaults, so keep motion subtle when adding new sections.
- Promotions are automatically filtered by date (expired promotions hidden).
- Before opening a PR, run `npm run lint` and ensure `npm run build` passes.

For support or onboarding, point teammates to this README plus:
- API client implementations in `lib/api/`
- Mock data definitions in `lib/mockData.ts`
- API audit documentation in `docs/`
