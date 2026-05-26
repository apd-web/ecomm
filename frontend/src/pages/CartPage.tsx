import { Badge, Button, Card, Section } from "@ecomm/ui";

import { useToast } from "../components/Toast";

const items = [
  { id: 1, name: "Aurora Pro Headset", price: 399, qty: 1 },
  { id: 2, name: "Quartz Keyset", price: 129, qty: 2 },
];

export function CartPage() {
  const { push } = useToast();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = 18;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  return (
    <Section size="wide">
      <div className="space-y-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-headline font-semibold">Cart</h2>
            <p className="text-sm text-muted">Your curated selection is ready for checkout.</p>
          </div>
          <Badge>{items.length} items</Badge>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="h-24 w-24 rounded-xl bg-gradient-to-br from-surface to-bg" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted">Studio-grade finish · Ships in 48h</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted">Qty {item.qty}</span>
                  <span className="font-semibold text-text">${item.price * item.qty}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    push({ title: "Removed", message: `${item.name} removed from cart.` })
                  }
                >
                  Remove
                </Button>
              </Card>
            ))}
          </div>
          <Card className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Order summary</p>
              <h3 className="mt-2 text-title font-semibold">Ready to checkout</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted">Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Shipping</span>
                <span>${shipping}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Tax</span>
                <span>${tax}</span>
              </div>
              <div className="accent-line" />
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>
            <Button
              size="lg"
              onClick={() => push({ title: "Checkout ready", message: "Redirecting to checkout." })}
            >
              Continue to checkout
            </Button>
            <Button
              size="lg"
              variant="ghost"
              onClick={() => push({ title: "Saved", message: "Items kept in your cart." })}
            >
              Keep shopping
            </Button>
          </Card>
        </div>
      </div>
    </Section>
  );
}
