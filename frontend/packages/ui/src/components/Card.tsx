import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", ...props }: CardProps) {
  return <div className={`glass rounded-2xl border border-line/60 p-6 ${className}`} {...props} />;
}
