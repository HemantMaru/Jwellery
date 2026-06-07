import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { useFavorites } from "../../../context/FavoritesContext";
import { useProducts } from "../../../context/ProductContext";
import {
  fallbackImage,
  formatPrice,
  getProductId,
  optimizeImageKitUrl,
  getResponsiveImageProps,
  getProductImages,
} from "../../../utils/products";
import React, { Suspense } from "react";

const ProductCard = React.lazy(() => import("../components/ProductCard"));

const HeartIcon = ({ filled }) => (
  <svg
    className="w-5 h-5"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.618-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.418-.099.824z" />
  </svg>
);

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading, error, getProductById, refreshProducts } =
    useProducts();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageVersion, setImageVersion] = useState(() => Date.now());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    refreshProducts(true).catch(() => {});
  }, [id, refreshProducts]);

  const product = getProductById(id);
  const productImages = useMemo(() => {
    return product ? getProductImages(product) : [];
  }, [product]);
  const productId = product ? getProductId(product) : "";
  const saved = productId ? isFavorite(productId) : false;

  useEffect(() => {
    if (productImages.length > 0) {
      setActiveIndex(0);
      setImageVersion(Date.now());
    }
  }, [productImages]);

  const currentImage = productImages[activeIndex] || "";

  const nextImage = () =>
    setActiveIndex((prev) => (prev + 1) % productImages.length);
  const prevImage = () =>
    setActiveIndex(
      (prev) => (prev - 1 + productImages.length) % productImages.length,
    );

  const [quantity, setQuantity] = useState(1);

  const handleQuantity = (delta) => {
    setQuantity((current) => Math.max(1, current + delta));
  };

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(
        (item) =>
          getProductId(item) !== productId &&
          item.category?.toLowerCase() === product.category?.toLowerCase(),
      )
      .slice(0, 4);
  }, [product, productId, products]);

  const handleWhatsAppOrder = () => {
    if (!product) return;
    const message = encodeURIComponent(
      `Hello, I'm interested in ${product.name}`,
    );
    window.open(`https://wa.me/917987550928?text=${message}`, "_blank");
  };

  if (loading) {
    return (
      <div className="app-page flex min-h-screen items-center justify-center pt-20">
        <p className="text-muted text-lg">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="app-page flex min-h-screen items-center justify-center px-4 pt-20">
        <div className="surface border px-6 py-12 text-center">
          <p className="mb-5 text-[var(--color-danger)]">
            {error || "Product not found."}
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            {error && (
              <button
                type="button"
                onClick={refreshProducts}
                className="premium-button"
              >
                Try Again
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="premium-button secondary"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page pb-20">
      <Helmet>
        <title>{product.name} | AURUM Luxury Jewellery</title>
        <meta
          name="description"
          content={
            product.description ||
            `Buy ${product.name} at AURUM Luxury Jewellery. Discover our exclusive collection of fine jewellery.`
          }
        />
      </Helmet>

      <div className="section-shell pt-32 pb-8">
        <div className="text-muted text-xs uppercase tracking-[0.22em]">
          <button
            type="button"
            className="transition-colors hover:text-[var(--color-accent)]"
            onClick={() => navigate("/")}
          >
            Home
          </button>
          <span className="mx-2">/</span>
          <button
            type="button"
            className="transition-colors hover:text-[var(--color-accent)]"
            onClick={() => navigate("/products")}
          >
            Products
          </button>
          <span className="mx-2">/</span>
          <span className="text-[var(--color-text)]">{product.name}</span>
        </div>
      </div>

      {/* ── GALLERY + PRODUCT INFO ─────────────────────────────── */}
      <section className="section-shell grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
        {/* Gallery: vertical thumbnails (desktop) | horizontal strip (mobile) */}
        <div className="flex flex-col gap-4">
          {/* Desktop: [thumbnails col] + [main image] side-by-side */}
          <div className="flex flex-col-reverse gap-4 sm:flex-row sm:gap-3">
            {/* Vertical thumbnail strip — desktop only */}
            {productImages.length > 1 && (
              <div
                className="hidden sm:flex sm:flex-col gap-2 overflow-y-auto"
                style={{ width: "84px", maxHeight: "520px" }}
                aria-label="Product image thumbnails"
              >
                {productImages.map((image, index) => (
                  <button
                    key={`thumb-${index}`}
                    type="button"
                    aria-label={`View image ${index + 1}`}
                    onClick={() => setActiveIndex(index)}
                    className={`relative flex-shrink-0 overflow-hidden transition-all duration-200 ${
                      activeIndex === index
                        ? "ring-2 ring-[var(--color-accent)] ring-offset-1"
                        : "opacity-60 hover:opacity-100"
                    }`}
                    style={{ width: "84px", height: "84px" }}
                  >
                    <img
                      src={optimizeImageKitUrl(
                        image,
                        "w-168,q-65,f-webp,fo-auto",
                      )}
                      alt={`${product.name} view ${index + 1}`}
                      width="84"
                      height="84"
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main image with arrow navigation */}
            <div
              className="relative flex-1 overflow-hidden bg-[var(--color-surface-soft)] shadow-[var(--shadow-soft)]"
              style={{ aspectRatio: "4/5" }}
            >
              <img
                key={`${currentImage}-${imageVersion}`}
                src={
                  currentImage
                    ? `${currentImage}${currentImage.includes("?") ? "&" : "?"}t=${imageVersion}`
                    : fallbackImage
                }
                alt={`${product.name}${productImages.length > 1 ? " — view " + (activeIndex + 1) : ""}`}
                width="650"
                height="800"
                className="h-full w-full object-cover transition-opacity duration-300"
                style={{ opacity: 1 }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = fallbackImage;
                }}
              />

              {/* Arrow buttons — only show when more than one image */}
              {productImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/70 hover:scale-105"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/70 hover:scale-105"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>

                  {/* Dot indicators (mobile) */}
                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 sm:hidden">
                    {productImages.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveIndex(i)}
                        aria-label={`Go to image ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-200 ${
                          i === activeIndex
                            ? "w-5 bg-[var(--color-accent)]"
                            : "w-1.5 bg-white/60"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile: horizontal thumbnail scroll strip */}
          {productImages.length > 1 && (
            <div
              className="flex gap-2 overflow-x-auto pb-1 sm:hidden"
              style={{ scrollbarWidth: "none" }}
              aria-label="Product image thumbnails"
            >
              {productImages.map((image, index) => (
                <button
                  key={`mob-thumb-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`View image ${index + 1}`}
                  className={`flex-shrink-0 overflow-hidden transition-all duration-200 ${
                    activeIndex === index
                      ? "ring-2 ring-[var(--color-accent)] ring-offset-1"
                      : "opacity-55 hover:opacity-100"
                  }`}
                  style={{ width: "64px", height: "64px" }}
                >
                  <img
                    src={optimizeImageKitUrl(
                      image,
                      "w-128,q-65,f-webp,fo-auto",
                    )}
                    alt={`${product.name} view ${index + 1}`}
                    width="64"
                    height="64"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <p className="eyebrow mb-4">{product.category || "Fine Jewellery"}</p>
          <h1 className="font-['Playfair_Display'] text-4xl font-semibold leading-tight md:text-6xl">
            {product.name}
          </h1>
          <p className="accent-text mt-6 text-3xl font-semibold">
            {formatPrice(product.price)}
          </p>
          <p className="text-muted mt-8 text-base leading-relaxed">
            {product.description ||
              "A refined AURUM piece created for luminous everyday wear and milestone moments."}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <div className="flex h-14 w-full border border-[var(--color-border)] sm:w-36">
              <button
                type="button"
                onClick={() => handleQuantity(-1)}
                className="flex-1 transition-colors hover:bg-[var(--color-surface-soft)]"
              >
                -
              </button>
              <span className="flex flex-1 items-center justify-center font-semibold">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => handleQuantity(1)}
                className="flex-1 transition-colors hover:bg-[var(--color-surface-soft)]"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={() => toggleFavorite(productId)}
              className={`premium-button secondary ${saved ? "text-[var(--color-accent)]" : ""}`}
            >
              <HeartIcon filled={saved} />
              {saved ? "Saved" : "Favorite"}
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={handleWhatsAppOrder}
              className="flex h-14 items-center justify-center gap-2 bg-[#25D366] px-4 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#1eba5a]"
            >
              <WhatsAppIcon />
              WhatsApp
            </button>
            <a
              href="tel:+917987550928"
              onClick={() => {
                if (!/Mobi|Android/i.test(navigator.userAgent)) {
                  alert("Please use a mobile device to call.");
                }
              }}
              className="premium-button secondary h-14 px-4 flex items-center justify-center"
            >
              Call
            </a>

            <a
              href={`mailto:hemantkumawat399@gmail.com?subject=${encodeURIComponent("Jewellery Inquiry")}&body=${encodeURIComponent(`Hi, I am interested in ${product.name}`)}`}
              onClick={() => {
                if (!navigator.userAgent.includes("Mobile")) {
                  alert("Please configure a mail app or use mobile.");
                }
              }}
              className="premium-button secondary h-14 px-4 flex items-center justify-center"
            >
              Email
            </a>
          </div>

          <div className="text-muted mt-8 grid grid-cols-3 gap-3 border-t border-[var(--color-border)] pt-6 text-center text-xs uppercase tracking-[0.16em]">
            <span>Premium Materials</span>
            <span>Secure Delivery</span>
            <span>Lifetime Warranty</span>
          </div>
        </div>
      </section>

      <section className="section-shell section-block">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4">Details</p>
          <h3 className="font-['Playfair_Display'] text-3xl font-semibold">
            Description
          </h3>
          <div className="text-muted mt-5 space-y-4 leading-relaxed">
            <p>{product.description}</p>
            <p>
              Every order is packed carefully, delivered securely, and can be
              tailored through a private consultation before purchase.
            </p>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="section-shell">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="eyebrow mb-3">More to Love</p>
              <h3 className="font-['Playfair_Display'] text-3xl font-semibold">
                Related Pieces
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Suspense
              fallback={
                <div className="col-span-full py-10 text-center text-muted">
                  Loading related pieces...
                </div>
              }
            >
              {relatedProducts.map((item) => (
                <ProductCard key={getProductId(item)} product={item} />
              ))}
            </Suspense>
          </div>
        </section>
      )}
    </div>
  );
}
