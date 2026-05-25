import { Badge, Button, Card, Input, Section } from "@ecomm/ui";

const items = [
  { id: 1, name: "Aurora Pro Headset", price: "$399" },
  { id: 2, name: "Quartz Keyset", price: "$129" },
];

export function CheckoutPage() {
  return (
    <Section size="wide">
      <div className="space-y-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-headline font-semibold">Checkout</h2>
            <p className="text-sm text-muted">Secure, multi-step checkout with live totals.</p>
          </div>
          <Badge>Secure checkout</Badge>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <Card className="space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted">Step 1</p>
                <h3 className="text-title font-semibold">Contact details</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="First name" placeholder="Nova" />
                <Input label="Last name" placeholder="Kline" />
                <Input label="Email" placeholder="nova@luminous.com" />
                <Input label="Phone" placeholder="+1 202 555 0142" />
              </div>
            </Card>

            <Card className="space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted">Step 2</p>
                <h3 className="text-title font-semibold">Shipping address</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Address line" placeholder="920 Aurora Lane" />
                <Input label="City" placeholder="San Francisco" />
                <Input label="State" placeholder="California" />
                <Input label="Postal code" placeholder="94107" />
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  { title: "Express", detail: "1-2 days" },
                  { title: "Priority", detail: "3-5 days" },
                  { title: "Standard", detail: "5-7 days" },
                ].map((option) => (
                  <button
                    key={option.title}
                    className="rounded-2xl border border-line/70 bg-surface/70 px-4 py-4 text-left text-sm text-muted transition hover:border-accent"
                  >
                    <p className="font-semibold text-text">{option.title}</p>
                    <p className="text-xs text-muted">{option.detail}</p>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted">Step 3</p>
                <h3 className="text-title font-semibold">Payment</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Cardholder name" placeholder="Nova Kline" />
                <Input label="Card number" placeholder="**** **** **** 2031" />
                <Input label="Expiry" placeholder="09/28" />
                <Input label="CVC" placeholder="***" />
              </div>
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Powered by Stripe • Encrypted</span>
                <span>Taxes calculated at final step</span>
              </div>
            </Card>
          </div>

          <Card className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Order summary</p>
              <h3 className="text-title font-semibold">Aurora drop</h3>
            </div>
            <div className="space-y-3 text-sm">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <span className="text-muted">{item.name}</span>
                  <span className="font-semibold">{item.price}</span>
                </div>
              ))}
              <div className="accent-line" />
              <div className="flex items-center justify-between">
                <span className="text-muted">Shipping</span>
                <span>$18</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Tax</span>
                <span>$42</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span>$588</span>
              </div>
            </div>
            <Button size="lg">Place order</Button>
            <Button size="lg" variant="ghost">
              Save for later
            </Button>
          </Card>
        </div>
      </div>
    </Section>
  );
}
