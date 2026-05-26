import type { HTMLAttributes } from "react";

import { Container } from "./Container";

type SectionProps = HTMLAttributes<HTMLElement> & {
  variant?: "default" | "surface" | "glass";
  size?: "default" | "wide";
};

const variantMap = {
  default: "",
  surface: "surface rounded-2xl",
  glass: "glass-strong rounded-2xl",
};

export function Section({
  variant = "default",
  size = "default",
  className = "",
  children,
  ...props
}: SectionProps) {
  return (
    <section className={`py-16 ${className}`} {...props}>
      <Container size={size} className={variantMap[variant]}>
        {children}
      </Container>
    </section>
  );
}
