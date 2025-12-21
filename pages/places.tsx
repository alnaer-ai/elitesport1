import Head from "next/head";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { type MouseEvent } from "react";

import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import {
  PlaceCard,
  usePlaceModal,
  type Place,
} from "@/components/places";
import { cn } from "@/lib/cn";
import { type HeroPayload } from "@/lib/hero";
import { getPageHero, getAllPlaces, type Place as MockPlace } from "@/lib/mockData";
import { getHotelsAsPlaces } from "@/lib/api/hotels";

type PlacesPageProps = {
  places: Place[];
  hero: HeroPayload | null;
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
    value: "tennisSquash",
    label: "Tennis & Squash",
    anchor: "racquet",
    description:
      "Indoor and outdoor racquet venues offering pro-grade surfaces, match play, and tactical coaching.",
  },
] as const;

// Convert mock place to Place type (ensure no undefined values for serialization)
const mapMockPlaceToPlace = (mockPlace: MockPlace): Place => ({
  _id: mockPlace._id,
  name: mockPlace.name ?? null,
  placeType: mockPlace.placeType ?? null,
  category: mockPlace.category ?? null,
  location: mockPlace.location ?? null,
  featuredImageUrl: mockPlace.featuredImageUrl ?? null,
  imageUrls: mockPlace.imageUrls ?? null,
  imageAlt: mockPlace.imageAlt ?? null,
  overview: mockPlace.overview ?? null,
  benefits: mockPlace.benefits ?? null,
  showInMostPopular: mockPlace.showInMostPopular ?? null,
  slug: mockPlace.slug ?? null,
  tags: mockPlace.tags ?? null,
});

export default function PlacesPage({
  places,
  hero,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const placesByCategory = PLACE_SECTIONS.map((section) => ({
    ...section,
    places: places.filter((place) => {
      const placeCategory = place.placeType ?? place.category;
      return placeCategory === section.value;
    }),
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
          content="Explore EliteSport-approved hotels, gyms, spas, and clubs worldwide — organized by category."
        />
      </Head>

      <div className="space-y-10 pb-20">
        <Hero hero={hero} />
        {navigableSections.length > 0 && (
          <Container className="flex flex-wrap gap-3 border-b border-brand-deepBlue/50 pb-8">
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
          </Container>
        )}

        {placesByCategory.map((section) => (
          <CategorySection
            key={section.value}
            section={section}
          />
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
  const { openModal: openPlaceModal } = usePlaceModal();
  const placeCount =
    section.places.length === 1 ? "1 Place" : `${section.places.length} Places`;

  const isFemalesSection = section.anchor === "females";

  return (
    <section
      id={section.anchor}
      className={cn(
        "scroll-mt-24",
        isFemalesSection && "bg-pink-950/10 rounded-lg"
      )}
    >
      <Container className="space-y-7">
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
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {section.places.map((place) => {
              return (
                <PlaceCard
                  key={place._id}
                  place={place}
                  categoryLabel={section.label}
                  onSelect={(place) => openPlaceModal(place, section.label)}
                />
              );
            })}
          </div>
        ) : (
          <p className="glass-card border border-dashed border-white/25 px-6 py-8 text-center text-sm text-brand-gray">
            We&apos;re finalizing new {section.label.toLowerCase()} for this region.
          </p>
        )}
      </Container>
    </section>
  );
};


export const getStaticProps: GetStaticProps<PlacesPageProps> = async () => {
  // Get mock places for non-hotel categories (gym, female, kids, tennisSquash)
  const mockPlaces = getAllPlaces()
    .filter((place) => place.placeType !== "hotel")
    .map(mapMockPlaceToPlace);

  // Fetch hotels from the EliteSport API
  const apiHotels = await getHotelsAsPlaces();

  // Combine API hotels with mock non-hotel places
  const places: Place[] = [...apiHotels, ...mockPlaces];

  const hero = getPageHero("places");

  return {
    props: {
      places,
      hero: hero ?? null,
    },
    revalidate: 60,
  };
};
