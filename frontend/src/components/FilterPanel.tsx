import { Badge, Button, Card } from "@ecomm/ui";

type FilterPanelProps = {
  categories: Array<{ id: string; name: string; slug: string }>;
  brands: Array<{ id: string; name: string; slug: string }>;
  activeCategory?: string;
  activeBrand?: string;
  onSelectCategory: (slug?: string) => void;
  onSelectBrand: (slug?: string) => void;
  onClear: () => void;
};

export function FilterPanel({
  categories,
  brands,
  activeBrand,
  activeCategory,
  onSelectBrand,
  onSelectCategory,
  onClear,
}: FilterPanelProps) {
  return (
    <Card className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted">Filters</p>
        <h3 className="mt-2 text-lg font-semibold">Refine results</h3>
        <Button size="sm" variant="ghost" className="mt-3" onClick={onClear}>
          Clear all
        </Button>
      </div>
      <div className="space-y-3">
        <p className="text-sm font-semibold">Categories</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((item) => {
            const isActive = activeCategory === item.slug;
            return (
              <button key={item.id} type="button" onClick={() => onSelectCategory(item.slug)}>
                <Badge variant={isActive ? "accent" : "outline"}>{item.name}</Badge>
              </button>
            );
          })}
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-sm font-semibold">Brands</p>
        <div className="flex flex-wrap gap-2">
          {brands.map((item) => {
            const isActive = activeBrand === item.slug;
            return (
              <button key={item.id} type="button" onClick={() => onSelectBrand(item.slug)}>
                <Badge variant={isActive ? "accent" : "default"}>{item.name}</Badge>
              </button>
            );
          })}
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
