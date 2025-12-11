import Head from "next/head";
import Image from "next/image";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { motion } from "framer-motion";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { sanityClient, urlForImage } from "@/lib/sanity.client";

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
  heroEyebrow?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroImage?: SanityImageSource;
  companyDescription?: string;
  missionStatement?: string;
  missionImage?: SanityImageSource;
  vision?: string;
  visionImage?: SanityImageSource;
  storyHeading?: string;
  storyIntro?: string;
  timeline?: TimelineEntry[];
  teamMembers?: TeamMember[];
  coreValues?: string[];
  differentiators?: Differentiator[];
};

type AboutPageProps = {
  about: AboutInfo | null;
};

const ABOUT_QUERY = `
  *[_type == "aboutInfo"][0]{
    heroEyebrow,
    heroTitle,
    heroDescription,
    heroImage,
    companyDescription,
    missionStatement,
    missionImage,
    vision,
    visionImage,
    storyHeading,
    storyIntro,
    timeline[]{year,title,description},
    teamMembers[]{name,role,bio,photo},
    coreValues,
    differentiators[]{title,description}
  }
`;

const motionSectionProps = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const fallbacks = {
  heroImage:
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=2400&q=80",
  missionImage:
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=80",
  visionImage:
    "https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?auto=format&fit=crop&w=1600&q=80",
  teamPhoto:
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
};

const defaultTimeline: TimelineEntry[] = [
  {
    year: "2014",
    title: "Origins",
    description:
      "EliteSport launches as an invitation-only coaching collective for professional athletes.",
  },
  {
    year: "2019",
    title: "Global Residences",
    description:
      "We expand into private performance residences across Europe, the Middle East, and Asia.",
  },
  {
    year: "2023",
    title: "Holistic Ecosystem",
    description:
      "Integrated recovery, hospitality partnerships, and a concierge team deliver end-to-end care.",
  },
];

const defaultDifferentiators: Differentiator[] = [
  {
    title: "Performance Residences",
    description:
      "Flagship destinations with altitude labs, hydrotherapy suites, and chefs dedicated to member protocols.",
  },
  {
    title: "Concierge-Level Care",
    description:
      "Athletic directors, medical partners, and travel curators coordinate seamless itineraries and daily rituals.",
  },
  {
    title: "Data-Informed Design",
    description:
      "Motion capture, metabolic diagnostics, and bespoke training blueprints evolve with every visit.",
  },
];

const defaultTeam: TeamMember[] = [
  {
    name: "Sofia Lemaire",
    role: "Founder & Creative Director",
    bio: "Leads the brand narrative and curates the design language of every EliteSport residence worldwide.",
  },
  {
    name: "Dr. Xavier Holt",
    role: "Chief Performance Officer",
    bio: "Oversees sports scientists, recovery leads, and multidisciplinary coaches across all locations.",
  },
  {
    name: "Mara Quinn",
    role: "Member Experience Director",
    bio: "Architects bespoke journeys for each member, from onboarding rituals to global event access.",
  },
];

const defaultValues = [
  "Human-led hospitality",
  "Precision wellness",
  "Timeless design",
  "Confidentiality",
  "Impactful partnerships",
];

