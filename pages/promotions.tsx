import Head from "next/head";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useMemo, useState, type MouseEvent } from "react";

import { Container } from "@/components/Container";
import {
  PromotionsGrid,
  PromoBadge,
  PromotionModal,
  type PromotionCardContent,
} from "@/components/promotions";
import { cn } from "@/lib/cn";
import { type HeroPayload } from "@/lib/hero";
import {
  isPromotionActive,
  mapPromotionRecordToCardContent,
  type PromotionRecord,
} from "@/lib/promotionContent";
import { getPageHero } from "@/lib/mockData";
import { getPromotions } from "@/lib/api/promotions";

type PromotionsPageProps = {
  promotions: PromotionRecord[];
  hero: HeroPayload | null;
};

// Category section definition
type CategorySection = {
  name: string;
  anchor: string;
  promotions: PromotionCardContent[];
};

export default function PromotionsPage({
  promotions,
  hero,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [selectedPromotion, setSelectedPromotion] =
    useState<PromotionCardContent | null>(null);
  const [isPromotionOpen, setIsPromotionOpen] = useState(false);

  // Filter to active promotions only
  const activePromotions = useMemo(
    () => promotions.filter((promotion) => isPromotionActive(promotion)),
    [promotions]
  );

  // Group promotions by category and create sections
  const categorySections = useMemo(() => {
    const categoryMap = new Map<string, PromotionRecord[]>();

    activePromotions.forEach((promotion) => {
      const category = promotion.promotionType || "Other";
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)!.push(promotion);
    });

    // Convert to array of sections and sort by count (largest first)
    const sections: CategorySection[] = Array.from(categoryMap.entries())
      .sort((a, b) => b[1].length - a[1].length)
      .map(([name, promos]) => ({
        name,
        anchor: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        promotions: promos.map((p) => mapPromotionRecordToCardContent(p)),
      }));

    return sections;
  }, [activePromotions]);

  const handleNavClick = (
    event: MouseEvent<HTMLAnchorElement>,
    anchor: string
  ) => {
    event.preventDefault();
    const target = document.getElementById(anchor);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const totalPromotions = activePromotions.length;

  return (
    <>
      <Head>
        <title>Promotions | EliteSport</title>
        <meta
          name="description"
          content="Browse every active EliteSport promotion with responsive filters."
        />
      </Head>

      <div className="space-y-10 pb-20">
        {/* Hero Section */}
        <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="pt-24 pb-8 md:pt-32 md:pb-12">
            <div className="mx-auto max-w-3xl space-y-6 text-center">
              <h1 className="text-5xl font-light text-brand-ivory md:text-6xl lg:text-7xl">
                {hero?.title || "Exclusive Offers"}
              </h1>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-brand-gray md:text-xl">
                {hero?.subtitle || "Discover member-only promotions and discounts at our partner destinations."}
              </p>
              <p className="text-sm uppercase tracking-[0.4em] text-brand-gold">
                {totalPromotions} Active {totalPromotions === 1 ? "Promotion" : "Promotions"}
              </p>
            </div>
          </div>

          {/* Category Navigation */}
          {categorySections.length > 0 && (
            <div className="sticky top-24 z-30 flex w-full flex-wrap justify-center gap-3 border-b border-brand-deepBlue/50 bg-brand-black/95 px-2 py-4 pb-8 text-center backdrop-blur-sm md:static md:bg-transparent md:backdrop-blur-none">
              {categorySections.map((section) => (
                <a
                  key={section.anchor}
                  href={`#${section.anchor}`}
                  onClick={(event) => handleNavClick(event, section.anchor)}
                  className="rounded-full border border-brand-lightBlue/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-brand-ivory transition hover:border-brand-gold hover:text-brand-gold"
                >
                  {section.name}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Category Sections */}
        {categorySections.map((section) => (
          <PromotionCategorySection
            key={section.anchor}
            section={section}
            onSelectPromotion={(promotion) => {
              setSelectedPromotion(promotion);
              setIsPromotionOpen(true);
            }}
          />
        ))}

        {/* Empty State */}
        {categorySections.length === 0 && (
          <Container>
            <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl">
              <p className="text-brand-gray">No active promotions found. Please check back later.</p>
            </div>
          </Container>
        )}
      </div>

      {/* Promotion Modal */}
      <PromotionModal
        promotion={selectedPromotion}
        isOpen={isPromotionOpen}
        onClose={() => {
          setIsPromotionOpen(false);
          setSelectedPromotion(null);
        }}
      />
    </>
  );
}

// Category Section Component
const PromotionCategorySection = ({
  section,
  onSelectPromotion,
}: {
  section: CategorySection;
  onSelectPromotion: (promotion: PromotionCardContent) => void;
}) => {
  const promoCount =
    section.promotions.length === 1
      ? "1 Offer"
      : `${section.promotions.length} Offers`;

  return (
    <section
      id={section.anchor}
      className="scroll-mt-32 transition-colors duration-500"
    >
      <Container className="space-y-7">
        {/* Section Header */}
        <div className="space-y-3 text-center sm:text-left">
          <p className="text-xs uppercase tracking-[0.4em] text-brand-lightBlue">
            Category
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl text-brand-ivory sm:text-4xl">
                {section.name}
              </h2>
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-gold flex-shrink-0">
              {promoCount}
            </span>
          </div>
        </div>

        {/* Promotions Grid */}
        {section.promotions.length > 0 ? (
          <PromotionsGrid
            promotions={section.promotions}
            onSelect={onSelectPromotion}
          />
        ) : (
          <p className="glass-card border border-dashed border-white/25 px-6 py-8 text-center text-sm text-brand-gray">
            No promotions in this category.
          </p>
        )}
      </Container>
    </section>
  );
};

export const getStaticProps: GetStaticProps<PromotionsPageProps> = async () => {
  // Fetch all promotions from API (sorted by date, newest first)
  const promotions = await getPromotions();
  const hero = getPageHero("promotions");

  return {
    props: {
      promotions,
      hero: hero ?? null,
    },
    revalidate: 60,
  };
};
