import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import type { SanityImageSource } from "@sanity/image-url";

import { ButtonLink } from "@/components/ButtonLink";
import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { MembershipCard } from "@/components/MembershipCard";
import {
  PlaceCard,
  usePlaceModal,
  type Place,
  type PlaceCategory,
} from "@/components/places";
import {
  PromotionCard,
  PromotionModal,
  type PromotionCardContent,
} from "@/components/promotions";
import { cn } from "@/lib/cn";
import { fetchPageHero, type HeroPayload } from "@/lib/hero";
import {
  collectMembershipTiers,
  MEMBERSHIP_QUERY,
  type MembershipInfo,
} from "@/lib/membership";
import {
  PROMOTION_FALLBACK_IMAGE,
  mapPromotionRecordToCardContent,
  type PromotionRecord,
} from "@/lib/promotionContent";
import {
  isSanityConfigured,
  sanityClient,
  urlForImage,
} from "@/lib/sanity.client";
import {
  buildLatestPromotionsQuery,
} from "@/lib/promotionQueries";

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
    "Discover EliteSport’s curated network of gyms and private clubs worldwide. Explore memberships, exclusive promotions, and CMS-driven places.",
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

type ClientPartner = {
  _id: string;
  name?: string;
  category?: "client" | "partner" | "sponsor";
  logo?: SanityImageSource;
  logoAlt?: string;
  website?: string;
};

type HomePageProps = {
  popularPlaces: Place[];
  promotions: Promotion[];
  clientLogos: ClientPartner[];
  partnerLogos: ClientPartner[];
  memberships: MembershipInfo[];
  hero: HeroPayload | null;
  aboutHero: HeroPayload | null;
};

type HomePageQueryResult = Omit<
  HomePageProps,
  "hero" | "aboutHero" | "clientLogos" | "partnerLogos"
> & {
  clientPartners: ClientPartner[];
};

const HOME_LATEST_PROMOTIONS_LIMIT = 5;
const HOME_LATEST_PROMOTIONS_QUERY = buildLatestPromotionsQuery(
  HOME_LATEST_PROMOTIONS_LIMIT
);
const HOME_PAGE_SLUG = "home";
const ABOUT_PAGE_SLUG = "about";
const HOME_LOGO_LIMIT = 6;

const HOME_PAGE_QUERY = `
{
  "popularPlaces": *[_type == "place" && showInMostPopular == true && !(_id in path("drafts.**"))] | order(name asc)[0...6] {
    _id,
    name,
    "placeType": placeType,
    location,
    featuredImage,
    images,
    overview,
    benefits,
    showInMostPopular
  },
  "promotions": ${HOME_LATEST_PROMOTIONS_QUERY},
  "clientPartners": *[_type == "clientPartner"] | order(coalesce(priority, 1000) asc, name asc) {
    _id,
    name,
    category,
    logo,
    logoAlt,
    website
  },
  "memberships": ${MEMBERSHIP_QUERY}
}
`;

const getCategoryLabel = (category?: PlaceCategory) => {
  if (!category) return "EliteSport";
  return PLACE_CATEGORY_LABELS[category] ?? "EliteSport";
};

const selectRandomItems = <T,>(items: T[], limit: number) => {
  if (items.length <= limit) {
    return [...items];
  }

  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result.slice(0, limit);
};

export default function Home(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const {
    hero,
    aboutHero,
    popularPlaces,
    promotions,
    clientLogos,
    partnerLogos,
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
                {aboutHero.image && (
                  <div className="relative order-2 lg:order-1">
                    <div className="glass-card premium-card overflow-hidden rounded-[32px]">
                      <AboutHeroImage image={aboutHero.image} title={aboutHero.title} />
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
              Add published places inside Sanity to populate this section.
            </p>
          )}
        </Section>

        <Section
          eyebrow="Member Exclusives"
          title="Latest Promotions"
          description="Newest offers stream directly from Sanity. No manual refreshes required."
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
              Publish a promotion in Sanity to activate this carousel.
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
              Add membership tiers in Sanity to populate this section.
            </p>
          )}
        </Section>

        <Section
          eyebrow="Trusted by Leaders"
          title="Our Clients & Partners"
          description="World-renowned brands and tastemakers rely on EliteSport to curate elevated training everywhere."
          className="bg-brand-deepBlue/20"
        >
          <div className="grid gap-10 lg:grid-cols-2">
            <LogoGrid
              title="Our Clients"
              items={clientLogos}
              cardClassName="text-brand-ivory/80 [--glass-glow:rgba(197,163,91,0.35)]"
            />
            <LogoGrid
              title="Our Partners"
              items={partnerLogos}
              cardClassName="text-brand-ivory/90 [--glass-glow:rgba(111,175,206,0.35)]"
            />
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              href="/partners-clients"
              className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-lightBlue transition hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black"
            >
              View All Clients &amp; Partners →
            </Link>
          </div>
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

