/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { productService } from "../services/product.service";
import { getProductId } from "../utils/products";

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshProducts = useCallback(async (force = true) => {
    try {
      if (!force && products.length > 0) return products;
      setLoading(true);
      setError("");
      const data = await productService.getAllProducts();
      setProducts(data.products || data);
      return data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Failed to load products.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts().catch(() => {});
  }, [refreshProducts]);

  const getProductById = useCallback(
    (identifier) => products.find((product) => getProductId(product) === identifier || product.slug === identifier),
    [products],
  );

  const removeProduct = useCallback((id) => {
    setProducts((current) =>
      current.filter((product) => getProductId(product) !== id),
    );
  }, []);

  const value = useMemo(
    () => ({
      products,
      featuredProducts: products.slice(0, 4),
      loading,
      error,
      getProductById,
      refreshProducts,
      removeProduct,
    }),
    [error, getProductById, loading, products, refreshProducts, removeProduct],
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("useProducts must be used within ProductProvider");
  }

  return context;
};
