import type { HTMLAttributes } from "react";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  size?: "default" | "wide";
};

const sizeMap = {
  default: "max-w-6xl",
  wide: "max-w-7xl",
};

export function Container({ size = "default", className = "", ...props }: ContainerProps) {
  return <div className={`mx-auto w-full px-6 ${sizeMap[size]} ${className}`} {...props} />;
}
