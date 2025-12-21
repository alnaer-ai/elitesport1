import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { cn } from "@/lib/cn";
import { HeroPayload } from "@/lib/hero";

import { Container } from "./Container";

const ScrollIndicator = () => (
  <motion.div 
    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 1.2 }}
  >
    <div className="flex flex-col items-center gap-2 text-brand-ivory/40">
      <span className="text-[0.65rem] uppercase tracking-[0.3em]">Scroll</span>
      <motion.div 
        className="h-8 w-px bg-gradient-to-b from-brand-ivory/40 to-transparent"
        animate={{ scaleY: [1, 0.6, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </div>
  </motion.div>
);

const alignmentClasses: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const heroButtonBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lightBlue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black";

const heroButtonVariants = {
  primary:
    "bg-brand-gold text-brand-black hover:bg-brand-lightBlue hover:text-brand-deepBlue shadow-glow",
};

const HeroTitle = ({ title }: { title: string }) => {
  // Split title at "One" to create two lines
  // Pattern: "Endless Choices One Membership" -> ["Endless Choices", "One Membership"]
  const oneMatch = title.match(/^(.+?)\s+(One\s+.+)$/i);
  
  let line1 = title;
  let line2 = "";
  
  if (oneMatch) {
    line1 = oneMatch[1].trim(); // "Endless Choices"
    line2 = oneMatch[2].trim(); // "One Membership"
  }

  const highlightWords = ["one", "happiness", "happniess"];

  const renderText = (text: string) => {
    return text.split(/\s+/).map((word, index, words) => {
      const cleanWord = word.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      const isHighlighted = highlightWords.includes(cleanWord);
      
      if (isHighlighted) {
        return (
          <span 
            key={index} 
            className="text-brand-gold drop-shadow-[0_0_20px_rgba(197,163,91,0.8),0_0_40px_rgba(197,163,91,0.4)] [text-shadow:0_0_10px_rgba(197,163,91,0.9),0_0_20px_rgba(197,163,91,0.6)]"
          >
            {word}
            {index < words.length - 1 ? " " : ""}
          </span>
        );
      }
      return (
        <span key={index}>
          {word}
          {index < words.length - 1 ? " " : ""}
        </span>
      );
    });
  };

  return (
    <h1 className="font-display text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-brand-ivory sm:text-4xl sm:leading-[1.08] sm:tracking-[-0.025em] lg:text-5xl lg:leading-[1.06] lg:tracking-[-0.03em] [text-shadow:0_1px_3px_rgba(0,0,0,0.4),0_0_30px_rgba(248,246,241,0.08)]">
      <span className="block">{renderText(line1)}</span>
      {line2 && <span className="block">{renderText(line2)}</span>}
    </h1>
  );
};

type HeroProps = {
  hero?: HeroPayload | null;
  customOverlayColor?: string;
};

export const Hero = ({ hero, customOverlayColor }: HeroProps) => {
  if (!hero || hero.isPublished === false) {
    return null;
  }

  const layout = hero.layoutVariant ?? "overlay";
  const alignment = hero.textAlignment ?? (layout === "centered" ? "center" : "left");
  const overlayOpacity = clampOpacity(hero.overlayOpacity);
  const mediaType = hero.mediaType ?? "image";
  const hasMedia =
    mediaType === "image"
      ? Boolean(hero.imageUrl)
      : mediaType === "video"
      ? Boolean(hero.video?.file || hero.video?.url)
      : false;

  const content = (
    <div
      className={cn(
        "space-y-5 sm:space-y-6",
        alignmentClasses[alignment] ?? alignmentClasses.left,
        layout !== "split" && "max-w-3xl mx-auto"
      )}
    >
      {hero.title && (
        <HeroTitle title={hero.title} />
      )}
      {hero.subtitle && (
        <p className="font-sans text-base font-light leading-[1.7] tracking-[0.01em] text-brand-ivory sm:text-lg sm:leading-[1.75] sm:tracking-[0.015em] md:text-xl md:leading-[1.8]">
          {hero.subtitle}
        </p>
      )}
      {hero.ctaLabel && hero.ctaLink && (
        <div className="pt-2">
          <HeroCta href={hero.ctaLink} alignment={alignment}>
            {hero.ctaLabel}
          </HeroCta>
        </div>
      )}
    </div>
  );

  if (layout === "split") {
    return (
      <section className="bg-brand-black">
        <Container className="py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {content}
            {hasMedia && <MediaCard hero={hero} />}
          </div>
        </Container>
      </section>
    );
  }

  if (layout === "centered") {
    return (
      <section className="bg-gradient-to-br from-brand-black via-brand-deepBlue/30 to-brand-black">
        <Container className="py-20">
          {content}
          {hasMedia && (
            <div className="mt-12">
              <MediaCard hero={hero} />
            </div>
          )}
        </Container>
      </section>
    );
  }

  return (
    <section className="relative isolate -mt-20 min-h-[85vh] overflow-hidden pt-20 sm:-mt-24 sm:pt-24">
      <div className="absolute inset-0">
        <HeroBackground hero={hero} />
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: customOverlayColor ?? `rgb(5, 10, 25)`,
            opacity: overlayOpacity,
          }}
        />
        {/* Gradient fade overlay for consistent visual effect */}
        <div className="hero-gradient-fade" />
      </div>
      <Container className="relative z-10 flex min-h-[85vh] flex-col justify-center py-24 sm:py-32">
        {content}
      </Container>
      <ScrollIndicator />
    </section>
  );
};

