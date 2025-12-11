import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/cn";

type LayoutProps = {
  children: ReactNode;
};

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/memberships", label: "Memberships" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/places", label: "Places" },
];

const SOCIAL_LINKS = [
  { href: "#", label: "Instagram" },
  { href: "#", label: "LinkedIn" },
  { href: "#", label: "Facebook" },
];

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-brand-black text-brand-ivory">
      <a
        href="#main-content"
        className="sr-only absolute left-4 top-4 z-50 inline-flex items-center rounded-full bg-brand-gold px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-black focus-visible:not-sr-only focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lightBlue"
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
    <header className="border-b border-brand-deepBlue/60 bg-brand-black/95 text-brand-ivory shadow-lg backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-brand-gold"
        >
          EliteSport
        </Link>
        <nav
          className="hidden items-center gap-8 md:flex"
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
          className="border-t border-brand-deepBlue/60 bg-brand-black md:hidden"
          aria-label="Mobile primary navigation"
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base font-medium text-brand-ivory/90 transition hover:text-brand-gold"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

const SiteFooter = () => (
  <footer className="border-t border-brand-deepBlue/60 bg-brand-deepBlue/40 text-brand-gray">
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 text-sm sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="font-display text-lg font-semibold text-brand-ivory">
          EliteSport
        </p>
        <p className="text-xs text-brand-gray/80">
          Elevate your performance with every session.
        </p>
      </div>
      <p className="text-xs text-brand-gray/80">
        © 2025 EliteSport. All rights reserved.
      </p>
      <div className="flex gap-4">
        {SOCIAL_LINKS.map((social) => (
          <a
            key={social.label}
            href={social.href}
            className="text-xs uppercase tracking-wide text-brand-gray transition hover:text-brand-gold"
          >
            {social.label}
          </a>
        ))}
      </div>
    </div>
  </footer>
);
