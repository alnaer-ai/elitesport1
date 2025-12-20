import Head from "next/head";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useMemo, useState } from "react";

import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import {
  PromotionsGrid,
  PromoBadge,
  PromotionModal,
  type PromotionCardContent,
} from "@/components/promotions";
import { cn } from "@/lib/cn";
import { fetchPageHero, type HeroPayload } from "@/lib/hero";
import {
  isPromotionActive,
  mapPromotionRecordToCardContent,
  type PromotionRecord,
} from "@/lib/promotionContent";
import { getPromotionTypeLabel } from "@/lib/promotionLabels";
import { sanityClient } from "@/lib/sanity.client";
import { ALL_ACTIVE_PROMOTIONS_QUERY } from "@/lib/promotionQueries";

type PromotionsPageProps = {
  promotions: PromotionRecord[];
  hero: HeroPayload | null;
};

const PROMOTIONS_PAGE_QUERY = ALL_ACTIVE_PROMOTIONS_QUERY;
const PROMOTIONS_PAGE_SLUG = "promotions";

export default function PromotionsPage({
  promotions,
  hero,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPromotion, setSelectedPromotion] =
    useState<PromotionCardContent | null>(null);
  const [isPromotionOpen, setIsPromotionOpen] = useState(false);

  const activePromotions = useMemo(
    () => promotions.filter((promotion) => isPromotionActive(promotion)),
    [promotions]
  );

  const promotionCategories = useMemo(() => {
    const set = new Set<string>();
    activePromotions.forEach((promotion) => {
      if (promotion.promotionType) {
        set.add(promotion.promotionType);
      }
    });
    return Array.from(set);
  }, [activePromotions]);

  const filteredPromotions = useMemo(() => {
    if (selectedCategory === "all") {
      return activePromotions;
    }
    return activePromotions.filter(
      (promotion) => promotion.promotionType === selectedCategory
    );
  }, [activePromotions, selectedCategory]);

  const promotionCards: PromotionCardContent[] = useMemo(
    () => filteredPromotions.map((promotion) => mapPromotionRecordToCardContent(promotion)),
    [filteredPromotions]
  );

  const activeCategoryLabel =
    selectedCategory === "all"
      ? "All Promotions"
      : getPromotionTypeLabel(selectedCategory) ?? selectedCategory;

  return (
    <>
      <Head>
        <title>Promotions | EliteSport</title>
        <meta
          name="description"
          content="Browse every active EliteSport promotion with responsive filters and CMS-powered content."
        />
      </Head>

      <div className="space-y-10 pb-20">
        <Hero hero={hero} />
        {promotionCategories.length > 0 && (
          <Container className="flex flex-wrap gap-2.5 border-b border-brand-deepBlue/40 pb-8">
            <PromoBadge label="Active Now" tone="outline" />
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] transition",
                selectedCategory === "all"
                  ? "border-brand-gold bg-brand-gold text-brand-black"
                  : "border-brand-lightBlue/30 bg-brand-black/60 text-brand-ivory hover:border-brand-gold/50"
              )}
            >
              All
            </button>
            {promotionCategories.map((category) => {
              const label = getPromotionTypeLabel(category) ?? category;
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] transition",
                    isActive
                      ? "border-brand-gold bg-brand-gold text-brand-black"
                      : "border-brand-lightBlue/30 bg-brand-black/60 text-brand-ivory hover:border-brand-gold/50"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </Container>
        )}

        <Container className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-brand-lightBlue">
                {activeCategoryLabel}
              </p>
              <h2 className="text-2xl text-brand-ivory sm:text-3xl">
                {filteredPromotions.length === 0 ? (
                  "No Promotions"
                ) : (
                  <>
                    {filteredPromotions.length}{" "}
                    {filteredPromotions.length === 1
                      ? "Promotion"
                      : "Promotions"}
                  </>
                )}
              </h2>
            </div>
          </div>
          {promotionCards.length > 0 ? (
            <PromotionsGrid
              promotions={promotionCards}
              onSelect={(promotion) => {
                setSelectedPromotion(promotion);
                setIsPromotionOpen(true);
              }}
            />
          ) : (
            <p className="glass-card border border-dashed border-white/25 px-6 py-8 text-center text-sm text-brand-gray">
              No active promotions match this filter. Adjust categories or
              publish a new promotion in Sanity.
            </p>
          )}
        </Container>
      </div>
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

export const getServerSideProps: GetServerSideProps<
  PromotionsPageProps
> = async () => {
  const client = sanityClient;

  if (!client) {
    return {
      props: { promotions: [], hero: null },
    };
  }

  try {
    const [promotions, hero] = await Promise.all([
      client.fetch<PromotionRecord[]>(PROMOTIONS_PAGE_QUERY),
      fetchPageHero(PROMOTIONS_PAGE_SLUG, client),
    ]);

    return {
      props: {
        promotions: promotions ?? [],
        hero: hero ?? null,
      },
    };
  } catch (error) {
    console.error("Failed to fetch promotions page content", error);
  }

  return {
    props: {
      promotions: [],
      hero: null,
    },
  };
};
