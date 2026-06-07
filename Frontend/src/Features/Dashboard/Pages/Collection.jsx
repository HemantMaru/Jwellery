import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { productService } from "../../../services/product.service";
import ProductCard from "../components/ProductCard";

const baseCategories = [
  "All",
  "Breathtaking Solitaires",
  "Elegant Cascades",
  "Luminous Drops",
  "Graceful Adornments",
  "Rings",
  "Necklaces",
  "Earrings",
  "Bracelets",
];

const SearchIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const ClearIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export default function Collection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const activeCategory = searchParams.get("category") || "All";

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState(searchTerm);

  const observerTarget = useRef(null);

  const fetchProducts = useCallback(
    async (currentPage, reset = false) => {
      try {
        setLoading(true);
        setError("");
        const params = {
          page: currentPage,
          limit: 12,
        };
        if (searchTerm) params.search = searchTerm;
        if (activeCategory && activeCategory !== "All")
          params.category = activeCategory;

        const data = await productService.getAllProducts(params);

        setProducts((prev) =>
          reset ? data.products : [...prev, ...data.products],
        );
        setHasMore(data.hasMore);
        setTotal(data.total);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, activeCategory],
  );

  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  const updateParams = useCallback(
    (updates) => {
      const params = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (!value || value === "All") params.delete(key);
        else params.set(key, value);
      });
      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  useEffect(() => {
    setPage(1);
    fetchProducts(1, true);
  }, [searchTerm, activeCategory, fetchProducts]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== searchTerm) {
        updateParams({ search: searchInput });
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput, searchTerm, updateParams]);

  useEffect(() => {
    if (page === 1) return;
    fetchProducts(page);
  }, [page, fetchProducts]);

  useEffect(() => {
    const element = observerTarget.current;
    if (!element || loading || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPage((currentPage) => currentPage + 1);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasMore, loading]);

  const clearAll = () => setSearchParams({}, { replace: true });

  return (
    <div className="app-page">
      <Helmet>
        <title>
          {activeCategory === "All" ? "Collection" : activeCategory} | AURUM
          Luxury Jewellery
        </title>
        <meta
          name="description"
          content={`Explore our ${activeCategory === "All" ? "exclusive" : activeCategory.toLowerCase()} collection of fine jewellery. AURUM offers pieces selected for brilliance and a memorable presence.`}
        />
      </Helmet>

      <section className="section-shell pt-32 pb-10 text-center">
        <p className="eyebrow mb-4">Catalogue</p>
        <h1 className="font-['Playfair_Display'] text-5xl md:text-6xl font-bold tracking-tight">
          {activeCategory === "All" ? "Signature Collection" : activeCategory}
        </h1>
        <p className="text-muted mx-auto mt-5 max-w-2xl text-base md:text-lg leading-relaxed">
          Discover our exclusive collection of fine jewellery, selected for
          brilliance, balance, and a quietly memorable presence.
        </p>
      </section>

      {/* Mobile Top Bar (Search + Categories horizontal scroll) visible only < lg */}
      <section className="glass-panel z-40 border-y border-[var(--color-border)] py-4 shadow-[var(--shadow-soft)] sm:sticky sm:top-20 lg:hidden">
        <div className="section-shell space-y-4">
          <div className="mx-auto max-w-2xl">
            <label className="sr-only" htmlFor="product-search-mobile">
              Search products
            </label>
            <div className="relative flex items-center">
              <input
                id="product-search-mobile"
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search pieces..."
                aria-label="Search products"
                className="premium-input pl-11 pr-11 w-full h-12"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => updateParams({ search: "" })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
                  title="Clear search"
                >
                  <ClearIcon />
                </button>
              )}
            </div>
          </div>

          <div className="flex overflow-x-auto pb-2 scrollbar-hide sm:flex-wrap sm:justify-center gap-2 sm:gap-3">
            {baseCategories.map((category) => (
              <button
                key={`mobile-${category}`}
                type="button"
                onClick={() => updateParams({ category })}
                className={`flex-shrink-0 border px-4 py-2 text-xs uppercase tracking-[0.18em] transition-colors ${
                  activeCategory === category
                    ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-surface-soft)]"
                    : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-text)] hover:text-[var(--color-text)] sm:border-transparent"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-8 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Desktop Left Sidebar visible only >= lg */}
          <aside className="hidden lg:flex w-64 flex-col shrink-0">
            <div className="sticky top-32">
              <div className="relative flex items-center mb-10">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search pieces..."
                  aria-label="Search products"
                  className="premium-input pl-10  pr-10 w-full h-11 text-sm bg-[var(--color-surface)]"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => updateParams({ search: "" })}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
                    title="Clear search"
                  >
                    <ClearIcon />
                  </button>
                )}
              </div>

              <h3 className="font-['Playfair_Display'] text-xl font-semibold mb-6">
                Collections
              </h3>
              <div className="flex flex-col gap-3">
                {baseCategories.map((category) => (
                  <button
                    key={`desktop-${category}`}
                    type="button"
                    onClick={() => updateParams({ category })}
                    className={`relative text-left text-sm uppercase tracking-[0.18em] transition-all duration-300 ease-in-out py-1 pl-4 ${
                      activeCategory === category
                        ? "text-[var(--color-accent)] font-semibold translate-x-[5px] before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-[var(--color-accent)]"
                        : "text-[var(--color-muted)] hover:text-[var(--color-accent)] hover:translate-x-[5px] before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-transparent"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Grid Area */}
          <div className="flex-1">
            {page === 1 && loading ? (
              <div className="surface border py-20 text-center text-muted">
                Loading products...
              </div>
            ) : error ? (
              <div className="surface border py-20 text-center">
                <p className="mb-5 text-[var(--color-danger)]">{error}</p>
                <button
                  type="button"
                  onClick={() => fetchProducts(1, true)}
                  className="premium-button"
                >
                  Try Again
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="surface border py-20 text-center">
                <p className="text-muted mb-6 text-lg">
                  No products found matching this selection.
                </p>
                <button
                  type="button"
                  onClick={clearAll}
                  className="premium-button"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8 flex flex-col gap-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    Showing {products.length} of {total} products
                  </span>
                  {(searchTerm || activeCategory !== "All") && (
                    <button
                      type="button"
                      onClick={clearAll}
                      className="self-start text-xs uppercase tracking-[0.18em] text-[var(--color-accent)] hover:text-[var(--color-accent-strong)]"
                    >
                      Reset filters
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-7">
                  {products.map((product, index) => (
                    <ProductCard
                      key={`${product._id || product.id}-${index}`}
                      product={product}
                      priority={index < 4}
                    />
                  ))}
                </div>

                {/* Infinite Scroll trigger area */}
                <div
                  ref={observerTarget}
                  className="mt-10 h-16 w-full flex justify-center items-center"
                >
                  {loading && page > 1 && (
                    <div className="text-sm tracking-[0.18em] uppercase text-muted">
                      Loading more...
                    </div>
                  )}
                  {!hasMore && products.length > 0 && (
                    <div className="text-sm tracking-[0.18em] uppercase text-muted opacity-50">
                      End of catalogue
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
