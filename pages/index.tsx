import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { ReactNode, useState } from "react";
import { motion } from "framer-motion";

import { ButtonLink } from "@/components/ButtonLink";
import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { MembershipCard } from "@/components/MembershipCard";
import { MembershipScrollSection } from "@/components/MembershipScrollSection";
import { AboutTeaser } from "@/components/AboutTeaser";
import { ValueHighlights } from "@/components/ValueHighlights";
import {
  PlaceCard,
  usePlaceModal,
  type Place,
} from "@/components/places";
import {
  PromotionMarquee,
  PromotionModal,
  type PromotionCardContent,
} from "@/components/promotions";
import { cn } from "@/lib/cn";
import { type HeroPayload } from "@/lib/hero";
import {
  collectMembershipTiers,
  getMemberships,
  type MembershipTier,
} from "@/lib/membership";
import {
  PROMOTION_FALLBACK_IMAGE,
  mapPromotionRecordToCardContent,
  type PromotionRecord,
} from "@/lib/promotionContent";
import {
  getPageHero,
} from "@/lib/mockData";
import { getPromotions } from "@/lib/api/promotions";
import { fetchPlaces } from "@/lib/api/places";

const PLACE_CATEGORY_LABELS: Record<string, string> = {
  hotel: "Hotel",
  gym: "Gym",
  female: "Female Club",
  kids: "Kids Club",
  tennisSquash: "Tennis & Squash",
};

const HOME_SEO = {
  title: "EliteSport | Luxury Performance Destinations Worldwide",
  description:
    "Discover EliteSport's curated network of gyms and private clubs worldwide. Explore memberships, exclusive promotions, and CMS-driven places.",
  url: "https://elitesport.com",
  image: PROMOTION_FALLBACK_IMAGE,
};

const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-brand-black shadow-glow transition duration-300 hover:bg-brand-lightBlue hover:text-brand-deepBlue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lightBlue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black";

const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-full border border-brand-ivory/50 px-8 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-brand-ivory transition duration-300 hover:border-brand-gold hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lightBlue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

type Promotion = PromotionRecord;

type HomePageProps = {
  popularPlaces: Place[];
  promotions: Promotion[];
  tiers: MembershipTier[];
  hero: HeroPayload | null;
  aboutHero: HeroPayload | null;
};

const HOME_LATEST_PROMOTIONS_LIMIT = 5;

const getCategoryLabel = (category?: Place["placeType"]) => {
  if (!category) return "EliteSport";
  return PLACE_CATEGORY_LABELS[category] ?? "EliteSport";
};


