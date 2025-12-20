import { cn } from "@/lib/cn";

type PromoBadgeTone = "default" | "gold" | "accent" | "outline" | "danger";
type PromoBadgeVariant = "pill" | "circle" | "solidCircle";

const toneClasses: Record<PromoBadgeTone, string> = {
  default: "bg-brand-black/70 text-brand-ivory border-brand-deepBlue/40",
  gold: "bg-brand-gold/90 text-brand-black border-brand-gold/80",
  accent: "bg-brand-lightBlue/20 text-brand-lightBlue border-brand-lightBlue/40",
  outline: "bg-transparent text-brand-ivory border-brand-lightBlue/40",
  danger: "bg-red-600 text-white border-red-500",
};

const variantClasses: Record<PromoBadgeVariant, string> = {
  pill:
    "inline-flex items-center rounded-full border px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.35em]",
  circle:
    "inline-flex h-9 w-9 items-center justify-center rounded-full border text-[0.7rem] font-semibold leading-none",
  solidCircle:
    "inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-xs font-semibold text-white shadow-lg shadow-red-900/30",
};

export type PromoBadgeProps = {
  label: string;
  tone?: PromoBadgeTone;
  className?: string;
  variant?: PromoBadgeVariant;
};

export const PromoBadge = ({
  label,
  tone = "default",
  className,
  variant = "pill",
}: PromoBadgeProps) => {
  if (!label) {
    return null;
  }

  return (
    <span className={cn(variantClasses[variant], toneClasses[tone], className)}>
      {label}
    </span>
  );
};
