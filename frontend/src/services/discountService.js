import apiClient from "./apiClient";

const discountService = {
  getAll: () => apiClient("/discount"),

  getById: (id) => apiClient(`/discount/${id}`),

  create: (data) =>
    apiClient("/discount", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    apiClient(`/discount/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    apiClient(`/discount/${id}`, {
      method: "DELETE",
    }),
};

export default discountService;