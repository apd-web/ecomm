import { Badge, Button, Card, Section } from "@ecomm/ui";
import { motion } from "framer-motion";

export function HomePage() {
  return (
    <div>
      <section className="section-pad hero-grid">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3">
              <Badge variant="accent">New drop</Badge>
              <span className="text-xs uppercase tracking-[0.3em] text-muted">Luminous Tech</span>
            </div>
            <h1 className="mt-4 text-display font-semibold">
              Premium tech commerce,
              <span className="text-glow"> engineered for velocity</span>
            </h1>
            <p className="mt-4 max-w-xl text-subtitle text-muted">
              A cinematic shopping experience with elite product storytelling, seamless checkout,
              and enterprise-grade performance.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg">Shop collection</Button>
              <Button size="lg" variant="outline">
                Explore launches
              </Button>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-6 text-xs text-muted">
              <div>
                <p className="text-lg font-semibold text-text">98%</p>
                <p>Customer satisfaction</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-text">24h</p>
                <p>Priority support</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-text">120+</p>
                <p>Global launches</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="relative overflow-hidden p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-transparent to-accent2/30" />
              <div className="relative space-y-6">
                <p className="text-xs uppercase tracking-[0.35em] text-muted">Featured drop</p>
                <h2 className="text-2xl font-semibold">Aurora Pro Series</h2>
                <p className="text-sm text-muted">
                  Precision devices with adaptive glass, neural sound, and crystal touch response.
                </p>
                <div className="flex items-center gap-3">
                  <Button variant="ghost">View release</Button>
                  <Button variant="outline">Watch demo</Button>
                </div>
                <div className="accent-line" />
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Limited edition 0012</span>
                  <span>Ships in 48 hours</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Neon-grade materials",
              body: "Glassmorphic enclosures with aerospace alloy shells and polished edge glow.",
            },
            {
              title: "Adaptive commerce",
              body: "Personalized, AI-tuned storefronts that respond in real time.",
            },
            {
              title: "Secure by design",
              body: "Tokenized checkout, device trust scoring, and encrypted receipts.",
            },
          ].map((item) => (
            <Card key={item.title} className="space-y-3">
              <h3 className="text-title font-semibold">{item.title}</h3>
              <p className="text-sm text-muted">{item.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section variant="surface">
        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Badge>Launch concierge</Badge>
            <h2 className="text-headline font-semibold">
              Bento layouts, cinematic motion, and premium product storytelling.
            </h2>
            <p className="text-sm text-muted">
              Modular components and layered motion cues produce a luxury commerce experience that
              adapts across devices with Apple-grade spacing.
            </p>
            <div className="flex gap-3">
              <Button variant="outline">Explore UI kit</Button>
              <Button variant="ghost">View case study</Button>
            </div>
          </div>
          <div className="grid gap-4">
            <Card className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Featured device</p>
              <h3 className="text-title font-semibold">Nova X Headset</h3>
              <p className="text-sm text-muted">Immersive audio, adaptive noise sculpting.</p>
            </Card>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-muted">Drop</p>
                <h4 className="text-lg font-semibold">Quartz Watch</h4>
              </Card>
              <Card className="space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-muted">Edition</p>
                <h4 className="text-lg font-semibold">Ion Keycaps</h4>
              </Card>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
