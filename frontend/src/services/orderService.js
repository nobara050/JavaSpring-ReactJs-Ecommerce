import apiClient from "./apiClient";

const orderService = {
  getAll: () => apiClient("/order"),

  getById: (id) => apiClient(`/order/${id}`),

  getByAccountId: (accountId) => apiClient(`/order/account/${accountId}`),

  create: (data) =>
    apiClient("/order", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateStatus: (id, status) =>
    apiClient(`/order/${id}/status?status=${status}`, {
      method: "PATCH",
    }),
};

export default orderService;