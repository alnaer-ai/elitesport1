import Head from "next/head";
import { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from "next";
import { useState } from "react";

import { Container } from "@/components/Container";
import { MembershipCard } from "@/components/MembershipCard";
import { TierCardShell } from "@/components/TierCardShell";
import {
    type MembershipTier,
    getAvailablePlanTypes,
    buildTiersForPlanType,
    getMemberships,
    collectMembershipTiers,
    getTierSlug,
    getTierColor,
} from "@/lib/membership";
import { cn } from "@/lib/cn";

type PlanPageProps = {
    tier: MembershipTier | null;
    slug: string;
    tierColor: string;
};

// Allowed slugs mapping to tier names
const ALLOWED_SLUGS = ["bronze", "silver", "gold", "she", "gym"];

export default function PlanPage({
    tier,
    slug,
    tierColor,
}: InferGetStaticPropsType<typeof getStaticProps>) {
    // If no tier found, show empty state
    if (!tier) {
        return (
            <Container className="py-32">
                <div className="glass-card flex flex-col items-center justify-center border border-dashed border-white/10 py-20 text-center">
                    <h1 className="text-2xl font-light text-brand-ivory">Plan Not Available</h1>
                    <p className="mt-2 text-brand-gray">
                        The requested membership plan is currently unavailable.
                    </p>
                </div>
            </Container>
        );
    }

    const activeTier = tier;

    // Parse descriptionHtml to extract hotels/gyms and services
    const parseDescriptionContent = (html?: string) => {
        if (!html) return { hotelsGyms: [], services: [] };

        // Convert HTML to text with line breaks preserved
        const text = html
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<\/div>/gi, "\n")
            .replace(/<\/p>/gi, "\n")
            .replace(/<[^>]+>/g, "");

        const lines = text
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l.length > 0);

        const hotelsGyms: string[] = [];
        const services: string[] = [];

        let inHotelsSection = false;
        let inServicesSection = false;

        for (const line of lines) {
            // Detect section headers
            if (/health\s*clubs|hotels|gyms|resorts/i.test(line) && /list|below|includes/i.test(line)) {
                inHotelsSection = true;
                inServicesSection = false;
                continue;
            }
            if (/services?\s*offered/i.test(line)) {
                inServicesSection = true;
                inHotelsSection = false;
                continue;
            }

            // Skip header-like lines
            if (/^(this plan|plan includes)/i.test(line)) continue;

            // Clean the line from bullets/dashes
            const cleanedLine = line.replace(/^[-_*•\s]+/, "").trim();
            if (!cleanedLine) continue;

            // Categorize based on current section
            if (inServicesSection) {
                services.push(cleanedLine);
            } else if (inHotelsSection) {
                hotelsGyms.push(cleanedLine);
            } else {
                // If no section detected yet, use keyword matching
                const venueKeywords = /hotel|gym|club|resort|fitness|millennium|rotana|vogo|metropolitan|khalidiya|etizan|ufc/i;
                if (venueKeywords.test(cleanedLine)) {
                    hotelsGyms.push(cleanedLine);
                } else {
                    services.push(cleanedLine);
                }
            }
        }

        return { hotelsGyms, services };
    };

    const { hotelsGyms, services } = activeTier
        ? parseDescriptionContent(activeTier.descriptionHtml)
        : { hotelsGyms: [], services: [] };

    return (
        <>
            <Head>
                <title>{`${tier.name} Membership | EliteSport`}</title>
                <meta
                    name="description"
                    content={`Discover the benefits of the ${tier.name} membership tier at EliteSport.`}
                />
            </Head>

            <div className="space-y-16 pb-20">
                {/* Header Section */}
                <div className="pt-24 md:pt-32">
                    <Container>
                        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                            <div className="max-w-2xl space-y-4">
                                <p className="text-xs uppercase tracking-[0.5em] text-brand-lightBlue">
                                    Membership Tier
                                </p>
                                <h1 className="text-4xl font-light text-brand-ivory md:text-5xl lg:text-6xl">
                                    {tier.name} Plan
                                </h1>
                                <p className="max-w-xl text-lg text-brand-gray">
                                    {tier.description}
                                </p>
                            </div>
                        </div>
                    </Container>
                </div>

                {/* Membership Spotlight & Services */}
                <Container>
                    <div className="grid gap-12 lg:grid-cols-12">
                        {/* Left: Card Spotlight */}
                        <div className="lg:col-span-5 xl:col-span-4">
                            {activeTier ? (
                                <div className="sticky top-24">
                                    <MembershipCard
                                        tier={activeTier}
                                        index={0}
                                        fallbackCtaHref="/contact"
                                    />
                                </div>
                            ) : (
                                <div className="glass-card p-10 text-center text-brand-gray">
                                    Plan details unavailable.
                                </div>
                            )}
                        </div>

                        {/* Right: Services Offered Card */}
                        <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
                            {activeTier && services.length > 0 ? (
                                <TierCardShell tier={activeTier} className="p-8">
                                    <div className="text-white">
                                        <h2 className="text-2xl font-semibold text-white drop-shadow-md">
                                            Services Offered
                                        </h2>
                                        <ul className="mt-6 space-y-2 list-disc list-inside">
                                            {services.map((service, i) => (
                                                <li
                                                    key={i}
                                                    className="text-sm font-medium text-white/90 leading-relaxed marker:text-white/60"
                                                >
                                                    {service}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </TierCardShell>
                            ) : activeTier ? (
                                <TierCardShell tier={activeTier} className="p-8">
                                    <div className="text-white">
                                        <h2 className="text-2xl font-semibold text-white drop-shadow-md">
                                            Services Offered
                                        </h2>
                                        <p className="mt-4 text-white/70">
                                            Services list coming soon.
                                        </p>
                                    </div>
                                </TierCardShell>
                            ) : (
                                <div className="glass-card p-10 text-center text-brand-gray">
                                    Services information unavailable.
                                </div>
                            )}
                        </div>
                    </div>
                </Container>

                {/* Hotels & Gyms Section - Separate Card */}
                {activeTier && hotelsGyms.length > 0 && (
                    <Container>
                        <TierCardShell tier={activeTier} className="p-8 md:p-12">
                            <div className="text-white">
                                <div className="text-center sm:text-left mb-8">
                                    <p className="text-xs uppercase tracking-[0.5em] text-white/80 font-semibold">
                                        Locations
                                    </p>
                                    <h2 className="mt-3 text-3xl font-semibold text-white drop-shadow-md">
                                        Hotels & Gyms
                                    </h2>
                                    <p className="mt-2 text-white/90 font-medium">
                                        Access these premier venues with your membership.
                                    </p>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {hotelsGyms.map((venue, i) => (
                                        <div
                                            key={i}
                                            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/90 shadow-[0_10px_40px_-30px_rgba(0,0,0,0.8)]"
                                        >
                                            {venue}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TierCardShell>
                    </Container>
                )}
            </div>
        </>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: ALLOWED_SLUGS.map((slug) => ({ params: { slug } })),
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps<PlanPageProps> = async ({ params }) => {
    const slug = params?.slug as string;

    // Use static mock data
    const memberships = getMemberships();
    const tiers = collectMembershipTiers(memberships);

    // Find matching tier by slug
    const tierIndex = tiers.findIndex((t) => getTierSlug(t.name) === slug);
    const tier = tierIndex >= 0 ? tiers[tierIndex] : null;
    const tierColor = tier ? getTierColor(tier, tierIndex) : "#f4b942";

    return {
        props: {
            tier,
            slug,
            tierColor,
        },
    };
};
