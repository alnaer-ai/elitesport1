import Head from "next/head";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { ChangeEvent, FormEvent, useState } from "react";

import { Container } from "@/components/Container";
import { MembershipSelect, type MembershipTier } from "@/components/contact/MembershipSelect";
import { PlanTypeSelect, type PlanType } from "@/components/contact/PlanTypeSelect";
import { getPageHero, type HeroPayload } from "@/lib/mockData";

type ContactPageProps = {
  hero: HeroPayload | null;
};

export default function ContactPage({
  hero,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    membership: "" as MembershipTier | "",
    planType: "Single" as PlanType,
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setStatusMessage(null);
  };

  const handleMembershipChange = (value: MembershipTier) => {
    setFormData((prev) => {
      const isRestricted = value === "Gym" || value === "She";
      return {
        ...prev,
        membership: value,
        planType: isRestricted ? "Single" : prev.planType,
      };
    });
    setStatusMessage(null);
  };

  const handlePlanTypeChange = (value: PlanType) => {
    setFormData((prev) => ({ ...prev, planType: value }));
    setStatusMessage(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.membership) {
      setStatusMessage("Please select a membership option.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setStatusMessage(data.message);
        // Reset form on success
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          membership: "" as MembershipTier | "",
          planType: "Single" as PlanType,
        });
      } else {
        setStatusMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatusMessage("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us | EliteSport</title>
        <meta
          name="description"
          content="Reach EliteSport for memberships, partnerships, or press inquiries."
        />
      </Head>

      <Container className="space-y-12">
        <div className="space-y-5 text-center">
          {hero?.title && (
            <h1 className="font-display text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-brand-ivory sm:text-4xl sm:leading-[1.08] sm:tracking-[-0.025em] lg:text-5xl lg:leading-[1.06] lg:tracking-[-0.03em]">
              {hero.title}
            </h1>
          )}
          {hero?.subtitle && (
            <p className="font-sans text-base font-light leading-[1.7] tracking-[0.01em] text-brand-ivory sm:text-lg sm:leading-[1.75] sm:tracking-[0.015em] md:text-xl md:leading-[1.8]">
              {hero.subtitle}
            </p>
          )}
        </div>

        <div className="glass-card premium-card p-8">
          <h2 className="text-2xl font-semibold text-brand-ivory">Send Us a Message</h2>
          <p className="mt-3 text-sm text-brand-gray">
            Share a question, partnership idea, or membership request.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2"
            noValidate
          >
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs uppercase tracking-[0.3em] text-brand-lightBlue">
                Name
              </label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                autoComplete="name"
                className="w-full rounded-xl border border-brand-deepBlue/60 bg-brand-black/40 px-4 py-3 text-brand-ivory placeholder:text-brand-gray focus:border-brand-gold focus:outline-none"
                placeholder="Your full name"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-xs uppercase tracking-[0.3em] text-brand-lightBlue">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                autoComplete="email"
                className="w-full rounded-xl border border-brand-deepBlue/60 bg-brand-black/40 px-4 py-3 text-brand-ivory placeholder:text-brand-gray focus:border-brand-gold focus:outline-none"
                placeholder="name@company.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-xs uppercase tracking-[0.3em] text-brand-lightBlue">
                Phone (Optional)
              </label>
              <input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                autoComplete="tel"
                className="w-full rounded-xl border border-brand-deepBlue/60 bg-brand-black/40 px-4 py-3 text-brand-ivory placeholder:text-brand-gray focus:border-brand-gold focus:outline-none"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="md:col-span-2 space-y-8 border-y border-brand-deepBlue/30 py-8">
              <MembershipSelect
                selected={formData.membership}
                onChange={handleMembershipChange}
              />

              <PlanTypeSelect
                selected={formData.planType}
                onChange={handlePlanTypeChange}
                isFamilyDisabled={
                  formData.membership === "Gym" || formData.membership === "She"
                }
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="message" className="text-xs uppercase tracking-[0.3em] text-brand-lightBlue">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleInputChange}
                required
                autoComplete="off"
                className="w-full rounded-xl border border-brand-deepBlue/60 bg-brand-black/40 px-4 py-3 text-brand-ivory placeholder:text-brand-gray focus:border-brand-gold focus:outline-none"
                placeholder="Let us know how we can help."
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-full bg-brand-gold px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-brand-black transition hover:bg-brand-lightBlue hover:text-brand-ivory disabled:opacity-50 disabled:cursor-not-allowed md:w-auto"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>

          {statusMessage && (
            <p className="mt-6 text-sm text-brand-gold" aria-live="polite">
              {statusMessage}
            </p>
          )}
        </div>
      </Container>
    </>
  );
}

export const getStaticProps: GetStaticProps<ContactPageProps> = async () => {
  const hero = getPageHero("contact");

  return {
    props: {
      hero: hero ?? null,
    },
    revalidate: 60,
  };
};
