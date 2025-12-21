import Head from "next/head";
import Image from "next/image";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { motion } from "framer-motion";

import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { type HeroPayload } from "@/lib/hero";
import { getPageHero, getAboutInfo, type AboutInfo } from "@/lib/mockData";

type AboutPageProps = {
  about: AboutInfo | null;
  pageHero: HeroPayload | null;
};

const motionSectionProps = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
};

export default function AboutPage({
  about,
  pageHero,
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
              About page content is not yet available.
            </p>
          </Container>
        </div>
      </>
    );
  }

  const differentiators = (about.differentiators ?? []).filter(
    (item) => item.title || item.description
  );
  const coreValues = about.coreValues ?? [];

  const missionImageUrl = about.missionImageUrl;
  const visionImageUrl = about.visionImageUrl;

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
        <Hero hero={pageHero} />

        {(about.missionStatement ||
          about.vision ||
          missionImageUrl ||
          visionImageUrl ||
          about.missionSectionEyebrow ||
          about.missionSectionTitle) && (
          <motion.section {...motionSectionProps}>
            <Container className="space-y-16">
              {/* Mission Section */}
              {(about.missionStatement || missionImageUrl || about.missionSectionEyebrow || about.missionSectionTitle) && (
                <div className="space-y-8">
                  {/* Mission Section Header */}
                  {(about.missionSectionEyebrow || about.missionSectionTitle) && (
                    <div className="space-y-4 text-center lg:text-left">
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
                    </div>
                  )}
                  
                  {/* Mission Content: Text and Image separated */}
                  <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
                    {/* Mission Text Card */}
                    {about.missionStatement && (
                      <article className="glass-card premium-card p-6 lg:p-8 flex flex-col">
                        <div className="space-y-4 flex-1 flex flex-col justify-center items-center text-center">
                          <h3 className="text-2xl sm:text-3xl uppercase tracking-[0.4em] text-brand-gold">
                            Mission
                          </h3>
                          <p className="text-[1.3125rem] text-brand-gray leading-relaxed">
                            {about.missionStatement}
                          </p>
                        </div>
                      </article>
                    )}
                    
                    {/* Mission Image Card */}
                    {missionImageUrl && (
                      <article className="glass-card premium-card p-0 overflow-hidden">
                        <div className="relative aspect-[4/3] w-full">
                          <Image
                            src={missionImageUrl}
                            alt="Mission visual"
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover"
                          />
                        </div>
                      </article>
                    )}
                  </div>
                </div>
              )}

              {/* Vision Section */}
              {(about.vision || visionImageUrl) && (
                <div className="space-y-8">
                  {/* Vision Content: Image and Text separated (reversed order) */}
                  <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
                    {/* Vision Image Card */}
                    {visionImageUrl && (
                      <article className="glass-card premium-card p-0 overflow-hidden order-1 lg:order-1">
                        <div className="relative aspect-[4/3] w-full">
                          <Image
                            src={visionImageUrl}
                            alt="Vision visual"
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover"
                          />
                        </div>
                      </article>
                    )}
                    
                    {/* Vision Text Card */}
                    {about.vision && (
                      <article className="glass-card premium-card p-6 lg:p-8 flex flex-col order-2 lg:order-2">
                        <div className="space-y-4 flex-1 flex flex-col justify-center items-center text-center">
                          <h3 className="text-2xl sm:text-3xl uppercase tracking-[0.4em] text-brand-gold">
                            Vision
                          </h3>
                          <p className="text-[1.3125rem] text-brand-gray leading-relaxed">
                            {about.vision}
                          </p>
                        </div>
                      </article>
                    )}
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
