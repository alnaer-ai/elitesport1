import Head from "next/head";
import Image from "next/image";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { motion } from "framer-motion";
import type { SanityImageSource } from "@sanity/image-url";

import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { fetchPageHero, type HeroPayload } from "@/lib/hero";
import {
  isSanityConfigured,
  sanityClient,
  urlForImage,
} from "@/lib/sanity.client";

type TimelineEntry = {
  year?: string;
  title?: string;
  description?: string;
};

type Differentiator = {
  title?: string;
  description?: string;
};

type TeamMember = {
  name?: string;
  role?: string;
  bio?: string;
  photo?: SanityImageSource;
};

type AboutInfo = {
  companyDescription?: string;
  missionSectionEyebrow?: string;
  missionSectionTitle?: string;
  missionStatement?: string;
  missionImage?: SanityImageSource;
  vision?: string;
  visionImage?: SanityImageSource;
  storyHeading?: string;
  storyIntro?: string;
  valuesSectionEyebrow?: string;
  valuesSectionTitle?: string;
  valuesSectionDescription?: string;
  teamSectionEyebrow?: string;
  teamSectionTitle?: string;
  teamSectionDescription?: string;
  timeline?: TimelineEntry[];
  teamMembers?: TeamMember[];
  coreValues?: string[];
  differentiators?: Differentiator[];
};

type AboutPageProps = {
  about: AboutInfo | null;
  hero: HeroPayload | null;
};

const ABOUT_QUERY = `
  *[_type == "aboutInfo"][0]{
    companyDescription,
    missionSectionEyebrow,
    missionSectionTitle,
    missionStatement,
    missionImage,
    vision,
    visionImage,
    storyHeading,
    storyIntro,
    valuesSectionEyebrow,
    valuesSectionTitle,
    valuesSectionDescription,
    teamSectionEyebrow,
    teamSectionTitle,
    teamSectionDescription,
    timeline[]{year,title,description},
    teamMembers[]{name,role,bio,photo},
    coreValues,
    differentiators[]{title,description}
  }
`;
const ABOUT_PAGE_SLUG = "about";

const motionSectionProps = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
};

const getImageUrl = (source?: SanityImageSource, width = 2000) => {
  if (!source || !isSanityConfigured) {
    return undefined;
  }

  try {
    return urlForImage(source).width(width).auto("format").url();
  } catch {
    return undefined;
  }
};

