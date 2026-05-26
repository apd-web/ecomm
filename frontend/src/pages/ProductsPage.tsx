import { Badge, Button, Section } from "@ecomm/ui";

import { FilterPanel } from "../components/FilterPanel";
import { ProductCard } from "../components/ProductCard";
import { SearchBar } from "../components/SearchBar";

const products = [
  { id: 1, name: "Photon X1", price: "$399", tag: "Limited", rating: 4.9 },
  { id: 2, name: "Aurora Pods", price: "$219", tag: "New", rating: 4.7 },
  { id: 3, name: "Nova Band", price: "$179", tag: "Hot", rating: 4.8 },
  { id: 4, name: "Ion Deck", price: "$329", tag: "Studio", rating: 4.6 },
  { id: 5, name: "Quartz Keyset", price: "$129", tag: "Drop", rating: 4.5 },
  { id: 6, name: "Zenith Dock", price: "$249", tag: "Pro", rating: 4.8 },
].map((product) => ({ ...product, href: `/products/${product.id}` }));

export function ProductsPage() {
  return (
    <Section size="wide">
      <div className="space-y-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-headline font-semibold">Products</h2>
            <p className="text-sm text-muted">
              Curated drops, studio-grade accessories, and cinematic tech essentials.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge>120 items</Badge>
            <Button size="sm" variant="outline">
              Filter presets
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <FilterPanel />
          <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <SearchBar />
              <select className="w-full rounded-xl border border-line/70 bg-surface/70 px-4 py-3 text-sm text-text lg:w-56">
                <option>Sort by: Featured</option>
                <option>Price: High to low</option>
                <option>Price: Low to high</option>
                <option>Newest releases</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Free shipping", "Limited drops", "Studio grade", "Fast charge"].map((filter) => (
                <Badge key={filter} variant="outline">
                  {filter}
                </Badge>
              ))}
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
