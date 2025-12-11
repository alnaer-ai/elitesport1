import Head from "next/head";
import Image from "next/image";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { cn } from "@/lib/cn";
import {
  isSanityConfigured,
  sanityClient,
  urlForImage,
} from "@/lib/sanity.client";

const heroHighlights = [
  { label: "Destinations", value: "45+" },
  { label: "Wellness Experts", value: "120" },
  { label: "Private Members", value: "3.5k" },
];

const PLACE_CATEGORY_LABELS: Record<string, string> = {
  hotel: "Hotel",
  gym: "Gym",
  female: "Female Club",
  kids: "Kids Club",
  spa: "Spa",
  tennisSquash: "Tennis & Squash",
};

const FALLBACK_PLACE_IMAGE =
  "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1600&q=80";
const FALLBACK_PROMO_IMAGE =
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80";
const HOME_SEO = {
  title: "EliteSport | Luxury Performance Destinations Worldwide",
  description:
    "Discover EliteSport’s curated network of gyms, spas, and private clubs worldwide. Explore memberships, exclusive promotions, and CMS-driven places.",
  url: "https://elitesport.com",
  image: FALLBACK_PROMO_IMAGE,
};

const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

type PlaceCategory = keyof typeof PLACE_CATEGORY_LABELS;

type Place = {
  _id: string;
  name?: string;
  description?: string;
  location?: string;
  category?: PlaceCategory;
  distanceLabel?: string;
  image?: SanityImageSource;
  imageAlt?: string;
};

type Promotion = {
  _id: string;
  title?: string;
  description?: string;
  promoCode?: string;
  image?: SanityImageSource;
  imageAlt?: string;
  ctaLabel?: string;
  ctaUrl?: string;
};

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
  nearbyPlaces: Place[];
  promotions: Promotion[];
  clientPartners: ClientPartner[];
};

const HOME_PAGE_QUERY = `
{
  "popularPlaces": *[_type == "place" && isMostPopular == true] | order(coalesce(priority, 1000) asc, name asc)[0...6] {
    _id,
    name,
    description,
    location,
    category,
    image,
    imageAlt
  },
  "nearbyPlaces": *[_type == "place" && isNearby == true] | order(coalesce(priority, 1000) asc, name asc)[0...4] {
    _id,
    name,
    description,
    location,
    distanceLabel,
    image,
    imageAlt
  },
  "promotions": *[_type == "promotion"] | order(isFeatured desc, coalesce(validFrom, _createdAt) desc)[0...6] {
    _id,
    title,
    description,
    promoCode,
    image,
    imageAlt,
    ctaLabel,
    ctaUrl
  },
  "clientPartners": *[_type == "clientPartner"] | order(coalesce(priority, 1000) asc, name asc) {
    _id,
    name,
    category,
    logo,
    logoAlt,
    website
  }
}
`;

