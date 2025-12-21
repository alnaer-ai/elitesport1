import Head from "next/head";
import Image from "next/image";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { motion } from "framer-motion";

import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { cn } from "@/lib/cn";
import { type HeroPayload } from "@/lib/hero";
import {
  getPageHero,
  getClientPartners,
  type ClientPartner,
} from "@/lib/mockData";

type PartnersClientsPageProps = {
  entries: ClientPartner[];
  hero: HeroPayload | null;
};

const gridAnimation = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardAnimation = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function PartnersClientsPage({
  entries,
  hero,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const partners = entries.filter((entry) => entry.category === "partner");
  const clients = entries.filter((entry) => entry.category === "client");

  return (
    <>
      <Head>
        <title>Partners &amp; Clients | EliteSport</title>
        <meta
          name="description"
          content="Explore the brands, hotels, and private clubs partnering with EliteSport worldwide."
        />
      </Head>

      <div className="space-y-10 pb-20">
        <Hero hero={hero} />
        <LogoGridSection
          title="Partners"
          eyebrow="Global Collaborators"
          description="Elite hospitality groups, wellness pioneers, and sport innovators partnering with us to craft elevated guest experiences."
          items={partners}
          emptyState="Partners will display here."
          cardClassName="text-brand-ivory/90 [--glass-glow:rgba(125,190,220,0.12)]"
        />
        <LogoGridSection
          title="Clients"
          eyebrow="Trusted Clients"
          description="Members, private families, and executive teams who count on EliteSport to deliver seamless training itineraries."
          items={clients}
          emptyState="Client entries will display here."
          cardClassName="text-brand-ivory/80 [--glass-glow:rgba(197,163,91,0.12)]"
        />
      </div>
    </>
  );
}

const LogoGridSection = ({
  title,
  eyebrow,
  description,
  items,
  emptyState,
  cardClassName,
}: {
  title: string;
  eyebrow: string;
  description: string;
  items: ClientPartner[];
  emptyState: string;
  cardClassName: string;
}) => {
  return (
    <section>
      <Container className="space-y-8">
        <div className="space-y-3 text-center md:text-left">
          <p className="text-xs uppercase tracking-[0.4em] text-brand-lightBlue">{eyebrow}</p>
          <h2 className="text-3xl text-brand-ivory sm:text-4xl">{title}</h2>
          <p className="text-base text-brand-gray/90 sm:max-w-3xl">{description}</p>
        </div>
        {items.length > 0 ? (
          <motion.div
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={gridAnimation}
          >
            {items.map((item) => (
              <LogoCard key={item._id} item={item} cardClassName={cardClassName} />
            ))}
          </motion.div>
        ) : (
          <p className="glass-card-minimal border border-dashed border-white/10 px-6 py-8 text-center text-sm text-brand-gray">
            {emptyState}
          </p>
        )}
      </Container>
    </section>
  );
};

const LogoCard = ({
  item,
  cardClassName,
}: {
  item: ClientPartner;
  cardClassName: string;
}) => {
  const logoUrl = item.logoUrl;
  const Wrapper = item.website ? "a" : "div";
  const wrapperProps = item.website
    ? {
        href: item.website,
        target: "_blank",
        rel: "noreferrer noopener",
        "aria-label": item.name ? `Visit ${item.name}` : undefined,
      }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        "block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lightBlue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black",
        item.website ? "group" : "cursor-default"
      )}
    >
      <motion.article
        className={cn(
          "logo-card-clean premium-card flex min-h-[14rem] flex-col items-center justify-center gap-3.5 px-4 py-6 text-center text-sm font-semibold transition",
          cardClassName
        )}
        variants={cardAnimation}
        whileHover={item.website ? { scale: 1.02 } : undefined}
      >
        {logoUrl ? (
          <div className="flex w-full justify-center">
            <div className="relative h-40 w-40 overflow-hidden rounded-xl bg-white p-4 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]">
              <Image
                src={logoUrl}
                alt={item.logoAlt ?? item.name ?? "Brand logo"}
                fill
                sizes="176px"
                className="object-contain"
              />
            </div>
          </div>
        ) : (
          item.name ?? "Featured Brand"
        )}
        <div>
          <p className="text-base text-brand-ivory">
            {item.name ?? "EliteSport Brand"}
          </p>
          {item.website && (
            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-brand-gold">
              Visit Site
            </p>
          )}
        </div>
      </motion.article>
    </Wrapper>
  );
};

export const getStaticProps: GetStaticProps<PartnersClientsPageProps> = async () => {
  const entries = getClientPartners();
  const hero = getPageHero("partners-clients");

  return {
    props: {
      entries,
      hero: hero ?? null,
    },
    revalidate: 60,
  };
};
