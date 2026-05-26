import { Badge, Card } from "@ecomm/ui";

const categories = ["Audio", "Wearables", "Accessories", "Smart home"];
const brands = ["Aurora", "Nova", "Ion", "Zenith"];

export function FilterPanel() {
  return (
    <Card className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted">Filters</p>
        <h3 className="mt-2 text-lg font-semibold">Refine results</h3>
      </div>
      <div className="space-y-3">
        <p className="text-sm font-semibold">Categories</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <Badge key={item} variant="outline">
              {item}
            </Badge>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-sm font-semibold">Brands</p>
        <div className="flex flex-wrap gap-2">
          {brands.map((item) => (
            <Badge key={item}>{item}</Badge>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-sm font-semibold">Price range</p>
        <div className="rounded-xl border border-line/70 bg-surface/70 px-4 py-3 text-xs text-muted">
          Slider component coming next
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-sm font-semibold">Availability</p>
        <div className="rounded-xl border border-line/70 bg-surface/70 px-4 py-3 text-xs text-muted">
          In stock · Pre-order · Limited
        </div>
      </div>
    </Card>
  );
}
