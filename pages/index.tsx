import Image from "next/image";
import { ReactNode } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { cn } from "@/lib/cn";

const heroHighlights = [
  { label: "Destinations", value: "45+" },
  { label: "Wellness Experts", value: "120" },
  { label: "Private Members", value: "3.5k" },
];

const popularPlaces = [
  {
    name: "Aurora Performance Club",
    location: "Dubai • United Arab Emirates",
    description:
      "Skyline conditioning suites with ocean-view recovery lounges and curated training blocks.",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=80",
  },
  {
    name: "Elysian Wellness Retreat",
    location: "St. Moritz • Switzerland",
    description:
      "Altitude spa circuits paired with Nordic hydrotherapy and bespoke strength coaching.",
    image:
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1600&q=80",
  },
  {
    name: "Harborfront Athletic Loft",
    location: "Singapore",
    description:
      "Members-only rooftop laps, infrared saunas, and guided movement diagnostics.",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80",
  },
  {
    name: "Solstice Recovery Pavilion",
    location: "Malibu • California",
    description:
      "Sunset reformer studios, cryotherapy domes, and chef-crafted restoration menus.",
    image:
      "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1600&q=80",
  },
];

const nearbyPlaces = [
  {
    name: "Marina Strength Loft",
    distance: "2.1 km away",
    description: "24/7 concierge coaching pods with heated lap pool access.",
    image:
      "https://images.unsplash.com/photo-1554344728-77cf90d9ed26?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Harborline Recovery Suites",
    distance: "3.4 km away",
    description: "Private physiotherapy cabins overlooking the city marina.",
    image:
      "https://images.unsplash.com/photo-1484287482475-e09c8a9f8d5c?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Skyline Tempo Studio",
    distance: "4.0 km away",
    description: "Altitude-inspired tread circuits and AI-powered training insights.",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Lumen Balance Atelier",
    distance: "5.8 km away",
    description: "Mind-body residencies with candlelit reformer sessions and tea bar.",
    image:
      "https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?auto=format&fit=crop&w=900&q=80",
  },
];

const promotions = [
  {
    title: "20% Off Spa Immersions",
    description: "Reserve a three-hour thermal journey with cryo-facial finale.",
    code: "REVIVE20",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Complimentary Coach Session",
    description: "Enjoy a personalized Lab Assessment with any new membership tier.",
    code: "LABCOACH",
    image:
      "https://images.unsplash.com/photo-1445384763658-0400939829cd?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Weekday Lounge Access",
    description: "Bring a guest to the Horizon Recovery Lounge Monday through Friday.",
    code: "DUOPASS",
    image:
      "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1200&q=80",
  },
];

const clients = [
  "Momentum Capital",
  "Nova Athletics",
  "Celestia Resorts",
  "Luxe Medical",
  "Arclight Group",
  "Horizon Hotels",
];

const partners = [
  "Aether Labs",
  "Pulse Nutrition",
  "Goldleaf Travel",
  "Orion Aviation",
  "Vitali Tech",
  "Summit Coaching",
];

