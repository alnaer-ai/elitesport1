import Head from "next/head";
import Image from "next/image";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import type { MouseEvent } from "react";
import { motion } from "framer-motion";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { Container } from "@/components/Container";
import {
  isSanityConfigured,
  sanityClient,
  urlForImage,
} from "@/lib/sanity.client";

type PlaceCategory =
  | "hotel"
  | "gym"
  | "female"
  | "kids"
  | "spa"
  | "tennisSquash";

type Place = {
  _id: string;
  name?: string;
  category?: PlaceCategory;
  description?: string;
  image?: SanityImageSource;
  tags?: string[];
};

type PlacesPageProps = {
  places: Place[];
};

const PLACE_SECTIONS = [
  {
    value: "hotel",
    label: "Hotels",
    anchor: "hotels",
    description:
      "Flagship residences inside five-star hotels, complete with private gyms and concierge recovery rituals.",
  },
  {
    value: "gym",
    label: "Gym",
    anchor: "gyms",
    description:
      "Signature training clubs curated for precision coaching, data-led programming, and on-call experts.",
  },
  {
    value: "female",
    label: "For Females",
    anchor: "females",
    description:
      "Women-only sanctuaries featuring guided classes, spa-grade recovery, and privacy-first amenities.",
  },
  {
    value: "kids",
    label: "For Kids",
    anchor: "kids",
    description:
      "Play-forward clubs where junior members explore sport safely with age-smart coaching staff.",
  },
  {
    value: "spa",
    label: "Spa",
    anchor: "spas",
    description:
      "Immersive hydrotherapy and ritual baths co-created with luxury spa partners for restorative sessions.",
  },
  {
    value: "tennisSquash",
    label: "Tennis & Squash",
    anchor: "racquet",
    description:
      "Indoor and outdoor racquet venues offering pro-grade surfaces, match play, and tactical coaching.",
  },
] as const;

const PLACE_QUERY = `
  *[_type == "place"] | order(coalesce(priority, 1000) asc, name asc) {
    _id,
    name,
    category,
    description,
    image,
    tags
  }
`;

const heroImage =
  "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=2400&q=80";

const fallbackPlaceImage =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80";

const cardMotionProps = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: "easeOut" },
};

const getImageUrl = (source?: SanityImageSource) => {
  if (!source || !isSanityConfigured) {
    return undefined;
  }

  try {
    return urlForImage(source).width(1600).height(1000).fit("crop").auto("format").url();
  } catch {
    return undefined;
  }
};

export default function PlacesPage({
  places,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const placesByCategory = PLACE_SECTIONS.map((section) => ({
    ...section,
    places: places.filter((place) => place.category === section.value),
  }));

  const navigableSections = placesByCategory.filter(
    (section) => section.places.length > 0
  );

  const handleNavClick = (
    event: MouseEvent<HTMLAnchorElement>,
    anchor: string
  ) => {
    event.preventDefault();
    const target = document.getElementById(anchor);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <Head>
        <title>Places | EliteSport</title>
        <meta
          name="description"
          content="Explore EliteSport-approved hotels, gyms, spas, and clubs worldwide — organized by category and powered by live CMS content."
        />
      </Head>

      <div className="space-y-20 pb-24">
        <section className="relative isolate overflow-hidden border-b border-brand-deepBlue/60">
          <Image
            src={heroImage}
            alt="EliteSport destination"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/80 to-brand-deepBlue/70" />
          <Container className="relative z-10 space-y-10 py-24">
            <div className="max-w-3xl space-y-6">
              <p className="text-xs uppercase tracking-[0.5em] text-brand-lightBlue">
                Global Network
              </p>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold text-brand-ivory sm:text-5xl">
                  Places
                </h1>
                <p className="text-base text-brand-gray sm:text-lg">
                  Gain effortless access to curated hotels, gyms, and racquet clubs.
                  Every location is sourced directly from our CMS, so new destinations
                  appear automatically the moment they are published.
                </p>
              </div>
            </div>
            {navigableSections.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {navigableSections.map((section) => (
                  <a
                    key={section.value}
                    href={`#${section.anchor}`}
                    onClick={(event) => handleNavClick(event, section.anchor)}
                    className="rounded-full border border-brand-lightBlue/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-brand-ivory transition hover:border-brand-gold hover:text-brand-gold"
                  >
                    {section.label}
                  </a>
                ))}
              </div>
            )}
          </Container>
        </section>

        {placesByCategory.map((section) => (
          <CategorySection key={section.value} section={section} />
        ))}
      </div>
    </>
  );
}

const CategorySection = ({
  section,
}: {
  section: (typeof PLACE_SECTIONS)[number] & { places: Place[] };
}) => {
  const placeCount =
    section.places.length === 1 ? "1 Place" : `${section.places.length} Places`;

  return (
    <section id={section.anchor} className="scroll-mt-24">
      <Container className="space-y-8">
        <div className="space-y-3 text-center sm:text-left">
          <p className="text-xs uppercase tracking-[0.4em] text-brand-lightBlue">
            {section.label}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <h2 className="text-3xl text-brand-ivory sm:text-4xl">
                {section.label}
              </h2>
              <p className="text-base text-brand-gray sm:max-w-2xl">
                {section.description}
              </p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-gold">
              {placeCount}
            </span>
          </div>
        </div>

        {section.places.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {section.places.map((place) => (
              <PlaceCard
                key={place._id}
                place={place}
                categoryLabel={section.label}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-3xl border border-dashed border-brand-deepBlue/50 bg-brand-black/50 px-6 py-8 text-center text-sm text-brand-gray">
            We&apos;re finalizing new {section.label.toLowerCase()} for this region.
          </p>
        )}
      </Container>
    </section>
  );
};

const PlaceCard = ({
  place,
  categoryLabel,
}: {
  place: Place;
  categoryLabel: string;
}) => {
  const imageUrl = getImageUrl(place.image) ?? fallbackPlaceImage;
  const tags = (place.tags ?? []).filter(Boolean);

  return (
    <motion.article
      {...cardMotionProps}
      className="overflow-hidden rounded-3xl border border-brand-deepBlue/60 bg-brand-black/70 shadow-lg shadow-brand-black/30"
    >
      <div className="relative h-60 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={place.name ?? "EliteSport place"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-[0.6rem] uppercase tracking-[0.45em] text-brand-lightBlue">
            {categoryLabel}
          </p>
          <p className="mt-2 text-xl font-semibold text-brand-ivory">
            {place.name ?? "EliteSport Place"}
          </p>
        </div>
      </div>
      <div className="space-y-4 px-5 py-6">
        <p className="text-sm text-brand-gray/90">
          {place.description ??
            "Destination curated by EliteSport with white-glove service and member-only access."}
        </p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-brand-lightBlue/30 px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-brand-lightBlue/90"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
};

export const getStaticProps: GetStaticProps<PlacesPageProps> = async () => {
  const client = sanityClient;
  if (!client) {
    return {
      props: {
        places: [],
      },
      revalidate: 60,
    };
  }

  const places = await client.fetch<Place[]>(PLACE_QUERY);

  return {
    props: {
      places,
    },
    revalidate: 60,
  };
};
