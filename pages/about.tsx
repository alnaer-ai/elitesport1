import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { motion } from "framer-motion";

import { Container } from "@/components/Container";
import { SpecialFeaturesSection } from "@/components/SpecialFeatures";
import { getPageHero, getAboutInfo, type AboutInfo, type HeroPayload } from "@/lib/mockData";

type AboutPageProps = {
  about: AboutInfo | null;
  pageHero: HeroPayload | null;
};

const motionSectionProps = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
};

const staggerChildren = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.15 },
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
};

const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-brand-black shadow-glow transition duration-300 hover:bg-brand-lightBlue hover:text-brand-deepBlue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lightBlue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black";

const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-full border border-brand-ivory/50 px-8 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-brand-ivory transition duration-300 hover:border-brand-gold hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lightBlue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black";

const luxuryEscapes = [
  {
    title: "Infinity Pool Retreats",
    caption: "Sunrise swims overlooking serene horizons, private cabanas, and attentive poolside service.",
    imageUrl: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1600&q=80",
    tag: "Pool & Beach Access",
  },
  {
    title: "Spa & Wellness Sanctuaries",
    caption: "Thermal circuits, aromatherapy suites, and restorative treatments designed for deep relaxation.",
    imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1600&q=80",
    tag: "Wellness Rituals",
  },
  {
    title: "Private Beach Escapes",
    caption: "Pristine shores, shaded loungers, and calm waters reserved for discerning travelers.",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    tag: "Exclusive Beach Clubs",
  },
];