const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Home() {
  return (
    <div className="space-y-20 pb-24">
      <Hero />
      <Section
        eyebrow="Elite Destinations"
        title="Most Popular Places"
        description="Curated residences and training spaces where performance, hospitality, and wellness are seamlessly woven together."
      >
        <motion.div
          className="grid gap-8 md:grid-cols-2 xl:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
        >
          {popularPlaces.map((place) => (
            <motion.article
              key={place.name}
              variants={cardVariants}
              className="group overflow-hidden rounded-3xl border border-brand-deepBlue/40 bg-brand-black/60 shadow-lg shadow-brand-black/40"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={place.image}
                  alt={place.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-xs uppercase tracking-[0.4em] text-brand-lightBlue">
                    {place.location}
                  </p>
                  <p className="mt-2 font-display text-2xl text-brand-ivory">
                    {place.name}
                  </p>
                </div>
              </div>
              <p className="px-5 py-6 text-sm text-brand-gray/90">
                {place.description}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </Section>

      <Section
        eyebrow="Nearby Escapes"
        title="Places Within Reach"
        description="Stay spontaneous. Explore impeccably serviced places curated for members within a short drive."
        className="bg-brand-deepBlue/30"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {nearbyPlaces.map((place) => (
            <motion.article
              key={place.name}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="flex gap-4 rounded-3xl border border-brand-deepBlue/60 bg-brand-black/70 p-4 shadow-lg shadow-brand-black/30"
              whileHover={{ y: -6 }}
            >
              <div className="relative h-32 w-32 overflow-hidden rounded-2xl">
                <Image
                  src={place.image}
                  alt={place.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-brand-lightBlue">
                    {place.distance}
                  </p>
                  <h3 className="mt-2 text-lg text-brand-ivory">{place.name}</h3>
                  <p className="mt-2 text-sm text-brand-gray/90">
                    {place.description}
                  </p>
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">
                  View Details
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Member Exclusives"
        title="Recent Promotions"
        description="Seasonal benefits for members, refreshed weekly with bespoke privileges."
      >
        <motion.div
          className="flex gap-6 overflow-x-auto pb-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
        >
          {promotions.map((promo) => (
            <motion.article
              key={promo.title}
              variants={cardVariants}
              className="relative min-w-[260px] flex-1 overflow-hidden rounded-3xl border border-brand-deepBlue/60 bg-brand-black/70 shadow-glow sm:min-w-[320px]"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative h-48">
                <Image
                  src={promo.image}
                  alt={promo.title}
                  fill
                  sizes="(max-width: 768px) 80vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20" />
                <div className="absolute bottom-4 left-4 rounded-full bg-brand-black/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-ivory/80">
                  Limited
                </div>
              </div>
              <div className="space-y-3 px-6 py-6">
                <h3 className="text-xl text-brand-ivory">{promo.title}</h3>
                <p className="text-sm text-brand-gray/80">{promo.description}</p>
                <div className="inline-flex items-center gap-3 rounded-full border border-brand-lightBlue/20 bg-brand-lightBlue/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-lightBlue">
                  Code: {promo.code}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </Section>

      <Section
        eyebrow="Trusted by Leaders"
        title="Our Clients & Partners"
        description="World-renowned brands and tastemakers rely on EliteSport to curate elevated training everywhere."
        className="bg-brand-deepBlue/20"
      >
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-brand-lightBlue">
              Our Clients
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {clients.map((client) => (
                <motion.div
                  key={client}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  className="flex h-24 items-center justify-center rounded-2xl border border-brand-deepBlue/50 bg-brand-black/60 text-center text-sm font-semibold text-brand-ivory/80"
                  whileHover={{ scale: 1.03 }}
                >
                  {client}
                </motion.div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-brand-lightBlue">
              Our Partners
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {partners.map((partner) => (
                <motion.div
                  key={partner}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  className="flex h-24 items-center justify-center rounded-2xl border border-brand-lightBlue/20 bg-brand-lightBlue/5 text-center text-sm font-semibold text-brand-ivory/90"
                  whileHover={{ scale: 1.03 }}
                >
                  {partner}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

const Hero = () => {
  return (
    <section className="relative overflow-hidden border-b border-brand-deepBlue/50">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-deepBlue via-brand-black to-brand-black" />
        <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-brand-gold/10 blur-[140px]" />
        <div className="absolute left-[10%] top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-brand-lightBlue/10 blur-3xl" />
      </div>
      <Container className="relative z-10 flex flex-col gap-12 py-24 lg:flex-row lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-8"
        >
          <p className="text-xs uppercase tracking-[0.6em] text-brand-lightBlue">
            Welcome to EliteSport
          </p>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold text-brand-ivory sm:text-5xl lg:text-6xl">
              Discover Elite Fitness & Luxury Wellness
            </h1>
            <p className="text-base text-brand-gray sm:text-lg">
              Immerse yourself in a network of iconic clubs, five-star spas, and private studios designed
              for travelers who expect every session to feel like a signature experience.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button>Join Now</Button>
            <Button variant="secondary">Explore Memberships</Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-xl rounded-[32px] border border-brand-deepBlue/60 bg-brand-black/60 p-8 shadow-2xl shadow-brand-black/40"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-brand-lightBlue">
            Members at a glance
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {heroHighlights.map((highlight) => (
              <div key={highlight.label}>
                <p className="text-3xl font-semibold text-brand-gold">
                  {highlight.value}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-brand-gray/80">
                  {highlight.label}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-2xl border border-brand-lightBlue/30 bg-brand-lightBlue/10 p-6 text-sm text-brand-ivory/90">
            &ldquo;EliteSport delivered an effortless wellness itinerary across three cities in one weekend.
            Concierge coaches arranged every training window and recovery ritual for us.&rdquo;
          </div>
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-brand-gray/70">
            — Guest Member, New York
          </p>
        </motion.div>
      </Container>
    </section>
  );
};

const Section = ({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <motion.section
      className={cn("py-16", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={sectionVariants}
    >
      <Container className="space-y-10 py-0">
        <div className="space-y-4 text-center md:text-left">
          <p className="text-xs uppercase tracking-[0.4em] text-brand-lightBlue">
            {eyebrow}
          </p>
          <h2 className="text-3xl text-brand-ivory sm:text-4xl">{title}</h2>
          {description && (
            <p className="text-base text-brand-gray/90 sm:max-w-3xl">
              {description}
            </p>
          )}
        </div>
        {children}
      </Container>
    </motion.section>
  );
};
