import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";
import { Container } from "./Container";
import { cn } from "@/lib/cn";

const steps = [
    {
        number: "01",
        title: "Choose Your Membership",
        description:
            "Pick the perfect plan for your lifestyle and unlock the gateway to exclusive experiences.",
        image: "/how-to-subscribe/step1.jpg",
    },
    {
        number: "02",
        title: "Activate the App",
        description:
            "Create your account and explore all the Elite Sport privileges right at your fingertips.",
        image: "/how-to-subscribe/step2.jpg",
    },
    {
        number: "03",
        title: "Start Your Elite Journey",
        description:
            "Use the app to book visits, access venues seamlessly, and enjoy exclusive discounts.",
        image: "/how-to-subscribe/step3.jpg",
    },
];

const sectionVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
    },
};

type StepCardProps = {
    step: typeof steps[0];
    index: number;
    scrollX: MotionValue<number>;
};

function ScalableStepCard({ step, index, scrollX }: StepCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    // Card dimensions for scroll-based scaling
    const cardWidth = 320;
    const gap = 24;
    const stepSize = cardWidth + gap;
    const target = index * stepSize;

    const scale = useTransform(
        scrollX,
        [target - stepSize, target, target + stepSize],
        [0.9, 1, 0.9]
    );

    const opacity = useTransform(
        scrollX,
        [target - stepSize, target, target + stepSize],
        [0.6, 1, 0.6]
    );

    return (
        <motion.div
            ref={cardRef}
            style={{
                scale,
                opacity,
            }}
            className="snap-center flex-shrink-0 md:!scale-100 md:!opacity-100 md:w-full"
        >
            <div className="w-[320px] md:w-full glass-card premium-card p-0 overflow-hidden">
                {/* Image container */}
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                    <Image
                        src={step.image}
                        alt={step.title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                    {/* Step number with line */}
                    <div className="flex items-center gap-3">
                        <span className="text-brand-gold font-display text-lg italic">
                            {step.number}
                        </span>
                        <div className="flex-1 h-px bg-brand-gold/30" />
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-xl text-brand-ivory">
                        {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-brand-gray text-sm leading-relaxed">
                        {step.description}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

export const HowToSubscribe = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { scrollX } = useScroll({ container: scrollContainerRef });

    return (
        <motion.section
            className="py-16 md:py-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={sectionVariants}
        >
            <Container className="space-y-12">
                {/* Section header */}
                <div className="space-y-4 text-center md:text-left">
                    <p className="text-xs uppercase tracking-[0.4em] text-brand-lightBlue">
                        Getting Started
                    </p>
                    <h2 className="text-3xl text-brand-ivory sm:text-4xl font-display">
                        How to Subscribe
                    </h2>
                    <p className="text-base text-brand-gray/90 sm:max-w-3xl">
                        Join our elite community in three simple steps and unlock a world of premium experiences.
                    </p>
                </div>

                {/* Scrollable container for mobile, grid for desktop */}
                <div className="relative -mx-4 md:mx-0">
                    <div
                        ref={scrollContainerRef}
                        className={cn(
                            "flex overflow-x-auto snap-x snap-mandatory scrollbar-hide py-10 px-4 md:px-0",
                            "md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:snap-none md:py-0",
                            "cursor-grab active:cursor-grabbing md:cursor-auto",
                            "content-start items-center"
                        )}
                        style={{
                            scrollBehavior: "smooth",
                            WebkitOverflowScrolling: "touch"
                        }}
                    >
                        {/* Spacer for centering start - hidden on desktop */}
                        <div className="w-[10vw] flex-shrink-0 md:hidden" />

                        {steps.map((step, index) => (
                            <ScalableStepCard
                                key={step.number}
                                step={step}
                                index={index}
                                scrollX={scrollX}
                            />
                        ))}

                        {/* Spacer for centering end - hidden on desktop */}
                        <div className="w-[10vw] flex-shrink-0 md:hidden" />
                    </div>

                    {/* Fade Effects - hidden on desktop */}
                    <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-brand-black/90 to-transparent pointer-events-none md:hidden" />
                    <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-brand-black/90 to-transparent pointer-events-none md:hidden" />
                </div>
            </Container>
        </motion.section>
    );
};
