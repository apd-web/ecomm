import { Link, useLocation } from "react-router-dom";

const items = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Cart", href: "/cart" },
  { label: "Profile", href: "/profile" },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="fixed inset-x-4 bottom-4 z-40 rounded-2xl border border-line/70 bg-surface/80 px-4 py-3 text-xs text-muted backdrop-blur-glass md:hidden">
      <div className="grid grid-cols-5 gap-2">
        {items.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-center transition ${
                isActive ? "bg-accent/15 text-accent" : "hover:text-text"
              }`}
            >
              <span className="text-[10px] uppercase tracking-[0.2em]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
