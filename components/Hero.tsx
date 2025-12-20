import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/cn";
import { HeroPayload } from "@/lib/hero";
import { isSanityConfigured, urlForImage } from "@/lib/sanity.client";

import { Container } from "./Container";

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

  const highlightWords = ["one", "happiness"];

  const renderText = (text: string) => {
    return text.split(/\s+/).map((word, index, words) => {
      const cleanWord = word.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      const isHighlighted = highlightWords.includes(cleanWord);
      
      if (isHighlighted) {
        return (
          <span key={index} className="text-brand-gold drop-shadow-[0_0_15px_rgba(197,163,91,0.6)]">
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
      ? Boolean(hero.image)
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
          <HeroCta href={hero.ctaLink}>{hero.ctaLabel}</HeroCta>
        </div>
      )}
    </div>
  );

  if (layout === "split") {
    return (
      <section className="border-b border-brand-deepBlue/60 bg-brand-black">
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
      <section className="border-b border-brand-deepBlue/60 bg-gradient-to-br from-brand-black via-brand-deepBlue/30 to-brand-black">
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
    <section className="relative isolate overflow-hidden border-b border-brand-deepBlue/70">
      <div className="absolute inset-0">
        <HeroBackground hero={hero} />
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: customOverlayColor ?? `rgb(5, 10, 25)`,
            opacity: overlayOpacity,
          }}
        />
      </div>
      <Container className="relative z-10 py-24 sm:py-32">
        {content}
      </Container>
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

  const imageUrl = getImageUrl(hero.image);
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
  const imageUrl = getImageUrl(hero.image);
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

const HeroCta = ({ href, children }: { href: string; children: string }) => {
  const isAnchor = href.startsWith("#");
  const isInternal = href.startsWith("/");
  const className = cn(heroButtonBase, heroButtonVariants.primary);
  if (isInternal) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  if (isAnchor) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
};

const getImageUrl = (image?: HeroPayload["image"]) => {
  if (!image || !isSanityConfigured) {
    return undefined;
  }

  try {
    return urlForImage(image).width(2400).auto("format").url();
  } catch {
    return undefined;
  }
};

const clampOpacity = (value?: number) => {
  if (typeof value !== "number") {
    return 0.7;
  }

  if (value <= 0) return 0;
  if (value >= 100) return 1;
  return value / 100;
};
