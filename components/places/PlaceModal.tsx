import Image from "next/image";
import { MouseEvent, useEffect, useState, type ReactNode } from "react";
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

  const imageSource = place.featuredImage;
  const imageUrl = getImageUrl(imageSource, 1600, 600) ?? FALLBACK_PLACE_IMAGE;
  const displayCategoryLabel =
    categoryLabel ?? place.location ?? getPlaceCategoryLabel(place.placeType);
  const overview = place.overview;
  const locationDetails = place.locationDetails;
  const contact = place.contactInformation;
  const hasLocationDetails =
    Boolean(locationDetails?.address) ||
    Boolean(locationDetails?.mapLink) ||
    Boolean(locationDetails?.coordinates?.lat) ||
    Boolean(locationDetails?.coordinates?.lng);
  const hasContact =
    Boolean(contact?.phone) || Boolean(contact?.email) || Boolean(contact?.website);

  const portableTextComponents = {
    block: {
      normal: ({ children }: { children: ReactNode }) => (
        <p className="text-base text-brand-gray/90 leading-relaxed">{children}</p>
      ),
      h3: ({ children }: { children: ReactNode }) => (
        <h3 className="text-lg font-semibold text-brand-ivory">{children}</h3>
      ),
    },
    list: {
      bullet: ({ children }: { children: ReactNode }) => (
        <ul className="list-disc space-y-2 pl-6 text-brand-gray/90">{children}</ul>
      ),
    },
    listItem: {
      bullet: ({ children }: { children: ReactNode }) => <li>{children}</li>,
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
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={place.featuredImage?.alt ?? place.name ?? "EliteSport place"}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/40 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute left-6 top-6 rounded-full border border-brand-lightBlue/30 bg-black/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-brand-ivory transition hover:border-brand-gold hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lightBlue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black"
            aria-label="Close modal"
          >
            Close
          </button>
          <div className="absolute bottom-6 left-6 right-6 space-y-3">
            <p className="text-xs uppercase tracking-[0.45em] text-brand-lightBlue">
              {displayCategoryLabel}
            </p>
            <h2 className="text-3xl font-semibold text-brand-ivory">
              {place.name ?? "EliteSport Place"}
            </h2>
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

          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-gold">
              Location
            </p>
            {hasLocationDetails ? (
              <div className="space-y-2 text-brand-gray/90">
                {locationDetails?.address && (
                  <p className="text-base leading-relaxed whitespace-pre-line">
                    {locationDetails.address}
                  </p>
                )}
                {locationDetails?.mapLink && (
                  <ButtonLink
                    href={locationDetails.mapLink}
                    variant="secondary"
                    className="w-full sm:w-auto"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open in Maps
                  </ButtonLink>
                )}
                {(locationDetails?.coordinates?.lat || locationDetails?.coordinates?.lng) && (
                  <p className="text-sm text-brand-gray/70">
                    Coordinates:{" "}
                    {[
                      locationDetails?.coordinates?.lat,
                      locationDetails?.coordinates?.lng,
                    ]
                      .filter((value) => value !== undefined && value !== null)
                      .join(", ")}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-base text-brand-gray/80">
                Location details will be added soon.
              </p>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-gold">
              Contact
            </p>
            {hasContact ? (
              <div className="space-y-2 text-brand-gray/90">
                {contact?.phone && (
                  <a
                    className="block text-base hover:text-brand-ivory transition"
                    href={`tel:${contact.phone}`}
                  >
                    {contact.phone}
                  </a>
                )}
                {contact?.email && (
                  <a
                    className="block text-base hover:text-brand-ivory transition"
                    href={`mailto:${contact.email}`}
                  >
                    {contact.email}
                  </a>
                )}
                {contact?.website && (
                  <a
                    className="block text-base hover:text-brand-ivory transition"
                    href={contact.website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {contact.website}
                  </a>
                )}
              </div>
            ) : (
              <p className="text-base text-brand-gray/80">
                Contact details will be added soon.
              </p>
            )}
          </div>

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
