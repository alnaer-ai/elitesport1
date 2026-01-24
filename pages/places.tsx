import Head from "next/head";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { type MouseEvent } from "react";
import { Star } from "lucide-react";

import { Container } from "@/components/Container";

import {
  PlaceCard,
  usePlaceModal,
  type Place,
} from "@/components/places";
import { cn } from "@/lib/cn";
import { fetchPlaces } from "@/lib/api/places";

type PlacesPageProps = {
  places: Place[];
};

// Define section definition with filter logic
type SectionDef = {
  value: string;
  label: string;
  anchor: string;
  description: string;
  filter: (place: Place) => boolean;
};

export default function PlacesPage({
  places,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  // Define filtering logic based on new data shape
  const SECTIONS: SectionDef[] = [
    {
      value: "promotions",
      label: "Start Your Journey",
      anchor: "promotions",
      description: "Exclusive benefits and limited-time offers at our premier destinations.",
      filter: (p) => !!p.offers, // Has HTML offers
    },
    {
      value: "hotel",
      label: "Hotels",
      anchor: "hotels",
      description:
        "Flagship residences inside five-star hotels, complete with private gyms and concierge recovery rituals.",
      filter: (p) => p.category === "hotel",
    },
    {
      value: "gym",
      label: "Gyms & Clubs",
      anchor: "gyms",
      description:
        "Signature training clubs curated for precision coaching, data-led programming, and on-call experts.",
      filter: (p) => p.category === "gym" || p.category === "wellness",
    },
    {
      value: "female",
      label: "Females",
      anchor: "ladies",
      description:
        "Women-only sanctuaries featuring guided classes, spa-grade recovery, and privacy-first amenities.",
      filter: (p) => p.tags?.includes("For women") ?? false,
    },
    {
      value: "kids",
      label: "Kids",
      anchor: "kids",
      description:
        "Play-forward clubs where junior members explore sport safely with age-smart coaching staff.",
      filter: (p) => p.tags?.includes("Family Friendly") ?? false,
    },
    {
      value: "tennisSquash",
      label: "Tennis & Squash",
      anchor: "racquet",
      description:
        "Indoor and outdoor racquet venues offering pro-grade surfaces, match play, and tactical coaching.",
      filter: (p) => p.category === "tennisSquash",
    },
  ];

  // Map places to sections
  // Note: A place can appear in multiple sections (e.g. Hotel + Promotions + All)
  const populatedSections = SECTIONS.map((section) => ({
    ...section,
    places: places.filter(section.filter),
  })).filter((section) => section.places.length > 0);

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
        <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="pt-24 pb-8 md:pt-32 md:pb-12">
            <div className="mx-auto max-w-3xl space-y-6 text-center">
              <h1 className="text-5xl font-light text-brand-ivory md:text-6xl lg:text-7xl">
                Elite Destinations
              </h1>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-brand-gray md:text-xl">
                Curated residences and retreats where hospitality, wellness, and elevated living are seamlessly woven together.
              </p>
            </div>
          </div>

          {populatedSections.length > 0 && (
            <div className="sticky top-24 z-30 flex w-full flex-wrap justify-center gap-3 border-b border-brand-deepBlue/50 bg-brand-black/95 px-2 py-4 pb-8 text-center backdrop-blur-sm md:static md:bg-transparent md:backdrop-blur-none">
              {populatedSections.map((section) => (
                <a
                  key={section.value}
                  href={`#${section.anchor}`}
                  onClick={(event) => handleNavClick(event, section.anchor)}
                  className={cn(
                    "rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] transition",
                    section.value === "promotions"
                      ? "border-brand-gold text-brand-gold hover:bg-brand-gold/10"
                      : "border-brand-lightBlue/40 text-brand-ivory hover:border-brand-gold hover:text-brand-gold"
                  )}
                >
                  {section.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {populatedSections.map((section) => (
          <CategorySection
            key={section.value}
            section={section}
          />
        ))}

        {populatedSections.length === 0 && (
          <Container>
            <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl">
              <p className="text-brand-gray">No places found. Please check back later.</p>
            </div>
          </Container>
        )}
      </div>
    </>
  );
}

const CategorySection = ({
  section,
}: {
  section: SectionDef & { places: Place[] };
}) => {
  const { openModal: openPlaceModal } = usePlaceModal();
  const placeCount =
    section.places.length === 1 ? "1 Place" : `${section.places.length} Places`;

  const isPromotions = section.value === "promotions";
  const isLadies = section.value === "female";

  return (
    <section
      id={section.anchor}
      className={cn(
        "scroll-mt-32 transition-colors duration-500",
        isPromotions && "bg-brand-gold/5 py-10 border-y border-brand-gold/10",
        isLadies && "bg-pink-950/10 py-10 rounded-lg"
      )}
    >
      <Container className="space-y-7">
        <div className="space-y-3 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            {isPromotions && <Star className="w-5 h-5 text-brand-gold animate-pulse" />}
            <p className={cn(
              "text-xs uppercase tracking-[0.4em]",
              isPromotions ? "text-brand-gold font-bold" : "text-brand-lightBlue"
            )}>
              {section.label}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <h2 className={cn(
                "text-3xl sm:text-4xl",
                isPromotions ? "text-brand-gold" : "text-brand-ivory"
              )}>
                {section.label}
              </h2>
              <p className="text-base text-brand-gray sm:max-w-2xl">
                {section.description}
              </p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-gold flex-shrink-0">
              {placeCount}
            </span>
          </div>
        </div>

        {section.places.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {section.places.map((place) => {
              return (
                <PlaceCard
                  key={`${section.value}-${place._id}`} // Unique key as place might appear in multiple sections
                  place={place}
                  categoryLabel={isPromotions ? "Member Benefit" : section.label}
                  onSelect={(place) => openPlaceModal(place, section.label)}
                />
              );
            })}
          </div>
        ) : (
          <p className="glass-card border border-dashed border-white/25 px-6 py-8 text-center text-sm text-brand-gray">
            Coming soon.
          </p>
        )}
      </Container>
    </section>
  );
};


export const getServerSideProps: GetServerSideProps<PlacesPageProps> = async () => {
  // Fetch from new Places API
  const places = await fetchPlaces();

  return {
    props: {
      places,
    },
  };
};