export default function AboutPage({
  about,
  hero,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!about) {
    return (
      <>
        <Head>
          <title>About EliteSport</title>
          <meta
            name="description"
            content="Discover the mission, story, and team shaping EliteSport's luxury performance residences worldwide."
          />
        </Head>
        <div className="py-24">
          <Container className="text-center">
            <p className="text-sm text-brand-gray">
              About page content is not yet available. Please add content in the CMS.
            </p>
          </Container>
        </div>
      </>
    );
  }

  const timeline = (about.timeline ?? []).filter(
    (entry) => entry.year || entry.title || entry.description
  );
  const differentiators = (about.differentiators ?? []).filter(
    (item) => item.title || item.description
  );
  const teamMembers = (about.teamMembers ?? []).filter(
    (member) => member.name || member.role || member.bio
  );
  const coreValues = about.coreValues ?? [];

  const missionImageUrl = getImageUrl(about.missionImage, 1800);
  const visionImageUrl = getImageUrl(about.visionImage, 1800);

  return (
    <>
      <Head>
        <title>About EliteSport</title>
        <meta
          name="description"
          content="Discover the mission, story, and team shaping EliteSport's luxury performance residences worldwide."
        />
      </Head>

      <div className="space-y-12 pb-24">
        <Hero hero={hero} />

        {(about.companyDescription ||
          about.missionStatement ||
          about.vision ||
          missionImageUrl ||
          visionImageUrl ||
          about.missionSectionEyebrow ||
          about.missionSectionTitle) && (
          <motion.section {...motionSectionProps}>
            <Container className="space-y-12">
              {/* Row 1: Text | Image Card (Mission) */}
              <div className="grid gap-12 lg:grid-cols-2">
                {(about.missionSectionEyebrow ||
                  about.missionSectionTitle ||
                  about.companyDescription) && (
                  <div className="space-y-6">
                    {about.missionSectionEyebrow && (
                      <p className="text-xs uppercase tracking-[0.5em] text-brand-lightBlue">
                        {about.missionSectionEyebrow}
                      </p>
                    )}
                    {about.missionSectionTitle && (
                      <h2 className="font-display text-3xl text-brand-ivory sm:text-4xl">
                        {about.missionSectionTitle}
                      </h2>
                    )}
                    {about.companyDescription && (
                      <p className="text-base text-brand-gray">
                        {about.companyDescription}
                      </p>
                    )}
                  </div>
                )}
                {(about.missionStatement || missionImageUrl) && (
                  <article className="glass-card premium-card p-6">
                    <p className="text-xs uppercase tracking-[0.4em] text-brand-gold">
                      Mission
                    </p>
                    {about.missionStatement && (
                      <p className="mt-3 text-sm text-brand-gray">
                        {about.missionStatement}
                      </p>
                    )}
                    {missionImageUrl && (
                      <div className="mt-5 relative h-48 w-full overflow-hidden rounded-2xl">
                        <Image
                          src={missionImageUrl}
                          alt="Mission visual"
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </article>
                )}
              </div>

              {/* Row 2: Image Card (Vision) | Empty space for alternating pattern */}
              {(about.vision || visionImageUrl) && (
                <div className="grid gap-12 lg:grid-cols-2">
                  <article className="glass-card premium-card p-6">
                    <p className="text-xs uppercase tracking-[0.4em] text-brand-gold">
                      Vision
                    </p>
                    {about.vision && (
                      <p className="mt-3 text-sm text-brand-gray">
                        {about.vision}
                      </p>
                    )}
                    {visionImageUrl && (
                      <div className="mt-5 relative h-48 w-full overflow-hidden rounded-2xl">
                        <Image
                          src={visionImageUrl}
                          alt="Vision visual"
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </article>
                  {/* Empty space on the right to maintain alternating pattern */}
                  <div />
                </div>
              )}
            </Container>
          </motion.section>
        )}

        {(about.storyHeading || about.storyIntro || timeline.length > 0) && (
          <motion.section id="our-story" {...motionSectionProps}>
            <Container className="space-y-10">
              {(about.storyHeading || about.storyIntro) && (
                <div className="space-y-4 text-center sm:text-left">
                  {about.storyHeading && (
                    <p className="text-xs uppercase tracking-[0.5em] text-brand-lightBlue">
                      {about.storyHeading}
                    </p>
                  )}
                  {about.storyIntro && (
                    <h2 className="font-display text-3xl text-brand-ivory sm:text-4xl">
                      {about.storyIntro}
                    </h2>
                  )}
                </div>
              )}
              {timeline.length > 0 && (
                <div className="relative pl-6">
                  <span className="absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-gold via-brand-lightBlue to-transparent" />
                  <div className="space-y-10">
                    {timeline.map((entry, index) => (
                      <motion.article
                        key={`${entry.year ?? "timeline"}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="relative border-l border-brand-deepBlue/60 pl-6"
                      >
                        <span className="absolute -left-2 top-2 h-3 w-3 rounded-full border border-brand-gold bg-brand-black" />
                        {entry.year && (
                          <p className="text-xs uppercase tracking-[0.4em] text-brand-gold">
                            {entry.year}
                          </p>
                        )}
                        {entry.title && (
                          <h3 className="mt-2 font-display text-2xl text-brand-ivory">
                            {entry.title}
                          </h3>
                        )}
                        {entry.description && (
                          <p className="mt-2 text-sm text-brand-gray">
                            {entry.description}
                          </p>
                        )}
                      </motion.article>
                    ))}
                  </div>
                </div>
              )}
            </Container>
          </motion.section>
        )}

        {(coreValues.length > 0 || differentiators.length > 0) && (
          <motion.section {...motionSectionProps}>
            <Container className="space-y-10">
              <div className="grid gap-6 lg:grid-cols-[0.6fr_1fr]">
                {(about.valuesSectionEyebrow ||
                  about.valuesSectionTitle ||
                  about.valuesSectionDescription ||
                  coreValues.length > 0) && (
                  <div className="space-y-4">
                    {about.valuesSectionEyebrow && (
                      <p className="text-xs uppercase tracking-[0.5em] text-brand-lightBlue">
                        {about.valuesSectionEyebrow}
                      </p>
                    )}
                    {about.valuesSectionTitle && (
                      <h2 className="font-display text-3xl text-brand-ivory">
                        {about.valuesSectionTitle}
                      </h2>
                    )}
                    {about.valuesSectionDescription && (
                      <p className="text-sm text-brand-gray">
                        {about.valuesSectionDescription}
                      </p>
                    )}
                    {coreValues.length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {coreValues.map((value) => (
                          <span
                            key={value}
                            className="rounded-full border border-brand-lightBlue/30 px-4 py-2 text-xs uppercase tracking-[0.25em] text-brand-lightBlue"
                          >
                            {value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {differentiators.length > 0 && (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {differentiators.map((item, index) => (
                      <article
                        key={`${item.title ?? "differentiator"}-${index}`}
                        className="glass-card premium-card p-5"
                      >
                        <p className="text-xs uppercase tracking-[0.3em] text-brand-gold">
                          {String(index + 1).padStart(2, "0")}
                        </p>
                        {item.title && (
                          <h3 className="mt-3 font-display text-xl text-brand-ivory">
                            {item.title}
                          </h3>
                        )}
                        {item.description && (
                          <p className="mt-2 text-sm text-brand-gray">
                            {item.description}
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </Container>
          </motion.section>
        )}

        {teamMembers.length > 0 && (
          <motion.section id="our-team" {...motionSectionProps}>
            <Container className="space-y-10">
              {(about.teamSectionEyebrow ||
                about.teamSectionTitle ||
                about.teamSectionDescription) && (
                <div className="space-y-3 text-center sm:text-left">
                  {about.teamSectionEyebrow && (
                    <p className="text-xs uppercase tracking-[0.5em] text-brand-lightBlue">
                      {about.teamSectionEyebrow}
                    </p>
                  )}
                  {about.teamSectionTitle && (
                    <h2 className="font-display text-3xl text-brand-ivory">
                      {about.teamSectionTitle}
                    </h2>
                  )}
                  {about.teamSectionDescription && (
                    <p className="text-sm text-brand-gray">
                      {about.teamSectionDescription}
                    </p>
                  )}
                </div>
              )}
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {teamMembers.map((member, index) => {
                  const photoUrl = getImageUrl(member.photo, 900);

                  return (
                    <article
                      key={`${member.name ?? "team-member"}-${index}`}
                      className="glass-card premium-card flex flex-col gap-5 p-6"
                    >
                      <div className="relative h-64 w-full overflow-hidden rounded-2xl">
                        {photoUrl && (
                          <Image
                            src={photoUrl}
                            alt={member.name ?? "Team portrait"}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="space-y-2">
                        {member.name && (
                          <h3 className="font-display text-2xl text-brand-ivory">
                            {member.name}
                          </h3>
                        )}
                        {member.role && (
                          <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">
                            {member.role}
                          </p>
                        )}
                        {member.bio && (
                          <p className="text-sm text-brand-gray">{member.bio}</p>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </Container>
          </motion.section>
        )}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<AboutPageProps> = async () => {
  const client = sanityClient;
  if (!client) {
    return {
      props: {
        about: null,
        hero: null,
      },
      revalidate: 60,
    };
  }

  const [about, hero] = await Promise.all([
    client.fetch<AboutInfo | null>(ABOUT_QUERY),
    fetchPageHero(ABOUT_PAGE_SLUG, client),
  ]);

  return {
    props: {
      about,
      hero: hero ?? null,
    },
    revalidate: 60,
  };
};
