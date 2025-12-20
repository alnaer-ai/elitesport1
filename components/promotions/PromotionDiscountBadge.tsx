import { cn } from "@/lib/cn";

const sizeClasses = {
  sm: "h-10 w-10 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-14 w-14 text-base",
};

export type PromotionDiscountBadgeProps = {
  percentage?: number | null;
  label?: string;
  size?: keyof typeof sizeClasses;
  className?: string;
};

export const PromotionDiscountBadge = ({
  percentage,
  label,
  size = "md",
  className,
}: PromotionDiscountBadgeProps) => {
  let displayLabel: string | undefined;

  if (typeof percentage === "number" && Number.isFinite(percentage)) {
    const formatted = Number.isInteger(percentage)
      ? `${percentage}`
      : `${Number(percentage.toFixed(1))}`;
    displayLabel = `${formatted}%`;
  } else if (label) {
    displayLabel = label;
  }

  if (!displayLabel) {
    return null;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-red-500 bg-red-600 font-semibold text-white shadow-xl shadow-red-900/30",
        "transition-all duration-300 ease-out",
        sizeClasses[size],
        className
      )}
    >
      {displayLabel}
    </span>
  );
};
