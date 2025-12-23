import React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { cn } from "@/lib/cn";

import { CreditCard, Medal, Tag, Dumbbell, Users, Baby } from "lucide-react";

export type FeatureCard = {
  title: string;
  description: string;
  Icon: () => React.ReactElement;
};

export const SPECIAL_FEATURES: FeatureCard[] = [
  {
    title: "Competitive Pricing",
    description: "Our memberships services are available at very reasonable fees.",
    Icon: () => <CreditCard className="h-8 w-8" />,
  },
  {
    title: "Best Services",
    description: "This memberships will allow to visit a huge number of fitness centers and hotels.",
    Icon: () => <Medal className="h-8 w-8" />,
  },
  {
    title: "Special Promotions",
    description: "We Provide special promotions and discounts of Elite Sport memberships.",
    Icon: () => <Tag className="h-8 w-8" />,
  },
  {
    title: "Health Club",
    description: "The first health club membership that is offered by a private company.",
    Icon: () => <Dumbbell className="h-8 w-8" />,
  },
  {
    title: "Family Membership",
    description: "We offer a family membership that the whole family members can enjoy its services.",
    Icon: () => <Users className="h-8 w-8" />,
  },
  {
    title: "Kids Passes",
    description: "This membership also have special passes for kids to enjoy.",
    Icon: () => <Baby className="h-8 w-8" />,
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
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
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
        "py-24 lg:py-32",
        className
      )}
    >
      <Container>
        <div className="mb-20 text-center">
          <motion.div {...fadeInUp} className="flex flex-col items-center gap-4">
            <span className="h-px w-12 bg-brand-gold" />
            <span className="text-xs uppercase tracking-[0.5em] text-brand-gold">
              Why Choose Us
            </span>
          </motion.div>

          <motion.h2
            {...fadeInUp}
            className="mt-6 font-display text-4xl tracking-tight text-brand-ivory sm:text-5xl"
          >
            What Makes Us Special?
          </motion.h2>
        </div>

        <motion.div
          {...staggerChildren}
          className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              {...fadeInUp}
              transition={{ delay: index * 0.1 }}
              className="group relative flex flex-col items-start gap-4"
            >
              <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-ivory/10 bg-brand-deepBlue/30 text-brand-lightBlue transition-colors duration-300 group-hover:border-brand-gold/30 group-hover:text-brand-gold">
                <feature.Icon />
              </div>

              <div className="space-y-3">
                <h3 className="font-display text-xl text-brand-ivory group-hover:text-brand-gold transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-base leading-relaxed text-brand-gray">
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
