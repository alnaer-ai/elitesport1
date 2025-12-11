import Head from "next/head";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { ChangeEvent, FormEvent, useState } from "react";

import { Container } from "@/components/Container";
import { sanityClient } from "@/lib/sanity.client";

type ContactHours = {
  label?: string;
  value?: string;
};

type ContactInfo = {
  address?: string;
  phone?: string;
  email?: string;
  introText?: string;
  mapLocation?: {
    lat?: number;
    lng?: number;
  };
  hours?: ContactHours[];
};

type ContactPageProps = {
  contact: ContactInfo | null;
};

const CONTACT_INFO_QUERY = `
  *[_type == "contactInfo"][0]{
    address,
    phone,
    email,
    introText,
    mapLocation{
      lat,
      lng
    },
    hours[]{
      label,
      value
    }
  }
`;

const defaultIntro =
  "We would love to hear from you. Please reach out with any questions or collaboration ideas.";

const sanitizePhone = (phone?: string) =>
  phone ? phone.replace(/[^+\d]/g, "") : undefined;

export default function ContactPage({
  contact,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const introText = contact?.introText || defaultIntro;
  const address = contact?.address || "EliteSport Headquarters";
  const phoneHref = sanitizePhone(contact?.phone);
  const emailAddress = contact?.email;
  const hours = contact?.hours?.filter((item) => item?.label && item?.value) ?? [];
  const lat = contact?.mapLocation?.lat;
  const lng = contact?.mapLocation?.lng;

  const mapSrc =
    typeof lat === "number" && typeof lng === "number"
      ? `https://www.google.com/maps?q=${lat},${lng}&z=14&output=embed`
      : `https://www.google.com/maps?q=${encodeURIComponent(address)}&z=12&output=embed`;

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setStatusMessage(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage("Thank you for reaching out! We will respond shortly.");
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
        <div className="space-y-4 text-center sm:text-left">
          <p className="text-xs uppercase tracking-[0.5em] text-brand-lightBlue">
            Get In Touch
          </p>
          <h1 className="text-4xl font-semibold text-brand-ivory sm:text-5xl">
            Contact Us
          </h1>
          <p className="mx-auto max-w-3xl text-base text-brand-gray sm:mx-0">
            {introText}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="space-y-8 rounded-3xl border border-brand-deepBlue/60 bg-brand-deepBlue/20 p-8 shadow-2xl shadow-brand-deepBlue/20">
            <div>
              <h2 className="text-xl font-semibold text-brand-ivory">
                Contact Details
              </h2>
              <p className="mt-3 whitespace-pre-line text-brand-gray">{address}</p>
            </div>

            <dl className="space-y-5 text-sm">
              {contact?.phone && phoneHref && (
                <div>
                  <dt className="text-xs uppercase tracking-[0.35em] text-brand-lightBlue">
                    Phone
                  </dt>
                  <dd>
                    <a
                      href={`tel:${phoneHref}`}
                      className="text-base text-brand-ivory transition hover:text-brand-gold"
                    >
                      {contact.phone}
                    </a>
                  </dd>
                </div>
              )}

              {emailAddress && (
                <div>
                  <dt className="text-xs uppercase tracking-[0.35em] text-brand-lightBlue">
                    Email
                  </dt>
                  <dd>
                    <a
                      href={`mailto:${emailAddress}`}
                      className="text-base text-brand-ivory transition hover:text-brand-gold"
                    >
                      {emailAddress}
                    </a>
                  </dd>
                </div>
              )}

              {hours.length > 0 && (
                <div>
                  <dt className="text-xs uppercase tracking-[0.35em] text-brand-lightBlue">
                    Hours
                  </dt>
                  <dd className="mt-3 space-y-2 text-base text-brand-gray">
                    {hours.map((hour) => (
                      <div key={`${hour.label}-${hour.value}`}>{hour.label}: {hour.value}</div>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="overflow-hidden rounded-3xl border border-brand-deepBlue/60 bg-brand-deepBlue/10">
            <iframe
              title="EliteSport location"
              src={mapSrc}
              className="h-[360px] w-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="rounded-3xl border border-brand-deepBlue/60 bg-brand-deepBlue/30 p-8 shadow-2xl shadow-brand-deepBlue/20">
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
                className="inline-flex w-full items-center justify-center rounded-full bg-brand-gold px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-brand-black transition hover:bg-brand-lightBlue hover:text-brand-ivory md:w-auto"
              >
                Send Message
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
  const client = sanityClient;
  if (!client) {
    return {
      props: {
        contact: null,
      },
      revalidate: 60,
    };
  }

  const contact = await client.fetch<ContactInfo | null>(CONTACT_INFO_QUERY);

  return {
    props: {
      contact,
    },
    revalidate: 60,
  };
};
