import type { HTMLAttributes } from "react";

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return <div className={`animate-pulse rounded-xl bg-surface/60 ${className}`} {...props} />;
}
