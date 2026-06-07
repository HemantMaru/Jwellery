import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const values = [
  {
    title: "Premium Materials",
    description: "Ethically sourced stones and finely finished metals.",
  },
  {
    title: "Master Craftsmanship",
    description: "Patiently finished details shaped by skilled hands.",
  },
  {
    title: "Lifetime Warranty",
    description: "Long-term care for jewellery made to stay with you.",
  },
  {
    title: "Secure Delivery",
    description: "Careful packing, insured shipping, and attentive support.",
  },
];

export default function About() {
  return (
    <div className="app-page">
      <Helmet>
        <title>Our Story | AURUM Luxury Jewellery</title>
        <meta
          name="description"
          content="Discover the AURUM story. We bring refined craftsmanship and modern luxury to jewellery designed for daily rituals and lasting milestones."
        />
      </Helmet>
      <section className="relative min-h-screen overflow-hidden bg-black pt-20 md:min-h-screen">
        <img
          src="/images/jwelleryabout1.webp"
          loading="eager"
          fetchPriority="high"
          alt="Aurum jewellery atelier"
          width="1600"
          height="1067"
          className="absolute inset-0 h-full w-full object-cover opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/20" />
        <div className="section-shell relative z-10 flex min-h-[calc(94vh-5rem)] items-end pb-14 md:pb-20">
          <div className="max-w-3xl">
            <p className="eyebrow mb-4">Our Story</p>
            <h1 className="font-['Playfair_Display'] text-5xl font-bold leading-tight text-white md:text-7xl">
              Quiet luxury, made to last
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-100 md:text-lg">
              Aurum brings refined craftsmanship and modern restraint to pieces
              designed for daily rituals and lasting milestones.
            </p>
          </div>
        </div>
      </section>

      <section className="section-shell section-block grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div>
          <p className="eyebrow mb-4">Craftsmanship</p>
          <h2 className="font-['Playfair_Display'] text-4xl font-bold leading-tight md:text-5xl">
            Details you notice up close
          </h2>
          <div className="text-muted mt-7 space-y-5 leading-relaxed">
            <p>
              We design jewellery around proportion, light, and comfort. Every
              piece is made to feel considered from the first glance to the
              final clasp.
            </p>
            <p>
              Our collections favor enduring shapes over passing noise, so each
              piece can become part of your personal story for years.
            </p>
          </div>
        </div>
        <div className="aspect-[4/5] overflow-hidden bg-[var(--color-surface-soft)] shadow-[var(--shadow-soft)]">
          <img
            src="/images/jwelleryabout2.webp"
            alt="Jewellery craftsmanship"
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            width="600"
            height="750"
          />
        </div>
      </section>

      <section className="section-block surface-soft">
        <div className="section-shell">
          <div className="mb-10 text-center">
            <p className="eyebrow mb-3">Promise</p>
            <h2 className="font-['Playfair_Display'] text-4xl font-bold md:text-5xl">
              The Aurum Standard
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="surface border p-6 shadow-[var(--shadow-soft)]"
              >
                <h3 className="font-['Playfair_Display'] text-xl font-semibold">
                  {value.title}
                </h3>
                <p className="text-muted mt-3 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell section-block grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div className="order-2 lg:order-1 aspect-[4/5] overflow-hidden bg-[var(--color-surface-soft)] shadow-[var(--shadow-soft)]">
          <img
            src="/images/jwelleryabout3.webp"
            alt="Aurum signature style"
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            width="600"
            height="750"
          />
        </div>
        <div className="order-1 lg:order-2 lg:pl-10">
          <p className="eyebrow mb-4">Philosophy</p>
          <h2 className="font-['Playfair_Display'] text-4xl font-bold leading-tight md:text-5xl">
            Beyond the surface
          </h2>
          <div className="text-muted mt-7 space-y-5 leading-relaxed">
            <p>
              True luxury does not shout; it waits to be discovered. We believe
              that the most captivating jewellery is that which reveals its
              brilliance through restraint.
            </p>
            <p>
              Each AURUM piece is a delicate balance of architectural discipline
              and organic warmth—crafted not just for special occasions, but to
              elevate the subtle moments of your everyday life.
            </p>
          </div>
        </div>
      </section>

      <section className="section-shell section-block text-center">
        <p className="eyebrow mb-4">Begin</p>
        <h2 className="mx-auto max-w-3xl font-['Playfair_Display'] text-4xl font-bold md:text-5xl">
          Find a piece that feels personal from the first wear
        </h2>
        <div className="mt-8 flex justify-center">
          <Link to="/products" className="premium-button">
            Explore Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
