import { cn } from "@/lib/cn";

export type MembershipTier = "Bronze" | "Silver" | "Gym" | "She";

interface MembershipSelectProps {
  selected: MembershipTier | "";
  onChange: (value: MembershipTier) => void;
}

const options: MembershipTier[] = ["Bronze", "Silver", "Gym", "She"];

export function MembershipSelect({ selected, onChange }: MembershipSelectProps) {
  return (
    <div className="space-y-3">
      <label className="text-xs uppercase tracking-[0.3em] text-brand-lightBlue">
        Select Membership
      </label>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "group relative flex items-center justify-center rounded-xl border px-4 py-4 transition-all duration-300",
              selected === option
                ? "border-brand-gold bg-brand-gold/10 text-brand-gold shadow-[0_0_20px_rgba(197,163,91,0.15)]"
                : "border-brand-deepBlue/60 bg-brand-black/40 text-brand-gray hover:border-brand-gold/50 hover:text-brand-ivory hover:bg-brand-deepBlue/20"
            )}
            aria-checked={selected === option}
            role="radio"
          >
            <span className="text-sm font-semibold tracking-wide uppercase">
              {option}
            </span>
            {selected === option && (
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-brand-gold/20" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

