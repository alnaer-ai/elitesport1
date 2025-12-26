import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";
import { motion } from "framer-motion";

import { ButtonLink, secondaryButtonClasses } from "@/components/ButtonLink";
import { BusinessContactModal } from "@/components/BusinessContactModal";
import { Container } from "@/components/Container";
import {
  collectMembershipTiers,
  getTierColor,
  getTierSlug,
  mapMembershipTierEntries,
  getMemberships,
  type MembershipInfo,
  type MembershipTier,
} from "@/lib/membership";

const checkIconPath = "M20 6L9 17L4 12";

type MembershipTierPageProps = {
  membership: MembershipInfo;
  tier: MembershipTier;
};

const motionItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function MembershipTierPage({
  membership,
  tier,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
  const tierName = tier.name ?? "Membership tier";
  const membershipTitle = membership.title ?? "Memberships";
  const tierSlug = getTierSlug(tier.name) ?? "";
  const benefits = (tier.benefits ?? []).filter((benefit): benefit is string => Boolean(benefit));
  // Filter out "family member" benefits unless explicitly provided
  const familyBenefits = (tier.familyBenefits ?? [])
    .filter((benefit): benefit is string => Boolean(benefit))
    .filter((benefit) => {
      const lowerBenefit = benefit.toLowerCase();
      // Remove benefits that mention "family member" unless explicitly provided
      return !lowerBenefit.includes("family member");
    });
  const hotelsGyms = (tier.hotelsGyms ?? []).filter((venue): venue is string => Boolean(venue));
  const benefitsCount = benefits.length;
  const familyBenefitsCount = familyBenefits.length;
  const tierOrderEntries: Array<[string, number]> = [];
  (membership.tiers ?? []).forEach((candidate, index) => {
    const slug = getTierSlug(candidate?.name);
    if (slug) {
      tierOrderEntries.push([slug, index]);
    }
  });
  const tierOrderMap = new Map(tierOrderEntries);
  const ctaLabel =
    tier.ctaLabel ?? membership.ctaLabel ?? "Contact Membership";
  const ctaHref = tier.ctaUrl ?? membership.ctaUrl ?? "/contact";

  const isBusinessTier =
    tierName.toLowerCase().includes("gold") ||
    ctaLabel.toUpperCase() === "CONTACT BUSINESS TEAM";

  const tierIndex = tierOrderMap.get(tierSlug);
  const currentTierColor = getTierColor(tier, tierIndex);

  // Check if this is a gym-related tier (hide benefits section)
  const normalizedTierName = tierName.toLowerCase().trim();
  const normalizedCategoryName = tier.categoryName?.toLowerCase().trim() ?? "";
  const normalizedSlug = tierSlug.toLowerCase().trim();

  const isGymTier =
    normalizedTierName.includes("gym") ||
    normalizedCategoryName.includes("gym") ||
    normalizedCategoryName === "gym only" ||
    tier.categoryName === "Gym Only" ||
    normalizedSlug.includes("gym") ||
    normalizedSlug === "gym";

  // Check if this is a "She" tier (hide benefits section)
  const isSheTier =
    normalizedTierName === "she" ||
    normalizedTierName.includes("she") ||
    normalizedCategoryName === "she" ||
    normalizedCategoryName === "SHE" ||
    tier.categoryName === "SHE" ||
    normalizedSlug === "she" ||
    normalizedSlug.includes("she");

  // Hide benefits section for gym and she tiers
  const shouldHideBenefits = isGymTier || isSheTier;

  return (
    <>
      <BusinessContactModal
        isOpen={isBusinessModalOpen}
        onClose={() => setIsBusinessModalOpen(false)}
        tierName={tierName}
      />
      <Head>
        <title>{`${tierName} | ${membershipTitle} | EliteSport`}</title>
        <meta
          name="description"
          content={`Explore the ${tierName} membership at EliteSport and review the curated benefits, pricing, and concierge details.`}
        />
      </Head>

      <div className="space-y-14 pb-20">
        <section>
          <Container className="space-y-10">
            <div
              className="glass-card relative overflow-hidden rounded-[40px] px-6 py-14 text-center sm:px-10"
              style={
                {
                  "--tier-color": currentTierColor,
                } as React.CSSProperties
              }
            >
              {/* Tier color glow / tint */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-50"
                style={{
                  background:
                    "radial-gradient(70% 55% at 50% 0%, var(--tier-color) 0%, transparent 70%)",
                }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-24 opacity-40 blur-2xl"
                style={{
                  background:
                    "radial-gradient(55% 120% at 50% 120%, var(--tier-color) 0%, transparent 70%)",
                }}
              />

              <div className="relative z-10 space-y-6">
                <p
                  className="text-xs uppercase tracking-[0.5em]"
                  style={{ color: "var(--tier-color)" }}
                >
                  Tier spotlight
                </p>
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="flex items-center gap-3">
                    <h1 className="text-4xl font-semibold text-brand-ivory">
                      {tierName}
                    </h1>
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
                    {isBusinessTier ? (
                      <ButtonLink onClick={() => setIsBusinessModalOpen(true)}>
                        {ctaLabel}
                      </ButtonLink>
                    ) : (
                      <ButtonLink href={ctaHref}>{ctaLabel}</ButtonLink>
                    )}
                    <Link href="/memberships" className={secondaryButtonClasses}>
                      View all tiers
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={{
                visible: {
                  transition: { staggerChildren: 0.1 },
                },
              }}
              className="space-y-7"
            >
              {/* Benefits Cards - Dynamic Grid - Hidden for gym and she tiers */}
              {!shouldHideBenefits && (
                <motion.div
                  variants={motionItem}
                  className="grid gap-6"
                  style={{
                    gridTemplateColumns:
                      tier.isFamilyFriendly && (familyBenefits.length > 0 || benefits.length > 0)
                        ? "repeat(auto-fit, minmax(min(100%, 320px), 1fr))"
                        : "1fr",
                  }}
                >
                  {/* Single Benefits Card */}
                  {tier.isFamilyFriendly && (familyBenefits.length > 0 || benefits.length > 0) ? (
                    <div className="glass-card space-y-5 p-7">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-xs uppercase tracking-[0.5em] text-brand-lightBlue">
                          Single
                        </p>
                        {benefitsCount > 0 && (
                          <span className="text-xs text-brand-gray">
                            {benefitsCount} benefit{benefitsCount === 1 ? "" : "s"}
                          </span>
                        )}
                      </div>
                      {benefits.length > 0 ? (
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-brand-gray">
                          {benefits.map((benefit, index) => (
                            <li
                              key={`single-${benefit}-${index}`}
                              className="flex items-start gap-3"
                            >
                              <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-deepBlue/60 text-brand-gold flex-shrink-0">
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
                    </div>
                  ) : (
                    <div className="glass-card space-y-5 p-7">
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
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-brand-gray">
                          {benefits.map((benefit, index) => (
                            <li
                              key={`${benefit}-${index}`}
                              className="flex items-start gap-3"
                            >
                              <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-deepBlue/60 text-brand-gold flex-shrink-0">
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
                    </div>
                  )}

                  {/* Family Benefits Card - Only shown when family-friendly tier */}
                  {tier.isFamilyFriendly && (familyBenefits.length > 0 || benefits.length > 0) && (
                    <div className="glass-card space-y-5 p-7">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-xs uppercase tracking-[0.5em] text-brand-lightBlue">
                          Family
                        </p>
                        {familyBenefitsCount > 0 && (
                          <span className="text-xs text-brand-gray">
                            {familyBenefitsCount} benefit{familyBenefitsCount === 1 ? "" : "s"}
                          </span>
                        )}
                      </div>
                      {familyBenefits.length > 0 ? (
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-brand-gray">
                          {familyBenefits.map((benefit, index) => (
                            <li
                              key={`family-${benefit}-${index}`}
                              className="flex items-start gap-3"
                            >
                              <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-deepBlue/60 text-brand-gold flex-shrink-0">
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
                          Family benefits are being curated. Check back soon
                          for a full breakdown.
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Hotels & Gyms Section - Bullet Points */}
              {hotelsGyms.length > 0 && (
                <motion.div
                  variants={motionItem}
                  className="glass-card space-y-5 p-7"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs uppercase tracking-[0.5em] text-brand-lightBlue">
                      Hotels & Gyms
                    </p>
                    <span className="text-xs text-brand-gray">
                      {hotelsGyms.length} venue{hotelsGyms.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <ul className="space-y-3 text-sm text-brand-gray">
                    {hotelsGyms.map((venue, index) => (
                      <li
                        key={`venue-${venue}-${index}`}
                        className="flex items-start gap-3"
                      >
                        <span className="mt-1 text-brand-gold" aria-hidden="true">
                          •
                        </span>
                        <span className="text-sm text-brand-gray">
                          {venue}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.div>
          </Container>
        </section>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Use static mock data
  const memberships = getMemberships();

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
  const tierSlug = Array.isArray(params?.tierSlug)
    ? params.tierSlug[0]
    : params?.tierSlug;

  if (!tierSlug) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  // Use static mock data
  const memberships = getMemberships();

  // Still no memberships
  if (memberships.length === 0) {
    return {
      notFound: true,
    };
  }

  const tierEntries = mapMembershipTierEntries(memberships);
  const tierEntry = tierEntries.find(
    (entry) => getTierSlug(entry.tier?.name) === tierSlug
  );

  if (!tierEntry?.tier?.name) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      membership: tierEntry.membership,
      tier: tierEntry.tier,
    },
  };
};
