import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/cn";

import type { ContactInfo as ContactData } from "@/lib/mockData";

type ContactInfo = Pick<
  ContactData,
  "address" | "mapLocation" | "phone" | "email" | "hours"
>;

type ContactInfoResponse = {
  data: ContactInfo | null;
};

type LayoutProps = {
  children: ReactNode;
};

const NAV_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/memberships", label: "Memberships" },
  { href: "/places", label: "Places" },
  { href: "/promotions", label: "Promotions" },
  { href: "/partners-clients", label: "Partners & Clients" },
];

type SocialIconName = "facebook" | "instagram" | "linkedin" | "whatsapp";

const SOCIAL_LINKS: { href: string; label: string; icon: SocialIconName }[] = [
  { href: "#", label: "Facebook", icon: "facebook" },
  { href: "#", label: "Instagram", icon: "instagram" },
  { href: "#", label: "LinkedIn", icon: "linkedin" },
  { href: "#", label: "WhatsApp", icon: "whatsapp" },
];

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-brand-black text-brand-ivory">
      <a
        href="#main-content"
        className="sr-only absolute left-4 top-4 z-[100] inline-flex items-center rounded-full bg-brand-gold px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-black focus-visible:not-sr-only focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lightBlue"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
};

const SiteHeader = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuId = "primary-navigation";

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleRouteChange = () => setIsMenuOpen(false);

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.events]);

  return (
    <header className="sticky top-0 z-50 text-brand-ivory">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-black/75 via-brand-black/45 to-transparent backdrop-blur-md"
        aria-hidden
      />
      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-3 text-xl font-semibold tracking-tight text-brand-gold"
        >
          <Image
            src="/elitsportlogo-clear.png"
            alt="EliteSport logo"
            width={1600}
            height={1209}
            className="h-12 w-auto drop-shadow-[0_0_10px_rgba(197,163,91,0.5)]"
            priority
          />
        </Link>
        <nav
          className="hidden items-center gap-8 md:flex md:flex-1 md:justify-center"
          aria-label="Primary navigation"
        >
          {NAV_LINKS.map((link) => {
            const isActive = router.pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-200",
                  isActive ? "text-brand-gold" : "text-brand-ivory/80 hover:text-brand-gold"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/contact"
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lightBlue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black",
              "bg-brand-gold text-brand-black hover:bg-brand-lightBlue hover:text-brand-deepBlue shadow-glow"
            )}
          >
            Get in Touch
          </Link>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-brand-deepBlue/70 px-3 py-2 text-brand-ivory transition hover:border-brand-gold hover:text-brand-gold md:hidden"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls={mobileMenuId}
        >
          <span className="sr-only">Toggle navigation</span>
          <div className="space-y-1">
            <span
              className={cn(
                "block h-0.5 w-6 bg-current transition-transform",
                isMenuOpen ? "translate-y-1.5 rotate-45" : ""
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-6 bg-current transition-opacity",
                isMenuOpen ? "opacity-0" : "opacity-100"
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-6 bg-current transition-transform",
                isMenuOpen ? "-translate-y-1.5 -rotate-45" : ""
              )}
            />
          </div>
        </button>
      </div>
      {isMenuOpen && (
        <nav
          id={mobileMenuId}
          className="fixed inset-x-0 top-[80px] z-[60] border-t border-brand-deepBlue/60 bg-brand-black/95 backdrop-blur-xl md:hidden h-[calc(100vh-80px)] overflow-y-auto"
          aria-label="Mobile primary navigation"
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-medium text-brand-ivory/90 transition hover:text-brand-gold border-b border-white/5 pb-4"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className={cn(
                "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lightBlue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black",
                "bg-brand-gold text-brand-black hover:bg-brand-lightBlue hover:text-brand-deepBlue shadow-glow"
              )}
              onClick={closeMenu}
            >
              Get in Touch
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

const SiteFooter = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchContactInfo = async () => {
      try {
        const response = await fetch("/api/contact-info", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload: ContactInfoResponse = await response.json();
        if (isMounted) {
          setContactInfo(payload.data);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("Failed to load contact info:", error);
      }
    };

    fetchContactInfo();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const googleMapsUrl = "https://maps.app.goo.gl/hoVheUudEp7Jveeh9";

  return (
    <footer className="mt-16 border-t border-brand-deepBlue/40 bg-gradient-to-b from-brand-black via-[#0b1422] to-black text-brand-ivory">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(111,175,206,0.12),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(197,163,91,0.14),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(16,54,87,0.18),transparent_45%)]" />
        <div className="absolute left-1/2 top-[-30%] h-80 w-80 -translate-x-1/2 rounded-full bg-brand-lightBlue/5 blur-3xl" />
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-6 p-6">
              <div className="flex items-center gap-3">
                <Image
                  src="/elitsportlogo-clear.png"
                  alt="EliteSport logo"
                  width={220}
                  height={80}
                  className="h-12 w-auto drop-shadow-[0_10px_25px_rgba(0,0,0,0.4)]"
                />
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-gold/80">
                  Membership
                </span>
              </div>
              <p className="hidden text-base leading-relaxed text-brand-ivory/70 md:block">
                EliteSport is your gateway to elevated training destinations, curated access, and unforgettable experiences.
              </p>

              {/* Mobile Download App Section */}
              <div className="space-y-3 md:hidden">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-gold">
                  Download our app
                </p>
                <div className="flex items-center gap-3">
                  <StoreBadge platform="apple" variant="icon" />
                  <StoreBadge platform="google" variant="icon" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-brand-ivory shadow-[0_14px_24px_rgba(0,0,0,0.4)] transition duration-200 hover:-translate-y-0.5 hover:border-brand-gold/70 hover:bg-brand-gold/15 hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lightBlue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black"
                  >
                    <SocialIcon name={social.icon} />
                  </a>
                ))}
              </div>
            </div>

            <div className="hidden space-y-5 lg:block">
              <h3 className="text-xl font-semibold text-brand-ivory">Explore EliteSport</h3>
              <div className="grid gap-3 text-base font-medium text-brand-ivory/70">
                <Link
                  href="/"
                  className="rounded-lg px-2 py-1 transition hover:text-brand-gold hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lightBlue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black"
                >
                  Home
                </Link>
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-lg px-2 py-1 transition hover:text-brand-gold hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lightBlue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/contact"
                  className="rounded-lg px-2 py-1 transition hover:text-brand-gold hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lightBlue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="space-y-5">
              <h3 className="text-xl font-semibold text-brand-ivory">Get In Touch</h3>
              <div className="space-y-4 text-[15px] text-brand-ivory/80">
                <div className="flex gap-3">
                  <span className="mt-1 text-brand-ivory/60">
                    <LocationIcon />
                  </span>
                  <div className="space-y-1">
                    <p className="font-semibold text-brand-ivory">Head Office</p>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-brand-gold transition hover:text-brand-lightBlue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lightBlue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black"
                    >
                      View on Google Maps
                    </a>
                  </div>
                </div>
                <MapPreview googleMapsUrl={googleMapsUrl} />
                <div className="flex gap-3">
                  <span className="mt-1 text-brand-ivory/60">
                    <PhoneIcon />
                  </span>
                  <div className="space-y-1">
                    <p className="font-semibold text-brand-ivory">Call / WhatsApp</p>
                    <a
                      href={`tel:${contactInfo?.phone ?? "+97121234567"}`}
                      className="transition hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lightBlue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black"
                    >
                      {contactInfo?.phone ?? "+971 2 123 4567"}
                    </a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-1 text-brand-ivory/60">
                    <MailIcon />
                  </span>
                  <a
                    href={`mailto:${contactInfo?.email ?? "concierge@elitesport.com"}`}
                    className="font-medium transition hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lightBlue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black"
                  >
                    {contactInfo?.email ?? "concierge@elitesport.com"}
                  </a>
                </div>
              </div>
            </div>

            <div className="hidden space-y-5 lg:block">
              <h3 className="text-xl font-semibold text-brand-ivory">Get The App</h3>
              <p className="text-base leading-relaxed text-brand-ivory/70">
                Enjoy faster access to concierge bookings and on-the-go member perks.
              </p>
              <div className="flex flex-wrap gap-3">
                <StoreBadge platform="google" />
                <StoreBadge platform="apple" />
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-white/5 pt-6 text-xs text-brand-ivory/60 sm:flex-row sm:items-center sm:justify-between">
            <div>© 2025 EliteSport. All rights reserved.</div>

          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ name }: { name: SocialIconName }) => {
  switch (name) {
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
          <path
            fill="currentColor"
            d="M13.4 21v-7.1h2.4l.4-2.8h-2.8V9.2c0-.8.3-1.4 1.4-1.4H16V5.2C15.6 5.1 14.6 5 13.5 5 11 5 9.3 6.5 9.3 8.9v2.2H7v2.8h2.3V21h4.1Z"
          />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
          <path
            fill="currentColor"
            d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm4 3.5A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5Zm0 2a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 12 10.5Zm4-2.8a1.2 1.2 0 1 1 1.2-1.2 1.2 1.2 0 0 1-1.2 1.2Z"
          />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
          <path
            fill="currentColor"
            d="M6.2 9.2H3.5V21h2.7ZM4.9 3a1.7 1.7 0 1 0 0 3.5 1.7 1.7 0 0 0 0-3.5Zm6.6 6.2H8.8V21h2.7v-6.5a2 2 0 0 1 2-2c1 0 1.8.7 1.8 2.2V21h2.7v-7c0-3-1.6-4.4-3.8-4.4a3.5 3.5 0 0 0-3 1.7Z"
          />
        </svg>
      );
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
          <path
            fill="currentColor"
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
          />
        </svg>
      );
    default:
      return null;
  }
};

const LocationIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <path
      fill="currentColor"
      d="M12 2.8a6.2 6.2 0 0 0-6.2 6.2c0 4.3 5 9.9 5.6 10.5a.9.9 0 0 0 1.2 0c.7-.6 5.6-6.2 5.6-10.5A6.2 6.2 0 0 0 12 2.8Zm0 3a3.2 3.2 0 1 1 0 6.4 3.2 3.2 0 0 1 0-6.4Z"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <path
      fill="currentColor"
      d="M19.2 14.2c-1.2 0-2.3-.2-3.4-.6a1.2 1.2 0 0 0-1.2.3l-1.5 1.5a12.6 12.6 0 0 1-5.5-5.5l1.5-1.5c.3-.3.4-.8.3-1.2-.3-1-.5-2-.5-3.1a1.2 1.2 0 0 0-1.2-1.2H4.8A1.2 1.2 0 0 0 3.6 4C3.6 13 11 20.4 20 20.4a1.2 1.2 0 0 0 1.2-1.2v-2.4a1.2 1.2 0 0 0-1.2-1.2Z"
    />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <path
      fill="currentColor"
      d="M4.5 5a2.5 2.5 0 0 0-2.5 2.5v9A2.5 2.5 0 0 0 4.5 19h15a2.5 2.5 0 0 0 2.5-2.5v-9A2.5 2.5 0 0 0 19.5 5h-15Zm0 2h15a.5.5 0 0 1 .5.5v.3l-8 4.7-8-4.7v-.3a.5.5 0 0 1 .5-.5Zm-0.5 3.6 7.4 4.3a1 1 0 0 0 1 0l7.4-4.3V16.5a.5.5 0 0 1-.5.5h-15a.5.5 0 0 1-.5-.5Z"
    />
  </svg>
);

