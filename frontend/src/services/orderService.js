import apiClient from "./apiClient";

const admin = { useAdminToken: true };
const user = { useAdminToken: false };

const orderService = {
  getAll: () => apiClient("/order", admin),

  getById: (id) => apiClient(`/order/${id}`, user),

  getByAccountId: (accountId) => apiClient(`/order/account/${accountId}`, user),

  create: (data) =>
    apiClient("/order", {
      ...user,
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