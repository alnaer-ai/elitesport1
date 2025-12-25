import Image from "next/image";
import Link from "next/link";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Wifi,
  Dumbbell,
  Utensils,
  Waves,
  Sparkles,
  Users,
  Baby,
  Trophy,
  Coffee,
  CheckCircle,
  MapPin,
  Clock,
  Star
} from "lucide-react";

import { ButtonLink } from "@/components/ButtonLink";
import { getPlaceCategoryLabel } from "@/lib/placePresentation";
import type { Place } from "@/lib/placeTypes";
import { cn } from "@/lib/cn";

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

const getServiceIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("wifi")) return Wifi;
  if (n.includes("gym") || n.includes("fitness") || n.includes("workout")) return Dumbbell;
  if (n.includes("pool") || n.includes("swim") || n.includes("beach")) return Waves;
  if (n.includes("spa") || n.includes("massage") || n.includes("sauna") || n.includes("steam")) return Sparkles;
  if (n.includes("kid") || n.includes("child") || n.includes("baby")) return Baby;
  if (n.includes("tennis") || n.includes("squash") || n.includes("padel") || n.includes("court")) return Trophy;
  if (n.includes("restaurant") || n.includes("dining") || n.includes("food") || n.includes("bar")) return Utensils;
  if (n.includes("coffee") || n.includes("cafe")) return Coffee;
  if (n.includes("ladies") || n.includes("women") || n.includes("female")) return Users;
  return CheckCircle;
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
      const tolerance = 5;

      if (direction === "left") {
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
    const userAgent = navigator?.userAgent ?? "";
    let newUrl = DEFAULT_STORE_URL;

    if (/iPad|iPhone|iPod/i.test(userAgent)) {
      newUrl = APP_STORE_URL;
    } else if (/Android/i.test(userAgent)) {
      newUrl = PLAY_STORE_URL;
    }

    setStoreUrl((prev) => (prev !== newUrl ? newUrl : prev));
  }, []);

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

  // Build image URLs array from place data
  const rawImages = [place.featuredImageUrl, ...(place.imageUrls || [])].filter(
    (img): img is string => Boolean(img)
  );
  const hasImages = rawImages.length > 0;

  const displayCategoryLabel =
    categoryLabel ?? getPlaceCategoryLabel(place.placeType);
  const showAllPlacesLink =
    displayCategoryLabel?.toLowerCase() === "most popular places";

  // New: Use HTML fields with fallback
  const descriptionHtml = place.description;
  const offersHtml = place.offers;
  const hasServices = place.services && place.services.length > 0;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-black/70 backdrop-blur-md p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Place details for ${place.name ?? "this place"}`}
      onClick={handleOverlayClick}
    >
      <div className="glass-card mx-auto w-full max-w-2xl rounded-[32px] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Gallery Section */}
        <div className="relative h-64 w-full group flex-shrink-0">
          <div
            ref={scrollContainerRef}
            className="flex h-full w-full overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {(hasImages ? rawImages : [FALLBACK_PLACE_IMAGE]).map((url, index) => {
              const alt = place.imageAlt ?? place.name ?? "EliteSport place";
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
              <div className="flex items-center gap-3">
                <p className="text-xs uppercase tracking-[0.45em] text-brand-lightBlue">
                  {displayCategoryLabel}
                </p>
                {place.location && (
                  <div className="flex items-center gap-1 text-brand-gray/80">
                    <MapPin className="w-3 h-3" />
                    <span className="text-[10px] uppercase tracking-wider">{place.location.split(',')[0]}</span>
                  </div>
                )}
              </div>

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

        {/* Content Section - Scrollable */}
        <div className="flex-1 overflow-y-auto px-8 py-10 space-y-8 custom-scrollbar">

          {/* Services / Facilities */}
          {hasServices && (
            <div className="flex flex-wrap gap-2 pb-2">
              {place.services?.map((service) => {
                const Icon = getServiceIcon(service.name);
                return (
                  <span key={service.id} className="inline-flex items-center gap-1.5 rounded-full border border-brand-lightBlue/20 bg-brand-lightBlue/5 px-3 py-1 text-xs text-brand-lightBlue">
                    <Icon className="w-3 h-3" />
                    {service.name}
                  </span>
                );
              })}
            </div>
          )}

          {/* Overview */}
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-gold">
              Overview
            </p>
            {descriptionHtml ? (
              <div
                className="prose prose-sm prose-invert max-w-none text-brand-gray/90 prose-p:leading-relaxed prose-headings:text-brand-ivory prose-a:text-brand-gold"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
            ) : (
              <p className="text-base text-brand-gray/90 leading-relaxed">{FALLBACK_OVERVIEW}</p>
            )}
          </div>

          {/* Elite Benefits (Offers) */}
          {offersHtml && (
            <div className="space-y-3 pt-2 border-t border-brand-lightBlue/10">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-brand-gold" />
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-gold">
                  Elite Benefits
                </p>
              </div>
              <div
                className="prose prose-sm prose-invert max-w-none text-brand-gray/90 prose-li:marker:text-brand-gold"
                dangerouslySetInnerHTML={{ __html: offersHtml }}
              />
            </div>
          )}

          <div className="pt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-base font-medium text-brand-ivory">Want to access this place?</p>
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
