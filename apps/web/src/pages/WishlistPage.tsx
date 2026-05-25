import { Badge, Button, Section } from "@ecomm/ui";

import { ProductCard } from "../components/ProductCard";
import { useToast } from "../components/Toast";

const saved = [
  { id: 1, name: "Nova Lightbar", price: "$189", tag: "Saved", rating: 4.8 },
  { id: 2, name: "Ion Studio Pack", price: "$459", tag: "Saved", rating: 4.7 },
  { id: 3, name: "Aurora Mesh", price: "$129", tag: "Saved", rating: 4.6 },
];

export function WishlistPage() {
  const { push } = useToast();

  return (
    <Section size="wide">
      <div className="space-y-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-headline font-semibold">Wishlist</h2>
            <p className="text-sm text-muted">Saved drops and curated collections in one place.</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge>{saved.length} items</Badge>
            <Button size="sm" variant="outline">
              Share list
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => push({ title: "Moved to cart", message: "Wishlist synced." })}
            >
              Move all
            </Button>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {saved.map((item) => (
            <ProductCard
              key={item.id}
              {...item}
              actions={
                <>
                  <Button
                    size="sm"
                    onClick={() =>
                      push({ title: "Added to cart", message: `${item.name} is ready to ship.` })
                    }
                  >
                    Move to cart
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      push({ title: "Removed", message: `${item.name} removed from wishlist.` })
                    }
                  >
                    Remove
                  </Button>
                </>
              }
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
