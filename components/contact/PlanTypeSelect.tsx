import { cn } from "@/lib/cn";

export type PlanType = "Single" | "Family";

interface PlanTypeSelectProps {
  selected: PlanType;
  onChange: (value: PlanType) => void;
  isFamilyDisabled: boolean;
}

export function PlanTypeSelect({ selected, onChange, isFamilyDisabled }: PlanTypeSelectProps) {
  return (
    <div className="space-y-3">
      <label className="text-xs uppercase tracking-[0.3em] text-brand-lightBlue">
        Plan Type
      </label>
      <div className="grid grid-cols-2 gap-4">
        {/* Single Option */}
        <button
          type="button"
          onClick={() => onChange("Single")}
          className={cn(
            "group relative flex items-center justify-center rounded-xl border px-4 py-4 transition-all duration-300",
            selected === "Single"
              ? "border-brand-gold bg-brand-gold/10 text-brand-gold shadow-[0_0_20px_rgba(197,163,91,0.15)]"
              : "border-brand-deepBlue/60 bg-brand-black/40 text-brand-gray hover:border-brand-gold/50 hover:text-brand-ivory hover:bg-brand-deepBlue/20"
          )}
          aria-checked={selected === "Single"}
          role="radio"
        >
          <span className="text-sm font-semibold tracking-wide uppercase">Single</span>
        </button>

        {/* Family Option */}
        <button
          type="button"
          onClick={() => !isFamilyDisabled && onChange("Family")}
          disabled={isFamilyDisabled}
          className={cn(
            "group relative flex flex-col items-center justify-center rounded-xl border px-4 py-4 transition-all duration-300",
            isFamilyDisabled
              ? "cursor-not-allowed border-brand-deepBlue/30 bg-brand-black/20 text-brand-gray/30 opacity-50"
              : selected === "Family"
                ? "border-brand-gold bg-brand-gold/10 text-brand-gold shadow-[0_0_20px_rgba(197,163,91,0.15)]"
                : "border-brand-deepBlue/60 bg-brand-black/40 text-brand-gray hover:border-brand-gold/50 hover:text-brand-ivory hover:bg-brand-deepBlue/20"
          )}
          aria-checked={selected === "Family"}
          role="radio"
          aria-disabled={isFamilyDisabled}
        >
          <span className="text-sm font-semibold tracking-wide uppercase">Family</span>
          <span className="flex items-center gap-1 mt-1 text-xs text-brand-gold/80">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Kids under 16
          </span>
        </button>
      </div>
    </div>
  );
}

