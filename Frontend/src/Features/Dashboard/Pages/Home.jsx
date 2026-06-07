import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useProducts } from "../../../context/ProductContext";
import ProductCard from "../components/ProductCard";

const collectionTiles = [
  {
    title: "Breathtaking Solitaires",
    category: "Rings",
    image: "/images/Product1.webp",
  },
  {
    title: "Elegant Cascades",
    category: "Necklaces",
    image: "/images/jwellerysection2.webp",
  },
  {
    title: "Luminous Drops",
    category: "Earrings",
    image: "/images/jwellerysection3.webp",
  },
  {
    title: "Graceful Adornments",
    category: "Bracelets",
    image: "/images/jwelleysection4.webp",
  },
];

const whyChooseUs = [
  {
    title: "Premium Materials",
    copy: "Selected metals, luminous stones, and finishes chosen for lasting radiance.",
  },
  {
    title: "Master Craftsmanship",
    copy: "Each piece is refined for proportion, comfort, setting strength, and polish.",
  },
  {
    title: "Lifetime Warranty",
    copy: "AURUM care protects the pieces you choose for your most personal moments.",
  },
  {
    title: "Secure Delivery",
    copy: "Every order is packed with care, insured in transit, and delivered with attention.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { featuredProducts, loading, error, refreshProducts } = useProducts();

  return (
    <div className="app-page">
      <Helmet>
        <title>AURUM | Timeless Luxury Jewellery</title>
        <meta
          name="description"
          content="Discover our exclusive collection of fine jewellery. AURUM offers breathtaking solitaires, elegant cascades, luminous drops, and graceful adornments."
        />
      </Helmet>

      <section className="relative min-h-[77vh] md:min-h-[94vh] lg:min-h-screen overflow-hidden bg-black pt-20">
        <img
          src="/images/jwelleryhomeimg.webp"
          srcSet="/images/jwelleryhomeimg.webp 800w, /images/jwelleryhomeimg.webp 1200w, /images/jwelleryhomeimg.webp 1600w"
          sizes="(max-width: 768px) 100vw, 1600px"
          loading="eager"
          fetchPriority="high"
          alt="Luxury jewellery campaign"
          width="1600"
          height="1067"
          className="absolute inset-0 h-full w-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />
        <div className="section-shell relative z-10 flex min-h-[calc(94vh-5rem)] items-end pb-14 md:pb-20">
          <div className="max-w-3xl">
            <p className="eyebrow mb-5">Fine Jewellery</p>
            <h1 className="font-['Playfair_Display'] text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
              Timeless Elegance, Crafted for You.
            </h1>
            <p className="mt-6 max-w-2xl text-base font-light leading-relaxed text-gray-100 md:text-lg">
              Discover our exclusive collection of fine jewellery, designed to
              illuminate daily rituals, grand celebrations, and every cherished
              moment between.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="premium-button"
              >
                Explore Collection
              </button>
              <button
                type="button"
                onClick={() => navigate("/contact")}
                className="premium-button secondary border-white/70 text-white hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                Book Consultancy
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-shell">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-3">Explore</p>
              <h2 className="font-['Playfair_Display'] text-4xl font-bold md:text-5xl">
                Featured Categories
              </h2>
            </div>
            <p className="text-muted max-w-lg leading-relaxed">
              Four refined worlds of jewellery, each curated around light,
              proportion, and the quiet confidence of exceptional materials.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {collectionTiles.map((tile) => (
              <button
                key={tile.title}
                type="button"
                onClick={() =>
                  navigate(
                    `/products?category=${encodeURIComponent(tile.category)}`,
                  )
                }
                className="group relative aspect-[4/5] overflow-hidden bg-[var(--color-surface-soft)] text-left shadow-[var(--shadow-soft)]"
              >
                <img
                  src={tile.image}
                  alt={tile.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <span className="font-['Playfair_Display'] text-2xl font-semibold leading-tight text-white">
                    {tile.title}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block surface-soft">
        <div className="section-shell">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow mb-3">Selected Pieces</p>
              <h2 className="font-['Playfair_Display'] text-4xl font-bold md:text-5xl">
                Signature Collection
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="self-start border-b border-[var(--color-text)] pb-1 text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] sm:self-auto"
            >
              View All
            </button>
          </div>

          {loading ? (
            <div className="surface border py-16 text-center text-muted">
              Loading products...
            </div>
          ) : error ? (
            <div className="surface border py-16 text-center">
              <p className="mb-5 text-[var(--color-danger)]">{error}</p>
              <button
                type="button"
                onClick={refreshProducts}
                className="premium-button"
              >
                Try Again
              </button>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="surface border py-16 text-center text-muted">
              No products available yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product, index) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                  priority={index < 2}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section-block">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1fr] lg:items-center">
          <div className="aspect-[4/5] overflow-hidden bg-[var(--color-surface-soft)] shadow-[var(--shadow-soft)]">
            <img
              src="/images/jwelleryfooter1.webp"
              alt="Jewellery artisan"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <p className="eyebrow mb-4">Craft</p>
            <h2 className="font-['Playfair_Display'] text-4xl font-bold leading-tight md:text-5xl">
              Fine craftsmanship with modern restraint
            </h2>
            <div className="text-muted mt-7 space-y-5 leading-relaxed">
              <p>
                Every AURUM piece begins with proportion, comfort, and the way
                light moves across metal and stone.
              </p>
              <p>
                Our ateliers favor enduring shapes over loud ornament, creating
                jewellery that feels intimate, composed, and unmistakably
                special up close.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/about")}
              className="premium-button secondary mt-8"
            >
              Our Story
            </button>
          </div>
        </div>
      </section>

      <section className="section-block surface-soft">
        <div className="section-shell">
          <div className="mb-10 text-center">
            <p className="eyebrow mb-3">Why AURUM</p>
            <h2 className="font-['Playfair_Display'] text-4xl font-bold md:text-5xl">
              The Promise Behind Every Piece
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item) => (
              <article
                key={item.title}
                className="surface border p-6 shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-1 hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-hover)]"
              >
                <h3 className="font-['Playfair_Display'] text-xl font-semibold">
                  {item.title}
                </h3>
                <p className="text-muted mt-3 text-sm leading-relaxed">
                  {item.copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-shell grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="eyebrow mb-4">Brand Story</p>
            <h2 className="font-['Playfair_Display'] text-4xl font-bold leading-tight md:text-5xl">
              Designed for keepsakes, not seasons
            </h2>
            <p className="text-muted mt-7 leading-relaxed">
              AURUM is built on the belief that fine jewellery should be deeply
              personal: elegant enough for ceremony, comfortable enough for
              daily wear, and crafted with the patience heirloom pieces deserve.
            </p>
          </div>
          <div className="aspect-[5/4] overflow-hidden bg-[var(--color-surface-soft)] shadow-[var(--shadow-soft)]">
            <img
              src="/images/jwelleysection4.webp"
              alt="AURUM fine jewellery detail"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="section-block surface-soft">
        <div className="section-shell text-center">
          <p className="eyebrow mb-4">Private Notes</p>
          <h2 className="mx-auto max-w-3xl font-['Playfair_Display'] text-4xl font-bold md:text-5xl">
            Receive collection previews and bespoke appointment openings
          </h2>
          <form
            className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              type="email"
              className="premium-input flex-1"
              placeholder="Email address"
              aria-label="Email address"
            />
            <button type="submit" className="premium-button">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
