import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../../../context/ProductContext";
import { productService } from "../../../services/product.service";
import { getProductImages } from "../../../utils/products";
import { compressImage } from "../../../utils/imageProcessor";

const emptyForm = {
  name: "",
  price: "",
  category: "",
  description: "",
};

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    loading: productsLoading,
    getProductById,
    refreshProducts,
  } = useProducts();
  const product = getProductById(id);
  const [form, setForm] = useState(emptyForm);
  const [existingImages, setExistingImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!product) return;

    setForm({
      name: product.name || "",
      price: product.price || "",
      category: product.category || "",
      description: product.description || "",
    });
    setExistingImages(getProductImages(product));
    setFiles([]);
    setNewPreviews([]);
  }, [product]);

  useEffect(() => {
    return () => {
      newPreviews.forEach((preview) => {
        if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
      });
    };
  }, [newPreviews]);

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const removeExistingImage = (index) => {
    setExistingImages((current) => current.filter((_, i) => i !== index));
  };

  const removeNewFile = (index) => {
    setFiles((current) => current.filter((_, i) => i !== index));
    setNewPreviews((current) => {
      const updated = [...current];
      if (updated[index]?.startsWith("blob:")) {
        URL.revokeObjectURL(updated[index]);
      }
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (existingImages.length + selectedFiles.length > 7) {
      setError("Maximum 7 images allowed in total.");
      return;
    }

    if (
      selectedFiles.some(
        (selectedFile) => !selectedFile.type.startsWith("image/"),
      )
    ) {
      setError("Please select valid image files only.");
      return;
    }

    setError("");
    const appendedFiles = [...files, ...selectedFiles].slice(
      0,
      7 - existingImages.length,
    );
    setFiles(appendedFiles);

    const renderedPreviews = appendedFiles.map((f) => URL.createObjectURL(f));
    setNewPreviews(renderedPreviews);
    event.target.value = ""; // Reset input
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.price || !form.category || !form.description) {
      setError("All fields are required.");
      return;
    }

    if (existingImages.length === 0 && files.length === 0) {
      setError("At least one product image is required.");
      return;
    }

    setLoading(true);

    try {
      console.log("Sending images:", files, "ExistingImages:", existingImages);
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", Number(form.price));
      formData.append("category", form.category);
      formData.append("description", form.description);

      formData.append("existingImages", JSON.stringify(existingImages));

      for (const file of files) {
        const compressed = await compressImage(file, 1200, 0.85);
        formData.append("images", compressed);
      }

      const updatedProduct = await productService.updateProduct(id, formData);
      console.log("Response from updateProduct:", updatedProduct);
      await refreshProducts(true);
      setSuccess("Product updated successfully.");
      window.setTimeout(() => navigate("/admin/dashboard"), 700);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (productsLoading && !product) {
    return (
      <div className="app-page flex min-h-screen items-center justify-center pt-20">
        <p className="text-muted">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="app-page flex min-h-screen items-center justify-center px-4 pt-20">
        <div className="surface border px-6 py-12 text-center">
          <p className="text-muted mb-5">Product not found.</p>
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="premium-button"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page pt-32 pb-20">
      <div className="section-shell max-w-3xl">
        <div className="surface border p-6 shadow-[var(--shadow-soft)] sm:p-8">
          <p className="eyebrow mb-3">Admin</p>
          <h1 className="font-['Playfair_Display'] text-4xl font-bold">
            Edit Product
          </h1>

          {error && (
            <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-6 border border-green-200 bg-green-50 px-4 py-3 text-green-700">
              {success}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted">
                Product Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="premium-input"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted">
                  Price
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(event) => updateField("price", event.target.value)}
                  className="premium-input"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted">
                  Category
                </label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(event) =>
                    updateField("category", event.target.value)
                  }
                  className="premium-input"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted">
                Description
              </label>
              <textarea
                rows="5"
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                className="premium-input resize-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted">
                Product Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                disabled={existingImages.length + files.length >= 7}
                className="block w-full text-sm text-[var(--color-text)] file:mr-4 file:border-0 file:bg-[var(--color-accent)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[var(--color-accent-strong)] disabled:opacity-50"
              />
              <p className="text-muted mt-2 text-sm">
                Max 7 images total. You can remove existing images below.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {/* Existing Images */}
                {existingImages.map((imgUrl, index) => (
                  <div
                    key={`existing-${index}`}
                    className="group relative aspect-square overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-soft)]"
                  >
                    <img
                      src={imgUrl}
                      alt={`Existing ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                      title="Remove image"
                    >
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    {index === 0 && (
                      <span className="absolute left-2 top-2 bg-[var(--color-accent)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                        Main
                      </span>
                    )}
                  </div>
                ))}

                {/* New Files */}
                {newPreviews.map((preview, index) => (
                  <div
                    key={`new-${index}`}
                    className="group relative aspect-square overflow-hidden border border-dashed border-green-500/50 bg-[var(--color-surface-soft)]"
                  >
                    <img
                      src={preview}
                      alt={`New Preview ${index + 1}`}
                      className="h-full w-full object-cover opacity-80"
                    />
                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 px-2 py-0.5 text-[10px] text-white">
                      NEW
                    </span>
                    <button
                      type="button"
                      onClick={() => removeNewFile(index)}
                      className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                      title="Remove image"
                    >
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    {existingImages.length === 0 && index === 0 && (
                      <span className="absolute left-2 top-2 bg-[var(--color-accent)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="premium-button flex-1 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Product"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/dashboard")}
                className="premium-button secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
