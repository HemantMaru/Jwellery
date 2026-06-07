import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../../../context/FavoritesContext";
import { useProducts } from "../../../context/ProductContext";
import { getProductId } from "../../../utils/products";
import ProductCard from "../components/ProductCard";

const Favorites = () => {
  const navigate = useNavigate();
  const { favoriteIds } = useFavorites();
  const { products, loading, error, refreshProducts } = useProducts();

  const favoriteProducts = useMemo(() => {
    return products.filter((product) => favoriteIds.includes(getProductId(product)));
  }, [favoriteIds, products]);

  return (
    <div className="app-page pt-32 pb-20">
      <div className="section-shell">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-3">Wishlist</p>
            <h1 className="font-['Playfair_Display'] text-4xl font-bold md:text-5xl">
              My Favorites
            </h1>
            <p className="text-muted mt-4 max-w-xl">
              Saved pieces stay here instantly on this device, ready whenever
              you want to compare or come back to them.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="premium-button self-start sm:self-auto"
          >
            Browse Products
          </button>
        </div>

        {loading ? (
          <div className="surface border py-20 text-center text-muted">
            Loading favorites...
          </div>
        ) : error ? (
          <div className="surface border py-20 text-center">
            <p className="mb-5 text-[var(--color-danger)]">{error}</p>
            <button
              type="button"
              onClick={refreshProducts}
              className="premium-button"
            >
              Try Again
            </button>
          </div>
        ) : favoriteProducts.length === 0 ? (
          <div className="surface border py-20 text-center">
            <p className="text-muted mb-6">Your wishlist is empty.</p>
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="premium-button"
            >
              Discover Pieces
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {favoriteProducts.map((product) => (
              <ProductCard key={getProductId(product)} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
