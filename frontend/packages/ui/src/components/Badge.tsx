import type { HTMLAttributes } from "react";

type BadgeVariant = "default" | "accent" | "outline";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantMap: Record<BadgeVariant, string> = {
  default: "bg-surface text-muted border border-line/70",
  accent: "bg-accent/15 text-accent border border-accent/40",
  outline: "bg-transparent text-text border border-line",
};

export function Badge({ variant = "default", className = "", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${variantMap[variant]} ${className}`}
      {...props}
    />
  );
}