const HeroBackground = ({ hero }: { hero: HeroPayload }) => {
  if (hero.mediaType === "video") {
    const videoSrc = hero.video?.file?.url ?? hero.video?.url;
    if (!videoSrc) return <div className="absolute inset-0 bg-brand-black" />;
    return (
      <video
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        controls={false}
      >
        <source src={videoSrc} />
      </video>
    );
  }

  const imageUrl = hero.imageUrl;
  if (!imageUrl) {
    return <div className="absolute inset-0 bg-brand-black" />;
  }

  return (
    <Image
      src={imageUrl}
      alt={hero.title ?? "EliteSport hero background"}
      fill
      priority
      sizes="100vw"
      className="object-cover"
    />
  );
};

const MediaCard = ({ hero }: { hero: HeroPayload }) => {
  const mediaType = hero.mediaType ?? "image";

  return (
    <div className="glass-card premium-card overflow-hidden rounded-[32px]">
      {mediaType === "video" ? <HeroVideo hero={hero} /> : <HeroImage hero={hero} />}
    </div>
  );
};

const HeroVideo = ({ hero }: { hero: HeroPayload }) => {
  const videoSrc = hero.video?.file?.url ?? hero.video?.url;
  if (!videoSrc) {
    return <div className="h-80 w-full bg-brand-black" />;
  }

  return (
    <video
      className="h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      controls={false}
    >
      <source src={videoSrc} />
    </video>
  );
};

const HeroImage = ({ hero }: { hero: HeroPayload }) => {
  const imageUrl = hero.imageUrl;
  if (!imageUrl) {
    return <div className="h-80 w-full bg-brand-black" />;
  }

  return (
    <Image
      src={imageUrl}
      alt={hero.title ?? "EliteSport hero"}
      width={1600}
      height={900}
      className="h-full w-full object-cover"
    />
  );
};

const AppleStoreLogo = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-6 w-6"
    aria-hidden="true"
  >
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const GooglePlayLogo = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-6 w-6"
    aria-hidden="true"
  >
    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
  </svg>
);

const APP_STORE_URL = "https://apps.apple.com/ae/app/elite-sport/id1558697337";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.alrumaithyest.elitesport&pli=1";

const StoreBadge = ({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType;
  label: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="inline-flex items-center justify-center rounded-full p-3 text-brand-ivory transition-all duration-300 hover:text-brand-gold hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lightBlue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black"
  >
    <Icon />
  </a>
);

const HeroCta = ({
  href,
  children,
  alignment = "left",
}: {
  href: string;
  children: string;
  alignment?: string;
}) => {
  const isAnchor = href.startsWith("#");
  const isInternal = href.startsWith("/");
  const className = cn(heroButtonBase, heroButtonVariants.primary);

  const ctaButton = isInternal ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <a href={href} className={className}>
      {children}
    </a>
  );

  const alignClass =
    alignment === "center"
      ? "items-center"
      : alignment === "right"
      ? "items-end"
      : "items-start";

  return (
    <div className={cn("flex flex-col gap-6", alignClass)}>
      {ctaButton}
      <div className="flex items-center gap-4">
        <span className="text-sm text-brand-ivory">Download our app</span>
        <StoreBadge
          href={APP_STORE_URL}
          icon={AppleStoreLogo}
          label="Download on the App Store"
        />
        <StoreBadge
          href={PLAY_STORE_URL}
          icon={GooglePlayLogo}
          label="Get it on Google Play"
        />
      </div>
    </div>
  );
};

const clampOpacity = (value?: number) => {
  if (typeof value !== "number") {
    return 0.7;
  }

  if (value <= 0) return 0;
  if (value >= 100) return 1;
  return value / 100;
};
