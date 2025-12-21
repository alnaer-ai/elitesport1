## Overview

EliteSport is a modern marketing site built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. Pages are statically generated from local mock data, ready for future API integration.

Key pages:

- Home, Memberships, About, Contact, Places, and Promotions
- Shared layout with accessible navigation, skip link, and footer
- Components live in `components/` to keep sections reusable and ready for future expansion

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

Content is served from static mock data in `lib/mockData.ts`. This includes:

- `MOCK_HEROES` – hero content for each page
- `MOCK_PLACES` – gym, hotel, and wellness destinations
- `MOCK_PROMOTIONS` – member promotions and offers
- `MOCK_MEMBERSHIPS` – membership tiers and FAQs
- `MOCK_CLIENT_PARTNERS` – client and partner logos
- `MOCK_ABOUT` – about page content
- `MOCK_CONTACT` – contact information

Helper functions like `getPageHero()`, `getAllPlaces()`, `getActivePromotions()` provide type-safe access to this data.

**Future API Integration:** The data layer is designed for easy migration to an external API. Replace the mock data functions with API calls when ready.

## Structure and conventions

- `components/` holds UI atoms (Button, Container, Layout, Typography) and feature components
- `pages/` contains route-level components
- `lib/` contains data utilities, type definitions, and helper functions
- Tailwind custom theme tokens are defined in `tailwind.config.js`; global styles live in `styles/globals.css`

To add new sections/pages:

1. Add mock data to `lib/mockData.ts` following existing patterns.
2. Create a new page in `pages/` that consumes the data via `getStaticProps`.
3. If a section will be reused, place it in `components/` and import it wherever needed.

## Deployment

Deploy the Next.js site (e.g., to Vercel) as usual. No external services or environment variables are required.

## QA & Maintenance notes

- Navigation is fully responsive with keyboard-accessible skip links and ARIA labels.
- All imagery uses `next/image` and remote domains are whitelisted in `next.config.ts`.
- Framer Motion animations respect `prefers-reduced-motion` via browser defaults, so keep motion subtle when adding new sections.
- Before opening a PR, run `npm run lint`.

For support or onboarding, point teammates to this README plus the mock data definitions in `lib/mockData.ts`.
