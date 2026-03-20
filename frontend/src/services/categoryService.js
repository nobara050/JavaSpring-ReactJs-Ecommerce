import apiClient from "./apiClient";

const categoryService = {
  getAll: () => apiClient("/category"),

  getById: (id) => apiClient(`/category/${id}`),

  create: (data) =>
    apiClient("/category", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    apiClient(`/category/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    apiClient(`/category/${id}`, {
      method: "DELETE",
    }),
};

export default categoryService;