import { Button } from "@ecomm/ui";

export function SearchBar() {
  return (
    <div className="flex w-full items-center gap-3 rounded-2xl border border-line/70 bg-surface/70 px-4 py-3">
      <input
        aria-label="Search products"
        className="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted"
        placeholder="Search products, drops, accessories"
      />
      <Button size="sm" variant="ghost">
        Search
      </Button>
    </div>
  );
}
