import Head from "next/head";
import Image from "next/image";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { motion, Variants } from "framer-motion";
import Link from "next/link";

import { Container } from "@/components/Container";
import { cn } from "@/lib/cn";
import {
  getPartnersAndClients,
  type PartnerClientEntry,
} from "@/lib/api/partnersClients";

type PartnersClientsPageProps = {
  entries: PartnerClientEntry[];
};


const gridAnimation = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cardAnimation: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.4, 0.55, 1] }
  },
};

export default function PartnersClientsPage({
  entries,

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

      <div className="space-y-16 pb-24 md:space-y-24">


        <LogoGridSection
          title="Partners"
          eyebrow="Global Collaborators"
          description="Elite hospitality groups, wellness pioneers, and sport innovators partnering with us to craft elevated guest experiences."
          items={partners}
          emptyState="Partners will display here."
        />

        <LogoGridSection
          title="Clients"
          eyebrow="Trusted Clients"
          description="Members, private families, and executive teams who count on EliteSport to deliver seamless training itineraries."
          items={clients}
          emptyState="Client entries will display here."
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
}: {
  title: string;
  eyebrow: string;
  description: string;
  items: PartnerClientEntry[];
  emptyState: string;
}) => {
  return (
    <section>
      <Container className="space-y-12">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-brand-gold">
            {eyebrow}
          </p>
          <h2 className="text-3xl font-light text-brand-ivory sm:text-4xl md:text-5xl">
            {title}
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-brand-gray/80 sm:text-lg">
            {description}
          </p>
        </div>

        {items.length > 0 ? (
          <motion.div
            className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={gridAnimation}
          >
            {items.map((item) => (
              <LogoCard key={item._id} item={item} />
            ))}
          </motion.div>
        ) : (
          <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-sm text-brand-gray/60">
            {emptyState}
          </div>
        )}
      </Container>
    </section>
  );
};

const LogoCard = ({
  item,
}: {
  item: PartnerClientEntry;
}) => {
  const logoUrl = item.logoUrl;
  const isPartner = item.category === "partner";

  // Clean up filename for display: remove extension and replace hyphens/underscores with spaces
  const displayName = item.name
    ? item.name.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, "")
    : "Brand";

  const CardContent = (
    <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-white p-8 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-brand-gold/10 lg:p-10">
      <div className="relative h-full w-full">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={item.logoAlt ?? displayName}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-contain transition-transform duration-500 ease-out will-change-transform group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-brand-black/20">
            <span className="sr-only">{displayName}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      variants={cardAnimation}
      className={cn(
        "group relative",
        isPartner && "cursor-pointer"
      )}
      whileHover={isPartner ? { y: -5 } : {}}
    >
      {isPartner ? (
        <Link href="/places" className="block h-full w-full">
          {CardContent}
        </Link>
      ) : (
        CardContent
      )}
    </motion.div>
  );
};

export const getStaticProps: GetStaticProps<PartnersClientsPageProps> = async () => {
  // Fetch partners and clients from API
  const entries = await getPartnersAndClients();

  return {
    props: {
      entries,
    },
    revalidate: 60,
  };
};

