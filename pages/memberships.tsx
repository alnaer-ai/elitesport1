import Head from "next/head";
import Link from "next/link";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { motion } from "framer-motion";

import { ButtonLink, secondaryButtonClasses } from "@/components/ButtonLink";
import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { cn } from "@/lib/cn";
import {
  fetchPageHero,
  type HeroPayload,
} from "@/lib/hero";
import {
  collectMembershipFaqs,
  collectMembershipTiers,
  getTierCardBackground,
  getTierHref,
  getTierSlug,
  MEMBERSHIP_QUERY,
  type MembershipInfo,
} from "@/lib/membership";
import { sanityClient } from "@/lib/sanity.client";

type MembershipsPageProps = {
  memberships: MembershipInfo[];
  hero: HeroPayload | null;
};

const MEMBERSHIPS_PAGE_SLUG = "memberships";

const motionItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function MembershipsPage({
  memberships,
  hero,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const primaryMembership = memberships[0] ?? null;
  const title = primaryMembership?.title ?? "Memberships";
  const ctaLabel = primaryMembership?.ctaLabel ?? "Contact Membership";
  const ctaHref = primaryMembership?.ctaUrl ?? "/contact";
  const tiers = collectMembershipTiers(memberships).filter(
    (tier) => tier?.name
  );
  const faqs = collectMembershipFaqs(memberships).filter(
    (faq) => faq?.question && faq?.answer
  );

  return (
    <>
      <Head>
        <title>{`${title} | EliteSport`}</title>
        <meta
          name="description"
          content="Discover EliteSport membership tiers, exclusive benefits, and concierge perks tailored for high-performance lifestyles."
        />
      </Head>

      <div className="space-y-20 pb-24">
        <Hero hero={hero} />
        <section id="membership-tiers">
          <Container className="space-y-14">
            <div className="space-y-4 text-center sm:text-left">
              <p className="text-xs uppercase tracking-[0.5em] text-brand-lightBlue">
                Member Benefits
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-3xl font-semibold text-brand-ivory">
                    Tiers designed for every ambition
                  </h2>
                  <p className="mt-3 text-base text-brand-gray">
                    Select the membership configuration that mirrors your
                    training cadence. Each tier unlocks curated benefits with
                    concierge-level servicing.
                  </p>
                </div>
              </div>
            </div>

            {tiers.length > 0 ? (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.15 },
                  },
                }}
                className="grid gap-8 md:grid-cols-2 xl:grid-cols-3"
              >
                {tiers.map((tier, tierIndex) => {
                  const cardBackground = getTierCardBackground(
                    tier,
                    tierIndex
                  );
                  const cardStyle = cardBackground
                    ? { background: cardBackground }
                    : undefined;
                  const tierActionLabel =
                    tier.ctaLabel ?? `Discover more about ${tier.name ?? "this tier"}`;
                  const tierSlug = getTierSlug(tier.name);
                  const tierHref = tierSlug ? getTierHref(tier.name) : ctaHref;

                  return (
                    <motion.article
                      key={tier.name ?? `tier-${tierIndex}`}
                      variants={motionItem}
                      style={cardStyle}
                      className={cn(
                        "relative flex h-full flex-col rounded-3xl border border-brand-deepBlue/60 bg-brand-black p-8 shadow-xl shadow-brand-black/30",
                        tier.isPopular &&
                          "ring-2 ring-brand-gold/60 ring-offset-4 ring-offset-brand-black"
                      )}
                    >
                      <Link
                        href={tierHref}
                        className="absolute inset-0 z-0"
                        aria-label={`${tier.name ?? "Membership tier"} — ${tierActionLabel}`}
                      >
                        <span className="sr-only">{tierActionLabel}</span>
                      </Link>
                      <div className="relative z-10 flex flex-col gap-6">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xl font-semibold text-brand-ivory">
                              {tier.name}
                            </p>
                            {tier.price && (
                              <p className="mt-2 text-sm uppercase tracking-[0.3em] text-brand-gold">
                                {tier.price}
                              </p>
                            )}
                          </div>
                          {tier.isPopular && (
                            <span className="rounded-full border border-brand-gold/50 bg-brand-gold/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-brand-gold">
                              Popular
                            </span>
                          )}
                        </div>

                        <div className="flex-1 space-y-3">
                          <p className="text-xs uppercase tracking-[0.3em] text-brand-lightBlue">
                            Description
                          </p>
                          <p className="text-sm text-brand-gray">
                            {tier.description ??
                              "Details for this membership tier will be published soon."}
                          </p>
                        </div>

                        <p className="text-xs uppercase tracking-[0.3em] text-brand-lightBlue">
                          {tierActionLabel}
                        </p>
                      </div>
                    </motion.article>
                  );
                })}
              </motion.div>
            ) : (
              <div className="rounded-3xl border border-brand-deepBlue/60 bg-brand-black/50 p-10 text-center text-brand-gray">
                Membership tiers are being curated in the CMS. Add tier entries
                inside Sanity to populate this section automatically.
              </div>
            )}
          </Container>
        </section>

        <section>
          <Container className="grid gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-6 rounded-3xl border border-brand-deepBlue/60 bg-gradient-to-br from-brand-deepBlue/50 via-brand-black to-brand-black p-10"
            >
              <p className="text-xs uppercase tracking-[0.5em] text-brand-lightBlue">
                Member Experience
              </p>
              <h3 className="text-3xl font-semibold text-brand-ivory">
                What sets an EliteSport membership apart?
              </h3>
              <p className="text-base text-brand-gray">
                Program strategy, recovery orchestration, and private access are
                choreographed by one membership concierge so every stay or
                session is purposeful.
              </p>
              <ul className="space-y-4 text-sm text-brand-gray">
                <li>
                  Personalized onboarding that captures performance data,
                  travel, and hospitality needs.
                </li>
                <li>
                  Rolling concierge support for itineraries, specialist bookings,
                  and guest access arrangements.
                </li>
                <li>
                  Transparent reporting on benefit usage, session credits, and
                  upcoming experiences.
                </li>
              </ul>
              <ButtonLink href={ctaHref} variant="secondary">
                Speak with Concierge
              </ButtonLink>
            </motion.div>

            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.4em] text-brand-lightBlue">
                  FAQs
                </p>
                <h3 className="text-2xl font-semibold text-brand-ivory">
                  Common questions
                </h3>
                <p className="text-base text-brand-gray">
                  Details below are authored in the CMS so your team can update
                  responses without a deployment.
                </p>
              </div>
              {faqs.length > 0 ? (
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <motion.div
                      key={faq.question}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="rounded-2xl border border-brand-deepBlue/60 bg-brand-black/60 p-6"
                    >
                      <p className="text-sm uppercase tracking-[0.3em] text-brand-lightBlue">
                        {faq.question}
                      </p>
                      <p className="mt-3 text-base text-brand-gray">
                        {faq.answer}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-brand-deepBlue/60 bg-brand-black/40 p-6 text-sm text-brand-gray">
                  No FAQs have been added yet. Create entries in the Membership
                  Info document to publish them instantly.
                </div>
              )}
            </div>
          </Container>
        </section>

        <section>
          <Container className="rounded-3xl border border-brand-lightBlue/30 bg-gradient-to-r from-brand-deepBlue via-brand-black to-brand-black py-16 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-brand-lightBlue">
              Begin your membership
            </p>
            <h3 className="mt-4 text-3xl font-semibold text-brand-ivory">
              Ready to elevate your performance rituals?
            </h3>
            <p className="mt-3 text-base text-brand-gray sm:text-lg">
              Share your goals with our membership directors. We will craft a
              program blueprint, confirm benefit allocations, and secure your
              preferred destinations.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <ButtonLink href={ctaHref}>{ctaLabel}</ButtonLink>
              <a
                href="mailto:concierge@elitesport.com"
                className={secondaryButtonClasses}
              >
                concierge@elitesport.com
              </a>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<MembershipsPageProps> = async () => {
  const client = sanityClient;
  if (!client) {
    return {
      props: {
        memberships: [],
        hero: null,
      },
      revalidate: 60,
    };
  }

  const [memberships, hero] = await Promise.all([
    client.fetch<MembershipInfo[]>(MEMBERSHIP_QUERY),
    fetchPageHero(MEMBERSHIPS_PAGE_SLUG, client),
  ]);

  const membershipEntries = memberships ?? [];

  return {
    props: {
      memberships: membershipEntries,
      hero: hero ?? null,
    },
    revalidate: 60,
  };
};
