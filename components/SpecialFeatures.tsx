import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { cn } from "@/lib/cn";

export type FeatureCard = {
  title: string;
  description: string;
  Icon: () => JSX.Element;
};

const PricingIcon = () => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="h-10 w-10"
  >
    <rect x="12" y="8" width="24" height="32" rx="5" />
    <path d="M24 12v24" />
    <path d="M20 18c0-2.4 2.1-4 4-4s4 1.3 4 3-1.9 3-4 3-4 1.1-4 3 2 3 4 3 4-1.3 4-3" />
  </svg>
);

const RibbonIcon = () => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="h-10 w-10"
  >
    <circle cx="24" cy="16" r="9" />
    <path d="m18 24-1.5 11L24 31l7.5 4-1.5-11" />
    <path d="m24 11 2 3-2 3-2-3z" fill="currentColor" stroke="none" />
  </svg>
);

const GlobeIcon = () => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="h-10 w-10"
  >
    <circle cx="24" cy="24" r="15" />
    <path d="M24 9v30" />
    <path d="M12 14h24" />
    <path d="M12 34h24" />
    <path d="M16 24h16" />
    <path d="M20 9.5c-2 4-2 25 0 29M28 9.5c2 4 2 25 0 29" />
  </svg>
);

const DumbbellIcon = () => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="h-10 w-10"
  >
    <path d="M8 16h4v16H8z" fill="currentColor" stroke="none" />
    <path d="M36 16h4v16h-4z" fill="currentColor" stroke="none" />
    <path d="M16 14h4v20h-4z" />
    <path d="M28 14h4v20h-4z" />
    <path d="M20 24h8" />
  </svg>
);

const IdCardIcon = () => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="h-10 w-10"
  >
    <rect x="10" y="12" width="28" height="24" rx="3" />
    <circle cx="19" cy="22" r="3.5" />
    <path d="M14 30c1.2-2.2 3-3.5 5-3.5s3.8 1.3 5 3.5" />
    <path d="M26 20h8M26 25h8" />
  </svg>
);

const TicketIcon = () => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="h-10 w-10"
  >
    <path d="M8 16a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v4a4 4 0 0 0 0 8v4a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4v-4a4 4 0 0 0 0-8z" />
    <path d="M30 12v24" />
    <path d="M24 20h4M24 28h4" />
  </svg>
);

export const SPECIAL_FEATURES: FeatureCard[] = [
  {
    title: "Competitive Pricing",
    description: "Our memberships services are available at very reasonable fees.",
    Icon: PricingIcon,
  },
  {
    title: "Best Services",
    description: "This memberships will allow to visit a huge number of fitness centers and hotels.",
    Icon: RibbonIcon,
  },
  {
    title: "Special Promotions",
    description: "We Provide special promotions and discounts of Elite Sport memberships.",
    Icon: GlobeIcon,
  },
  {
    title: "Health Club",
    description: "The first health club membership that is offered by a private company.",
    Icon: DumbbellIcon,
  },
  {
    title: "Family Membership",
    description: "We offer a family membership that the whole family members can enjoy its services.",
    Icon: IdCardIcon,
  },
  {
    title: "Kids Passes",
    description: "This membership also have special passes for kids to enjoy.",
    Icon: TicketIcon,
  },
];

const motionSectionProps = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
};

const staggerChildren = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.15 },
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

type SpecialFeaturesSectionProps = {
  features?: FeatureCard[];
  className?: string;
};

export const SpecialFeaturesSection = ({
  features = SPECIAL_FEATURES,
  className,
}: SpecialFeaturesSectionProps) => {
  return (
    <motion.section
      {...motionSectionProps}
      className={cn(
        "bg-[#ece6c9] py-28 text-brand-black lg:py-36",
        className
      )}
    >
      <Container>
        <div className="mb-16 flex justify-center">
          <motion.div {...fadeInUp} className="flex items-center gap-3">
            <span className="text-lg font-semibold uppercase tracking-[0.28em] text-[#6c86a6] md:text-xl">
              What
            </span>
            <span className="rounded-sm bg-brand-black px-5 py-3 text-lg font-semibold uppercase tracking-[0.28em] text-[#5f86ad] md:text-xl">
              Makes Us Special?
            </span>
          </motion.div>
        </div>

        <motion.div
          {...staggerChildren}
          className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12"
        >
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              {...fadeInUp}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-4"
            >
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#5f86ad] text-white shadow-md">
                <feature.Icon />
              </div>
              <div className="space-y-2 pt-1">
                <h3 className="text-xl font-semibold text-brand-black">
                  {feature.title}
                </h3>
                <p className="text-base leading-relaxed text-[#6b6764]">
                  {feature.description}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </Container>
    </motion.section>
  );
};
