import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../../context/ProductContext";
import { productService } from "../../../services/product.service";
import { getProductId } from "../../../utils/products";
import { compressImage } from "../../../utils/imageProcessor";

const initialForm = {
  name: "",
  price: "",
  category: "",
  description: "",
};

export default function AddProduct() {
  const navigate = useNavigate();
  const { refreshProducts } = useProducts();
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
      });
    };
  }, [previews]);

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []).slice(0, 7);

    if (!selectedFiles.length) {
      setFiles([]);
      setPreviews([]);
      return;
    }

    if (selectedFiles.some((selectedFile) => !selectedFile.type.startsWith("image/"))) {
      setError("Please select valid image files only.");
      setFiles([]);
      setPreviews([]);
      return;
    }

    previews.forEach((preview) => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    });
    setError("");
    setFiles(selectedFiles);
    setPreviews(selectedFiles.map((selectedFile) => URL.createObjectURL(selectedFile)));
  };

  const removeFile = (index) => {
    setFiles((current) => current.filter((_, i) => i !== index));
    setPreviews((current) => {
      const newPreviews = [...current];
      if (newPreviews[index]?.startsWith("blob:")) {
        URL.revokeObjectURL(newPreviews[index]);
      }
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name || !form.price || !form.category || !form.description) {
      setError("All fields are required.");
      return;
    }

    if (!files.length) {
      setError("Please select at least one image to upload.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", Number(form.price));
      formData.append("category", form.category);
      formData.append("description", form.description);
      
      // Compress and append all files
      for (const file of files) {
        const compressed = await compressImage(file, 1200, 0.85); // 1200px max, 85% quality WebP fallback
        formData.append("images", compressed);
      }

      const createdProduct = await productService.createProduct(formData);
      await refreshProducts();
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-page pt-32 pb-20">
      <div className="section-shell max-w-3xl">
        <div className="surface border p-6 shadow-[var(--shadow-soft)] sm:p-8">
          <p className="eyebrow mb-3">Admin</p>
          <h1 className="font-['Playfair_Display'] text-4xl font-bold">
            Add New Product
          </h1>

          {error && (
            <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {error}
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
                placeholder="Enter product name"
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
                  placeholder="Enter price"
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
                  placeholder="Rings, Necklaces, Earrings"
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
                placeholder="Enter product description"
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
                className="block w-full text-sm text-[var(--color-text)] file:mr-4 file:border-0 file:bg-[var(--color-accent)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[var(--color-accent-strong)]"
              />
              <p className="text-muted mt-2 text-sm">
                Upload up to 7 images. The first image becomes the catalogue
                image; the rest appear in the product gallery.
              </p>
              {previews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {previews.map((preview, index) => (
                    <div
                      key={preview}
                      className="group relative aspect-square overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-soft)]"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                        title="Remove image"
                      >
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      {index === 0 && (
                        <span className="absolute left-2 top-2 bg-[var(--color-accent)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                          Main
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="premium-button flex-1 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Create Product"}
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
