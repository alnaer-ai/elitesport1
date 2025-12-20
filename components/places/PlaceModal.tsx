import Image from "next/image";
import Link from "next/link";
import { MouseEvent, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { PortableText } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";

import { ButtonLink } from "@/components/ButtonLink";
import { getPlaceCategoryLabel } from "@/lib/placePresentation";
import type { Place } from "@/lib/placeTypes";
import { isSanityConfigured, urlForImage } from "@/lib/sanity.client";

export type PlaceModalProps = {
  place: Place | null;
  isOpen: boolean;
  onClose: () => void;
  categoryLabel?: string;
};

const APP_STORE_URL = "https://apps.apple.com/ae/app/elite-sport/id1558697337";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.alrumaithyest.elitesport&pli=1";
const DEFAULT_STORE_URL = APP_STORE_URL;
const FALLBACK_OVERVIEW =
  "Destination curated by EliteSport with member-first amenities and elevated service.";

const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

const getImageUrl = (
  source?: SanityImageSource,
  width = 1600,
  height?: number
) => {
  if (!source || !isSanityConfigured) {
    return undefined;
  }

  try {
    let builder = urlForImage(source).width(width).auto("format");
    if (height) {
      builder = builder.height(height).fit("crop");
    }
    return builder.url();
  } catch {
    return undefined;
  }
};

const FALLBACK_PLACE_IMAGE =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80";

export const PlaceModal = ({
  place,
  isOpen,
  onClose,
  categoryLabel,
}: PlaceModalProps) => {
  const [storeUrl, setStoreUrl] = useState<string>(DEFAULT_STORE_URL);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.clientWidth;
      const maxScrollLeft = current.scrollWidth - current.clientWidth;
      const tolerance = 5; // Buffer for scroll position precision

      if (direction === "left") {
        // If near start, loop to end
        if (current.scrollLeft <= tolerance) {
          current.scrollTo({
            left: maxScrollLeft,
            behavior: "smooth",
          });
        } else {
          current.scrollBy({
            left: -scrollAmount,
            behavior: "smooth",
          });
        }
      } else {
        // If near end, loop to start
        if (current.scrollLeft >= maxScrollLeft - tolerance) {
          current.scrollTo({
            left: 0,
            behavior: "smooth",
          });
        } else {
          current.scrollBy({
            left: scrollAmount,
            behavior: "smooth",
          });
        }
      }
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const userAgent = navigator?.userAgent ?? "";
    const isIOS = /iPad|iPhone|iPod/i.test(userAgent);
    const isAndroid = /Android/i.test(userAgent);

    if (isIOS) {
      setStoreUrl(APP_STORE_URL);
      return;
    }

    if (isAndroid) {
      setStoreUrl(PLAY_STORE_URL);
      return;
    }

    setStoreUrl(DEFAULT_STORE_URL);
  }, [isOpen]);

  if (!isOpen || !place) {
    return null;
  }

  if (typeof document === "undefined") {
    return null;
  }

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const rawImages = [place.featuredImage, ...(place.images || [])].filter(
    (img) => img !== null && img !== undefined
  );
  const hasImages = rawImages.length > 0;

  const displayCategoryLabel =
    categoryLabel ?? place.location ?? getPlaceCategoryLabel(place.placeType);
  const showAllPlacesLink =
    displayCategoryLabel?.toLowerCase() === "most popular places";
  const overview = place.overview;

  const portableTextComponents = {
    block: {
      normal: ({ children }: { children?: ReactNode }) => (
        <p className="text-base text-brand-gray/90 leading-relaxed">{children}</p>
      ),
      h3: ({ children }: { children?: ReactNode }) => (
        <h3 className="text-lg font-semibold text-brand-ivory">{children}</h3>
      ),
    },
    list: {
      bullet: ({ children }: { children?: ReactNode }) => (
        <ul className="list-disc space-y-2 pl-6 text-brand-gray/90">{children}</ul>
      ),
    },
    listItem: {
      bullet: ({ children }: { children?: ReactNode }) => <li>{children}</li>,
    },
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-black/70 backdrop-blur-md p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Place details for ${place.name ?? "this place"}`}
      onClick={handleOverlayClick}
    >
      <div className="glass-card mx-auto w-full max-w-2xl rounded-[32px] overflow-hidden">
        <div className="relative h-64 w-full group">
          <div 
            ref={scrollContainerRef}
            className="flex h-full w-full overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {(hasImages ? rawImages : [undefined]).map((img, index) => {
              const url = getImageUrl(img, 1600, 600) ?? FALLBACK_PLACE_IMAGE;
              const alt = img?.alt ?? place.name ?? "EliteSport place";
              return (
                <div
                  key={index}
                  className="relative h-full w-full flex-shrink-0 snap-center"
                >
                  <Image
                    src={url}
                    alt={alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-cover"
                  />
                </div>
              );
            })}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/40 to-transparent pointer-events-none" />

          {/* Scroll Controls */}
          {hasImages && rawImages.length > 1 && (
            <>
              <button
                onClick={() => scroll("left")}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-brand-black/40 p-2 text-brand-ivory/90 backdrop-blur-md transition-all hover:bg-brand-gold hover:text-brand-black focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold opacity-0 group-hover:opacity-100 duration-300"
                aria-label="Scroll left"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-brand-black/40 p-2 text-brand-ivory/90 backdrop-blur-md transition-all hover:bg-brand-gold hover:text-brand-black focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold opacity-0 group-hover:opacity-100 duration-300"
                aria-label="Scroll right"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onClose}
            className="absolute left-6 top-6 rounded-full border border-brand-lightBlue/30 bg-black/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-brand-ivory transition hover:border-brand-gold hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lightBlue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black"
            aria-label="Close modal"
          >
            Close
          </button>
          <div className="absolute bottom-6 left-6 right-6 space-y-3 pointer-events-none">
            <div className="pointer-events-auto">
              <p className="text-xs uppercase tracking-[0.45em] text-brand-lightBlue">
                {displayCategoryLabel}
              </p>
              {showAllPlacesLink && (
                <Link
                  href="/places"
                  className="inline-block text-xs font-semibold uppercase tracking-[0.35em] text-brand-lightBlue transition hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black"
                >
                  See All Places →
                </Link>
              )}
              <h2 className="text-3xl font-semibold text-brand-ivory">
                {place.name ?? "EliteSport Place"}
              </h2>
            </div>
          </div>
        </div>
        <div className="space-y-8 px-8 py-10">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-gold">
              Overview
            </p>
            {overview ? (
              <PortableText value={overview} components={portableTextComponents} />
            ) : (
              <p className="text-base text-brand-gray/90">{FALLBACK_OVERVIEW}</p>
            )}
          </div>

          {place.benefits && place.benefits.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-gold">
                Benefits
              </p>
              <ul className="list-disc space-y-2 pl-6 text-brand-gray/90">
                {place.benefits.map((benefit, index) => (
                  <li key={index} className="text-base leading-relaxed">
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-base font-medium text-brand-ivory">Want to know more?</p>
              <ButtonLink
                href={storeUrl}
                variant="primary"
                className="w-full sm:w-auto justify-center"
                target="_blank"
                rel="noreferrer"
              >
                Download our app
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
