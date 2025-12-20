import Link from "next/link";
import { ReactNode } from "react";

import { cn } from "@/lib/cn";

const anchorButtonBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lightBlue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black";

const anchorButtonVariants = {
  primary:
    "bg-brand-gold text-brand-black hover:bg-brand-lightBlue hover:text-brand-deepBlue shadow-glow",
  secondary:
    "bg-brand-deepBlue text-brand-ivory hover:bg-brand-lightBlue/20 border border-brand-lightBlue/30",
};

const getButtonClasses = (variant: keyof typeof anchorButtonVariants) =>
  cn(anchorButtonBase, anchorButtonVariants[variant]);

type ButtonLinkProps = {
  href?: string;
  variant?: keyof typeof anchorButtonVariants;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
};

export const ButtonLink = ({
  href,
  variant = "primary",
  children,
  className: extraClassName,
  target,
  rel,
  onClick,
}: ButtonLinkProps) => {
  const className = cn(getButtonClasses(variant), extraClassName);

  if (onClick) {
    return (
      <button onClick={onClick} className={className} type="button">
        {children}
      </button>
    );
  }

  if (!href) {
    return null;
  }

  const isInternal = href.startsWith("/");
  const isExternal = href.startsWith("http");
  const resolvedTarget = target ?? (isExternal ? "_blank" : undefined);
  const resolvedRel = rel ?? (isExternal ? "noreferrer" : undefined);

  if (isInternal) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={className}
      target={resolvedTarget}
      rel={resolvedRel}
    >
      {children}
    </a>
  );
};

export const secondaryButtonClasses =
  "inline-flex items-center justify-center gap-2 rounded-full border border-brand-lightBlue/30 px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-ivory transition duration-200 hover:border-brand-gold/60 hover:text-brand-gold";
