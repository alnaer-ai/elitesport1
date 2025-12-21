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
import {
  PlaceCard,
  usePlaceModal,
  type Place,
} from "@/components/places";
import {
  PromotionCard,
  PromotionModal,
  type PromotionCardContent,
} from "@/components/promotions";
import { cn } from "@/lib/cn";
import { type HeroPayload } from "@/lib/hero";
import {
  collectMembershipTiers,
  type MembershipInfo,
} from "@/lib/membership";
import {
  PROMOTION_FALLBACK_IMAGE,
  mapPromotionRecordToCardContent,
  type PromotionRecord,
} from "@/lib/promotionContent";
import {
  getPageHero,
  getMemberships,
} from "@/lib/mockData";
import { getPromotions } from "@/lib/api/promotions";

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
  memberships: MembershipInfo[];
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
    memberships,
  } = props;
  const promotionCards: PromotionCardContent[] = promotions
    .slice(0, HOME_LATEST_PROMOTIONS_LIMIT)
    .map((promotion) => mapPromotionRecordToCardContent(promotion));
  const { openModal: openPlaceModal } = usePlaceModal();
  const [selectedPromotion, setSelectedPromotion] =
    useState<PromotionCardContent | null>(null);
  const [isPromotionOpen, setIsPromotionOpen] = useState(false);

  const allTiers = collectMembershipTiers(memberships).filter(
    (tier) => tier?.name
  );
  const tiers = allTiers.slice(0, 3);

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

        {aboutHero && aboutHero.isPublished !== false && (
          <motion.section
            className="py-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={sectionVariants}
          >
            <Container>
              <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                {/* Hero Image - Left Side */}
                {aboutHero.imageUrl && (
                  <div className="relative order-2 lg:order-1">
                    <div className="glass-card premium-card overflow-hidden rounded-[32px]">
                      <AboutHeroImage imageUrl={aboutHero.imageUrl} title={aboutHero.title} />
                    </div>
                  </div>
                )}
                
                {/* Text Content - Right Side */}
                <div className="space-y-6 order-1 lg:order-2 text-center lg:text-left">
                  {aboutHero.title && (
                    <h2 className="font-display text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-brand-ivory sm:text-4xl sm:leading-[1.08] lg:text-5xl lg:leading-[1.06]">
                      {aboutHero.title}
                    </h2>
                  )}
                  {aboutHero.subtitle && (
                    <p className="font-sans text-base font-light leading-[1.7] tracking-[0.01em] text-brand-ivory sm:text-lg sm:leading-[1.75] md:text-xl md:leading-[1.8]">
                      {aboutHero.subtitle}
                    </p>
                  )}
                  <div className="pt-4">
                    <ButtonLink href="/about" variant="secondary">
                      Learn More About Us
                    </ButtonLink>
                  </div>
                </div>
              </div>
            </Container>
          </motion.section>
        )}

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

        <Section
          eyebrow="Member Exclusives"
          title="Latest Promotions"
          description="Newest offers stream directly from our curated collection. No manual refreshes required."
        >
          {promotionCards.length > 0 ? (
            <>
              <LatestPromotionsGrid
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

        <Section
          eyebrow="Membership Tiers"
          title="Unlock Elite Access"
          description="Choose the membership level that fits your training needs and lifestyle."
          className="bg-brand-deepBlue/20"
        >
          {tiers.length > 0 ? (
            <>
              <motion.div
                className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.15 },
                  },
                }}
              >
                {tiers.map((tier, index) => (
                  <div key={tier.name ?? index} className="h-full">
                    <MembershipCard tier={tier} index={index} />
                  </div>
                ))}
              </motion.div>
              {allTiers.length > 3 && (
                <div className="mt-10 flex justify-center">
                  <ButtonLink href="/memberships" variant="secondary">
                    View All Tiers
                  </ButtonLink>
                </div>
              )}
            </>
          ) : (
            <p className="glass-card border border-dashed border-white/25 px-6 py-8 text-center text-sm text-brand-gray">
              Membership tiers coming soon.
            </p>
          )}
        </Section>

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


const AboutHeroImage = ({
  imageUrl,
  title,
}: {
  imageUrl: string;
  title?: string;
}) => {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden">
      <Image
        src={imageUrl}
        alt={title ?? "About EliteSport"}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover"
      />
    </div>
  );
};

const LatestPromotionsGrid = ({
  promotions,
  onSelect,
}: {
  promotions: PromotionCardContent[];
  onSelect?: (promotion: PromotionCardContent) => void;
}) => {
  return (
    <motion.div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {promotions.map((promotion, index) => (
        <motion.div
          key={promotion.id}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: index * 0.1 }}
        >
          <PromotionCard
            promotion={promotion}
            layout="grid"
            showDescription={true}
            onSelect={onSelect ? () => onSelect(promotion) : undefined}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};


export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  // Fetch promotions from API (sorted by date, newest first)
  const apiPromotions = await getPromotions();
  
  // Fetch static mock data for other sections
  const hero = getPageHero("home");
  const aboutHero = getPageHero("about");
  const popularPlaces: Place[] = [];
  const memberships = getMemberships();

  return {
    props: {
      popularPlaces,
      // API promotions are already sorted by date (newest first)
      promotions: apiPromotions,
      memberships,
      hero: hero ?? null,
      aboutHero: aboutHero ?? null,
    },
    revalidate: 60,
  };
};
