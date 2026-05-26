import type { ReactNode } from "react";
import { useState } from "react";

import { Badge, Button, Container, Tag } from "@ecomm/ui";

import { CartDrawer } from "../components/CartDrawer";
import { MobileNav } from "../components/MobileNav";
import { ToastProvider, useToast } from "../components/Toast";
import { authApi } from "../services/authApi";
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom";

const links = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Cart", href: "/cart" },
  { label: "Profile", href: "/profile" },
];

function MainLayoutContent({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const { push } = useToast();
  const user = useAuthStore((state) => state.user);
  const clear = useAuthStore((state) => state.clear);

  const handleSignOut = async () => {
    try {
      await authApi.logout();
    } finally {
      clear();
      push({ title: "Signed out", message: "Session ended successfully." });
    }
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line/70 bg-bg/80 backdrop-blur-glass">
        <div className="border-b border-line/60 bg-surface/40">
          <Container className="flex items-center justify-between py-2 text-xs text-muted">
            <div className="flex items-center gap-3">
              <Tag>Launch Week</Tag>
              <span className="hidden sm:inline">New Aurora Pro drops daily at 7 PM</span>
            </div>
            <Badge variant="accent">Free global shipping</Badge>
          </Container>
        </div>
        <Container className="flex items-center justify-between gap-4 py-4">
          <Link to="/" className="text-lg font-semibold text-glow">
            Ecomm
          </Link>
          <div className="hidden items-center gap-6 text-sm text-muted lg:flex">
            <nav className="flex items-center gap-6">
              {links.map((link) => (
                <Link key={link.href} to={link.href} className="hover:text-text">
                  {link.label}
                </Link>
              ))}
            </nav>
            <input
              aria-label="Quick search"
              className="w-60 rounded-xl border border-line/70 bg-surface/70 px-4 py-2 text-sm text-text placeholder:text-muted"
              placeholder="Search"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              className="hidden md:inline-flex"
              size="sm"
              variant="ghost"
              onClick={() =>
                push({ title: "Search saved", message: "Personalized results synced." })
              }
            >
              Quick action
            </Button>
            {user ? (
              <>
                <Link to="/profile">
                  <Button className="hidden md:inline-flex" size="sm" variant="outline">
                    Account
                  </Button>
                </Link>
                <Button size="sm" variant="ghost" onClick={handleSignOut}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link to="/signin">
                  <Button className="hidden md:inline-flex" size="sm" variant="outline">
                    Sign in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Get started</Button>
                </Link>
              </>
            )}
            <Button size="sm" variant="outline" onClick={() => setCartOpen(true)}>
              Cart
            </Button>
          </div>
        </Container>
      </header>
      <main>{children}</main>
      <MobileNav />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <footer className="border-t border-line/70 px-6 py-10 text-sm text-muted">
        <Container className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <span>Premium ecommerce platform</span>
          <span>Crafted for enterprise commerce</span>
        </Container>
      </footer>
    </div>
  );
}

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </ToastProvider>
  );
}
