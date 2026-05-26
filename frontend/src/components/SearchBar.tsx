import { Button } from "@ecomm/ui";

type SearchBarProps = {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function SearchBar({ value, placeholder, onChange, onSubmit }: SearchBarProps) {
  return (
    <form
      className="flex w-full items-center gap-3 rounded-2xl border border-line/70 bg-surface/70 px-4 py-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <input
        aria-label="Search products"
        className="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted"
        placeholder={placeholder ?? "Search products, drops, accessories"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <Button size="sm" variant="ghost" type="submit">
        Search
      </Button>
    </form>
  );
}
