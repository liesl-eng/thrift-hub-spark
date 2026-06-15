import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BadgeCheck, TrendingDown, Leaf, Mail } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Comeback Restock" },
      { name: "description", content: "Learn about Comeback Restock — sourcing quality home goods for thrift retailers, diverted from the waste stream." },
      { property: "og:title", content: "About — Comeback Restock" },
      { property: "og:description", content: "Sourcing quality home goods for thrift retailers, diverted from the waste stream." },
    ],
  }),
  component: AboutPage,
});

const BENEFITS = [
  {
    icon: BadgeCheck,
    title: "Curated & Floor-Ready",
    description: "Inspected inventory sourced directly from brand warehouses.",
    bg: "bg-mission/10",
    fg: "text-mission",
  },
  {
    icon: TrendingDown,
    title: "Up to 60% Below Wholesale",
    description: "Stretch your budget without sacrificing quality.",
    bg: "bg-emerald-500/10",
    fg: "text-emerald-600",
  },
  {
    icon: Leaf,
    title: "100% Sustainable",
    description: "Every item diverted from the waste stream — not a single piece to landfill.",
    bg: "bg-primary/10",
    fg: "text-primary",
  },
];

function AboutPage() {
  return (
    <div>
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <Button asChild variant="ghost" size="sm" className="mb-8">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </Button>

          {/* Page headline */}
          <h1 className="font-display text-5xl md:text-7xl font-black text-primary leading-[0.95]">
            About{" "}
            <span className="text-mission">Comeback Restock</span>
          </h1>

          {/* Intro paragraphs */}
          <div className="mt-8 space-y-4 text-lg text-muted-foreground">
            <p>
              We work with thrift stores, Goodwill-type retailers, and secondhand
              boutiques that want to stock smarter — sourcing quality home goods
              that are new, inspected, and ready for the floor.
            </p>
            <p>
              Every piece we carry was diverted from the waste stream. Not
              returned, not damaged — just inventory that didn't fit the traditional
              retail path. It comes to us. We get it to you.
            </p>
          </div>

          {/* Section heading */}
          <h2 className="mt-16 font-display text-3xl md:text-4xl font-bold text-primary">
            What makes us different
          </h2>

          {/* Body paragraphs */}
          <div className="mt-6 space-y-4 text-lg text-muted-foreground">
            <p>
              Comeback Restock was built by a team with deep roots in e-commerce and
              logistics. We source directly from brand warehouses and authorized
              suppliers — which means consistent inventory, real documentation, and
              pricing up to 60% below wholesale.
            </p>
            <p>
              Everything is inspected and floor-ready before it reaches your quote.
              No guessing on condition. No surprises for your customers.
            </p>
          </div>

          {/* Benefit cards */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="rounded-xl bg-card shadow p-6 flex flex-col items-start"
              >
                <span
                  className={`grid h-10 w-10 place-items-center rounded-full ${b.bg} ${b.fg}`}
                >
                  <b.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-primary">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {b.description}
                </p>
              </div>
            ))}
          </div>

          {/* Contact section */}
          <div className="mt-16 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
              Get in Touch
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Have questions? We love email.
            </p>
            <a
              href="mailto:hello@comebackgoods.com"
              className="mt-4 inline-flex items-center gap-2 text-lg font-medium text-mission hover:underline"
            >
              <Mail className="h-5 w-5" />
              hello@comebackgoods.com
            </a>
          </div>

          {/* CTA button */}
          <div className="mt-12 flex justify-center">
            <Button asChild variant="hero" size="lg">
              <Link to="/catalog">Browse Catalog</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
