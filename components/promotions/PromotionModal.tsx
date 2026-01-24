import Image from "next/image";
import { MouseEvent, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { PortableText } from "@portabletext/react";

import type { PromotionCardContent } from "@/lib/promotionCardContent";
import { ButtonLink } from "@/components/ButtonLink";

import { PromoBadge } from "./PromoBadge";
import { PromotionDiscountBadge } from "./PromotionDiscountBadge";

export type PromotionModalProps = {
  promotion: PromotionCardContent | null;
  isOpen: boolean;
  onClose: () => void;
};

export const PromotionModal = ({
  promotion,
  isOpen,
  onClose,
}: PromotionModalProps) => {
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

  if (!isOpen || !promotion) {
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

  const startLabel = promotion.publishStartDate
    ? `Starts ${new Date(promotion.publishStartDate).toLocaleDateString()}`
    : null;
  const endLabel = promotion.publishEndDate
    ? `Ends ${new Date(promotion.publishEndDate).toLocaleDateString()}`
    : null;
  const dateLabel =
    startLabel && endLabel
      ? `${startLabel} • ${endLabel}`
      : startLabel ?? endLabel ?? "Limited-time benefit";

  const overview = promotion.overview;
  const benefits = promotion.benefits ?? [];
  const hasOverview = Array.isArray(overview) ? overview.length > 0 : Boolean(overview);

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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-black/70 backdrop-blur-md p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Promotion details for ${promotion.title}`}
      onClick={handleOverlayClick}
    >
      <div className="glass-card mx-auto w-full max-w-2xl rounded-[32px] overflow-hidden">
        <div className="relative h-64 w-full overflow-hidden">
          {promotion.imageUrl && (
            <Image
              src={promotion.imageUrl}
              alt={promotion.imageAlt ?? promotion.title}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/40 to-transparent" />
          <div className="absolute right-6 top-6 z-10 flex items-center gap-3">
            <PromotionDiscountBadge
              percentage={promotion.discountPercentage}
              size="lg"
            />
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-brand-lightBlue/30 bg-black/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-brand-ivory transition hover:border-brand-gold hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lightBlue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black"
              aria-label="Close modal"
            >
              Close
            </button>
          </div>

          <div className="absolute bottom-6 left-6 right-6 space-y-3">
            <p className="text-xs uppercase tracking-[0.45em] text-brand-lightBlue">
              {promotion.metaLabel ?? "Member Exclusive"}
            </p>
            <h2 className="text-3xl font-semibold text-brand-ivory">
              {promotion.title}
            </h2>
          </div>
        </div>
        <div className="space-y-6 px-8 py-8">
          {/* Category and Dates Row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              {promotion.promotionTypeLabel && (
                <PromoBadge label={promotion.promotionTypeLabel} tone="accent" />
              )}
            </div>
            <div className="text-xs uppercase tracking-[0.35em] text-brand-lightBlue/80">
              {dateLabel}
            </div>
          </div>

          {/* Overview Section */}
          {hasOverview && (
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-gold">
                Overview
              </p>
              <div className="prose-sm text-brand-gray/90 leading-relaxed space-y-3">
                <PortableText value={overview ?? []} components={portableTextComponents} />
              </div>
            </div>
          )}

          {/* Benefits Section */}
          {benefits.length > 0 && (
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-gold">
                Benefits
              </p>
              <ul className="list-disc space-y-2 pl-6 text-brand-gray/90">
                {benefits.map((benefit, index) => (
                  <li key={`${promotion.id}-benefit-${index}`}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA Button */}
          {promotion.ctaAction && (
            <div className="pt-4 border-t border-white/10">
              <ButtonLink href={promotion.ctaAction} variant="secondary">
                {promotion.ctaLabel ?? "Learn More"}
              </ButtonLink>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};




