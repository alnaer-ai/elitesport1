
import { motion } from "framer-motion";
import { Container } from "@/components/Container";

import { CreditCard, Medal, Tag } from "lucide-react";

const items = [
    {
        title: "Competitive Pricing",
        description:
            "Our memberships services are available at very reasonable fees.",
        icon: <CreditCard className="h-8 w-8" />,
    },
    {
        title: "Best Services",
        description:
            "Our memberships allow you to visit a huge number of fitness centers and hotels.",
        icon: <Medal className="h-8 w-8" />,
    },
    {
        title: "Special Promotions",
        description:
            "We provide special promotions and discounts of Elite Sport memberships.",
        icon: <Tag className="h-8 w-8" />,
    },
];

export const ValueHighlights = () => {
    return (
        <section className="relative overflow-hidden py-12">
            <Container>
                <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
                    {items.map((item, idx) => (
                        <motion.div
                            key={idx}
                            className="group flex flex-col items-start space-y-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                        >
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-deepBlue/50 text-brand-gold ring-1 ring-white/10 transition-colors duration-300 group-hover:bg-brand-gold group-hover:text-brand-black">
                                {item.icon}
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-display text-xl text-brand-ivory transition-colors duration-300 group-hover:text-brand-gold">
                                    {item.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-brand-gray/90">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </section>
    );
};
