import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { ReactNode } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { cn } from "@/lib/cn";
import { sanityClient } from "@/lib/sanity.client";

type MembershipTier = {
  name?: string;
  price?: string;
  benefits?: string[];
  isPopular?: boolean;
};

type MembershipFaq = {
  question?: string;
  answer?: string;
};

type MembershipInfo = {
  title?: string;
  heroDescription?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  tiers?: MembershipTier[];
  faq?: MembershipFaq[];
};

type MembershipsPageProps = {
  membership: MembershipInfo | null;
};

const MEMBERSHIP_QUERY = `
  *[_type == "membershipInfo"][0]{
    title,
    heroDescription,
    ctaLabel,
    ctaUrl,
    tiers[]{
      name,
      price,
      benefits,
      isPopular
    },
    faq[]{
      question,
      answer
    }
  }
`;

const heroImage =
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=2400&q=80";

const motionItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const secondaryButtonClasses =
  "inline-flex items-center justify-center gap-2 rounded-full border border-brand-lightBlue/30 px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-ivory transition duration-200 hover:border-brand-gold/60 hover:text-brand-gold";

const checkIconPath = "M20 6L9 17L4 12";

const anchorButtonBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lightBlue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black";

const anchorButtonVariants = {
  primary:
    "bg-brand-gold text-brand-black hover:bg-brand-lightBlue hover:text-brand-deepBlue shadow-glow",
  secondary:
    "bg-brand-deepBlue text-brand-ivory hover:bg-brand-lightBlue/20 border border-brand-lightBlue/30",
};

const getButtonClasses = (variant: keyof typeof anchorButtonVariants) =>
  cn(anchorButtonBase, anchorButtonVariants[variant]);

type ButtonLinkProps = {
  href: string;
  variant?: keyof typeof anchorButtonVariants;
  children: ReactNode;
};

const ButtonLink = ({ href, variant = "primary", children }: ButtonLinkProps) => {
  const isInternal = href.startsWith("/");
  const isExternal = href.startsWith("http");
  const className = getButtonClasses(variant);

  if (isInternal) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={className}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
    >
      {children}
    </a>
  );
};

export default function MembershipsPage({
  membership,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const title = membership?.title ?? "Memberships";
  const heroDescription =
    membership?.heroDescription ??
    "Every EliteSport membership unlocks curated destinations, bespoke training design, and concierge-grade recovery care across the globe.";
  const ctaLabel = membership?.ctaLabel ?? "Contact Membership";
  const ctaHref = membership?.ctaUrl ?? "/contact";
  const tiers = (membership?.tiers ?? []).filter((tier) => tier?.name);
  const faqs = (membership?.faq ?? []).filter(
    (faq) => faq?.question && faq?.answer
  );

  const totalBenefits = tiers.reduce((count, tier) => {
    return count + (tier?.benefits?.length ?? 0);
  }, 0);

  const handleExploreClick = () => {
    const section = document.getElementById("membership-tiers");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

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
        <section className="relative isolate overflow-hidden border-b border-brand-deepBlue/60">
          <Image
            src={heroImage}
            alt="Members training at EliteSport"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black/95 via-brand-black/80 to-brand-deepBlue/70" />
          <Container className="relative z-10 text-center sm:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-3xl space-y-6 py-24"
            >
              <p className="text-xs uppercase tracking-[0.6em] text-brand-lightBlue">
                EliteSport
              </p>
              <div>
                <h1 className="text-4xl font-semibold text-brand-ivory sm:text-5xl">
                  {title}
                </h1>
                <p className="mt-4 text-base text-brand-gray sm:text-lg">
                  {heroDescription}
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <ButtonLink href={ctaHref}>{ctaLabel}</ButtonLink>
                <Button
                  type="button"
                  variant="secondary"
                  className="uppercase tracking-[0.25em]"
                  onClick={handleExploreClick}
                >
                  Explore Tiers
                </Button>
              </div>
            </motion.div>
          </Container>
        </section>

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
                {tiers.length > 0 && (
                  <p className="text-sm text-brand-gray">
                    {tiers.length} tier{tiers.length === 1 ? "" : "s"} •{" "}
                    {totalBenefits} benefits documented
                  </p>
                )}
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
                {tiers.map((tier) => (
                  <motion.article
                    key={tier.name}
                    variants={motionItem}
                    className={cn(
                      "relative flex h-full flex-col rounded-3xl border border-brand-deepBlue/60 bg-brand-black/70 p-8 shadow-xl shadow-brand-black/30",
                      tier.isPopular && "ring-2 ring-brand-gold/60 ring-offset-4 ring-offset-brand-black"
                    )}
                  >
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
                    <ul className="mt-6 flex-1 space-y-3">
                      {tier.benefits?.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-3 text-sm text-brand-gray">
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
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8">
                      <p className="text-xs uppercase tracking-[0.4em] text-brand-lightBlue">
                        Concierge Access
                      </p>
                      <p className="mt-2 text-base text-brand-gray">
                        Work with a membership director to tailor this tier to
                        your travel or recovery schedule.
                      </p>
                    </div>
                  </motion.article>
                ))}
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
        membership: null,
      },
      revalidate: 60,
    };
  }

  const membership = await client.fetch<MembershipInfo | null>(
    MEMBERSHIP_QUERY
  );

  return {
    props: {
      membership,
    },
    revalidate: 60,
  };
};
