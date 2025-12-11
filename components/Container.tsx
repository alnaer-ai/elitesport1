import { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ContainerProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export const Container = <T extends ElementType = "div">({
  as,
  children,
  className,
  ...props
}: ContainerProps<T>) => {
  const Component = as ?? "div";

  return (
    <Component
      className={cn(
        "container w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
