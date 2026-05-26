import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantMap: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-bg shadow-glow hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent",
  ghost: "bg-transparent text-text hover:bg-surface",
  outline: "border border-line text-text hover:border-accent",
};

const sizeMap: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-3.5 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl font-semibold transition ${variantMap[variant]} ${sizeMap[size]} ${className}`}
      {...props}
    />
  );
}
