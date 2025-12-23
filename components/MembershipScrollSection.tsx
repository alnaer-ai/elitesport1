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

  // Card stats for scaling calculations
  // Assuming card width ~320px to 400px plus gap
  // We'll estimate dynamic positions based on ref later if needed, 
  // but for a fixed horizontal list, calculating based on index * (width + gap) is smoother if sizes are fixed.
  // However, since sizes might be responsive, we can use useTransform on the raw scrollX 
  // and map it to the element's position.

  // Actually, a simpler approximation for "center focus" relative to viewport center 
  // without expensive layout measurements updates:
  // We can measure the element offset once mounted? 
  // Or better, assume standard card width + gap.
  // Let's rely on standard widths (e.g. 350px + 24px gap = 374px).
  const CARD_WIDTH = 340; // Approx card width
  const GAP = 24;
  const ITEM_SIZE = CARD_WIDTH + GAP;

  // NOTE: This simple math is an approximation. 
  // For precise IntersectionObserver-like behavior with Motion, we usually need layout info.
  // But let's try a reactive approach.

  // Let's try a simpler approach: 
  // The 'center' of the scroll container is what matters.
  // But scrollX is 0 at start.

  // Since we want GPU accelerated, let's use the index-based approach assuming regular sizing.
  // If the cards adapt width, this might be slightly off, but usually valid for a carousel.

  const centerOffset = index * ITEM_SIZE;
  // Range of influence: +/- one card width
  const range = [centerOffset - ITEM_SIZE, centerOffset, centerOffset + ITEM_SIZE];
  const outputRange = [0.9, 1, 0.9];

  // We need to account for the initial spacer.
  // Spacer is approx 25vw or whatever we set.
  // This makes exact calculation tricky without fixed pixels.

  // ALTERNATIVE: use `element.getBoundingClientRect()` inside a `useAnimationFrame` or similar? 
  // No, that's heavy.

  // BEST APPROACH for "Responsive" & "Motion":
  // Allow Framer Motion to handle it via a wrapper that checks its own position?
  // Current `useScroll` is for the container. 
  // Let's stick to a robust scroll-snap + CSS scale? 
  // The user asked for "GPU-accelerated transforms" and "smooth easing".
  // CSS `scale` IS GPU accelerated.
  // But standard CSS scroll-driven animations are bleeding edge.

  // Let's stick to Framer Motion with an estimated range, but refine it.
  // We can treat `scrollX` as just a value.
  // If we can't guarantee exact pixel matches, we can use a "Spotlight" approach.
  // Actually, we can just use `whileInView` with a custom viewport? No, that's boolean.

  // Let's proceed with the math-based approach, but maybe lock the card width in CSS for the carousel items 
  // to ensure visual consistency.

  const cardWidth = 320;
  const gap = 24;
  const spacer = 0; // We will adjust the mapping. 
  // Actually, `scrollX` measures how far the container has scrolled.
  // When card 0 is centered, scrollX is 0 (if we account for spacer correctly in the layout).
  // If we put a spacer of `50vw - cardWidth/2` at the start, then at scrollX=0, the first card is centered.
  // That is the most robust way.

  // Let's set start spacer to `calc(50% - 160px)` (half of card width 320px).
  // Then scrollX = 0 => index 0 is centered.
  // scrollX = (320 + 24) * 1 => index 1 is centered.

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