const StoreBadge = ({
  platform,
  variant = "full",
}: {
  platform: "google" | "apple";
  variant?: "full" | "icon";
}) => {
  const isGoogle = platform === "google";
  const APP_STORE_URL = "https://apps.apple.com/ae/app/elite-sport/id1558697337";
  const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.alrumaithyest.elitesport&pli=1";

  const href = isGoogle ? PLAY_STORE_URL : APP_STORE_URL;

  if (variant === "icon") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={isGoogle ? "Get it on Google Play" : "Download on the App Store"}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-gold/10 text-brand-gold shadow-[0_14px_24px_rgba(0,0,0,0.4)] ring-1 ring-brand-gold/20 transition duration-200 hover:-translate-y-0.5 hover:border-brand-gold hover:bg-brand-gold/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lightBlue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black"
      >
        {isGoogle ? <GooglePlayLogo /> : <AppleStoreLogo />}
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative inline-flex h-[72px] w-full max-w-[280px] items-center justify-between gap-3 rounded-2xl bg-gradient-to-br from-brand-gold/15 via-brand-gold/10 to-transparent px-4 py-3 text-sm font-semibold text-brand-ivory/90 shadow-[0_18px_40px_rgba(0,0,0,0.4)] ring-1 ring-brand-gold/25 transition hover:-translate-y-0.5 hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lightBlue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-black/75 text-brand-ivory shadow-[0_12px_25px_rgba(0,0,0,0.35)] ring-1 ring-brand-gold/30 transition duration-200 group-hover:ring-brand-gold/50 group-hover:shadow-[0_16px_28px_rgba(0,0,0,0.45)]">
        {isGoogle ? <GooglePlayLogo /> : <AppleStoreLogo />}
      </span>
      <div className="flex-1 leading-tight">
        <div className="text-[11px] uppercase tracking-[0.16em] text-brand-ivory/65">
          {isGoogle ? "Get it on" : "Download on the"}
        </div>
        <div className="text-base font-semibold">{isGoogle ? "Google Play" : "App Store"}</div>
      </div>
    </a>
  );
};

const AppleStoreLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const GooglePlayLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
  </svg>
);

const MapPreview = ({ googleMapsUrl }: { googleMapsUrl: string }) => (
  <a
    href={googleMapsUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-brand-deepBlue/70 via-brand-black to-[#07090f] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.45)] transition hover:border-brand-gold/60 hover:shadow-[0_28px_70px_rgba(0,0,0,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lightBlue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black"
  >
    <svg
      viewBox="0 0 160 120"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full text-brand-lightBlue/25 transition duration-300 group-hover:scale-[1.02]"
    >
      <rect x="0" y="0" width="160" height="120" fill="transparent" />
      <path d="M0 30h160M0 60h160M0 90h160M40 0v120M80 0v120M120 0v120" stroke="currentColor" strokeWidth="1" />
      <path d="M18 20c18 8 32 12 50 7s33-7 52 1 23 17 40 17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path
        d="M24 98c12-10 24-18 40-16s30 12 42 10 26-16 38-16"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="118" cy="56" r="6" fill="currentColor" fillOpacity="0.18" />
      <circle cx="52" cy="74" r="5" fill="currentColor" fillOpacity="0.18" />
    </svg>
    <div className="relative flex min-h-[128px] items-center justify-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold text-brand-black shadow-[0_12px_30px_rgba(199,163,91,0.45)] transition duration-200 group-hover:scale-105">
        <MapPinIcon />
      </span>
    </div>
  </a>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <path
      fill="currentColor"
      d="M12 3.4a5.4 5.4 0 0 0-5.4 5.4c0 3.7 3.7 7.9 4.9 9.2a1 1 0 0 0 1.4 0c1.2-1.3 4.9-5.5 4.9-9.2A5.4 5.4 0 0 0 12 3.4Zm0 2a3.4 3.4 0 1 1 0 6.8 3.4 3.4 0 0 1 0-6.8Z"
    />
    <circle cx="12" cy="8.8" r="1.2" fill="#0b1422" />
  </svg>
);
