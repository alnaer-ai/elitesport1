
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { ButtonLink } from "@/components/ButtonLink";

type AboutTeaserProps = {
    imageUrl?: string | null;
};

export const AboutTeaser = ({ imageUrl }: AboutTeaserProps) => {
    return (
        <section className="py-12 lg:py-16 overflow-hidden">
            <Container>
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
                    {/* Image Column */}
                    <motion.div
                        className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] lg:order-1"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        // Fix easing type
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
                    >
                        <Image
                            src={imageUrl || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2400&q=80"}
                            alt="Luxury resort pool at sunset"
                            fill
                            className="object-cover transition-transform duration-700 hover:scale-105"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                        {/* Subtle overlay for depth if needed, but requested 'clean' so maybe not */}
                    </motion.div>

                    {/* Text Column */}
                    <motion.div
                        className="lg:order-2"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
                    >
                        <div className="space-y-8">
                            <h2 className="font-display text-4xl leading-[1.1] tracking-[-0.02em] text-brand-ivory sm:text-5xl lg:text-6xl">
                                A Better Way
                                <br />
                                <span className="text-brand-gold">to Live</span>
                            </h2>

                            <p className="max-w-xl text-lg leading-[1.8] text-brand-gray">
                                Experience a luxury style of life. EliteSport gives you unlimited access to health
                                clubs across the UAE — gyms, saunas, swimming pools, beaches, and more — with extra
                                discounts at restaurants, cafes, training or sports classes, and spas.
                            </p>

                            <div>
                                <ButtonLink href="/about" variant="primary">
                                    Learn More About Us
                                </ButtonLink>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Container>
        </section>
    );
};
