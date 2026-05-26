import { Badge, Button, Section } from "@ecomm/ui";

import { FilterPanel } from "../components/FilterPanel";
import { ProductCard } from "../components/ProductCard";
import { SearchBar } from "../components/SearchBar";
import { EmptyState } from "../components/EmptyState";

import { useMemo, useState } from "react";
import { productApi, ProductListResponse } from "../services/productApi";
import { catalogApi } from "../services/catalogApi";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useQuery } from "@tanstack/react-query";

export function ProductsPage() {
  const [q, setQ] = useState("");
  // Data is loaded via react-query below; local state is not needed here.
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [activeBrand, setActiveBrand] = useState<string | undefined>(undefined);
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);

  const debouncedQ = useDebouncedValue(q, 350);

  const { data: brands = [], isLoading: brandsLoading } = useQuery<
    Array<{ id: string; name: string; slug: string }>,
    Error
  >({
    queryKey: ["brands"],
    queryFn: () => catalogApi.listBrands(),
  });
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<
    Array<{ id: string; name: string; slug: string }>,
    Error
  >({
    queryKey: ["categories"],
    queryFn: () => catalogApi.listCategories(),
  });

  const productsQueryKey = [
    "products",
    { q: debouncedQ, brand: activeBrand, category: activeCategory, page, limit },
  ];
  const useQueryAny: any = useQuery;
  const productsQuery: any = useQueryAny(
    productsQueryKey as any,
    () =>
      productApi.list({
        q: debouncedQ || undefined,
        brand: activeBrand,
        category: activeCategory,
        page,
        limit,
      }),
    { keepPreviousData: true },
  );

  const productsData: { items: any[]; meta?: { total?: number } } = productsQuery.data ?? {
    items: [],
    meta: { total: 0 },
  };
  const products = productsData.items || [];
  const total = productsData.meta?.total ?? products.length;
  const productsLoading = productsQuery.isLoading;
  const isFetching = productsQuery.isFetching;

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
            <Badge>{total} items</Badge>
            <Button size="sm" variant="outline">
              Filter presets
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <FilterPanel
            categories={categories}
            brands={brands}
            activeBrand={activeBrand}
            activeCategory={activeCategory}
            onSelectBrand={(slug) => setActiveBrand(slug)}
            onSelectCategory={(slug) => setActiveCategory(slug)}
            onClear={() => {
              setActiveBrand(undefined);
              setActiveCategory(undefined);
            }}
          />
          <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <SearchBar value={q} onChange={setQ} onSubmit={() => setPage(1)} />
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
              {productsLoading && !products.length ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <ProductCard key={`skeleton-${i}`} name="" price="" href="#" />
                ))
              ) : products.length === 0 ? (
                <EmptyState title="No products" message="Try adjusting your filters or search." />
              ) : (
                products.map((product: any) => (
                  <ProductCard
                    key={product.id || product._id || product.slug}
                    name={product.name}
                    price={product.price ? `$${product.price}` : ""}
                    rating={product.ratingAvg}
                    href={`/products/${product.slug}`}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
