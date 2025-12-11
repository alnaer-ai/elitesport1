import { ReactNode } from "react";
import { cn } from "@/lib/cn";

type HeadingTag = "h1" | "h2" | "h3" | "h4";
type HeadingTone = "light" | "accent";

const headingSizes: Record<HeadingTag, string> = {
  h1: "text-4xl sm:text-5xl lg:text-6xl",
  h2: "text-3xl sm:text-4xl",
  h3: "text-2xl sm:text-3xl",
  h4: "text-xl sm:text-2xl",
};

type HeadingProps<T extends HeadingTag = "h2"> = {
  as?: T;
  tone?: HeadingTone;
  className?: string;
  children: ReactNode;
};

export const Heading = <T extends HeadingTag = "h2">({
  as,
  tone = "light",
  className,
  children,
}: HeadingProps<T>) => {
  const Tag = as ?? "h2";
  return (
    <Tag
      className={cn(
        "font-display leading-tight",
        tone === "accent" ? "text-brand-gold" : "text-brand-ivory",
        headingSizes[Tag],
        className
      )}
    >
      {children}
    </Tag>
  );
};

type BodyTextSize = "sm" | "md" | "lg";

const bodySizes: Record<BodyTextSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

type BodyTextProps = {
  as?: "p" | "span" | "div";
  muted?: boolean;
  size?: BodyTextSize;
  className?: string;
  children: ReactNode;
};

export const BodyText = ({
  as: Component = "p",
  muted = false,
  size = "md",
  className,
  children,
}: BodyTextProps) => (
  <Component
    className={cn(
      "font-sans leading-relaxed",
      muted ? "text-brand-gray" : "text-brand-ivory",
      bodySizes[size],
      className
    )}
  >
    {children}
  </Component>
);
