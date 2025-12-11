## Overview

EliteSport is a modern marketing site built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and a headless CMS (Sanity). Pages are statically generated from CMS content so new hero copy, places, promotions, or memberships can be published without redeploying the site.

Key pages:

- Home, Memberships, About, Contact, and Places (all CMS powered)
- Shared layout with accessible navigation, skip link, and footer
- Components live in `components/` to keep sections reusable and ready for future expansion

## Requirements

- Node.js 18+
- npm 10+ (or another package manager)
- Sanity project credentials exposed via the environment variables listed below

Copy `.env.local.example` (if available) into `.env.local` and provide at least:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxx
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-10-01
SANITY_API_READ_TOKEN=xxxxxxxx
```

## Running the app

```bash
# install dependencies
npm install

# start the Next.js dev server
npm run dev

# lint the project
npm run lint
```

The site runs at [http://localhost:3000](http://localhost:3000). All pages are statically generated and revalidated every 60 seconds when hitting Sanity.

## Sanity Studio

The CMS lives inside the `cms/` directory.

```bash
cd cms
npm install
npm run dev
```

Schemas exist for:

- `place` – used on Home (popular/nearby) and Places page
- `promotion` – drives the promotions carousel on Home
- `membershipInfo` – hero, tiers, and FAQs on Memberships page
- `aboutInfo` – hero, mission, values, team content
- `contactInfo` – address, contact details, office hours, and map coordinates
- `clientPartner` – logos for the “Clients & Partners” section

Whenever relevant data is missing the UI renders helpful placeholder copy, so editors can ship incremental content safely.

## Structure and conventions

- `components/` holds UI atoms (Button, Container, Layout, Typography)
- `pages/` contains route-level components that call the CMS
- `lib/sanity.client.ts` exposes a configured Sanity client plus helper utilities
- Tailwind custom theme tokens are defined in `tailwind.config.js`; global styles live in `styles/globals.css`

To add new sections/pages:

1. Create or update a schema in `cms/schemas`.
2. Publish the document so it is queryable.
3. Consume that data inside a page via `sanityClient.fetch`.
4. If a section will be reused, place it in `components/` and import it wherever needed.

This keeps presentation concerns decoupled from content, so future pages (e.g., a new “Events” tab or an additional Places category) are mostly CMS work plus a light template update.

## Deployment

Deploy the Next.js site (e.g., to Vercel) as usual. Set the same environment variables on the hosting provider and enable the Sanity webhook if you need on-demand revalidation.

## QA & Maintenance notes

- Navigation is fully responsive with keyboard-accessible skip links and ARIA labels.
- All imagery uses `next/image` and remote domains are whitelisted in `next.config.ts`.
- Framer Motion animations respect `prefers-reduced-motion` via browser defaults, so keep motion subtle when adding new sections.
- Before opening a PR, run `npm run lint`.

For support or onboarding, point teammates to this README plus the schema definitions inside `cms/schemas/`. Most additions boil down to Sanity document updates.
