import apiClient from "./apiClient";

const admin = { useAdminToken: true };

const orderService = {
  getAll: () => apiClient("/order", admin),

  getById: (id) => apiClient(`/order/${id}`, admin),

  getByAccountId: (accountId) => apiClient(`/order/account/${accountId}`, admin),

  create: (data) =>
    apiClient("/order", {
      ...admin,
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateStatus: (id, status) =>
    apiClient(`/order/${id}/status?status=${status}`, {
      ...admin,
      method: "PATCH",
    }),
};

export default orderService;