const getImageUrl = (
  source?: SanityImageSource,
  width = 1600,
  height?: number
) => {
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

const getCategoryLabel = (category?: PlaceCategory) => {
  if (!category) return "EliteSport";
  return PLACE_CATEGORY_LABELS[category] ?? "EliteSport";
};

export default function Home(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { popularPlaces, nearbyPlaces, promotions, clientPartners } = props;

  const clientLogos = clientPartners.filter(
    (entry) => entry.category === "client"
  );
  const partnerLogos = clientPartners.filter(
    (entry) => entry.category && entry.category !== "client"
  );

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

      <div className="space-y-20 pb-24">
        <Hero />

      <Section
        eyebrow="Elite Destinations"
        title="Most Popular Places"
        description="Curated residences and training spaces where performance, hospitality, and wellness are seamlessly woven together."
      >
        {popularPlaces.length > 0 ? (
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
              const imageUrl =
                getImageUrl(place.image, 1600, 900) ?? FALLBACK_PLACE_IMAGE;
              const locationLabel = place.location ?? getCategoryLabel(place.category);

              return (
                <motion.article
                  key={place._id}
                  variants={cardVariants}
                  className="group overflow-hidden rounded-3xl border border-brand-deepBlue/40 bg-brand-black/60 shadow-lg shadow-brand-black/40"
                >
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={place.imageAlt ?? place.name ?? "EliteSport place"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="text-xs uppercase tracking-[0.4em] text-brand-lightBlue">
                        {locationLabel}
                      </p>
                      <p className="mt-2 font-display text-2xl text-brand-ivory">
                        {place.name ?? "EliteSport Place"}
                      </p>
                    </div>
                  </div>
                  <p className="px-5 py-6 text-sm text-brand-gray/90">
                    {place.description ??
                      "Destination curated by EliteSport with white-glove service and member-only access."}
                  </p>
                </motion.article>
              );
            })}
          </motion.div>
        ) : (
          <p className="rounded-3xl border border-dashed border-brand-deepBlue/50 bg-brand-black/50 px-6 py-8 text-center text-sm text-brand-gray">
            Add a few “Most Popular” places inside Sanity to populate this section.
          </p>
        )}
      </Section>

      <Section
        eyebrow="Nearby Escapes"
        title="Places Within Reach"
        description="Stay spontaneous. Explore impeccably serviced places curated for members within a short drive."
        className="bg-brand-deepBlue/30"
      >
        {nearbyPlaces.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {nearbyPlaces.map((place) => {
              const imageUrl = getImageUrl(place.image, 800, 800) ?? FALLBACK_PLACE_IMAGE;
              const distanceLabel = place.distanceLabel ?? place.location ?? "Featured";

              return (
                <motion.article
                  key={place._id}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  className="flex gap-4 rounded-3xl border border-brand-deepBlue/60 bg-brand-black/70 p-4 shadow-lg shadow-brand-black/30"
                  whileHover={{ y: -6 }}
                >
                  <div className="relative h-32 w-32 overflow-hidden rounded-2xl">
                    <Image
                      src={imageUrl}
                      alt={place.imageAlt ?? place.name ?? "EliteSport place"}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-brand-lightBlue">
                        {distanceLabel}
                      </p>
                      <h3 className="mt-2 text-lg text-brand-ivory">
                        {place.name ?? "EliteSport Place"}
                      </h3>
                      <p className="mt-2 text-sm text-brand-gray/90">
                        {place.description ?? "Boutique destination curated nearby."}
                      </p>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">
                      View Details
                    </span>
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <p className="rounded-3xl border border-dashed border-brand-deepBlue/50 bg-brand-black/50 px-6 py-8 text-center text-sm text-brand-gray">
            Flag a few places as “Nearby Highlights” in the CMS to showcase quick escapes.
          </p>
        )}
      </Section>

      <Section
        eyebrow="Member Exclusives"
        title="Recent Promotions"
        description="Seasonal benefits for members, refreshed weekly with bespoke privileges."
      >
        {promotions.length > 0 ? (
          <motion.div
            className="flex gap-6 overflow-x-auto pb-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
          >
            {promotions.map((promo) => {
              const imageUrl = getImageUrl(promo.image, 1400, 900) ?? FALLBACK_PROMO_IMAGE;
              const promoLabel = promo.promoCode ?? promo.ctaLabel ?? "Limited";

              return (
                <motion.article
                  key={promo._id}
                  variants={cardVariants}
                  className="relative min-w-[260px] flex-1 overflow-hidden rounded-3xl border border-brand-deepBlue/60 bg-brand-black/70 shadow-glow sm:min-w-[320px]"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative h-48">
                    <Image
                      src={imageUrl}
                      alt={promo.imageAlt ?? promo.title ?? "EliteSport promotion"}
                      fill
                      sizes="(max-width: 768px) 80vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20" />
                    <div className="absolute bottom-4 left-4 rounded-full bg-brand-black/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-ivory/80">
                      Limited
                    </div>
                  </div>
                  <div className="space-y-3 px-6 py-6">
                    <h3 className="text-xl text-brand-ivory">
                      {promo.title ?? "EliteSport Promotion"}
                    </h3>
                    <p className="text-sm text-brand-gray/80">
                      {promo.description ?? "Exclusive member perk curated via the CMS."}
                    </p>
                    <div className="inline-flex items-center gap-3 rounded-full border border-brand-lightBlue/20 bg-brand-lightBlue/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-lightBlue">
                      Code: {promoLabel}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        ) : (
          <p className="rounded-3xl border border-dashed border-brand-deepBlue/50 bg-brand-black/50 px-6 py-8 text-center text-sm text-brand-gray">
            Publish a promotion in Sanity to activate this carousel.
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
            cardClassName="border-brand-deepBlue/50 bg-brand-black/60 text-brand-ivory/80"
          />
          <LogoGrid
            title="Our Partners"
            items={partnerLogos.length > 0 ? partnerLogos : clientPartners}
            cardClassName="border-brand-lightBlue/20 bg-brand-lightBlue/5 text-brand-ivory/90"
          />
        </div>
      </Section>
    </div>
    </>
  );
}

const Hero = () => {
  return (
    <section className="relative overflow-hidden border-b border-brand-deepBlue/50">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-deepBlue via-brand-black to-brand-black" />
        <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-brand-gold/10 blur-[140px]" />
        <div className="absolute left-[10%] top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-brand-lightBlue/10 blur-3xl" />
      </div>
      <Container className="relative z-10 flex flex-col gap-12 py-24 lg:flex-row lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-8"
        >
          <p className="text-xs uppercase tracking-[0.6em] text-brand-lightBlue">
            Welcome to EliteSport
          </p>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold text-brand-ivory sm:text-5xl lg:text-6xl">
              Discover Elite Fitness & Luxury Wellness
            </h1>
            <p className="text-base text-brand-gray sm:text-lg">
              Immerse yourself in a network of iconic clubs, five-star spas, and private studios designed
              for travelers who expect every session to feel like a signature experience.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button>Join Now</Button>
            <Button variant="secondary">Explore Memberships</Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-xl rounded-[32px] border border-brand-deepBlue/60 bg-brand-black/60 p-8 shadow-2xl shadow-brand-black/40"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-brand-lightBlue">
            Members at a glance
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {heroHighlights.map((highlight) => (
              <div key={highlight.label}>
                <p className="text-3xl font-semibold text-brand-gold">{highlight.value}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-brand-gray/80">
                  {highlight.label}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-2xl border border-brand-lightBlue/30 bg-brand-lightBlue/10 p-6 text-sm text-brand-ivory/90">
            &ldquo;EliteSport delivered an effortless wellness itinerary across three cities in one weekend.
            Concierge coaches arranged every training window and recovery ritual for us.&rdquo;
          </div>
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-brand-gray/70">
            — Guest Member, New York
          </p>
        </motion.div>
      </Container>
    </section>
  );
};

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
      className={cn("py-16", className)}
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
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.4em] text-brand-lightBlue">{title}</p>
      {items.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {items.map((item) => {
            const logoUrl = getImageUrl(item.logo, 600, 300);

            return (
              <motion.a
                key={item._id}
                href={item.website ?? undefined}
                target={item.website ? "_blank" : undefined}
                rel={item.website ? "noreferrer" : undefined}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className={cn(
                  "flex h-24 items-center justify-center rounded-2xl border text-center text-sm font-semibold",
                  cardClassName,
                  item.website ? "transition hover:-translate-y-1" : ""
                )}
                whileHover={{ scale: item.website ? 1.03 : 1 }}
              >
                {logoUrl ? (
                  <div className="relative h-12 w-full">
                    <Image
                      src={logoUrl}
                      alt={item.logoAlt ?? item.name ?? "Brand logo"}
                      fill
                      sizes="(max-width: 768px) 40vw, 20vw"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  item.name ?? "Featured Brand"
                )}
              </motion.a>
            );
          })}
        </div>
      ) : (
        <p className="mt-4 rounded-2xl border border-dashed border-brand-deepBlue/40 bg-brand-black/40 p-4 text-center text-xs text-brand-gray">
          Add {title.toLowerCase()} inside the CMS to showcase their logos here.
        </p>
      )}
    </div>
  );
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const client = sanityClient;
  if (!client) {
    return {
      props: {
        popularPlaces: [],
        nearbyPlaces: [],
        promotions: [],
        clientPartners: [],
      },
      revalidate: 60,
    };
  }

  const data = await client.fetch<HomePageProps>(HOME_PAGE_QUERY);

  return {
    props: {
      popularPlaces: data.popularPlaces ?? [],
      nearbyPlaces: data.nearbyPlaces ?? [],
      promotions: data.promotions ?? [],
      clientPartners: data.clientPartners ?? [],
    },
    revalidate: 60,
  };
};
