import api from "./api";

export const productService = {
  getAllProducts: async (params = {}) => {
    const res = await api.get("/products", { params });
    if (res.data && res.data.products) {
      return res.data;
    }
    return { products: res.data || [], hasMore: false, total: 0 };
  },

  getProductById: async (id) => {
    const data = await productService.getAllProducts();
    const product = (data.products || data).find((item) => item._id === id || item.id === id);

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  },

  createProduct: async (formData) => {
    const res = await api.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.product;
  },

  updateProduct: async (id, data) => {
    const res = await api.put(`/products/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.product;
  },

  deleteProduct: async (id) => {
    await api.delete(`/products/${id}`);
  },
};