export default function Home(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const {
    hero,
    aboutHero,
    popularPlaces,
    promotions,
    tiers,
  } = props;
  const promotionCards: PromotionCardContent[] = promotions
    .slice(0, HOME_LATEST_PROMOTIONS_LIMIT)
    .map((promotion) => mapPromotionRecordToCardContent(promotion));
  const { openModal: openPlaceModal } = usePlaceModal();
  const [selectedPromotion, setSelectedPromotion] =
    useState<PromotionCardContent | null>(null);
  const [isPromotionOpen, setIsPromotionOpen] = useState(false);

  const displayedTiers = tiers.slice(0, 3);

  return (
    <>
      <Head>
        <title>{HOME_SEO.title}</title>
        <meta name="description" content={HOME_SEO.description} />
        <meta property="og:title" content={HOME_SEO.title} />
        <meta property="og:description" content={HOME_SEO.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={HOME_SEO.url} />
        <meta property="og:image" content={HOME_SEO.image} />
      </Head>

      <div className="space-y-12 pb-24">
        <Hero hero={hero} />

        <AboutTeaser imageUrl={aboutHero?.imageUrl} />

        <ValueHighlights />

        <Section
          eyebrow="Elite Destinations"
          title="Most Popular Places"
          description="Curated residences and training spaces where performance, hospitality, and wellness are seamlessly woven together."
        >
          {popularPlaces.length > 0 ? (
            <>
              <motion.div
                className="grid gap-8 md:grid-cols-2 xl:grid-cols-3"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.12 } },
                }}
              >
                {popularPlaces.map((place) => {
                  const placeCategory = place.placeType ?? undefined;
                  const locationLabel = place.location ?? getCategoryLabel(placeCategory);

                  return (
                    <PlaceCard
                      key={place._id}
                      place={place}
                      categoryLabel={locationLabel}
                      onSelect={(place) => openPlaceModal(place, locationLabel)}
                    />
                  );
                })}
              </motion.div>
              <div className="mt-10 flex justify-center">
                <Link
                  href="/places"
                  className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-lightBlue transition hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black"
                >
                  See All Places →
                </Link>
              </div>
            </>
          ) : (
            <p className="glass-card border border-dashed border-white/25 px-6 py-8 text-center text-sm text-brand-gray">
              No places available at this time.
            </p>
          )}
        </Section>

        {/* Premium Scroll-Controlled Membership Section */}
        {displayedTiers.length > 0 && (
          <MembershipScrollSection
            tiers={displayedTiers}
            allTiersCount={tiers.length}
          />
        )}

        <Section
          eyebrow="Member Exclusives"
          title="Latest Promotions"
          description="Newest offers stream directly from our curated collection. No manual refreshes required."
        >
          {promotionCards.length > 0 ? (
            <>
              <PromotionMarquee
                promotions={promotionCards}
                onSelect={(promotion) => {
                  setSelectedPromotion(promotion);
                  setIsPromotionOpen(true);
                }}
              />
              <div className="mt-10 flex justify-center">
                <Link
                  href="/promotions"
                  className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-lightBlue transition hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black"
                >
                  View All Promotions →
                </Link>
              </div>
            </>
          ) : (
            <p className="glass-card border border-dashed border-white/25 px-6 py-8 text-center text-sm text-brand-gray">
              No promotions available at this time.
            </p>
          )}
        </Section>
        <PromotionModal
          promotion={selectedPromotion}
          isOpen={isPromotionOpen}
          onClose={() => {
            setIsPromotionOpen(false);
            setSelectedPromotion(null);
          }}
        />

      </div>
    </>
  );
}

const Section = ({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <motion.section
      className={cn("py-10", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={sectionVariants}
    >
      <Container className="space-y-10 py-0">
        <div className="space-y-4 text-center md:text-left">
          <p className="text-xs uppercase tracking-[0.4em] text-brand-lightBlue">{eyebrow}</p>
          <h2 className="text-3xl text-brand-ivory sm:text-4xl">{title}</h2>
          {description && (
            <p className="text-base text-brand-gray/90 sm:max-w-3xl">{description}</p>
          )}
        </div>
        {children}
      </Container>
    </motion.section>
  );
};




export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  // Fetch promotions from API (sorted by date, newest first)
  const apiPromotions = await getPromotions();

  // Fetch places from API
  const allPlaces = await fetchPlaces();

  // Display up to 6 places in the "Most Popular Places" section
  // Prioritize hotels first, then others
  const popularPlaces = allPlaces
    .sort((a, b) => {
      // Prioritize hotels
      if (a.category === "hotel" && b.category !== "hotel") return -1;
      if (b.category === "hotel" && a.category !== "hotel") return 1;
      return 0;
    })
    .slice(0, 6);

  // Fetch static mock data for other sections
  const hero = getPageHero("home");
  const aboutHero = getPageHero("about");

  // Get membership tiers from mock data
  const memberships = getMemberships();
  const tiers = collectMembershipTiers(memberships);

  return {
    props: {
      popularPlaces,
      // API promotions are already sorted by date (newest first)
      promotions: apiPromotions,
      tiers,
      hero: hero ?? null,
      aboutHero: aboutHero ?? null,
    },
    revalidate: 60,
  };
};
