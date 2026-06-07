import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../../context/ProductContext";
import { authService } from "../../../services/auth.service";
import { productService } from "../../../services/product.service";
import {
  formatPrice,
  getProductId,
  getProductImage,
  getProductImages,
} from "../../../utils/products";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { products, loading, error, refreshProducts, removeProduct } =
    useProducts();
  const [actionError, setActionError] = useState("");
  const user = authService.getUser();

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      setActionError("");
      await productService.deleteProduct(id);
      removeProduct(id);
    } catch (err) {
      setActionError("Failed to delete product");
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-page pt-32 pb-20">
      <div className="section-shell">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow mb-3">Admin</p>
            <h1 className="font-['Playfair_Display'] text-4xl font-bold md:text-5xl">
              Product Dashboard
            </h1>
            <p className="text-muted mt-3">Signed in as {user?.email}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/admin/add-product")}
              className="premium-button"
            >
              Add Product
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="premium-button secondary"
            >
              Logout
            </button>
          </div>
        </div>

        {(error || actionError) && (
          <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {actionError || error}
          </div>
        )}

        {loading ? (
          <div className="surface border py-16 text-center text-muted">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="surface border py-16 text-center">
            <p className="text-muted mb-5">No products yet.</p>
            <button
              type="button"
              onClick={() => navigate("/admin/add-product")}
              className="premium-button"
            >
              Add First Product
            </button>
          </div>
        ) : (
          <div className="surface overflow-hidden border shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-4 sm:px-6">
              <p className="text-sm text-muted">{products.length} products</p>
              <button
                type="button"
                onClick={refreshProducts}
                className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]"
              >
                Refresh
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-left text-xs uppercase tracking-[0.16em] text-muted">
                    <th className="px-6 py-4 font-medium">Image</th>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {products.map((product) => {
                    const productId = getProductId(product);
                    const imageCount = getProductImages(product).length;

                    return (
                      <tr
                        key={productId}
                        className="transition-colors hover:bg-[var(--color-surface-soft)]"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={getProductImage(product)}
                              alt={product.name}
                              className="h-14 w-14 object-cover"
                              loading="lazy"
                              decoding="async"
                              width="56"
                              height="56"
                            />
                            <span className="text-xs text-muted">
                              {imageCount} image{imageCount === 1 ? "" : "s"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-[var(--color-accent)]">
                          {formatPrice(product.price)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-4">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/admin/edit-product/${productId}`)
                              }
                              className="font-semibold text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(productId)}
                              className="font-semibold text-[var(--color-danger)]"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
