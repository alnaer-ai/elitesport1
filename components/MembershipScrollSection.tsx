import { useRef, useState, useEffect, useCallback, ReactNode } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { MembershipCard } from "./MembershipCard";
import { Container } from "./Container";
import { ButtonLink } from "./ButtonLink";
import { cn } from "@/lib/cn";
import { type MembershipTier } from "@/lib/membership";

// Configuration constants
const SCROLL_SENSITIVITY = 1.2; // How fast the horizontal scroll responds to vertical scroll
const ESCAPE_VELOCITY_THRESHOLD = 50; // Pixels per 100ms to escape scroll lock
const MOBILE_BREAKPOINT = 768;
const TRANSITION_DURATION = 0.6;

type MembershipScrollSectionProps = {
  tiers: MembershipTier[];
  allTiersCount: number;
};

/**
 * MembershipScrollSection - Premium scroll-jacking experience
 * 
 * Implements a controlled scroll where vertical scrolling is converted to
 * horizontal tier revelation. Once all tiers are viewed, scroll is released.
 * 
 * Accessibility features:
 * - Fast scroll escape (velocity-based)
 * - Touch-friendly on mobile
 * - Keyboard navigation support
 * - Respects prefers-reduced-motion
 */
export function MembershipScrollSection({
  tiers,
  allTiersCount,
}: MembershipScrollSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // State for scroll control
  const [isLocked, setIsLocked] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const enableScrollExperience = isMobile && !prefersReducedMotion;

  // Motion values for smooth animations
  const scrollProgress = useMotionValue(0);
  const cardIndex = useMotionValue(0);

  // Velocity tracking for escape mechanism
  const lastScrollTime = useRef(0);
  const lastScrollY = useRef(0);
  const velocityHistory = useRef<number[]>([]);

  // Track accumulated scroll during lock
  const accumulatedScroll = useRef(0);
  const maxScroll = useRef(0);

  // Determine the scroll range based on number of tiers
  const tierCount = tiers.length;

  // Check for reduced motion preference and mobile
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    motionQuery.addEventListener("change", handleMotionChange);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Calculate max scroll distance based on cards container width
  useEffect(() => {
    if (!enableScrollExperience) return;

    const calculateMaxScroll = () => {
      if (cardsContainerRef.current && scrollAreaRef.current) {
        const containerWidth = scrollAreaRef.current.offsetWidth;
        const scrollWidth = cardsContainerRef.current.scrollWidth;
        maxScroll.current = Math.max(0, scrollWidth - containerWidth);
      }
    };

    calculateMaxScroll();
    window.addEventListener("resize", calculateMaxScroll);
    return () => window.removeEventListener("resize", calculateMaxScroll);
  }, [enableScrollExperience, tiers]);

  // Transform scroll progress to horizontal translation
  const translateX = useTransform(
    scrollProgress,
    [0, 1],
    [0, -maxScroll.current]
  );

  // Calculate velocity for escape mechanism
  const calculateVelocity = useCallback((currentY: number) => {
    const now = performance.now();
    const timeDelta = now - lastScrollTime.current;

    if (timeDelta > 0 && timeDelta < 200) {
      const distance = Math.abs(currentY - lastScrollY.current);
      const velocity = (distance / timeDelta) * 100; // pixels per 100ms
      velocityHistory.current.push(velocity);

      // Keep only last 5 velocity samples
      if (velocityHistory.current.length > 5) {
        velocityHistory.current.shift();
      }
    }

    lastScrollTime.current = now;
    lastScrollY.current = currentY;

    // Return average velocity
    if (velocityHistory.current.length > 0) {
      return velocityHistory.current.reduce((a, b) => a + b, 0) / velocityHistory.current.length;
    }
    return 0;
  }, []);

  // Intersection observer to detect when section enters view
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!enableScrollExperience || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
          // Reset state when section leaves view completely
          if (!entry.isIntersecting) {
            if (hasCompleted) {
              setHasCompleted(false);
              scrollProgress.set(0);
              cardIndex.set(0);
              accumulatedScroll.current = 0;
            }
            // Also unlock if section leaves view while locked
            if (isLocked) {
              setIsLocked(false);
            }
          }
        });
      },
      {
        threshold: 0.4, // Section needs to be 40% visible
        rootMargin: "0px 0px 0px 0px"
      }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [enableScrollExperience, hasCompleted, scrollProgress, cardIndex, isLocked]);

  // Check if scroll lock should engage (called from wheel handler)
  const shouldEnterScrollLock = useCallback(() => {
    if (!enableScrollExperience || hasCompleted || !isInView || isLocked) return false;

    const section = sectionRef.current;
    if (!section) return false;

    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Check if section header is visible near top of viewport
    const headerTop = rect.top;

    // Only lock when section header is near top of viewport (just scrolled to section)
    // and section is mostly visible
    return headerTop >= -100 && headerTop <= viewportHeight * 0.15;
  }, [enableScrollExperience, hasCompleted, isLocked, isInView]);

  // Handle wheel events - both for entering lock and during lock
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!enableScrollExperience) return;

    // Check if we should enter scroll lock
    if (!isLocked && e.deltaY > 0 && shouldEnterScrollLock()) {
      e.preventDefault();
      setIsLocked(true);
      accumulatedScroll.current = 0;
      velocityHistory.current = [];
      return;
    }

    // If not locked, allow normal scrolling
    if (!isLocked) return;

    const velocity = calculateVelocity(e.pageY);

    // Allow escape on fast scroll
    if (velocity > ESCAPE_VELOCITY_THRESHOLD) {
      setIsLocked(false);
      setHasCompleted(true);
      return;
    }

    e.preventDefault();

    const delta = e.deltaY * SCROLL_SENSITIVITY;
    accumulatedScroll.current += delta;

    // Clamp progress between 0 and 1
    const totalScrollRange = window.innerHeight * (tierCount - 1) * 0.5;
    const progress = Math.max(0, Math.min(1, accumulatedScroll.current / totalScrollRange));

    // Animate to new progress value
    animate(scrollProgress, progress, {
      type: "spring",
      stiffness: 300,
      damping: 40,
    });

    // Update current card index for visual feedback
    cardIndex.set(Math.round(progress * (tierCount - 1)));

    // Check if completed
    if (progress >= 0.98) {
      // Smoothly complete and release lock
      animate(scrollProgress, 1, {
        type: "spring",
        stiffness: 200,
        damping: 30,
        onComplete: () => {
          setTimeout(() => {
            setIsLocked(false);
            setHasCompleted(true);
          }, 300);
        },
      });
    }

    // Allow scroll back to exit from start
    if (progress <= 0.02 && accumulatedScroll.current < -50) {
      setIsLocked(false);
      accumulatedScroll.current = 0;
    }
  }, [enableScrollExperience, isLocked, calculateVelocity, scrollProgress, cardIndex, tierCount, shouldEnterScrollLock]);

  // Handle touch events for mobile
  const touchStartY = useRef(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enableScrollExperience) return;
    touchStartY.current = e.touches[0].clientY;
  }, [enableScrollExperience]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enableScrollExperience) return;

    const currentY = e.touches[0].clientY;
    const deltaY = touchStartY.current - currentY;

    // Check if we should enter scroll lock on swipe up
    if (!isLocked && deltaY > 10 && shouldEnterScrollLock()) {
      e.preventDefault();
      setIsLocked(true);
      accumulatedScroll.current = 0;
      velocityHistory.current = [];
      touchStartY.current = currentY;
      return;
    }

    if (!isLocked) return;

    // Calculate velocity
    const velocity = calculateVelocity(currentY);

    if (velocity > ESCAPE_VELOCITY_THRESHOLD * 1.5) {
      setIsLocked(false);
      setHasCompleted(true);
      return;
    }

    e.preventDefault();

    accumulatedScroll.current += deltaY * 2;
    touchStartY.current = currentY;

    const totalScrollRange = window.innerHeight * (tierCount - 1) * 0.5;
    const progress = Math.max(0, Math.min(1, accumulatedScroll.current / totalScrollRange));

    scrollProgress.set(progress);
    cardIndex.set(Math.round(progress * (tierCount - 1)));

    if (progress >= 0.98) {
      setTimeout(() => {
        setIsLocked(false);
        setHasCompleted(true);
      }, 200);
    }

    if (progress <= 0.02 && accumulatedScroll.current < -30) {
      setIsLocked(false);
      accumulatedScroll.current = 0;
    }
  }, [enableScrollExperience, isLocked, calculateVelocity, scrollProgress, cardIndex, tierCount, shouldEnterScrollLock]);

  // Attach event listeners
  useEffect(() => {
    if (!enableScrollExperience) return;

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [enableScrollExperience, handleWheel, handleTouchStart, handleTouchMove]);

  // Lock body scroll when section is locked
  useEffect(() => {
    if (!enableScrollExperience) {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      return;
    }

    if (isLocked) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [enableScrollExperience, isLocked]);

  // Keyboard navigation
  useEffect(() => {
    if (!enableScrollExperience) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLocked) return;

      if (e.key === "Escape") {
        setIsLocked(false);
        setHasCompleted(true);
        return;
      }

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        const current = scrollProgress.get();
        const step = 1 / (tierCount - 1);
        const newProgress = Math.min(1, current + step);
        animate(scrollProgress, newProgress, { duration: 0.4 });
        cardIndex.set(Math.round(newProgress * (tierCount - 1)));

        if (newProgress >= 1) {
          setTimeout(() => {
            setIsLocked(false);
            setHasCompleted(true);
          }, 400);
        }
      }

      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const current = scrollProgress.get();
        const step = 1 / (tierCount - 1);
        const newProgress = Math.max(0, current - step);
        animate(scrollProgress, newProgress, { duration: 0.4 });
        cardIndex.set(Math.round(newProgress * (tierCount - 1)));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableScrollExperience, isLocked, scrollProgress, cardIndex, tierCount]);

  // Calculate dynamic max scroll on progress update
  useEffect(() => {
    if (!enableScrollExperience) return;

    const unsubscribe = scrollProgress.on("change", () => {
      if (cardsContainerRef.current && scrollAreaRef.current) {
        const containerWidth = scrollAreaRef.current.offsetWidth;
        const scrollWidth = cardsContainerRef.current.scrollWidth;
        maxScroll.current = Math.max(0, scrollWidth - containerWidth);
      }
    });
    return () => unsubscribe();
  }, [enableScrollExperience, scrollProgress]);

  // Track current card index as React state for reactivity
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Sync motion value to React state
  useEffect(() => {
    if (!enableScrollExperience) return;

    const unsubscribe = cardIndex.on("change", (v) => {
      setCurrentCardIndex(Math.round(v));
    });
    return () => unsubscribe();
  }, [cardIndex, enableScrollExperience]);

  // Progress indicator dots
  const ProgressIndicator = () => (
    <motion.div
      className="flex justify-center gap-2 mt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: isLocked ? 1 : 0.5 }}
      transition={{ duration: 0.3 }}
    >
      {tiers.map((_, index) => (
        <motion.div
          key={index}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            "bg-brand-lightBlue/30"
          )}
          animate={{
            width: currentCardIndex === index ? 24 : 8,
            backgroundColor: currentCardIndex === index
              ? "rgb(111, 175, 206)"
              : "rgba(111, 175, 206, 0.3)",
          }}
        />
      ))}
    </motion.div>
  );

  // Hint text for user guidance
  const ScrollHint = () => (
    <motion.p
      className="text-center text-xs uppercase tracking-[0.3em] text-brand-lightBlue/60 mt-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: isLocked ? 1 : 0,
        y: isLocked ? 0 : 10
      }}
      transition={{ duration: 0.4 }}
    >
      {isMobile ? "Swipe up/down to explore" : "Scroll to explore • Press Esc to skip"}
    </motion.p>
  );

  // Render standard grid for desktop or reduced motion users
  if (!enableScrollExperience) {
    return (
      <StandardMembershipSection
        tiers={tiers}
        allTiersCount={allTiersCount}
      />
    );
  }

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative py-20 transition-all duration-500",
        "bg-brand-deepBlue/20",
        isLocked && "z-50"
      )}
      aria-label="Membership Tiers"
      role="region"
    >
      {/* Subtle glow effect when locked */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLocked ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: "radial-gradient(ellipse at center, rgba(197, 163, 91, 0.08) 0%, rgba(0,0,0,0) 70%)",
        }}
      />

      <Container>
        <div className="space-y-10">
          {/* Section Header */}
          <motion.div
            className="space-y-4 text-center md:text-left"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <p className="text-xs uppercase tracking-[0.4em] text-brand-lightBlue">
              Membership Tiers
            </p>
            <h2 className="text-3xl text-brand-ivory sm:text-4xl">
              Unlock Elite Access
            </h2>
            <p className="text-base text-brand-gray/90 sm:max-w-3xl">
              Choose the membership level that fits your training needs and lifestyle.
            </p>
          </motion.div>

          {/* Scrollable Cards Container */}
          {tiers.length > 0 ? (
            <>
              <div ref={scrollAreaRef} className="relative overflow-hidden">
                <motion.div
                  ref={cardsContainerRef}
                  className="flex gap-6"
                  style={{
                    x: translateX,
                    willChange: "transform",
                  }}
                >
                  {tiers.map((tier, index) => (
                    <motion.div
                      key={tier.name ?? index}
                      className="flex-shrink-0 w-[calc(100%-2rem)] md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333%-1rem)]"
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                        ease: [0.16, 1, 0.3, 1] as const
                      }}
                    >
                      <MembershipCard tier={tier} index={index} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Fade edges during scroll */}
                <motion.div
                  className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-brand-black/80 to-transparent pointer-events-none"
                  animate={{ opacity: scrollProgress.get() > 0.05 ? 1 : 0 }}
                />
                <motion.div
                  className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-brand-black/80 to-transparent pointer-events-none"
                  animate={{ opacity: scrollProgress.get() < 0.95 ? 1 : 0 }}
                />
              </div>

              <ProgressIndicator />
              <ScrollHint />

              {allTiersCount > 3 && (
                <motion.div
                  className="mt-10 flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <ButtonLink href="/memberships" variant="secondary">
                    View All Tiers
                  </ButtonLink>
                </motion.div>
              )}
            </>
          ) : (
            <p className="glass-card border border-dashed border-white/25 px-6 py-8 text-center text-sm text-brand-gray">
              Membership tiers coming soon.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}

/**
 * Fallback component for desktop or reduced motion preference.
 * Renders a standard grid layout without scroll-jacking.
 */
function StandardMembershipSection({
  tiers,
  allTiersCount,
}: {
  tiers: MembershipTier[];
  allTiersCount: number;
}) {
  return (
    <motion.section
      className="py-10 bg-brand-deepBlue/20"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
    >
      <Container className="space-y-10 py-0">
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

        {tiers.length > 0 ? (
          <>
            <motion.div
              className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                visible: {
                  transition: { staggerChildren: 0.15 },
                },
              }}
            >
              {tiers.map((tier, index) => (
                <div key={tier.name ?? index} className="h-full">
                  <MembershipCard tier={tier} index={index} />
                </div>
              ))}
            </motion.div>
            {allTiersCount > 3 && (
              <div className="mt-10 flex justify-center">
                <ButtonLink href="/memberships" variant="secondary">
                  View All Tiers
                </ButtonLink>
              </div>
            )}
          </>
        ) : (
          <p className="glass-card border border-dashed border-white/25 px-6 py-8 text-center text-sm text-brand-gray">
            Membership tiers coming soon.
          </p>
        )}
      </Container>
    </motion.section>
  );
}
