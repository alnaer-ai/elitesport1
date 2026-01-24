import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "./Container";

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

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    },
};

const sectionVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
    },
};

export const HowToSubscribe = () => {
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

                {/* Steps grid */}
                <motion.div
                    className="grid gap-8 md:grid-cols-3"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.12 } },
                    }}
                >
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.number}
                            className="glass-card premium-card p-0 overflow-hidden"
                            variants={cardVariants}
                        >
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
                        </motion.div>
                    ))}
                </motion.div>
            </Container>
        </motion.section>
    );
};
