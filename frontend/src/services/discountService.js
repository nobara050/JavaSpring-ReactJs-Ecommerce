import apiClient from "./apiClient";

const admin = { useAdminToken: true };

const discountService = {
  getAll: () => apiClient("/discount", admin),

  getById: (id) => apiClient(`/discount/${id}`, admin),

  create: (data) =>
    apiClient("/discount", {
      ...admin,
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    apiClient(`/discount/${id}`, {
      ...admin,
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    apiClient(`/discount/${id}`, {
      ...admin,
      method: "DELETE",
    }),
};

export default discountService;