const getImageUrl = (source?: SanityImageSource, width = 2000) => {
  if (!source) {
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
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const heroEyebrow = about?.heroEyebrow ?? "EliteSport";
  const heroTitle = about?.heroTitle ?? "About EliteSport";
  const heroDescription =
    about?.heroDescription ??
    "EliteSport crafts immersive wellness destinations, concierge training labs, and hospitality-grade recovery for modern leaders.";
  const companyDescription =
    about?.companyDescription ??
    "We are storytellers of movement, curating tailored performance programs, architectural training suites, and cultural experiences that reinforce calm, focus, and longevity.";

  const missionStatement =
    about?.missionStatement ??
    "To choreograph every member touchpoint—from data-led assessments to the scent of the lounge—into a ritual that inspires high performance without the chaos.";
  const visionStatement =
    about?.vision ??
    "To build the most coveted network of performance houses across the globe, where wellness, art, and hospitality converge.";

  const timeline = (about?.timeline ?? defaultTimeline).filter(
    (entry) => entry.year || entry.title || entry.description
  );
  const differentiators = (
    about?.differentiators ?? defaultDifferentiators
  ).filter((item) => item.title || item.description);
  const teamMembers = (about?.teamMembers ?? defaultTeam).filter(
    (member) => member.name || member.role
  );
  const coreValues = about?.coreValues?.length
    ? about.coreValues
    : defaultValues;

  const heroImageUrl = getImageUrl(about?.heroImage, 2400) ?? fallbacks.heroImage;
  const missionImageUrl =
    getImageUrl(about?.missionImage, 1800) ?? fallbacks.missionImage;
  const visionImageUrl =
    getImageUrl(about?.visionImage, 1800) ?? fallbacks.visionImage;

  const handleScrollTo = (id: string) => {
    if (typeof window === "undefined") return;
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Head>
        <title>About EliteSport</title>
        <meta
          name="description"
          content="Discover the mission, story, and team shaping EliteSport's luxury performance residences worldwide."
        />
      </Head>

      <div className="space-y-20 pb-24">
        <motion.section
          className="relative isolate overflow-hidden border-b border-brand-deepBlue/70"
          {...motionSectionProps}
        >
          <Image
            src={heroImageUrl}
            alt="EliteSport bespoke wellness house"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black/95 via-brand-black/80 to-brand-deepBlue/60" />
          <Container className="relative z-10 py-24 sm:py-32">
            <div className="space-y-8 max-w-3xl">
              <p className="text-xs uppercase tracking-[0.6em] text-brand-gold">
                {heroEyebrow}
              </p>
              <div>
                <h1 className="font-display text-4xl font-semibold text-brand-ivory sm:text-5xl lg:text-6xl">
                  {heroTitle}
                </h1>
                <p className="mt-4 text-base text-brand-gray sm:text-lg">
                  {heroDescription}
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button onClick={() => handleScrollTo("our-story")}>
                  Discover Our Story
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleScrollTo("our-team")}
                >
                  Meet The Team
                </Button>
              </div>
            </div>
          </Container>
        </motion.section>

        <motion.section {...motionSectionProps}>
          <Container className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.5em] text-brand-lightBlue">
                Our Mission & Vision
              </p>
              <h2 className="font-display text-3xl text-brand-ivory sm:text-4xl">
                Precision wellness narratives shaped for the modern traveler.
              </h2>
              <p className="text-base text-brand-gray">{companyDescription}</p>
            </div>
            <div className="grid gap-6">
              <article className="rounded-3xl border border-brand-deepBlue/60 bg-gradient-to-br from-brand-deepBlue/70 to-brand-black p-6 shadow-lg shadow-brand-black/50">
                <p className="text-xs uppercase tracking-[0.4em] text-brand-gold">
                  Mission
                </p>
                <p className="mt-3 text-sm text-brand-gray">{missionStatement}</p>
                <div className="mt-5 relative h-48 w-full overflow-hidden rounded-2xl">
                  <Image
                    src={missionImageUrl}
                    alt="Mission visual"
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </article>
              <article className="rounded-3xl border border-brand-deepBlue/60 bg-gradient-to-br from-brand-black to-brand-deepBlue/60 p-6 shadow-lg shadow-brand-black/50">
                <p className="text-xs uppercase tracking-[0.4em] text-brand-gold">
                  Vision
                </p>
                <p className="mt-3 text-sm text-brand-gray">{visionStatement}</p>
                <div className="mt-5 relative h-48 w-full overflow-hidden rounded-2xl">
                  <Image
                    src={visionImageUrl}
                    alt="Vision visual"
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </article>
            </div>
          </Container>
        </motion.section>

        <motion.section id="our-story" {...motionSectionProps}>
          <Container className="space-y-10">
            <div className="space-y-4 text-center sm:text-left">
              <p className="text-xs uppercase tracking-[0.5em] text-brand-lightBlue">
                {about?.storyHeading ?? "Our Story"}
              </p>
              <h2 className="font-display text-3xl text-brand-ivory sm:text-4xl">
                {about?.storyIntro ??
                  "Every EliteSport house is crafted like a cinematic chapter—balancing ritual, performance, and refined comfort."}
              </h2>
            </div>
            <div className="relative pl-6">
              <span className="absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-gold via-brand-lightBlue to-transparent" />
              <div className="space-y-10">
                {timeline.map((entry, index) => (
                  <motion.article
                    key={`${entry.year}-${entry.title}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="relative border-l border-brand-deepBlue/60 pl-6"
                  >
                    <span className="absolute -left-2 top-2 h-3 w-3 rounded-full border border-brand-gold bg-brand-black" />
                    <p className="text-xs uppercase tracking-[0.4em] text-brand-gold">
                      {entry.year}
                    </p>
                    <h3 className="mt-2 font-display text-2xl text-brand-ivory">
                      {entry.title}
                    </h3>
                    <p className="mt-2 text-sm text-brand-gray">
                      {entry.description}
                    </p>
                  </motion.article>
                ))}
              </div>
            </div>
          </Container>
        </motion.section>

        <motion.section {...motionSectionProps}>
          <Container className="space-y-10">
            <div className="grid gap-6 lg:grid-cols-[0.6fr_1fr]">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.5em] text-brand-lightBlue">
                  Our Values
                </p>
                <h2 className="font-display text-3xl text-brand-ivory">
                  Guiding principles we live by in every city.
                </h2>
                <p className="text-sm text-brand-gray">
                  Each residence is choreographed with sensory balance—detailing, scent,
                  lighting, and art—to create environments that calm the mind and prime
                  the body for meaningful work or recovery.
                </p>
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
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {differentiators.map((item, index) => (
                  <article
                    key={`${item.title}-${index}`}
                    className="rounded-3xl border border-brand-deepBlue/50 bg-brand-black/80 p-5 shadow-lg shadow-brand-black/40"
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-brand-gold">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-3 font-display text-xl text-brand-ivory">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-brand-gray">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </Container>
        </motion.section>

        <motion.section id="our-team" {...motionSectionProps}>
          <Container className="space-y-10">
            <div className="space-y-3 text-center sm:text-left">
              <p className="text-xs uppercase tracking-[0.5em] text-brand-lightBlue">
                Our Team
              </p>
              <h2 className="font-display text-3xl text-brand-ivory">
                The curators behind every EliteSport experience.
              </h2>
              <p className="text-sm text-brand-gray">
                From master trainers and medical partners to hospitality veterans, our
                collective champions members across each journey.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member, index) => {
                const photoUrl =
                  getImageUrl(member.photo, 900) ?? `${fallbacks.teamPhoto}&sig=${index}`;

                return (
                  <article
                    key={`${member.name}-${index}`}
                    className="flex flex-col gap-5 rounded-3xl border border-brand-deepBlue/50 bg-brand-black/70 p-6 shadow-lg shadow-brand-black/40"
                  >
                    <div className="relative h-64 w-full overflow-hidden rounded-2xl">
                      <Image
                        src={photoUrl}
                        alt={member.name ?? "Team portrait"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-display text-2xl text-brand-ivory">
                        {member.name}
                      </h3>
                      <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">
                        {member.role}
                      </p>
                      <p className="text-sm text-brand-gray">{member.bio}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </Container>
        </motion.section>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<AboutPageProps> = async () => {
  const about = await sanityClient.fetch<AboutInfo | null>(ABOUT_QUERY);

  return {
    props: {
      about,
    },
    revalidate: 60,
  };
};
