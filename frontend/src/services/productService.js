import apiClient from "./apiClient";

const productService = {
  getAll: () => apiClient("/product"),

  getById: (id) => apiClient(`/product/${id}`),

  create: (data) =>
    apiClient("/product", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    apiClient(`/product/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    apiClient(`/product/${id}`, {
      method: "DELETE",
    }),
};

export default productService;