const LogoGrid = ({
  title,
  items,
  cardClassName,
}: {
  title: string;
  items: ClientPartner[];
  cardClassName: string;
}) => {
  const getImageUrl = (source?: SanityImageSource, width = 600, height = 300) => {
    if (!source || !isSanityConfigured) {
      return undefined;
    }

    try {
      let builder = urlForImage(source).width(width).auto("format");
      if (height) {
        builder = builder.height(height).fit("crop");
      }
      return builder.url();
    } catch {
      return undefined;
    }
  };

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.4em] text-brand-lightBlue">{title}</p>
      {items.length > 0 ? (
        <div className="mt-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {items.map((item, itemIndex) => {
              const logoUrl = getImageUrl(item.logo, 600, 300);
              const key = item._id ?? `${title}-${itemIndex}`;

              return (
                <motion.div
                  key={key}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  className={cn(
                    "logo-card-clean premium-card flex min-h-[14.4rem] flex-col items-center justify-center gap-2.5 text-center text-sm font-semibold",
                    cardClassName
                  )}
                >
                  {logoUrl ? (
                    <div className="flex w-full justify-center">
                      <div className="relative h-[10.8rem] w-[10.8rem] overflow-hidden rounded-2xl bg-white p-5 shadow-inner">
                        <Image
                          src={logoUrl}
                          alt={item.logoAlt ?? item.name ?? "Brand logo"}
                          fill
                          sizes="144px"
                          className="object-contain"
                        />
                      </div>
                    </div>
                  ) : (
                    item.name ?? "Featured Brand"
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="glass-card mt-4 rounded-2xl border border-dashed border-white/25 p-4 text-center text-xs text-brand-gray">
          Add {title.toLowerCase()} inside the CMS to showcase their logos here.
        </p>
      )}
    </div>
  );
};

const AboutHeroImage = ({
  image,
  title,
}: {
  image: SanityImageSource;
  title?: string;
}) => {
  const getImageUrl = (source?: SanityImageSource, width = 1200) => {
    if (!source || !isSanityConfigured) {
      return undefined;
    }

    try {
      return urlForImage(source).width(width).auto("format").url();
    } catch {
      return undefined;
    }
  };

  const imageUrl = getImageUrl(image);
  if (!imageUrl) {
    return <div className="relative h-80 w-full bg-brand-black" />;
  }

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
  const client = sanityClient;
  if (!client) {
    return {
      props: {
        popularPlaces: [],
        promotions: [],
        clientLogos: [],
        partnerLogos: [],
        memberships: [],
        hero: null,
        aboutHero: null,
      },
      revalidate: 60,
    };
  }

  const [data, hero, aboutHero] = await Promise.all([
    client.fetch<HomePageQueryResult>(HOME_PAGE_QUERY),
    fetchPageHero(HOME_PAGE_SLUG, client),
    fetchPageHero(ABOUT_PAGE_SLUG, client),
  ]);

  return {
    props: {
      popularPlaces: data.popularPlaces ?? [],
      promotions: data.promotions ?? [],
      clientLogos: selectRandomItems(
        (data.clientPartners ?? []).filter((entry) => entry.category === "client"),
        HOME_LOGO_LIMIT
      ),
      partnerLogos: selectRandomItems(
        (data.clientPartners ?? []).filter((entry) => entry.category === "partner"),
        HOME_LOGO_LIMIT
      ),
      memberships: data.memberships ?? [],
      hero: hero ?? null,
      aboutHero: aboutHero ?? null,
    },
    revalidate: 60,
  };
};
