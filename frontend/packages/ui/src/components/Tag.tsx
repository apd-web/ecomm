import type { HTMLAttributes } from "react";

type TagProps = HTMLAttributes<HTMLSpanElement>;

export function Tag({ className = "", ...props }: TagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-line/70 bg-surface/60 px-4 py-1 text-xs uppercase tracking-[0.25em] text-muted ${className}`}
      {...props}
    />
  );
}
