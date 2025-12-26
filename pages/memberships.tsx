import Head from "next/head";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { motion } from "framer-motion";

import { ButtonLink, secondaryButtonClasses } from "@/components/ButtonLink";
import { Container } from "@/components/Container";
import { MembershipCard } from "@/components/MembershipCard";

import {
  collectMembershipFaqs,
  collectMembershipTiers,
  type MembershipInfo,
  planCategoriesToMembershipInfo,
} from "@/lib/membership";

import { fetchPlans } from "@/lib/api/plans";

type MembershipsPageProps = {
  memberships: MembershipInfo[];

};

export default function MembershipsPage({
  memberships,
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

      <div className="space-y-10 pb-20">
        <div className="pt-24 pb-8 md:pt-32 md:pb-12">
          <Container>
            <div className="max-w-3xl space-y-6">
              <h1 className="text-5xl font-light text-brand-ivory md:text-6xl lg:text-7xl">
                Unlock Elite Access
              </h1>
              <p className="max-w-2xl text-lg text-brand-gray md:text-xl leading-relaxed">
                Choose the membership level that complements your lifestyle and wellness journey.
              </p>
            </div>
          </Container>
        </div>


        <section id="membership-tiers">
          <Container className="space-y-12">
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
                className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
              >
                {tiers.map((tier, tierIndex) => (
                  <MembershipCard
                    key={tier.name ?? `tier-${tierIndex}`}
                    tier={tier}
                    index={tierIndex}
                    fallbackCtaHref={ctaHref}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="glass-card p-10 text-center text-brand-gray">
                Membership tiers are being curated. Check back soon.
              </div>
            )}
          </Container>
        </section>

        <section>
          <Container>

            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.4em] text-brand-lightBlue">
                  FAQs
                </p>
                <h3 className="text-2xl font-semibold text-brand-ivory">
                  Common questions
                </h3>
                <p className="text-base text-brand-gray">
                  Details below help answer your membership questions.
                </p>
              </div>
              {faqs.length > 0 ? (
                <div className="space-y-3.5">
                  {faqs.map((faq) => (
                    <motion.div
                      key={faq.question}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1] as const,
                      }}
                      className="glass-card premium-card rounded-2xl p-5"
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
                <div className="glass-card rounded-2xl border border-dashed border-white/25 p-6 text-sm text-brand-gray">
                  No FAQs have been added yet.
                </div>
              )}
            </div>
          </Container>
        </section>

        <section>
          <Container className="glass-card premium-card py-14 text-center">
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
  const categories = await fetchPlans();
  let memberships = planCategoriesToMembershipInfo(categories);

  // Fallback to mock data if API returns empty results
  if (!memberships || memberships.length === 0 || collectMembershipTiers(memberships).length === 0) {
    const { getMemberships } = await import("@/lib/membership");
    memberships = getMemberships();
  }

  return {
    props: {
      memberships,
    },
    revalidate: 60,
  };
};
