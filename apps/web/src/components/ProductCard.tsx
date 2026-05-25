import type { ReactNode } from "react";

import { Link } from "react-router-dom";

import { Badge, Button, Card } from "@ecomm/ui";

type ProductCardProps = {
  name: string;
  price: string;
  tag?: string;
  rating?: number;
  subtitle?: string;
  href?: string;
  actions?: ReactNode;
};

export function ProductCard({
  name,
  price,
  tag,
  rating,
  subtitle,
  href,
  actions,
}: ProductCardProps) {
  const title = href ? (
    <Link to={href} className="hover:text-accent">
      {name}
    </Link>
  ) : (
    name
  );

  return (
    <Card className="group relative space-y-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent2/15 opacity-0 transition group-hover:opacity-100" />
      <div className="relative h-40 rounded-xl bg-gradient-to-br from-surface to-bg" />
      <div className="relative space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          {tag ? <Badge variant="accent">{tag}</Badge> : null}
        </div>
        <p className="text-sm text-muted">
          {subtitle ?? "Precision accessories tuned for clarity."}
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-text">{price}</span>
          {rating ? <span className="text-muted">{rating.toFixed(1)} rating</span> : null}
        </div>
        <div className="flex flex-wrap gap-3">
          {actions ?? (
            <>
              <Button size="sm">Add to cart</Button>
              <Button size="sm" variant="outline">
                Save
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
