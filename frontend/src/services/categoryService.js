import apiClient from "./apiClient";

const admin = { useAdminToken: true };

const categoryService = {
  getAll: () => apiClient("/category", admin),

  getById: (id) => apiClient(`/category/${id}`, admin),

  create: (data) =>
    apiClient("/category", {
      ...admin,
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    apiClient(`/category/${id}`, {
      ...admin,
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    apiClient(`/category/${id}`, {
      ...admin,
      method: "DELETE",
    }),
};

export default categoryService;
