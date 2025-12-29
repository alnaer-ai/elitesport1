import Image from "next/image";
import { MouseEvent } from "react";
import { motion } from "framer-motion";

import { getPlaceCategoryLabel } from "@/lib/placePresentation";
import type { Place } from "@/lib/placeTypes";

export type PlaceCardProps = {
  place: Place;
  categoryLabel?: string;
  onSelect?: (place: Place) => void;
  imageWidth?: number;
  imageHeight?: number;
  motionProps?: typeof cardMotionProps;
  /** Enable priority loading for above-the-fold images */
  priority?: boolean;
};

const cardMotionProps = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const },
};

const FALLBACK_PLACE_IMAGE =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80";

export const PlaceCard = ({
  place,
  categoryLabel: _providedLabel,
  onSelect,
  motionProps = cardMotionProps,
  priority = false,
}: PlaceCardProps) => {
  const imageUrl = place.featuredImageUrl ?? FALLBACK_PLACE_IMAGE;
  const placeCategory = place.placeType;
  const categoryLabel = _providedLabel ?? getPlaceCategoryLabel(placeCategory ?? undefined);
  const locationLabel = place.location;

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (onSelect) {
      event.preventDefault();
      event.stopPropagation();
      onSelect(place);
    }
  };

  return (
    <motion.article
      {...motionProps}
      className="glass-card premium-card overflow-hidden cursor-pointer group flex flex-col h-full transform-gpu"
      onClick={handleClick}
      role={onSelect ? "button" : "article"}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={
        onSelect
          ? (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onSelect(place);
            }
          }
          : undefined
      }
      aria-label={onSelect ? `View details for ${place.name ?? "this place"}` : undefined}
    >
      {/* Image Section */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={place.imageAlt ?? place.name ?? "EliteSport place"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
      </div>

      {/* Content Section - Below Image */}
      <div className="flex flex-col gap-1.5 px-5 py-5 flex-grow bg-brand-black/40 backdrop-blur-sm">
        <p className="text-[0.6rem] uppercase tracking-[0.45em] text-brand-lightBlue">
          {categoryLabel}
        </p>
        <h3 className="text-xl font-semibold text-brand-ivory leading-tight">
          {place.name ?? "EliteSport Place"}
        </h3>
        {locationLabel && (
          <p className="text-sm text-brand-gray/80 font-light tracking-wide">
            {locationLabel}
          </p>
        )}
      </div>
    </motion.article>
  );
};