export default function AboutPage({
  about,
  pageHero,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!about) {
    return (
      <>
        <Head>
          <title>About EliteSport | Luxury Lifestyle Access</title>
          <meta
            name="description"
            content="Discover the mission, story, and curated experiences shaping EliteSport's luxury lifestyle residences worldwide."
          />
        </Head>
        <div className="py-32">
          <Container className="text-center">
            <p className="text-sm text-brand-gray">
              About page content is not yet available.
            </p>
          </Container>
        </div>
      </>
    );
  }

  const missionImageUrl = about.missionImageUrl;
  const visionImageUrl = about.visionImageUrl;

  return (
    <>
      <Head>
        <title>About EliteSport | Luxury Lifestyle Access</title>
        <meta
          name="description"
          content="Discover the mission, story, and curated experiences shaping EliteSport's luxury lifestyle residences worldwide."
        />
      </Head>

      <div className="bg-brand-black text-brand-ivory">
        {/* Hero Section */}
        <motion.section
          className="relative isolate -mt-20 min-h-[85vh] overflow-hidden pt-20 sm:-mt-24 sm:pt-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <div className="absolute inset-0">
            {pageHero?.imageUrl ? (
              <Image
                src={pageHero.imageUrl}
                alt={pageHero.title ?? "Elite Sport luxury lifestyle"}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            ) : (
              <Image
                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2400&q=80"
                alt="Luxury resort pool at sunset"
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-brand-black/70 via-brand-black/35 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-black/60 via-transparent to-brand-black/40" />
            {/* Consistent hero gradient fade overlay */}
            <div className="hero-gradient-fade" />
          </div>

          <Container className="relative z-10 flex min-h-[85vh] flex-col justify-center py-32">
            <motion.div
              className="max-w-4xl space-y-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <h1 className="font-display text-5xl leading-[1.05] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
                A Better Way
                <br />
                <span className="text-brand-gold">to Live</span>
              </h1>

              <p className="max-w-2xl text-lg leading-[1.9] text-brand-ivory/80 sm:text-xl">
                Experience a luxury style of life. Elite Sport gives you unlimited access to health
                clubs across the UAE — gyms, saunas, swimming pools, beaches, and more — with extra
                discounts at restaurants, cafes, training or sports classes, and spas.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/memberships" className={primaryButtonClass}>
                  Explore Membership
                </Link>
                <Link href="/partners-clients" className={secondaryButtonClass}>
                  View Partners
                </Link>
              </div>

              <div className="flex flex-wrap gap-3 pt-6">
                {[
                  "Resort & Hotel Privileges",
                  "Private Beach Access",
                  "Spa & Wellness",
                  "Pool Lounges",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-brand-ivory/20 bg-brand-black/30 px-4 py-2 text-[0.7rem] uppercase tracking-[0.2em] text-brand-ivory/70 backdrop-blur-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          </Container>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <div className="flex flex-col items-center gap-2 text-brand-ivory/40">
              <span className="text-[0.65rem] uppercase tracking-[0.3em]">Scroll</span>
              <motion.div
                className="h-8 w-px bg-gradient-to-b from-brand-ivory/40 to-transparent"
                animate={{ scaleY: [1, 0.6, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.section>

        {/* Mission & Vision Section */}
        {(about.missionStatement || about.vision || missionImageUrl || visionImageUrl) && (
          <motion.section {...motionSectionProps} className="py-16 lg:py-20">
            <Container>
              <div className="mb-20 text-center">
                {about.missionSectionEyebrow && (
                  <motion.p
                    {...fadeInUp}
                    className="mb-4 text-xs uppercase tracking-[0.5em] text-brand-lightBlue"
                  >
                    {about.missionSectionEyebrow}
                  </motion.p>
                )}
                {about.missionSectionTitle && (
                  <motion.h2
                    {...fadeInUp}
                    className="font-display text-4xl tracking-tight sm:text-5xl"
                  >
                    {about.missionSectionTitle}
                  </motion.h2>
                )}
              </div>

              <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
                {/* Mission Card */}
                {about.missionStatement && (
                  <motion.article
                    {...fadeInUp}
                    className="group relative overflow-hidden rounded-[2rem] border border-brand-ivory/10 bg-gradient-to-br from-brand-deepBlue/40 via-brand-black to-brand-deepBlue/30"
                  >
                    {missionImageUrl && (
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={missionImageUrl}
                          alt="Wellness and fitness training in a luxury setting"
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/30 to-transparent" />
                      </div>
                    )}
                    <div className="relative p-8 sm:p-10">
                      <div className="flex items-center gap-3 mb-5">
                        <span className="h-px w-8 bg-brand-gold" />
                        <p className="text-xs uppercase tracking-[0.4em] text-brand-gold">Mission</p>
                      </div>
                      <p className="text-xl leading-[1.8] text-brand-ivory sm:text-[1.35rem]">
                        {about.missionStatement}
                      </p>
                      <div className="mt-8 flex flex-wrap gap-2">
                        {["Restful Stays", "Personalized Service", "Seamless Balance"].map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-brand-ivory/10 px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.2em] text-brand-gray"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.article>
                )}

                {/* Vision Card */}
                {(about.vision || visionImageUrl) && (
                  <motion.article
                    {...fadeInUp}
                    className="group relative overflow-hidden rounded-[2rem] border border-brand-ivory/10 bg-gradient-to-br from-brand-black via-brand-deepBlue/40 to-brand-black"
                  >
                    {visionImageUrl && (
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={visionImageUrl}
                          alt="Luxurious hotel suite with ocean view"
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/30 to-transparent" />
                      </div>
                    )}
                    <div className="relative p-8 sm:p-10">
                      <div className="flex items-center gap-3 mb-5">
                        <span className="h-px w-8 bg-brand-lightBlue" />
                        <p className="text-xs uppercase tracking-[0.4em] text-brand-lightBlue">Vision</p>
                      </div>
                      {about.vision && (
                        <p className="text-xl leading-[1.8] text-brand-ivory sm:text-[1.35rem]">
                          {about.vision}
                        </p>
                      )}
                      <div className="mt-8 flex flex-wrap gap-2">
                        {["Calm Destinations", "Elevated Rituals", "Effortless Travel"].map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-brand-ivory/10 px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.2em] text-brand-gray"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.article>
                )}
              </div>
            </Container>
          </motion.section>
        )}

        {/* Luxury Escapes Gallery */}
        <motion.section {...motionSectionProps} className="py-12 lg:py-16">
          <Container>
            <div className="mb-16 flex flex-col items-center text-center">
              <motion.div {...fadeInUp} className="flex items-center gap-4 mb-6">
                <span className="h-px w-12 bg-brand-gold" />
                <p className="text-xs uppercase tracking-[0.5em] text-brand-gold">
                  Signature Escapes
                </p>
                <span className="h-px w-12 bg-brand-gold" />
              </motion.div>

              <motion.h2 {...fadeInUp} className="font-display text-4xl tracking-tight sm:text-5xl">
                Where Members Unwind
              </motion.h2>

              <motion.p {...fadeInUp} className="mt-6 max-w-2xl text-base leading-relaxed text-brand-gray sm:text-lg">
                Every experience reflects calm, hospitality-first moments — private pools,
                spa sanctuaries, and beachfront lounges from our trusted luxury partners.
              </motion.p>
            </div>

            <motion.div
              {...staggerChildren}
              className="grid gap-6 md:grid-cols-3"
            >
              {luxuryEscapes.map((escape, index) => (
                <motion.article
                  key={escape.title}
                  {...fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-[1.75rem] border border-brand-ivory/10"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={escape.imageUrl}
                      alt={escape.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent" />

                    <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                      <span className="mb-4 w-fit rounded-full border border-brand-ivory/30 bg-brand-black/40 px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.25em] text-brand-ivory/90 backdrop-blur-sm">
                        {escape.tag}
                      </span>
                      <h3 className="font-display text-2xl text-brand-ivory sm:text-[1.75rem]">
                        {escape.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-brand-ivory/75">
                        {escape.caption}
                      </p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </Container>
        </motion.section>

        <SpecialFeaturesSection />

      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<AboutPageProps> = async () => {
  const about = getAboutInfo();
  const pageHero = getPageHero("about");

  return {
    props: {
      about,
      pageHero: pageHero ?? null,
    },
    revalidate: 60,
  };
};
