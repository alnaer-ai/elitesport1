import Head from "next/head";
import Link from "next/link";
import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";
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
  collectMembershipTiers,
  getTierCardBackground,
  getTierHref,
  getTierSlug,
  mapMembershipTierEntries,
  MEMBERSHIP_QUERY,
  type MembershipInfo,
  type MembershipTier,
} from "@/lib/membership";
import { sanityClient } from "@/lib/sanity.client";

const MEMBERSHIPS_PAGE_SLUG = "memberships";
const checkIconPath = "M20 6L9 17L4 12";

type MembershipTierPageProps = {
  membership: MembershipInfo;
  tier: MembershipTier;
  hero: HeroPayload | null;
};

const motionItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function MembershipTierPage({
  membership,
  tier,
  hero,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const tierName = tier.name ?? "Membership tier";
  const membershipTitle = membership.title ?? "Memberships";
  const tierSlug = getTierSlug(tier.name) ?? "";
  const benefits = (tier.benefits ?? []).filter((benefit): benefit is string => Boolean(benefit));
  const benefitsCount = benefits.length;
  const otherTiers = (membership.tiers ?? []).filter((candidate) => {
    const slug = getTierSlug(candidate?.name);
    return slug && slug !== tierSlug && candidate?.name;
  });
  const tierOrderEntries: Array<[string, number]> = [];
  (membership.tiers ?? []).forEach((candidate, index) => {
    const slug = getTierSlug(candidate?.name);
    if (slug) {
      tierOrderEntries.push([slug, index]);
    }
  });
  const tierOrderMap = new Map(tierOrderEntries);
  const faqs = (membership.faq ?? []).filter(
    (faq) => faq?.question && faq?.answer
  );
  const ctaLabel =
    tier.ctaLabel ?? membership.ctaLabel ?? "Contact Membership";
  const ctaHref = tier.ctaUrl ?? membership.ctaUrl ?? "/contact";

  return (
    <>
      <Head>
        <title>{`${tierName} | ${membershipTitle} | EliteSport`}</title>
        <meta
          name="description"
          content={`Explore the ${tierName} membership at EliteSport and review the curated benefits, pricing, and concierge details.`}
        />
      </Head>

      <div className="space-y-16 pb-24">
        <Hero hero={hero} />
        <section>
          <Container className="space-y-12">
            <div className="space-y-6 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-brand-lightBlue">
                Tier spotlight
              </p>
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-semibold text-brand-ivory">
                    {tierName}
                  </h1>
                  {tier.isPopular && (
                    <span className="rounded-full border border-brand-gold/50 bg-brand-gold/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-brand-gold">
                      Popular
                    </span>
                  )}
                </div>
                {tier.price && (
                  <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">
                    {tier.price}
                  </p>
                )}
                <div className="max-w-2xl space-y-2 text-brand-gray">
                  <p className="text-xs uppercase tracking-[0.3em] text-brand-lightBlue">
                    Description
                  </p>
                  <p className="text-base">
                    {tier.description ??
                      "Membership specialists will update this tier description soon."}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <ButtonLink href={ctaHref}>{ctaLabel}</ButtonLink>
                  <Link href="/memberships" className={secondaryButtonClasses}>
                    View all tiers
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-[2fr,1fr]">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.1 },
                  },
                }}
                className="space-y-8"
              >
                <motion.div
                  variants={motionItem}
                  className="space-y-6 rounded-3xl border border-brand-deepBlue/60 bg-brand-black/60 p-8 shadow-lg shadow-brand-black/50"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs uppercase tracking-[0.5em] text-brand-lightBlue">
                      Benefits
                    </p>
                    {benefitsCount > 0 && (
                      <span className="text-xs text-brand-gray">
                        {benefitsCount} benefit{benefitsCount === 1 ? "" : "s"}
                      </span>
                    )}
                  </div>
                  {benefits.length > 0 ? (
                    <ul className="space-y-3 text-sm text-brand-gray">
                      {benefits.map((benefit, index) => (
                        <li
                          key={`${benefit}-${index}`}
                          className="flex items-start gap-3"
                        >
                          <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-deepBlue/60 text-brand-gold">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={1.6}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-3 w-3"
                            >
                              <path d={checkIconPath} />
                            </svg>
                          </span>
                          <span className="text-sm text-brand-gray">
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-brand-gray">
                      Additional benefits are being curated. Check back soon
                      for a full breakdown.
                    </p>
                  )}
                </motion.div>

                {membership.ctaUrl && membership.ctaLabel && (
                  <motion.div
                    variants={motionItem}
                    className="rounded-3xl border border-brand-lightBlue/30 bg-gradient-to-r from-brand-deepBlue/40 via-brand-black to-brand-black p-8 text-center"
                  >
                    <p className="text-xs uppercase tracking-[0.5em] text-brand-lightBlue">
                      Need Concierge Support
                    </p>
                    <p className="mt-3 text-base text-brand-ivory">
                      Share your goals with our membership team. They will craft
                      a tailored plan, confirm benefit allocations, and secure
                      your preferred experiences.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      <ButtonLink href={membership.ctaUrl}>
                        {membership.ctaLabel}
                      </ButtonLink>
                      <Link href="/contact" className={secondaryButtonClasses}>
                        Contact Concierge
                      </Link>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              <aside className="space-y-6">
                <motion.div
                  variants={motionItem}
                  className="rounded-3xl border border-brand-deepBlue/60 bg-brand-black/50 p-6"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.5em] text-brand-lightBlue">
                      Other tiers
                    </p>
                    <span className="text-xs text-brand-gray">
                      {otherTiers.length} available
                    </span>
                  </div>
                  <div className="mt-6 space-y-4">
                    {otherTiers.length === 0 && (
                      <p className="text-sm text-brand-gray">
                        No other tiers are configured yet. Add them in the CMS
                        to publish instantly.
                      </p>
                    )}
                    {otherTiers.map((otherTier) => {
                      const slug = getTierSlug(otherTier.name);
                      if (!slug || !otherTier.name) {
                        return null;
                      }
                      const fallbackIndex = tierOrderMap.get(slug);
                      const cardBackground = getTierCardBackground(
                        otherTier,
                        fallbackIndex
                      );
                      const cardStyle = cardBackground
                        ? { background: cardBackground }
                        : undefined;

                      return (
                        <Link
                          key={otherTier.name}
                          href={getTierHref(otherTier.name)}
                          style={cardStyle}
                          className={cn(
                            "group block rounded-2xl border border-transparent bg-brand-black/30 p-4 transition hover:border-brand-gold/60",
                            otherTier.isPopular &&
                              "border-brand-gold/60 shadow-glow shadow-brand-gold/40"
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-base font-semibold text-brand-ivory">
                              {otherTier.name}
                            </p>
                            {otherTier.isPopular && (
                              <span className="rounded-full border border-brand-gold/50 px-2 py-0.5 text-xs uppercase tracking-[0.3em] text-brand-gold">
                                Popular
                              </span>
                            )}
                          </div>
                          {otherTier.price && (
                            <p className="mt-2 text-sm uppercase tracking-[0.3em] text-brand-gold">
                              {otherTier.price}
                            </p>
                          )}
                          <p className="mt-4 text-xs uppercase tracking-[0.4em] text-brand-lightBlue">
                            View details
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>

                {faqs.length > 0 && (
                  <motion.div
                    variants={motionItem}
                    className="rounded-3xl border border-dashed border-brand-deepBlue/60 bg-brand-black/40 p-6"
                  >
                    <p className="text-xs uppercase tracking-[0.5em] text-brand-lightBlue">
                      FAQs
                    </p>
                    <div className="mt-5 space-y-4">
                      {faqs.slice(0, 3).map((faq) => (
                        <div
                          key={faq.question}
                          className="space-y-1 rounded-2xl border border-brand-deepBlue/40 bg-brand-black/60 p-4"
                        >
                          <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">
                            {faq.question}
                          </p>
                          <p className="text-sm text-brand-gray">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </aside>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const client = sanityClient;
  if (!client) {
    return {
      paths: [],
      fallback: "blocking",
    };
  }

  const memberships = (await client.fetch<MembershipInfo[]>(MEMBERSHIP_QUERY)) ?? [];
  const tiers = collectMembershipTiers(memberships);

  const tierSlugs = tiers
    .map((tier) => getTierSlug(tier?.name))
    .filter((slug): slug is string => Boolean(slug));

  const uniqueSlugs = Array.from(new Set(tierSlugs));

  const paths = uniqueSlugs.map((slug) => ({
    params: {
      tierSlug: slug,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<MembershipTierPageProps> = async ({
  params,
}) => {
  const client = sanityClient;
  if (!client) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  const tierSlug = Array.isArray(params?.tierSlug)
    ? params.tierSlug[0]
    : params?.tierSlug;

  if (!tierSlug) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  const memberships = (await client.fetch<MembershipInfo[]>(MEMBERSHIP_QUERY)) ?? [];

  if (memberships.length === 0) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  const tierEntries = mapMembershipTierEntries(memberships);
  const tierEntry = tierEntries.find(
    (entry) => getTierSlug(entry.tier?.name) === tierSlug
  );

  if (!tierEntry?.tier?.name) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  const hero = await fetchPageHero(MEMBERSHIPS_PAGE_SLUG, client);

  return {
    props: {
      membership: tierEntry.membership,
      tier: tierEntry.tier,
      hero: hero ?? null,
    },
    revalidate: 60,
  };
};
