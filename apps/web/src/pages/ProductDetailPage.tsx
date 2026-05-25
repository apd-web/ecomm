import { Badge, Button, Card, Section } from "@ecomm/ui";

import { useToast } from "../components/Toast";

export function ProductDetailPage() {
  const { push } = useToast();

  return (
    <Section size="wide">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-surface to-bg" />
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[4/3] rounded-xl border border-line/70 bg-surface/60"
              />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-3">
            <Badge variant="accent">Limited</Badge>
            <h1 className="text-headline font-semibold">Aurora Pro Headset</h1>
            <p className="text-sm text-muted">
              Studio-grade acoustic design with adaptive glass and precision fit profile.
            </p>
          </div>
          <Card className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Starting at</span>
              <span className="text-2xl font-semibold">$399</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted">
              <span>Premium shipping</span>
              <span>2-year warranty</span>
              <span>Stock: 18 units</span>
            </div>
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Finish</p>
              <div className="flex flex-wrap gap-2">
                {["Onyx", "Rose", "Iris"].map((finish) => (
                  <button
                    key={finish}
                    className="rounded-full border border-line/70 bg-surface/60 px-4 py-2 text-xs text-muted transition hover:border-accent"
                  >
                    {finish}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Quantity</p>
              <div className="flex items-center gap-3">
                <button className="rounded-xl border border-line/70 bg-surface/60 px-4 py-2 text-sm text-muted">
                  -
                </button>
                <span className="text-sm font-semibold">1</span>
                <button className="rounded-xl border border-line/70 bg-surface/60 px-4 py-2 text-sm text-muted">
                  +
                </button>
              </div>
            </div>
            <Button
              size="lg"
              onClick={() => push({ title: "Added to cart", message: "Aurora Pro is ready." })}
            >
              Add to cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => push({ title: "Saved", message: "Added to wishlist." })}
            >
              Save to wishlist
            </Button>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              "Adaptive noise sculpting",
              "Cinematic spatial audio",
              "Magnetic docking",
              "24h intelligent battery",
            ].map((item) => (
              <Card key={item} className="text-sm text-muted">
                {item}
              </Card>
            ))}
          </div>
          <Card className="space-y-2 text-sm text-muted">
            <p className="text-xs uppercase tracking-[0.3em]">Included</p>
            <ul className="space-y-2">
              <li>Magnetic dock + braided cable</li>
              <li>Adaptive carry case</li>
              <li>Digital ownership certificate</li>
            </ul>
          </Card>
        </div>
      </div>
    </Section>
  );
}
