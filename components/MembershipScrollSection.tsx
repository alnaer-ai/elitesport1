import { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import { MembershipCard } from "./MembershipCard";
import { Container } from "./Container";
import { ButtonLink } from "./ButtonLink";
import { cn } from "@/lib/cn";
import { type MembershipTier } from "@/lib/membership";

type MembershipScrollSectionProps = {
  tiers: MembershipTier[];
  allTiersCount: number;
};

export function MembershipScrollSection({
  tiers,
  allTiersCount,
}: MembershipScrollSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { scrollX } = useScroll({ container: scrollContainerRef });

  return (
    <section className="py-20 bg-brand-deepBlue/20 overflow-hidden">
      <Container className="space-y-10">
        <div className="space-y-4 text-center md:text-left">
          <p className="text-xs uppercase tracking-[0.4em] text-brand-lightBlue">
            Membership Tiers
          </p>
          <h2 className="text-3xl text-brand-ivory sm:text-4xl">
            Unlock Elite Access
          </h2>
          <p className="text-base text-brand-gray/90 sm:max-w-3xl">
            Choose the membership level that fits your training needs and lifestyle.
          </p>
        </div>

        <div className="relative -mx-4 md:-mx-8">
          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className={cn(
              "flex overflow-x-auto snap-x snap-mandatory scrollbar-hide py-10 px-4 md:px-0",
              "md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:snap-none md:py-0",
              "cursor-grab active:cursor-grabbing md:cursor-auto",
              "content-start items-center"
            )}
            style={{
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch"
            }}
          >
            {/* Spacer for centering start - hidden on desktop */}
            <div className="w-[10vw] flex-shrink-0 md:hidden" />

            {tiers.map((tier, index) => (
              <ScalableMembershipCard
                key={tier.name ?? index}
                tier={tier}
                index={index}
                scrollX={scrollX}
                totalItems={tiers.length}
              />
            ))}

            {/* Spacer for centering end - hidden on desktop */}
            <div className="w-[10vw] flex-shrink-0 md:hidden" />
          </div>

          {/* Fade Effects - hidden on desktop */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-brand-black/90 to-transparent pointer-events-none md:hidden" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-brand-black/90 to-transparent pointer-events-none md:hidden" />
        </div>

        {allTiersCount > 3 && (
          <div className="flex justify-center pt-4">
            <ButtonLink href="/memberships" variant="secondary">
              View All Tiers
            </ButtonLink>
          </div>
        )}
      </Container>
    </section>
  );
}

function ScalableMembershipCard({
  tier,
  index,
  scrollX,
  totalItems,
}: {
  tier: MembershipTier;
  index: number;
  scrollX: MotionValue<number>;
  totalItems: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const cardWidth = 320;
  const gap = 24;
  const step = cardWidth + gap;
  const target = index * step;

  const scale = useTransform(
    scrollX,
    [target - step, target, target + step],
    [0.9, 1, 0.9]
  );

  const opacity = useTransform(
    scrollX,
    [target - step, target, target + step],
    [0.6, 1, 0.6]
  );

  return (
    <motion.div
      ref={cardRef}
      style={{
        scale,
        opacity,
      }}
      className="snap-center flex-shrink-0 md:!scale-100 md:!opacity-100 md:w-full"
    >
      <div className="w-[320px] md:w-full">
        <MembershipCard tier={tier} index={index} />
      </div>
    </motion.div>
  );
}

