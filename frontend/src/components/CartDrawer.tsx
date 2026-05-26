import { Button, Card } from "@ecomm/ui";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const items = [
  { id: 1, name: "Aurora Pro Headset", price: "$399" },
  { id: 2, name: "Quartz Keyset", price: "$129" },
];

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const subtotal = items.reduce((sum, item) => sum + Number(item.price.replace("$", "")), 0);

  return (
    <div
      className={`fixed inset-0 z-40 transition ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-bg/60 transition duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Cart drawer"
        className={`absolute right-0 top-0 h-full w-full max-w-md transform border-l border-line/70 bg-surface/90 p-6 shadow-2xl backdrop-blur-glass transition duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Your cart</h3>
          <Button size="sm" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-muted">Ships in 48 hours</p>
              </div>
              <span className="text-sm font-semibold">{item.price}</span>
            </Card>
          ))}
        </div>
        <div className="mt-6 space-y-3">
          <Card className="flex items-center justify-between text-sm">
            <span className="text-muted">Subtotal</span>
            <span className="font-semibold">${subtotal}</span>
          </Card>
          <Button size="lg">Checkout</Button>
          <Button size="lg" variant="ghost" onClick={onClose}>
            Continue shopping
          </Button>
        </div>
      </aside>
    </div>
  );
}
